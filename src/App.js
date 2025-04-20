import React, { useState, useEffect, useRef } from 'react';
import ControlsGroup from './ControlsGroup';
import './App.css';
import './Tabs.scss'

function App() {
  // Load or initialize groups
  const [groups, setGroups] = useState(() => {
    const stored = localStorage.getItem('groups');
    if (stored) return JSON.parse(stored);
    // default: two groups, each with two controls
    return [
      {
        id: Date.now(),
        name: '1',
        controls: [
          { id: 1, findText: '', replaceText: '', caseSensitive: false },
          { id: 2, findText: '', replaceText: '', caseSensitive: false }
        ]
      },
      {
        id: Date.now() + 1,
        name: '2',
        controls: [
          { id: 3, findText: '', replaceText: '', caseSensitive: false },
        ]
      }
    ];
  });

  const [currentGroupId, setCurrentGroupId] = useState(groups[0].id);
  const [autoFocusControlId, setAutoFocusControlId] = useState(null);
  const [text, setText] = useState('');
  const textAreaRef = useRef(null);

  // Persist groups whenever they change
  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  // Focus textarea on mount
  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  // Helper to update one control in one group
  const updateControl = (groupId, ctrlId, field, value) => {
    setGroups(groups.map(g =>
      g.id === groupId
        ? {
            ...g,
            controls: g.controls.map(c =>
              c.id === ctrlId ? { ...c, [field]: value } : c
            )
          }
        : g
    ));
  };

  const toggleCase = (groupId, ctrlId) => {
    setGroups(groups.map(g =>
      g.id === groupId
        ? {
            ...g,
            controls: g.controls.map(c =>
              c.id === ctrlId ? { ...c, caseSensitive: !c.caseSensitive } : c
            )
          }
        : g
    ));
  };

  const removeControl = (groupId, ctrlId) => {
    setGroups(groups.map(g =>
      g.id === groupId
        ? { ...g, controls: g.controls.filter(c => c.id !== ctrlId) }
        : g
    ));
  };

  const addControl = (groupId, fullText, taRef, setAutoId) => {
    let selected = '';
    const ta = taRef.current;
    if (ta) {
      const start = ta.selectionStart, end = ta.selectionEnd;
      if (start !== end) selected = fullText.slice(start, end);
    }
    const newId = Date.now();
    setGroups(groups.map(g =>
      g.id === groupId
        ? {
            ...g,
            controls: [
              ...g.controls,
              { id: newId, findText: selected, replaceText: '', caseSensitive: false }
            ]
          }
        : g
    ));
    if (selected) setAutoId(newId);

    // clear selection
    if (ta) {
      ta.focus();
      ta.setSelectionRange(ta.selectionEnd, ta.selectionEnd);
    }
  };

  const handleReplace = (groupId, fullText, setFullText) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    let result = fullText;
    group.controls.forEach(c => {
      if (c.findText) {
        const flags = c.caseSensitive ? 'g' : 'gi';
        result = result.replace(new RegExp(c.findText, flags), c.replaceText);
      }
    });
    setFullText(result);
  };

  // Add a new empty group
  const addGroup = () => {
    const newId = Date.now();
    setGroups([
      ...groups,
      { id: newId, name: `${groups.length + 1}`, controls: [] }
    ]);
    setCurrentGroupId(newId);
  };

  return (
    <div className="App">
      <div className="editor-container">
        <div className="left-section">
          <ul className="tabs" role="tablist">
            {groups.map((g) => {
              const tabId = `tab${g.id}`;
              const panelId = `tab-content${g.id}`;
              return (
                <li key={g.id} className="tab">
                  <input
                    type="radio"
                    name="tabs"
                    id={tabId}
                    defaultChecked={g.id === currentGroupId}
                    onChange={() => setCurrentGroupId(g.id)}
                  />
                  <label htmlFor={tabId} role="tab" tabIndex={0}>
                    {g.name}
                  </label>
                  <div
                    id={panelId}
                    className="tab-content"
                    role="tabpanel"
                    aria-labelledby={tabId}
                  >
                    <ControlsGroup
                      groupId={g.id}
                      controls={g.controls}
                      onChange={updateControl}
                      onToggleCase={toggleCase}
                      onRemove={removeControl}
                      onAddControl={addControl}
                      onReplace={handleReplace}
                      autoFocusControlId={autoFocusControlId}
                      text={text}
                      textAreaRef={textAreaRef}
                      setText={setText}
                      setAutoFocusControlId={setAutoFocusControlId}
                    />
                  </div>
                </li>
              );
            })}

            <li onClick={addGroup} className="label tab add-group-button">
              <label role="tab">
                +
              </label>
            </li>
          </ul>
        </div>

        <div className="right-section">
          <textarea
            ref={textAreaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here…"
          />
        </div>
      </div>
    </div>
  );
}

export default App;

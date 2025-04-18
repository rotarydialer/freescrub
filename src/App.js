import React, { useState, useEffect, useRef } from 'react';
import ControlsSection from './ControlsSection';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [controls, setControls] = useState(() => {
    const storedControls = localStorage.getItem('controls');
    return storedControls 
      ? JSON.parse(storedControls) 
      : [
          { id: 1, findText: '', replaceText: '', caseSensitive: false },
          { id: 2, findText: '', replaceText: '', caseSensitive: false },
        ];
  });
  const [autoFocusControlId, setAutoFocusControlId] = useState(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  // Save controls to localStorage
  useEffect(() => {
    localStorage.setItem('controls', JSON.stringify(controls));
  }, [controls]);

  const updateControl = (id, field, value) => {
    setControls(controls.map(control =>
      control.id === id ? { ...control, [field]: value } : control
    ));
  };

  const toggleCaseSensitive = (id) => {
    setControls(controls.map(control =>
      control.id === id ? { ...control, caseSensitive: !control.caseSensitive } : control
    ));
  };

  const removeControl = (id) => {
    setControls(controls.filter(control => control.id !== id));
  };

  const handleReplace = () => {
    let newText = text;
    controls.forEach(control => {
      if (control.findText) {
        const flags = control.caseSensitive ? 'g' : 'gi'; // case sensitivity
        const regex = new RegExp(control.findText, flags);
        newText = newText.replace(regex, control.replaceText);
      }
    });
    setText(newText);
  };

  const addControl = () => {
    let selectedText = '';
    if (textAreaRef.current) {
      const start = textAreaRef.current.selectionStart;
      const end = textAreaRef.current.selectionEnd;
      if (start !== end) {
        selectedText = text.substring(start, end);
      }
    }
    const newId = Date.now();
    setControls([
      ...controls, 
      { id: newId, findText: selectedText, replaceText: '', caseSensitive: false }
    ]);
    if(selectedText !== '') setAutoFocusControlId(newId);

    // clear highlighted text
    if (textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(textAreaRef.current.selectionEnd, textAreaRef.current.selectionEnd);
    }
  };

  return (
    <div className="App">
      <div className="editor-container">
        <div className="left-section">
          {controls.map((control, index) => (
            <ControlsSection
              key={control.id}
              control={control}
              onChange={(field, value) => updateControl(control.id, field, value)}
              onToggleCase={() => toggleCaseSensitive(control.id)}
              onRemove={() => removeControl(control.id)}
              index={index}
              autoFocusReplace={control.id === autoFocusControlId}
            />
          ))}
          <button onClick={addControl} className="add-button">
            +
          </button>
          <button onClick={handleReplace} className="replace-button">
            Replace All
          </button>
        </div>
        <div className="right-section">
          <textarea
            ref={textAreaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="15"
            placeholder="Enter your text here..."
          />
        </div>
      </div>
    </div>
  );
}

export default App;

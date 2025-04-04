import React, { useState } from 'react';
import ControlsSection from './ControlsSection';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [controls, setControls] = useState([
    { id: 1, findText: '', replaceText: '' },
    { id: 2, findText: '', replaceText: '' },
  ]);

  const updateControl = (id, field, value) => {
    setControls(controls.map(control =>
      control.id === id ? { ...control, [field]: value } : control
    ));
  };

  const removeControl = (id) => {
    setControls(controls.filter(control => control.id !== id));
  };

  const handleReplace = () => {
    let newText = text;
    controls.forEach(control => {
      if (control.findText) {
        const regex = new RegExp(control.findText, 'gi');
        newText = newText.replace(regex, control.replaceText);
      }
    });
    setText(newText);
  };

  const addControl = () => {
    setControls([...controls, { id: Date.now(), findText: '', replaceText: '' }]);
  };

  return (
    <div className="App">
      <h1>Find and Replace Multiple</h1>
      <div className="editor-container">
        <div className="left-section">
          {controls.map((control, index) => (
            <ControlsSection
              key={control.id}
              control={control}
              onChange={(field, value) => updateControl(control.id, field, value)}
              onRemove={() => removeControl(control.id)}
              index={index}
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

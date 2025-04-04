import React from 'react';

function ControlsSection({ control, onChange, onRemove, index }) {
  const { findText, replaceText } = control;

  return (
    <div className="controls-section">
      <span className="row-count">{index + 1}</span>
      <input
        type="text"
        value={findText}
        onChange={(e) => onChange('findText', e.target.value)}
        placeholder="Find text"
        className="input-field"
      />
      <input
        type="text"
        value={replaceText}
        onChange={(e) => onChange('replaceText', e.target.value)}
        placeholder="Replace with"
        className="input-field"
      />
      <button className="remove-button" onClick={onRemove}>
        x
      </button>
    </div>
  );
}

export default ControlsSection;

import React from 'react';

function ControlsSection({ control, onChange, onRemove, onToggleCase, index }) {
  const { findText, replaceText, caseSensitive } = control;

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
      <button className="case-toggle" onClick={onToggleCase}>
        <img
          src="/case-sensitive.svg"
          alt="Toggle Case Sensitivity"
          style={{ opacity: caseSensitive ? 1 : 0.3, width: '20px', height: '20px' }}
        />
      </button>
      <button className="remove-button" onClick={onRemove}>
        x
      </button>
    </div>
  );
}

export default ControlsSection;

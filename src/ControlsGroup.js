import React, { useRef } from 'react';
import ControlsSection from './ControlsSection';

export default function ControlsGroup({
  groupId,
  controls,
  onChange,
  onToggleCase,
  onRemove,
  onAddControl,
  onReplace,
  autoFocusControlId,
  text,
  textAreaRef,
  setText,
  setAutoFocusControlId
}) {
  return (
    <div className="controls-group">
      {controls.map((control, index) => (
        <ControlsSection
          key={control.id}
          control={control}
          index={index}
          onChange={(field, val) => onChange(groupId, control.id, field, val)}
          onToggleCase={() => onToggleCase(groupId, control.id)}
          onRemove={() => onRemove(groupId, control.id)}
          autoFocusReplace={control.id === autoFocusControlId}
        />
      ))}

      <button
        className="add-button"
        onClick={() => onAddControl(groupId, text, textAreaRef, setAutoFocusControlId)}
      >
        +
      </button>

      <button
        className="replace-button"
        onClick={() => onReplace(groupId, text, setText)}
      >
        Replace All
      </button>
    </div>
  );
}

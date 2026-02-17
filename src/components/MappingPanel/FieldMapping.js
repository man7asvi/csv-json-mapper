import React, { useState, useEffect } from 'react';
import * as S from './MappingPanel.styles';
import { validateFieldMapping } from '../../utils/mappingUtils';

/**
 * Individual field mapping card.
 * When isJoined is true, the source CSV selector is hidden —
 * the joined CSV columns come in via columnsA.
 */
const FieldMapping = ({
  field,
  columnsA,
  columnsB,
  isJoined = false,
  onUpdate,
  onDelete,
  isEditing,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
}) => {
  const [localField, setLocalField] = useState(field);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setLocalField(field);
  }, [field]);

  /* ── Drag & Drop ── */

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const updated = {
        ...localField,
        source: { csvId: data.csvId === 'Joined' ? 'A' : data.csvId, column: data.columnName },
        targetField: localField.targetField || data.columnName,
      };
      setLocalField(updated);
      if (!isEditing) onUpdate(updated);
    } catch (err) {
      // silently ignore bad drops
    }
  };

  /* ── Field Changes ── */

  const updateField = (updated) => {
    setLocalField(updated);
    if (!isEditing) onUpdate(updated);
  };

  const handleSourceCsvChange = (e) => {
    updateField({
      ...localField,
      source: { csvId: e.target.value, column: '' },
    });
  };

  const handleSourceColumnChange = (e) => {
    updateField({
      ...localField,
      source: { ...localField.source, column: e.target.value },
    });
  };

  const handleTargetChange = (e) => {
    updateField({ ...localField, targetField: e.target.value });
  };

  const handleTransformChange = (key, value) => {
    updateField({
      ...localField,
      transformations: { ...localField.transformations, [key]: value },
    });
  };

  /* ── Save / Cancel ── */

  const handleSave = () => {
    const { isValid, errors: validationErrors } = validateFieldMapping(localField);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    onSaveEdit(localField);
  };

  const handleCancel = () => {
    setLocalField(field);
    setErrors([]);
    onCancelEdit();
  };

  /* ── Derived ── */

  const currentColumns =
    isJoined
      ? columnsA // joined columns are always passed as columnsA
      : localField.source.csvId === 'A'
      ? columnsA
      : columnsB;

  return (
    <S.FieldMappingCard isDragOver={isDragOver}>
      <S.FieldHeader>
        <S.FieldLabel>
          <S.FieldContent>
            <S.FieldValue>
              {localField.source.column ? (
                <>
                  {isJoined ? (
                    <S.CSVBadge csvId="joined">⚡</S.CSVBadge>
                  ) : (
                    <S.CSVBadge csvId={localField.source.csvId}>
                      {localField.source.csvId}
                    </S.CSVBadge>
                  )}
                  {localField.source.column}
                </>
              ) : (
                <S.EmptyValue>No source selected</S.EmptyValue>
              )}
            </S.FieldValue>
          </S.FieldContent>
          <span>→</span>
          <S.FieldName>{localField.targetField || 'target_name'}</S.FieldName>
        </S.FieldLabel>

        <S.DeleteButton
          onClick={() => onDelete(field.id)}
          title="Delete field"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </S.DeleteButton>
      </S.FieldHeader>

      {/* Drop zone when no source is selected */}
      {!localField.source.column && (
        <S.DropZone
          isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragOver
            ? 'Drop column here'
            : 'Drag a CSV column here or select below'}
        </S.DropZone>
      )}

      <S.FieldRow>
        {!isJoined && (
          <S.InputGroup>
            <S.Label>Source CSV</S.Label>
            <S.Select
              value={localField.source.csvId}
              onChange={handleSourceCsvChange}
            >
              <option value="A">CSV A</option>
              <option value="B">CSV B</option>
            </S.Select>
          </S.InputGroup>
        )}

        <S.InputGroup>
          <S.Label>{isJoined ? 'Source Column (Joined)' : 'Source Column'}</S.Label>
          <S.Select
            value={localField.source.column}
            onChange={handleSourceColumnChange}
          >
            <option value="">Select a column...</option>
            {currentColumns?.map((col) => (
              <option key={col.name} value={col.name}>
                {col.name} ({col.type})
              </option>
            ))}
          </S.Select>
        </S.InputGroup>

        <S.InputGroup>
          <S.Label>Target Field Name</S.Label>
          <S.Input
            type="text"
            value={localField.targetField}
            onChange={handleTargetChange}
            placeholder="e.g., user_name"
          />
        </S.InputGroup>
      </S.FieldRow>

      {errors.length > 0 && (
        <S.ErrorMessage>
          {errors.map((err, i) => (
            <div key={i}>• {err}</div>
          ))}
        </S.ErrorMessage>
      )}

      <S.TransformationsRow>
        <S.CheckboxLabel>
          <input
            type="checkbox"
            checked={localField.transformations.trim}
            onChange={(e) => handleTransformChange('trim', e.target.checked)}
          />
          Trim
        </S.CheckboxLabel>
        <S.CheckboxLabel>
          <input
            type="checkbox"
            checked={localField.transformations.toNumber}
            onChange={(e) => handleTransformChange('toNumber', e.target.checked)}
          />
          To Number
        </S.CheckboxLabel>
      </S.TransformationsRow>

      {isEditing && (
        <S.SaveCancelButtons>
          <S.SaveButton onClick={handleSave}>Save</S.SaveButton>
          <S.CancelButton onClick={handleCancel}>Cancel</S.CancelButton>
        </S.SaveCancelButtons>
      )}
    </S.FieldMappingCard>
  );
};

export default FieldMapping;

import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as S from './MappingPanel.styles';
import FieldMapping from './FieldMapping';
import {
  autoMapFields,
  createEmptyField,
  findDuplicateFields,
  generateJSON,
  generateId,
} from '../../utils/mappingUtils';

/**
 * Mapping Panel – lets users map CSV columns to JSON field names.
 * Now includes a collapsible Filter section for WHERE clause functionality.
 * When a joined CSV is available (csvData.csvJoined), it maps from that.
 * Otherwise, it maps from csvA/csvB separately.
 */
const MappingPanel = ({ csvData, templateFields, onFieldMapping }) => {
  const [fields, setFields] = useState([]);
  const [editingFieldId, setEditingFieldId] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState([]);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const onFieldMappingRef = useRef(onFieldMapping);
  onFieldMappingRef.current = onFieldMapping;

  // Determine the active source: joined CSV or separate CSVs
  const isJoined = Boolean(csvData?.csvJoined);

  // Build an effective csvData object for generateJSON
  // When joined, treat joined as "csvA" so the existing generator works
  const effectiveCsvData = useMemo(() => {
    if (isJoined) {
      return { csvA: csvData.csvJoined, csvB: null };
    }
    return { csvA: csvData?.csvA || null, csvB: csvData?.csvB || null };
  }, [csvData, isJoined]);

  // Get available columns for filter dropdown
  const availableColumns = useMemo(() => {
    if (isJoined) {
      return csvData?.csvJoined?.columns || [];
    }
    return [
      ...(csvData?.csvA?.columns || []).map(col => ({ ...col, source: 'A' })),
      ...(csvData?.csvB?.columns || []).map(col => ({ ...col, source: 'B' }))
    ];
  }, [csvData, isJoined]);

  // Generate JSON whenever fields, data, or filters change
  useEffect(() => {
    if ((effectiveCsvData.csvA || effectiveCsvData.csvB) && fields.length > 0) {
      const jsonOutput = generateJSON(fields, effectiveCsvData, filters);
      onFieldMappingRef.current(fields, jsonOutput, filters);
    } else {
      onFieldMappingRef.current(fields, [], filters);
    }
  }, [fields, effectiveCsvData, filters]);

  // When template fields arrive, create mappings for each placeholder
  useEffect(() => {
    if (!templateFields?.length || !csvData) return;

    const columns = isJoined
      ? csvData.csvJoined?.columns || []
      : [...(csvData.csvA?.columns || []), ...(csvData.csvB?.columns || [])];

    const newFields = templateFields.map((name) => {
      const match = columns.find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      );

      return {
        id: `tpl_${name}_${Date.now()}`,
        source: { csvId: isJoined ? 'A' : (match ? 'A' : 'A'), column: match ? match.name : '' },
        targetField: name,
        dataType: match ? match.type : 'string',
        transformations: { trim: false, toNumber: false },
      };
    });

    setFields(newFields);
  }, [templateFields, csvData, isJoined]);

  /* ── Field Mapping Actions ── */

  const handleAutoMap = () => {
    if (!effectiveCsvData.csvA && !effectiveCsvData.csvB) return;

    let mapped = [];
    if (effectiveCsvData.csvA?.columns) {
      mapped = [...mapped, ...autoMapFields(effectiveCsvData.csvA.columns, 'A')];
    }
    if (effectiveCsvData.csvB?.columns) {
      mapped = [...mapped, ...autoMapFields(effectiveCsvData.csvB.columns, 'B')];
    }
    setFields(mapped);
  };

  const handleReset = () => {
    if (fields.length > 0 && window.confirm('Reset all mappings?')) {
      setFields([]);
    }
  };

  const handleAddField = () => {
    const defaultCsvId = effectiveCsvData.csvA ? 'A' : 'B';
    const newField = createEmptyField(defaultCsvId);
    setFields((prev) => [...prev, newField]);
    setEditingFieldId(newField.id);
  };

  const handleUpdateField = (updated) => {
    setFields((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const handleDeleteField = (id) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (editingFieldId === id) setEditingFieldId(null);
  };

  const handleSaveEdit = (updated) => {
    handleUpdateField(updated);
    setEditingFieldId(null);
  };

  /* ── Filter Actions ── */

  const handleAddFilter = () => {
    const newFilter = {
      id: generateId(),
      field: '',
      operator: '=',
      value: '',
      logicOperator: 'AND'
    };
    setFilters([...filters, newFilter]);
    if (!filtersExpanded) setFiltersExpanded(true);
  };

  const handleRemoveFilter = (id) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const handleFilterChange = (id, key, value) => {
    setFilters(filters.map(f => 
      f.id === id ? { ...f, [key]: value } : f
    ));
  };

  const handleToggleLogicOperator = (id) => {
    setFilters(filters.map(f => 
      f.id === id 
        ? { ...f, logicOperator: f.logicOperator === 'AND' ? 'OR' : 'AND' }
        : f
    ));
  };

  const handleClearAllFilters = () => {
    if (filters.length > 0 && window.confirm('Clear all filters?')) {
      setFilters([]);
    }
  };

  /* ── Derived ── */

  const duplicateFields = useMemo(() => findDuplicateFields(fields), [fields]);

  const totalColumns =
    (effectiveCsvData.csvA?.columnCount || 0) +
    (effectiveCsvData.csvB?.columnCount || 0);

  const columnsA = effectiveCsvData.csvA?.columns || [];
  const columnsB = effectiveCsvData.csvB?.columns || [];

  const hasAnyData = effectiveCsvData.csvA || effectiveCsvData.csvB;

  return (
    <S.Container>
      <S.Header>
        <div>
          <S.Title>Mapping Panel</S.Title>
          <S.MappingCount>
            {fields.length} of {totalColumns} fields mapped
            {isJoined && ' (from Joined CSV)'}
          </S.MappingCount>
        </div>
        <S.ButtonGroup>
          <S.Button
            variant="primary"
            onClick={handleAutoMap}
            disabled={!hasAnyData}
            title="Auto-map all CSV columns"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Auto-map
          </S.Button>

          <S.Button
            onClick={handleReset}
            disabled={fields.length === 0}
            title="Reset all mappings"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C9.17974 21 6.67465 19.6463 5.08658 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 17V17.01M3 17V12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Reset
          </S.Button>

          <S.Button onClick={handleAddField} title="Add a new field mapping">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add Field
          </S.Button>
        </S.ButtonGroup>
      </S.Header>

      {duplicateFields.length > 0 && (
        <S.ErrorMessage>
          Duplicate field names: {duplicateFields.join(', ')}
        </S.ErrorMessage>
      )}

      {/* ═══════════════════════════════════════════════════ */}
      {/* FILTER SECTION - NEW */}
      {/* ═══════════════════════════════════════════════════ */}
      
      <S.FilterSection>
        <S.FilterHeader onClick={() => setFiltersExpanded(!filtersExpanded)}>
          <S.FilterTitle>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Filters
            {filters.length > 0 && (
              <S.FilterBadge>{filters.length} active</S.FilterBadge>
            )}
          </S.FilterTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {filters.length > 0 && (
              <S.Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAllFilters();
                }}
                style={{ padding: '4px 8px', fontSize: '11px' }}
                title="Clear all filters"
              >
                Clear
              </S.Button>
            )}
            <svg 
              width="16" 
              height="16" 
              style={{ 
                transform: filtersExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}
              viewBox="0 0 24 24" 
              fill="none"
            >
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </S.FilterHeader>

        <S.FilterBody expanded={filtersExpanded}>
          {filters.length === 0 ? (
            <S.EmptyState style={{ padding: '20px', minHeight: 'auto', border: 'none' }}>
              <S.EmptyStateText style={{ fontSize: '13px' }}>No filters applied</S.EmptyStateText>
              <S.EmptyStateTip>
                Add filters to include only specific rows in your output (WHERE clause)
              </S.EmptyStateTip>
            </S.EmptyState>
          ) : (
            <S.FiltersList>
              {filters.map((filter, index) => (
                <React.Fragment key={filter.id}>
                  {index > 0 && (
                    <S.LogicOperatorBadge 
                      onClick={() => handleToggleLogicOperator(filter.id)}
                      title="Click to toggle between AND/OR"
                    >
                      {filter.logicOperator}
                    </S.LogicOperatorBadge>
                  )}
                  
                  <S.FilterRow>
                    <S.FilterFieldGroup>
                      <S.FilterLabel>Field</S.FilterLabel>
                      <S.Select
                        value={filter.field}
                        onChange={(e) => handleFilterChange(filter.id, 'field', e.target.value)}
                      >
                        <option value="">Select column...</option>
                        {availableColumns.map(col => (
                          <option key={col.name} value={col.name}>
                            {isJoined ? col.name : `${col.source}.${col.name}`}
                          </option>
                        ))}
                      </S.Select>
                    </S.FilterFieldGroup>

                    <S.FilterFieldGroup>
                      <S.FilterLabel>Operator</S.FilterLabel>
                      <S.Select
                        value={filter.operator}
                        onChange={(e) => handleFilterChange(filter.id, 'operator', e.target.value)}
                      >
                        <option value="=">equals (=)</option>
                        <option value="!=">not equals (!=)</option>
                        <option value=">">greater than (&gt;)</option>
                        <option value="<">less than (&lt;)</option>
                        <option value=">=">greater or equal (&gt;=)</option>
                        <option value="<=">less or equal (&lt;=)</option>
                        <option value="LIKE">contains (LIKE)</option>
                        <option value="IN">in list (IN)</option>
                        <option value="NOT IN">not in list (NOT IN)</option>
                      </S.Select>
                    </S.FilterFieldGroup>

                    <S.FilterFieldGroup>
                      <S.FilterLabel>Value</S.FilterLabel>
                      <S.Input
                        type="text"
                        value={filter.value}
                        onChange={(e) => handleFilterChange(filter.id, 'value', e.target.value)}
                        placeholder={filter.operator === 'IN' || filter.operator === 'NOT IN' ? 'val1, val2, val3' : 'Enter value...'}
                      />
                    </S.FilterFieldGroup>

                    <S.RemoveFilterButton
                      onClick={() => handleRemoveFilter(filter.id)}
                      title="Remove filter"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </S.RemoveFilterButton>
                  </S.FilterRow>
                </React.Fragment>
              ))}
            </S.FiltersList>
          )}

          <S.AddFilterButton onClick={handleAddFilter}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add Filter
          </S.AddFilterButton>
        </S.FilterBody>
      </S.FilterSection>

      {/* ═══════════════════════════════════════════════════ */}
      {/* FIELD MAPPINGS */}
      {/* ═══════════════════════════════════════════════════ */}

      <S.MappingsContainer>
        {fields.length === 0 ? (
          <S.EmptyState>
            <S.EmptyStateIcon>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </S.EmptyStateIcon>
            <S.EmptyStateText>No field mappings yet</S.EmptyStateText>
            <S.EmptyStateTip>
              {isJoined
                ? 'Click "Auto-map" to map all joined columns, or "Add Field" for custom mappings.'
                : 'Click "Auto-map" to map all CSV columns, "Add Field" for custom mappings, or drag columns from the CSV Inspector.'}
            </S.EmptyStateTip>
          </S.EmptyState>
        ) : (
          fields.map((field) => (
            <FieldMapping
              key={field.id}
              field={field}
              columnsA={columnsA}
              columnsB={columnsB}
              isJoined={isJoined}
              onUpdate={handleUpdateField}
              onDelete={handleDeleteField}
              isEditing={editingFieldId === field.id}
              onStartEdit={setEditingFieldId}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={() => setEditingFieldId(null)}
            />
          ))
        )}
      </S.MappingsContainer>
    </S.Container>
  );
};

export default MappingPanel;
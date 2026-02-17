/**
 * Mapping Utilities
 * Helper functions for field mapping, JSON generation, template parsing, and filtering
 */

/* ── ID Generation ── */

let _idCounter = 0;

export const generateId = () => `field_${++_idCounter}_${Date.now()}`;

/* ── Field Mapping Helpers ── */

/**
 * Auto-map CSV columns to field names (each column maps to itself)
 */
export const autoMapFields = (columns, csvId = 'A') => {
  if (!columns || columns.length === 0) return [];

  return columns.map((column) => ({
    id: generateId(),
    source: { csvId, column: column.name },
    targetField: column.name,
    dataType: column.type,
    transformations: { trim: false, toNumber: false },
  }));
};

/**
 * Create a new empty field mapping
 */
export const createEmptyField = (defaultCsvId = 'A') => ({
  id: generateId(),
  source: { csvId: defaultCsvId, column: '' },
  targetField: '',
  dataType: 'string',
  transformations: { trim: false, toNumber: false },
});

/**
 * Validate a single field mapping
 */
export const validateFieldMapping = (field) => {
  const errors = [];

  if (!field.targetField || field.targetField.trim() === '') {
    errors.push('Target field name is required');
  }

  if (!field.source?.column) {
    errors.push('Source column must be selected');
  }

  if (!['A', 'B'].includes(field.source?.csvId)) {
    errors.push('Source CSV must be either A or B');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Find duplicate target field names
 */
export const findDuplicateFields = (fields) => {
  const names = fields.map((f) => f.targetField).filter(Boolean);
  const duplicates = names.filter((name, i) => names.indexOf(name) !== i);
  return [...new Set(duplicates)];
};

/* ── Template Parsing ── */

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Extract unique placeholder names from a template string.
 * Supports {{placeholder}} and {{ placeholder }} syntax.
 */
export const parseTemplatePlaceholders = (templateStr) => {
  if (!templateStr) return [];
  const matches = templateStr.match(/\{\{\s*(\w+)\s*\}\}/g) || [];
  const placeholders = matches.map((m) => m.replace(/\{\{\s*|\s*\}\}/g, ''));
  return [...new Set(placeholders)];
};

/**
 * Create field mappings from template placeholders, auto-matching CSV columns by name.
 */
export const createMappingsFromTemplate = (placeholders, csvData) => {
  if (!placeholders?.length) return [];

  const columnsA = csvData?.csvA?.columns || [];
  const columnsB = csvData?.csvB?.columns || [];

  return placeholders.map((name) => {
    // Try to find a matching column in CSV A first, then CSV B
    const matchA = columnsA.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    const matchB = columnsB.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );

    const match = matchA || matchB;
    const csvId = matchA ? 'A' : matchB ? 'B' : 'A';

    return {
      id: generateId(),
      source: { csvId, column: match ? match.name : '' },
      targetField: name,
      dataType: match ? match.type : 'string',
      transformations: { trim: false, toNumber: false },
    };
  });
};

/* ══════════════════════════════════════════════════════════════════ */
/* FILTERING LOGIC - NEW */
/* ══════════════════════════════════════════════════════════════════ */

/**
 * Apply filters to a single row
 * @param {Object} row - CSV row object
 * @param {Array} filters - Array of filter objects with field, operator, value, logicOperator
 * @returns {boolean} - True if row passes all filters
 */
const applyFilters = (row, filters) => {
  if (!filters || filters.length === 0) return true;
  if (!row) return false;

  let result = true;
  let currentLogic = 'AND'; // Start with AND

  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    
    // Skip incomplete filters
    if (!filter.field || filter.value === null || filter.value === undefined || filter.value === '') {
      continue;
    }

    const fieldValue = row[filter.field];
    const filterValue = filter.value;
    
    // Handle null/undefined field values
    if (fieldValue === null || fieldValue === undefined) {
      // For most operators, null/undefined doesn't match
      const matches = false;
      
      if (i === 0) {
        result = matches;
      } else {
        if (currentLogic === 'AND') {
          result = result && matches;
        } else {
          result = result || matches;
        }
      }
      currentLogic = filter.logicOperator || 'AND';
      continue;
    }

    const fieldValueStr = String(fieldValue);
    const filterValueStr = String(filterValue);
    
    let matches = false;

    switch (filter.operator) {
      case '=':
        matches = fieldValueStr === filterValueStr;
        break;
      
      case '!=':
        matches = fieldValueStr !== filterValueStr;
        break;
      
      case '>':
        const gtField = parseFloat(fieldValueStr);
        const gtFilter = parseFloat(filterValueStr);
        if (!isNaN(gtField) && !isNaN(gtFilter)) {
          matches = gtField > gtFilter;
        } else {
          matches = fieldValueStr > filterValueStr; // String comparison fallback
        }
        break;
      
      case '<':
        const ltField = parseFloat(fieldValueStr);
        const ltFilter = parseFloat(filterValueStr);
        if (!isNaN(ltField) && !isNaN(ltFilter)) {
          matches = ltField < ltFilter;
        } else {
          matches = fieldValueStr < filterValueStr; // String comparison fallback
        }
        break;
      
      case '>=':
        const gteField = parseFloat(fieldValueStr);
        const gteFilter = parseFloat(filterValueStr);
        if (!isNaN(gteField) && !isNaN(gteFilter)) {
          matches = gteField >= gteFilter;
        } else {
          matches = fieldValueStr >= filterValueStr; // String comparison fallback
        }
        break;
      
      case '<=':
        const lteField = parseFloat(fieldValueStr);
        const lteFilter = parseFloat(filterValueStr);
        if (!isNaN(lteField) && !isNaN(lteFilter)) {
          matches = lteField <= lteFilter;
        } else {
          matches = fieldValueStr <= filterValueStr; // String comparison fallback
        }
        break;
      
      case 'LIKE':
        matches = fieldValueStr.toLowerCase().includes(filterValueStr.toLowerCase());
        break;
      
      case 'IN':
        const inValues = filterValueStr.split(',').map(v => v.trim());
        matches = inValues.includes(fieldValueStr);
        break;
      
      case 'NOT IN':
        const notInValues = filterValueStr.split(',').map(v => v.trim());
        matches = !notInValues.includes(fieldValueStr);
        break;
      
      default:
        matches = true; // Unknown operator, pass through
    }

    // Apply logic operator (AND/OR)
    if (i === 0) {
      result = matches;
    } else {
      if (currentLogic === 'AND') {
        result = result && matches;
      } else { // OR
        result = result || matches;
      }
    }

    // Update logic for next iteration
    currentLogic = filter.logicOperator || 'AND';
  }

  return result;
};

/* ── JSON Generation ── */

/**
 * Apply transformations to a raw value
 */
const applyTransformations = (value, transformations) => {
  let result = value;
  if (transformations?.trim && typeof result === 'string') {
    result = result.trim();
  }
  if (transformations?.toNumber && result != null && result !== '') {
    const num = parseFloat(result);
    if (!isNaN(num)) result = num;
  }
  return result;
};

/**
 * Generate flat JSON from field mappings and CSV data with filtering support.
 * Uses positional matching when fields reference both CSVs.
 * @param {Array} fields - Field mapping configuration
 * @param {Object} csvData - CSV data object with csvA and/or csvB
 * @param {Array} filters - Filter configuration (optional)
 * @returns {Array} - Array of JSON objects
 */
export const generateJSON = (fields, csvData, filters = []) => {
  if (!fields?.length || !csvData) return [];

  const rowsA = csvData.csvA?.rows || [];
  const rowsB = csvData.csvB?.rows || [];
  const baseLength = Math.max(rowsA.length, rowsB.length);

  if (baseLength === 0) return [];

  const result = [];
  
  for (let i = 0; i < baseLength; i++) {
    // Get the current row from both CSVs
    const rowA = rowsA[i];
    const rowB = rowsB[i];
    
    // For filtering, we need to check against the combined row data
    // Priority: if we have joined data (csvA is the joined result), use that
    // Otherwise, combine rowA and rowB (rowA takes precedence for duplicate keys)
    const rowToFilter = { ...rowB, ...rowA };
    
    // Apply filters - skip row if it doesn't match
    if (!applyFilters(rowToFilter, filters)) {
      continue; // Skip this row
    }

    // Build the output object
    const obj = {};
    fields.forEach((field) => {
      if (field.source?.column && field.targetField) {
        const rows = field.source.csvId === 'B' ? rowsB : rowsA;
        const row = rows[i];
        const rawValue = row ? row[field.source.column] : null;
        obj[field.targetField] = applyTransformations(
          rawValue,
          field.transformations
        );
      }
    });

    result.push(obj);
  }

  return result;
};

/**
 * Apply a template string to flat JSON rows.
 * Replaces {{placeholder}} with actual values from each row.
 * Returns an array of parsed JSON objects (or raw strings if parse fails).
 */
export const applyTemplate = (templateStr, flatJsonRows) => {
  if (!templateStr?.trim() || !flatJsonRows?.length) return [];

  return flatJsonRows.map((row) => {
    let filled = templateStr;

    for (const [key, value] of Object.entries(row)) {
      const regex = new RegExp(`\\{\\{\\s*${escapeRegex(key)}\\s*\\}\\}`, 'g');
      if (typeof value === 'number') {
        filled = filled.replace(regex, String(value));
      } else {
        filled = filled.replace(regex, String(value ?? ''));
      }
    }

    try {
      return JSON.parse(filled);
    } catch {
      return filled;
    }
  });
};

/* ── JOIN Operations ── */

/**
 * Build the column name mapping for joined results.
 * - All columns from CSV A are included as-is
 * - Join key columns from CSV B (all keyB values) are skipped (redundant)
 * - Other CSV B columns get a B_ prefix ONLY if their name collides with an A column
 *
 * @param {Array} columnsA
 * @param {Array} columnsB
 * @param {string[]} keysB – array of B key column names to skip
 */
const buildJoinedColumnMap = (columnsA, columnsB, keysB) => {
  const aNamesSet = new Set(columnsA.map((c) => c.name));
  const skipBSet = new Set(keysB);
  
  // Build the final column list
  const finalColumns = [];
  const bColNameMap = {}; // original B col name → final name
  
  // Add all A columns
  columnsA.forEach((col) => {
    finalColumns.push({ name: col.name, type: col.type, source: 'A' });
  });
  
  // Add B columns (skip join keys, rename on collision)
  columnsB.forEach((col) => {
    if (skipBSet.has(col.name)) {
      bColNameMap[col.name] = null; // skip
      return;
    }
    const finalName = aNamesSet.has(col.name) ? `B_${col.name}` : col.name;
    bColNameMap[col.name] = finalName;
    finalColumns.push({ name: finalName, type: col.type, source: 'B' });
  });
  
  return { finalColumns, bColNameMap };
};

/**
 * Build a single joined row object with clean column names.
 * keysB is now unused directly here – skipping is handled via bColNameMap (null entries).
 */
const buildJoinedRow = (rowA, rowB, columnsA, columnsB, _keysB, bColNameMap) => {
  const joined = {};
  
  // Add A columns
  columnsA.forEach((col) => {
    joined[col.name] = rowA ? rowA[col.name] : null;
  });
  
  // Add B columns (skipping join keys via bColNameMap, renaming collisions)
  columnsB.forEach((col) => {
    const finalName = bColNameMap[col.name];
    if (finalName === null || finalName === undefined) return; // skip join keys
    joined[finalName] = rowB ? rowB[col.name] : null;
  });
  
  return joined;
};

/**
 * Build a composite key string from a row and an array of key column names.
 */
const compositeKey = (row, keyCols) => {
  if (!row) return null;
  const parts = keyCols.map((col) => row[col]);
  if (parts.some((v) => v == null || v === '')) return null;
  return parts.map(String).join('\x00'); // null-byte separator to avoid collisions
};

/**
 * Index rows by composite key into a Map of arrays.
 * @param {Array} rows
 * @param {string[]} keyCols – array of column names
 */
const indexByKey = (rows, keyCols) => {
  const idx = new Map();
  rows.forEach((row) => {
    const k = compositeKey(row, keyCols);
    if (k != null) {
      if (!idx.has(k)) idx.set(k, []);
      idx.get(k).push(row);
    }
  });
  return idx;
};

const performInnerJoin = (rowsA, rowsB, keysA, keysB, columnsA, columnsB, bColNameMap) => {
  const result = [];
  const idxB = indexByKey(rowsB, keysB);
  
  rowsA.forEach((rowA) => {
    const k = compositeKey(rowA, keysA);
    if (k != null && idxB.has(k)) {
      idxB.get(k).forEach((rowB) => {
        result.push(buildJoinedRow(rowA, rowB, columnsA, columnsB, keysB, bColNameMap));
      });
    }
  });
  return result;
};

const performLeftJoin = (rowsA, rowsB, keysA, keysB, columnsA, columnsB, bColNameMap) => {
  const result = [];
  const idxB = indexByKey(rowsB, keysB);
  
  rowsA.forEach((rowA) => {
    const k = compositeKey(rowA, keysA);
    const matches = k != null ? idxB.get(k) : null;
    
    if (matches && matches.length > 0) {
      matches.forEach((rowB) => {
        result.push(buildJoinedRow(rowA, rowB, columnsA, columnsB, keysB, bColNameMap));
      });
    } else {
      result.push(buildJoinedRow(rowA, null, columnsA, columnsB, keysB, bColNameMap));
    }
  });
  return result;
};

const performRightJoin = (rowsA, rowsB, keysA, keysB, columnsA, columnsB, bColNameMap) => {
  const result = [];
  const idxA = indexByKey(rowsA, keysA);
  
  rowsB.forEach((rowB) => {
    const k = compositeKey(rowB, keysB);
    const matches = k != null ? idxA.get(k) : null;
    
    if (matches && matches.length > 0) {
      matches.forEach((rowA) => {
        result.push(buildJoinedRow(rowA, rowB, columnsA, columnsB, keysB, bColNameMap));
      });
    } else {
      // For unmatched B rows, fill A's join key columns from B
      const row = buildJoinedRow(null, rowB, columnsA, columnsB, keysB, bColNameMap);
      keysA.forEach((ka, i) => { row[ka] = rowB[keysB[i]]; });
      result.push(row);
    }
  });
  return result;
};

const performFullOuterJoin = (rowsA, rowsB, keysA, keysB, columnsA, columnsB, bColNameMap) => {
  const result = [];
  const idxB = indexByKey(rowsB, keysB);
  const matchedKeysB = new Set();
  
  rowsA.forEach((rowA) => {
    const k = compositeKey(rowA, keysA);
    const matches = k != null ? idxB.get(k) : null;
    
    if (matches && matches.length > 0) {
      matchedKeysB.add(k);
      matches.forEach((rowB) => {
        result.push(buildJoinedRow(rowA, rowB, columnsA, columnsB, keysB, bColNameMap));
      });
    } else {
      result.push(buildJoinedRow(rowA, null, columnsA, columnsB, keysB, bColNameMap));
    }
  });
  
  // Add unmatched B rows
  rowsB.forEach((rowB) => {
    const k = compositeKey(rowB, keysB);
    if (k != null && !matchedKeysB.has(k)) {
      const row = buildJoinedRow(null, rowB, columnsA, columnsB, keysB, bColNameMap);
      keysA.forEach((ka, i) => { row[ka] = rowB[keysB[i]]; });
      result.push(row);
    }
  });
  return result;
};

/**
 * Join two CSV datasets based on join configuration.
 * Supports composite (multi-key) joins.
 * Returns a clean dataset with no redundant columns:
 * - All A columns kept as-is
 * - B's join key columns are dropped (already present via A)
 * - B columns with the same name as an A column get a B_ prefix
 *
 * @param {Object} csvData - { csvA, csvB }
 * @param {Object} joinConfig - { type, keys: [{ keyA, keyB }, ...] }
 * @returns {Object|null} { rows, columns, headers, rowCount, columnCount, fileName }
 */
export const performJoin = (csvData, joinConfig) => {
  if (!csvData?.csvA || !csvData?.csvB) return null;
  
  const { type, keys } = joinConfig;
  if (!keys || keys.length === 0) return null;
  if (keys.some((k) => !k.keyA || !k.keyB)) return null;
  
  const keysA = keys.map((k) => k.keyA);
  const keysB = keys.map((k) => k.keyB);
  
  const rowsA = csvData.csvA.rows || [];
  const rowsB = csvData.csvB.rows || [];
  const columnsA = csvData.csvA.columns || [];
  const columnsB = csvData.csvB.columns || [];
  
  const { finalColumns, bColNameMap } = buildJoinedColumnMap(columnsA, columnsB, keysB);
  
  let joinedRows;
  switch (type) {
    case 'inner':
      joinedRows = performInnerJoin(rowsA, rowsB, keysA, keysB, columnsA, columnsB, bColNameMap);
      break;
    case 'left':
      joinedRows = performLeftJoin(rowsA, rowsB, keysA, keysB, columnsA, columnsB, bColNameMap);
      break;
    case 'right':
      joinedRows = performRightJoin(rowsA, rowsB, keysA, keysB, columnsA, columnsB, bColNameMap);
      break;
    case 'full':
      joinedRows = performFullOuterJoin(rowsA, rowsB, keysA, keysB, columnsA, columnsB, bColNameMap);
      break;
    default:
      return null;
  }
  
  const headers = finalColumns.map((c) => c.name);
  const joinTypeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  
  return {
    rows: joinedRows,
    columns: finalColumns,
    headers,
    rowCount: joinedRows.length,
    columnCount: finalColumns.length,
    fileName: `Joined (${joinTypeLabel})`,
  };
};
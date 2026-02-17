# Developer Code Guide

This document explains the codebase structure, key patterns, and implementation details for developers.

## Table of Contents

1. [Project Structure](#project-structure)
2. [State Management](#state-management)
3. [Component Communication](#component-communication)
4. [JOIN Implementation](#join-implementation)
5. [SQL Generation](#sql-generation)
6. [Theme System](#theme-system)
7. [Code Patterns](#code-patterns)

---

## Project Structure

### Component Hierarchy

```
App (Root)
├── Header
│   └── Theme Toggle, Query Lab, Export buttons
├── CSVInspector (Left Panel)
│   ├── Tab navigation (A, B, Joined)
│   ├── Join Configuration Panel
│   └── CSVTabPanel (per tab)
│       ├── Upload dropzone
│       ├── Search input
│       ├── Columns list (draggable)
│       └── Sample data table
├── MappingPanel (Middle Panel)
│   └── FieldMapping[] (cards)
│       ├── Source CSV selector
│       ├── Source column dropdown
│       ├── Target field input
│       └── Transformations checkboxes
├── TemplateEditor (Right Panel)
│   ├── Template Editor tab
│   └── Live Preview tab
└── QueryLab (Modal, conditional)
    └── SQL query display + copy button
```

---

## State Management

### Top-Level State (App.js)

All state is managed in `App.js` and passed down via props:

```javascript
// CSV Data
const [csvData, setCsvData] = useState({
  csvA: null,      // { fileName, rows, columns, rowCount, columnCount }
  csvB: null,      // Same structure
  csvJoined: null  // Same structure (generated from A + B)
});

// Join Config (when join is applied)
const [joinConfig, setJoinConfig] = useState(null);
// { type: 'inner'|'left'|'right'|'full', keys: [{keyA, keyB}] }

// Field Mappings
const [mappedFields, setMappedFields] = useState([]);
// [{ id, source: {csvId, column}, targetField, dataType, transformations }]

// JSON Output
const [jsonOutput, setJsonOutput] = useState([]);
// Array of generated JSON objects

// Template
const [template, setTemplate] = useState('');
const [templateFields, setTemplateFields] = useState(null);

// UI State
const [previewTab, setPreviewTab] = useState('editor');
const [showQueryLab, setShowQueryLab] = useState(false);

// Theme
const [theme, setTheme] = useState('dark');
```

### State Flow

```
CSVInspector (user uploads CSVs, configures join)
     ↓ onCSVUpload({ csvA, csvB, csvJoined, joinConfig })
   App.js (updates csvData, joinConfig)
     ↓ csvData prop
MappingPanel (user creates field mappings)
     ↓ onFieldMapping(mappedFields, jsonOutput)
   App.js (updates mappedFields, jsonOutput)
     ↓ jsonOutput prop
TemplateEditor (displays JSON, user writes templates)
     ↓ onTemplateParse(placeholders)
   App.js (updates templateFields)
     ↓ templateFields prop
MappingPanel (auto-creates mappings from template)
```

---

## Component Communication

### Callback Pattern

All child → parent communication uses callbacks with `useCallback` for stability:

```javascript
// Parent (App.js)
const handleCSVUpload = useCallback((data) => {
  setCsvData(data);
  setJoinConfig(data.joinConfig || null);
}, []);

// Child (CSVInspector.js)
useEffect(() => {
  onCSVUpload({
    csvA: csvDataA,
    csvB: csvDataB,
    csvJoined: joinedData,
    joinConfig: joinApplied ? joinConfig : null,
  });
}, [csvDataA, csvDataB, joinedData, joinApplied, joinConfig]);
```

### Ref Pattern for Callbacks

To avoid unnecessary re-renders when callbacks change:

```javascript
const onCSVUploadRef = useRef(onCSVUpload);
onCSVUploadRef.current = onCSVUpload;

// Use ref.current in useEffect
useEffect(() => {
  onCSVUploadRef.current(data);
}, [data]);
```

---

## JOIN Implementation

### How JOINs Work

Located in `src/utils/mappingUtils.js`.

#### 1. Index Building (for efficiency)

```javascript
/**
 * Build index: composite key string → array of rows
 * For multi-key joins: key = "val1|val2|val3"
 */
function indexByKey(rows, keyColumns) {
  const index = {};
  rows.forEach((row) => {
    const keyParts = keyColumns.map((k) => row[k] ?? '');
    const compositeKey = keyParts.join('|');
    if (!index[compositeKey]) index[compositeKey] = [];
    index[compositeKey].push(row);
  });
  return index;
}
```

#### 2. Column Mapping

Avoid duplicate column names and skip redundant join keys:

```javascript
/**
 * Build joined column list:
 * - All A columns
 * - B columns (skip join keys, prefix on collision)
 */
function buildJoinedColumnMap(columnsA, columnsB, keysB) {
  const aNamesSet = new Set(columnsA.map((c) => c.name));
  const skipBSet = new Set(keysB);
  
  const finalColumns = [];
  const bColNameMap = {};
  
  // Add all A columns as-is
  columnsA.forEach((col) => {
    finalColumns.push({ name: col.name, type: col.type, source: 'A' });
  });
  
  // Add B columns (skip join keys, rename collisions)
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
}
```

#### 3. Join Execution

Each join type has its own function:

```javascript
// INNER JOIN: Only matching rows
function performInnerJoin(rowsA, rowsB, columnsA, columnsB, keysA, keysB) {
  const indexB = indexByKey(rowsB, keysB);
  const { finalColumns, bColNameMap } = buildJoinedColumnMap(columnsA, columnsB, keysB);
  
  const result = [];
  rowsA.forEach((rowA) => {
    const keyParts = keysA.map((k) => rowA[k] ?? '');
    const compositeKey = keyParts.join('|');
    const matchingBRows = indexB[compositeKey] || [];
    
    matchingBRows.forEach((rowB) => {
      const joined = buildJoinedRow(rowA, rowB, columnsA, columnsB, keysB, bColNameMap);
      result.push(joined);
    });
  });
  
  return { rows: result, columns: finalColumns };
}

// LEFT JOIN: All A rows + matching B rows (nulls for non-matches)
// RIGHT JOIN: Matching A rows + all B rows (nulls for non-matches)
// FULL OUTER JOIN: All rows from both (nulls where no match)
```

---

## SQL Generation

Located in `src/utils/sqlGenerator.js`.

### Strategy

1. **Detect source**: Joined data or single CSV?
2. **Build SELECT columns**:
   - Extract source column from mapping
   - Detect table (A or B) from `A_` / `B_` prefix in joined mode
   - Apply transformations (`TRIM()`, `CAST()`)
   - Add alias for target field name
3. **Build JOIN clause** (if applicable):
   - Map join type to SQL keyword
   - Build `ON` conditions from key pairs

### Example Output

**Simple Query:**
```sql
SELECT
  TRIM("name") AS "user_name",
  CAST("age" AS NUMERIC) AS "user_age"
FROM csv_table_a;
```

**JOIN Query:**
```sql
SELECT
  a."id" AS "id",
  TRIM(a."name") AS "store_name",
  b."revenue" AS "revenue"
FROM csv_table_a AS a
INNER JOIN csv_table_b AS b
  ON a."store_id" = b."store_id" AND a."region" = b."region";
```

---

## Theme System

### CSS Variables Approach

All colors are defined as CSS custom properties in `App.css`:

```css
:root {
  --bg: #111827;
  --surface: #1f2937;
  --text: #f9fafb;
  --primary: #3b82f6;
  /* ... */
}

:root.light {
  --bg: #f3f4f6;
  --surface: #ffffff;
  --text: #111827;
  --primary: #3b82f6;
  /* ... */
}
```

### Theme Toggle

```javascript
// App.js
useEffect(() => {
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.add('light');
  } else {
    root.classList.remove('light');
  }
  localStorage.setItem('csv-mapper-theme', theme);
}, [theme]);
```

### Using Theme in Styled Components

```javascript
// Any .styles.js file
export const Panel = styled.div`
  background-color: var(--surface);  // Uses CSS variable
  color: var(--text);
  border: 1px solid var(--border);
  transition: background-color 0.2s ease; // Smooth theme switch
`;
```

---

## Code Patterns

### 1. Memoization for Performance

```javascript
// Expensive computations
const joinedData = useMemo(() => {
  if (!joinApplied || !csvDataA || !csvDataB) return null;
  return performJoin({ csvA: csvDataA, csvB: csvDataB }, joinConfig);
}, [joinApplied, csvDataA, csvDataB, joinConfig]);
```

### 2. Stable Callbacks

```javascript
// Prevent unnecessary child re-renders
const handleFieldMapping = useCallback((fields, generatedJson) => {
  setMappedFields(fields);
  setJsonOutput(generatedJson || []);
}, []);
```

### 3. Effect Dependencies

```javascript
// Only run when specific deps change
useEffect(() => {
  if ((effectiveCsvData.csvA || effectiveCsvData.csvB) && fields.length > 0) {
    const jsonOutput = generateJSON(fields, effectiveCsvData);
    onFieldMappingRef.current(fields, jsonOutput);
  } else {
    onFieldMappingRef.current(fields, []);
  }
}, [fields, effectiveCsvData]);
```

### 4. Conditional Rendering

```javascript
// Modal (only when showQueryLab is true)
{showQueryLab && (
  <QueryLab sqlQuery={sqlQuery} onClose={handleCloseQueryLab} />
)}

// Empty state
{fields.length === 0 ? (
  <EmptyState>...</EmptyState>
) : (
  fields.map((field) => <FieldMapping key={field.id} field={field} ... />)
)}
```

### 5. File Naming Conventions

- **Components**: `ComponentName.js`
- **Styles**: `ComponentName.styles.js`
- **Utilities**: `utilityName.js` (camelCase)
- **Constants**: `CONSTANT_NAME` (inside files)

### 6. Import Order

```javascript
// 1. React & external libraries
import React, { useState, useCallback } from 'react';

// 2. Internal components
import Header from './components/common/Header';
import CSVInspector from './components/CSVInspector/CSVInspector';

// 3. Utilities
import { generateSQLQuery } from './utils/sqlGenerator';

// 4. Styles
import * as S from './App.styles';
```

---

## Testing Patterns

### Manual Testing Checklist

1. **CSV Upload**
   - ✅ Upload single CSV
   - ✅ Upload two CSVs
   - ✅ Clear CSV
   - ✅ Search columns

2. **JOIN Configuration**
   - ✅ Single key join (all types)
   - ✅ Multi-key join
   - ✅ Edit join
   - ✅ Remove join

3. **Field Mapping**
   - ✅ Auto-map
   - ✅ Manual field addition
   - ✅ Drag-and-drop columns
   - ✅ Apply transformations
   - ✅ Delete fields
   - ✅ Validate (with errors)

4. **JSON Generation**
   - ✅ View preview
   - ✅ Switch format (Pretty/NDJSON)
   - ✅ Template with placeholders
   - ✅ Export JSON

5. **Query Lab**
   - ✅ Simple query generation
   - ✅ JOIN query generation
   - ✅ Copy to clipboard

6. **Theme**
   - ✅ Toggle light/dark
   - ✅ Persistence across refreshes

---

## Performance Considerations

### Large CSVs

- **Indexed joins**: O(n + m) instead of O(n × m)
- **Memoization**: Avoid recalculating joins on every render
- **Virtual scrolling**: Consider for 10k+ rows (not implemented yet)

### Memory Usage

- CSV data is stored in memory
- Large files (>10MB) may cause slowness
- Consider chunking for production use

---

## Future Enhancements

1. **Advanced Transformations**
   - Date parsing/formatting
   - String manipulation (uppercase, lowercase, substring)
   - Math operations
   - Conditional logic

2. **Export Options**
   - CSV export from joined data
   - Excel export
   - SQL INSERT statements

3. **Data Validation**
   - Schema validation
   - Data type constraints
   - Required field checks

4. **Performance**
   - Virtual scrolling for large datasets
   - Web Workers for CSV parsing
   - Streaming CSV uploads

5. **Collaboration**
   - Save/load projects
   - Share configurations
   - Version history

---

## Debugging Tips

### React DevTools

Use React DevTools to inspect component state and props:

```javascript
// Add to component for debugging
useEffect(() => {
  console.log('CSV Data:', csvData);
  console.log('Join Config:', joinConfig);
  console.log('Mapped Fields:', mappedFields);
}, [csvData, joinConfig, mappedFields]);
```

### Common Issues

1. **JOIN not working**: Check that join keys exist in both CSVs
2. **JSON empty**: Ensure mappings have both source column and target field
3. **Theme not persisting**: Check localStorage in DevTools
4. **Transformations not applying**: Verify transformation flags are true

---

## Contact

For questions or contributions, please open an issue or PR on GitHub.

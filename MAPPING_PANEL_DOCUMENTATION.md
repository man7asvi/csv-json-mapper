# Enhanced Mapping Panel Documentation

## Overview
The Enhanced Mapping Panel is a well-structured, modular component system that allows users to map CSV columns to custom JSON field names with transformations and drag-and-drop support.

## Architecture

### File Structure
```
src/
├── utils/
│   └── mappingUtils.js          # Utility functions for mapping logic
├── components/
│   └── MappingPanel/
│       ├── MappingPanel.styles.js      # All styled components
│       ├── FieldMapping.js             # Individual field mapping component
│       └── EnhancedMappingPanel.js     # Main mapping panel component
```

## Components

### 1. **mappingUtils.js** - Utility Functions

#### Functions:
- `autoMapFields(columns)` - Auto-maps CSV columns to themselves
- `createEmptyField(index)` - Creates a new empty field mapping
- `validateFieldMapping(field)` - Validates field mapping rules
- `findDuplicateFields(fields)` - Detects duplicate target field names
- `generateJSONFromMapping(fields, rows)` - Generates JSON output from mappings
- `exportMappingConfig(fields)` - Exports mapping configuration as JSON
- `importMappingConfig(configJson)` - Imports mapping configuration

#### Field Mapping Object Structure:
```javascript
{
  id: 'field_0_1234567890',
  sourceColumn: 'ip_address',
  targetField: 'user_ip',
  dataType: 'string',
  transformations: {
    trim: false,
    toNumber: false
  }
}
```

### 2. **MappingPanel.styles.js** - Styled Components

All UI components are exported as styled-components for modularity:
- `Container`, `Header`, `Title`, `MappingCount`
- `ButtonGroup`, `Button`
- `MappingsContainer`, `EmptyState`
- `FieldMappingCard`, `FieldHeader`, `FieldRow`
- `InputGroup`, `Label`, `Input`, `Select`
- `TransformationsRow`, `CheckboxLabel`
- `DropZone`, `ErrorMessage`
- `SaveCancelButtons`, `SaveButton`, `CancelButton`

### 3. **FieldMapping.js** - Individual Field Component

#### Props:
- `field` - Field mapping object
- `columns` - Available CSV columns
- `onUpdate` - Callback when field is updated
- `onDelete` - Callback when field is deleted
- `isEditing` - Whether field is in edit mode
- `onStartEdit`, `onSaveEdit`, `onCancelEdit` - Edit mode callbacks

#### Features:
- **Drag & Drop Support**: Drop CSV columns onto the field
- **Column Selection**: Dropdown to select source column
- **Target Field Input**: Text input for custom field name
- **Transformations**: Checkboxes for trim and toNumber
- **Validation**: Real-time validation with error messages
- **Visual Feedback**: Highlights when dragging over

### 4. **EnhancedMappingPanel.js** - Main Component

#### Props:
- `csvData` - Parsed CSV data from CSVInspector
- `onFieldMapping` - Callback with (fields, jsonOutput)

#### Features:

##### Auto-map Button
- Automatically maps all CSV columns to themselves
- Creates field mappings with detected data types
- Disabled when no CSV is uploaded

##### Reset Button
- Clears all field mappings
- Shows confirmation dialog
- Disabled when no mappings exist

##### Add Field Button
- Creates a new empty field mapping
- Allows custom field creation
- Automatically enters edit mode

##### Drag & Drop
- Accept columns dragged from CSV Inspector
- Visual feedback during drag operations
- Auto-populates source column and suggests target name

##### Validation
- Real-time field name validation
- Duplicate field name detection
- Error messages displayed inline

## Data Flow

```
CSV Upload
    ↓
EnhancedCSVInspector → csvData
    ↓
EnhancedMappingPanel receives csvData
    ↓
User Actions:
  - Auto-map → autoMapFields()
  - Add Field → createEmptyField()
  - Drag & Drop → handleDrop()
  - Edit Field → handleUpdateField()
    ↓
generateJSONFromMapping(fields, rows)
    ↓
onFieldMapping(fields, jsonOutput)
    ↓
App.js receives mappings and JSON output
```

## Features

### ✅ Implemented Features

1. **Auto-mapping**
   - One-click mapping of all CSV columns
   - Preserves original column names
   - Detects data types automatically

2. **Manual Field Creation**
   - Add custom fields
   - Map to any CSV column
   - Rename fields as needed

3. **Drag & Drop**
   - Drag columns from CSV Inspector
   - Drop onto field cards or dropzone
   - Visual feedback during drag

4. **Transformations**
   - Trim whitespace
   - Convert to number
   - Extensible for more transformations

5. **Validation**
   - Field name format validation
   - Duplicate name detection
   - Required field checking

6. **Reset Functionality**
   - Clear all mappings
   - Confirmation dialog
   - Preserves CSV data

7. **Real-time JSON Generation**
   - Automatic JSON output generation
   - Updates on every mapping change
   - Applies transformations

## Usage Example

```javascript
import EnhancedMappingPanel from './components/MappingPanel/EnhancedMappingPanel';

function App() {
  const [csvData, setCsvData] = useState(null);
  const [mappedFields, setMappedFields] = useState([]);
  const [jsonOutput, setJsonOutput] = useState([]);

  const handleFieldMapping = (fields, generatedJson) => {
    setMappedFields(fields);
    setJsonOutput(generatedJson);
  };

  return (
    <EnhancedMappingPanel 
      csvData={csvData}
      onFieldMapping={handleFieldMapping}
    />
  );
}
```

## Styling

### Color Scheme
- Primary: `#00b050` (green)
- Backgrounds: `#f9f9f9`, `#f0fdf4`
- Borders: `#ddd`, `#e0e0e0`
- Error: `#ef4444`
- Text: `#333`, `#666`, `#999`

### Design Patterns
- Rounded corners (8px, 12px)
- Subtle shadows on hover
- Smooth transitions (0.2s ease)
- Custom scrollbars
- Responsive grid layouts

## Best Practices

1. **Separation of Concerns**
   - Logic in utils
   - Styling in separate file
   - Component focused on UI

2. **Modularity**
   - Reusable FieldMapping component
   - Exportable utility functions
   - Independent styled components

3. **User Experience**
   - Visual feedback for all actions
   - Clear error messages
   - Confirmation for destructive actions
   - Drag & drop support

4. **Performance**
   - useCallback for event handlers
   - Efficient state updates
   - Minimal re-renders

## Future Enhancements

### Potential Features:
1. **Advanced Transformations**
   - Date formatting
   - String manipulation (uppercase, lowercase, etc.)
   - Custom regex transformations
   - Conditional transformations

2. **Mapping Templates**
   - Save mapping configurations
   - Load saved mappings
   - Share mapping templates

3. **Field Reordering**
   - Drag to reorder fields
   - Sort alphabetically
   - Group by data type

4. **Bulk Operations**
   - Select multiple fields
   - Apply transformations to multiple fields
   - Delete multiple fields

5. **Preview**
   - Show sample output for each field
   - Preview transformations
   - Highlight errors in sample data

6. **Export/Import**
   - Export mapping configuration
   - Import from JSON
   - Copy/paste mappings

## Testing Recommendations

1. **Unit Tests**
   - Test all utility functions
   - Test validation logic
   - Test JSON generation

2. **Integration Tests**
   - Test drag & drop functionality
   - Test auto-mapping
   - Test field CRUD operations

3. **E2E Tests**
   - Complete mapping workflow
   - CSV upload to JSON export
   - Error handling scenarios

## Troubleshooting

### Common Issues:

1. **Drag & Drop Not Working**
   - Ensure dataTransfer is properly set
   - Check browser compatibility
   - Verify event handlers are attached

2. **Validation Errors**
   - Check field name format
   - Look for duplicate names
   - Ensure source column is selected

3. **JSON Not Generating**
   - Verify CSV data is loaded
   - Check field mappings are valid
   - Ensure onFieldMapping callback is connected

## Summary

The Enhanced Mapping Panel provides a robust, user-friendly interface for mapping CSV columns to JSON fields. It follows best practices for React development with clear separation of concerns, modular architecture, and excellent user experience. The component is fully functional, well-documented, and ready for production use.

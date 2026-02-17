# CSV to JSON Mapper

A powerful React application for transforming CSV data into structured JSON with support for SQL-like JOINs, field mappings, and template-based generation.

## Features

### 🔄 Multi-CSV Support with SQL Joins
- Upload up to 2 CSV files (CSV A and CSV B)
- Configure SQL-style joins (INNER, LEFT, RIGHT, FULL OUTER)
- **Multi-key (composite) joins** — join on multiple column pairs
- Visual join configuration panel with real-time preview

### 🗺️ Visual Field Mapping
- Drag-and-drop CSV columns to create field mappings
- Auto-map all columns with one click
- Apply transformations:
  - **Trim** whitespace
  - **Cast to Number** for numeric data
- Rename fields for JSON output
- Validation and duplicate detection

### 📄 Template-Based JSON Generation
- Write JSON templates with `{{placeholder}}` syntax
- Auto-parse templates to create field mappings
- Live preview of generated JSON
- Support for nested JSON structures
- Export options: Pretty JSON or NDJSON

### 🔍 Query Lab
- **Generate SQL queries** from your mappings
- See the equivalent SQL that produces your JSON output
- One-click copy to clipboard
- Supports all join types and transformations

### 🎨 Modern UI/UX
- **Light & Dark themes** with persistent preference
- Responsive design (desktop and tablet)
- Flowbite-inspired dark mode
- Geist fonts (Geist for UI, Geist Mono for code)
- Smooth transitions and animations

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view in the browser.

### Build

```bash
npm run build
```

Builds the app for production to the `build` folder.

## User Guide

### 1. Upload CSVs

**Left Panel → CSV Inspector**

- Click or drag-and-drop to upload CSV files
- Upload one CSV for simple transformation
- Upload two CSVs to enable JOIN operations
- Search and preview columns and sample data

### 2. Configure Join (Optional)

**Left Panel → Configure Join Button**

If you uploaded 2 CSVs:

1. Click **"Configure Join"** button
2. Select **Join Type**: Inner, Left, Right, or Full Outer
3. Choose **Join Keys**:
   - Select matching columns from CSV A and CSV B
   - Click **"+ Add Key"** for multi-key (composite) joins
4. Click **"Apply Join"** 
5. View the "Joined Data" tab with combined results

### 3. Map Fields

**Middle Panel → Mapping Panel**

- Click **"Auto-map"** to map all columns automatically
- Or click **"Add Field"** for manual mappings
- For each field:
  - **Source CSV**: A, B, or Joined (auto-selected for joined data)
  - **Source Column**: Select the CSV column
  - **Target Field Name**: Enter the JSON field name
  - **Transformations**: Enable Trim and/or To Number
- Drag columns from the left panel for quick mapping

### 4. Preview JSON

**Right Panel → Template Editor / Live Preview**

#### Option A: Direct Preview
- Switch to **"Live Preview"** tab
- View generated JSON from mappings
- Adjust rows to preview (1, 5, 10, 25)
- Toggle between Pretty JSON and NDJSON format

#### Option B: Template-Based
1. Stay on **"Template Editor"** tab
2. Write a JSON template using `{{placeholder}}` syntax
3. Click **"Parse Template"** to auto-create mappings
4. Switch to **"Live Preview"** to see template-applied JSON

Example template:
```json
{
  "store": {
    "id": "{{store_id}}",
    "name": "{{store_name}}"
  },
  "revenue": {{revenue}},
  "active": {{is_active}}
}
```

### 5. Generate SQL Query

**Top Right → Query Lab Button**

- Click **"Query Lab"** to see the SQL query
- The query replicates your mappings and joins
- Click **"Copy"** to copy to clipboard
- Use in your database to reproduce the same JSON transformation

### 6. Export & Validate

**Footer Actions**

- **Validate**: Check mappings for errors and see summary
- **Submit**: Switch to Live Preview
- **Export JSON**: Download the generated JSON file

## Architecture

### Components

```
src/
├── components/
│   ├── common/
│   │   └── Header.js                 # Top header with theme toggle, Query Lab, Export
│   ├── CSVInspector/
│   │   ├── CSVInspector.js           # CSV upload, tabs, join configuration
│   │   ├── CSVTabPanel.js            # Individual CSV tab content
│   │   └── CSVInspector.styles.js    # Styled components
│   ├── MappingPanel/
│   │   ├── MappingPanel.js           # Field mappings manager
│   │   ├── FieldMapping.js           # Individual field mapping card
│   │   └── MappingPanel.styles.js    # Styled components
│   ├── TemplateEditor/
│   │   ├── TemplateEditor.js         # Template editor & JSON preview
│   │   └── TemplateEditor.styles.js  # Styled components
│   └── QueryLab/
│       ├── QueryLab.js               # SQL query modal
│       └── QueryLab.styles.js        # Styled components
├── utils/
│   ├── csvParser.js                  # CSV parsing logic
│   ├── mappingUtils.js               # Field mapping & JOIN operations
│   └── sqlGenerator.js               # SQL query generation
├── App.js                            # Main application orchestrator
└── App.css                           # Global styles & CSS variables (theme)
```

### Key Utilities

#### `mappingUtils.js`
- **`autoMapFields()`** — Auto-map all CSV columns
- **`generateJSON()`** — Generate flat JSON from mappings
- **`performJoin()`** — Execute SQL-like JOINs (inner, left, right, full)
- **`applyTemplate()`** — Apply template with placeholders

#### `sqlGenerator.js`
- **`generateSQLQuery()`** — Generate SQL from mappings & joins
- Supports all join types and transformations

#### `csvParser.js`
- **`parseCSV()`** — Parse CSV file with type inference
- Detects numbers, booleans, dates automatically

## JOIN Operations

### How Joins Work

When you join CSV A and CSV B:

1. **Join Type** determines which rows are included:
   - **INNER**: Only matching rows from both CSVs
   - **LEFT**: All rows from A, matching rows from B (nulls for non-matches)
   - **RIGHT**: Matching rows from A, all rows from B (nulls for non-matches)
   - **FULL OUTER**: All rows from both CSVs (nulls where no match)

2. **Join Keys** specify the matching conditions:
   - Single key: `A.id = B.store_id`
   - Multi-key: `A.id = B.store_id AND A.region = B.region`

3. **Column Naming** in joined results:
   - CSV A columns keep their original names
   - CSV B join key columns are omitted (redundant)
   - CSV B columns with name collisions get `B_` prefix
   - All other CSV B columns keep original names

Example:
```
CSV A: id, name, city
CSV B: store_id, city, revenue

Join on: A.id = B.store_id
Result: id, name, city, B_city, revenue
                            ↑ prefixed to avoid collision
```

## Theme System

The app uses **CSS custom properties** for theming:

- All colors are defined in `:root` in `App.css`
- Light theme overrides in `:root.light`
- Theme preference saved to `localStorage`
- Toggle button in header switches themes instantly

### Color Tokens

```css
--bg           # Background
--surface      # Panel backgrounds
--surface-alt  # Card backgrounds
--border       # Borders
--text         # Primary text
--text-secondary  # Secondary text
--primary      # Blue accent
--success      # Green (success states)
--danger       # Red (errors)
```

## Technologies

- **React 18** — UI library
- **styled-components** — CSS-in-JS styling
- **PapaParse** (if used) — CSV parsing
- **Geist Fonts** — Typography (Geist & Geist Mono)
- **Flowbite** — Design inspiration for dark theme

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Responsive: Desktop (1024px+) and Tablet (768px+)

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using React**

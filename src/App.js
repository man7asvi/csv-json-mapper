/**
 * CSV to JSON Mapper - Main Application Component
 * 
 * This is the root component that orchestrates the entire CSV-to-JSON transformation workflow.
 * It manages global state and coordinates between three main panels:
 * - Left Panel (CSVInspector): CSV upload and join configuration
 * - Middle Panel (MappingPanel): Field mapping from CSV columns to JSON fields
 * - Right Panel (TemplateEditor): Template editing and JSON preview
 * 
 * Features:
 * - Upload single or multiple CSVs with SQL-like JOIN support
 * - Visual field mapping with drag-and-drop
 * - Row filtering with WHERE clause support (NEW)
 * - Template-based JSON generation with {{placeholder}} syntax
 * - Live preview and validation
 * - SQL query generation (Query Lab)
 * - Light/Dark theme support
 * 
 * @component
 */

import React, { useState, useCallback, useEffect } from 'react';
import './App.css';

// Components
import Header from './components/common/Header';
import CSVInspector from './components/CSVInspector/CSVInspector';
import MappingPanel from './components/MappingPanel/MappingPanel';
import TemplateEditor from './components/TemplateEditor/TemplateEditor';
import QueryLab from './components/QueryLab/QueryLab';

// Utilities
import { generateSQLQuery } from './utils/sqlGenerator';
import * as S from './App.styles';

function App() {
  // ═══════════════════════════════════════════════════════════════════
  // Theme Management
  // ═══════════════════════════════════════════════════════════════════
  
  /**
   * Theme state (light/dark) with localStorage persistence
   * Default: dark theme
   */
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('csv-mapper-theme');
    return saved || 'dark';
  });

  /**
   * Apply theme class to document root and persist to localStorage
   */
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('csv-mapper-theme', theme);
  }, [theme]);

  /**
   * Toggle between light and dark themes
   */
  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  // Application State
  // ═══════════════════════════════════════════════════════════════════
  
  /**
   * CSV data state
   * @type {{ csvA: Object|null, csvB: Object|null, csvJoined: Object|null }}
   */
  const [csvData, setCsvData] = useState({ 
    csvA: null, 
    csvB: null, 
    csvJoined: null 
  });

  /**
   * Join configuration (type, keys) when CSVs are joined
   * @type {Object|null}
   */
  const [joinConfig, setJoinConfig] = useState(null);

  /**
   * Array of field mappings (source column → target JSON field)
   * @type {Array<Object>}
   */
  const [mappedFields, setMappedFields] = useState([]);

  /**
   * Generated JSON output array
   * @type {Array<Object>}
   */
  const [jsonOutput, setJsonOutput] = useState([]);

  /**
   * Filter configuration array (WHERE clause logic)
   * NEW: Stores filter conditions for row filtering
   * @type {Array<Object>}
   */
  const [filters, setFilters] = useState([]);

  /**
   * User-defined JSON template string
   * @type {string}
   */
  const [template, setTemplate] = useState('');

  /**
   * Parsed template placeholders {{field}} from template
   * @type {Array<string>|null}
   */
  const [templateFields, setTemplateFields] = useState(null);

  /**
   * Active tab in template editor (editor|preview)
   * @type {string}
   */
  const [previewTab, setPreviewTab] = useState('editor');

  /**
   * Query Lab modal visibility
   * @type {boolean}
   */
  const [showQueryLab, setShowQueryLab] = useState(false);

  // ═══════════════════════════════════════════════════════════════════
  // Event Handlers
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Handle CSV upload/change from CSVInspector
   * Updates CSV data and join configuration
   * 
   * @param {Object} data - CSV data object with csvA, csvB, csvJoined, joinConfig
   */
  const handleCSVUpload = useCallback((data) => {
    setCsvData(data);
    setJoinConfig(data.joinConfig || null);
  }, []);

  /**
   * Handle field mapping changes from MappingPanel
   * Updates mapped fields, generated JSON, and filters
   * UPDATED: Now receives filters as third parameter
   * 
   * @param {Array<Object>} fields - Array of field mapping objects
   * @param {Array<Object>} generatedJson - Generated JSON array
   * @param {Array<Object>} filterConfig - Filter configuration array (NEW)
   */
  const handleFieldMapping = useCallback((fields, generatedJson, filterConfig) => {
    setMappedFields(fields);
    setJsonOutput(generatedJson || []);
    setFilters(filterConfig || []); // NEW: Store filters
  }, []);

  /**
   * Handle template content change
   * 
   * @param {string} newTemplate - Updated template string
   */
  const handleTemplateChange = useCallback((newTemplate) => {
    setTemplate(newTemplate);
  }, []);

  /**
   * Handle template parsing (extract {{placeholders}})
   * 
   * @param {Array<string>} placeholders - Array of placeholder field names
   */
  const handleTemplateParse = useCallback((placeholders) => {
    setTemplateFields(placeholders);
  }, []);

  /**
   * Handle preview tab change (editor/preview)
   * 
   * @param {string} tab - Tab identifier
   */
  const handlePreviewTabChange = useCallback((tab) => {
    setPreviewTab(tab);
  }, []);

  /**
   * Open Query Lab modal
   */
  const handleOpenQueryLab = useCallback(() => {
    setShowQueryLab(true);
  }, []);

  /**
   * Close Query Lab modal
   */
  const handleCloseQueryLab = useCallback(() => {
    setShowQueryLab(false);
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  // Actions
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Submit and switch to live preview tab
   * Validates that data and mappings exist before switching
   */
  const handleSubmit = () => {
    if (!csvData.csvA && !csvData.csvB && !csvData.csvJoined) {
      alert('Please upload at least one CSV file first.');
      return;
    }
    if (mappedFields.length === 0) {
      alert('Please create at least one field mapping first.');
      return;
    }
    setPreviewTab('preview');
  };

  /**
   * Validate field mappings and data
   * Shows alert with validation results
   */
  const handleValidate = () => {
    // Check if data exists
    if (!csvData.csvA && !csvData.csvB && !csvData.csvJoined) {
      alert('Please upload at least one CSV file first.');
      return;
    }

    // Check if mappings exist
    if (mappedFields.length === 0) {
      alert('Please create at least one field mapping.');
      return;
    }

    // Check for incomplete mappings
    const incomplete = mappedFields.filter(
      (f) => !f.source?.column || !f.targetField
    );
    if (incomplete.length > 0) {
      alert(`${incomplete.length} field(s) have incomplete mappings.`);
      return;
    }

    // Build validation summary
    const csvAInfo = csvData.csvA
      ? `CSV A: ${csvData.csvA.rowCount} rows, ${csvData.csvA.columnCount} columns\n`
      : '';
    const csvBInfo = csvData.csvB
      ? `CSV B: ${csvData.csvB.rowCount} rows, ${csvData.csvB.columnCount} columns\n`
      : '';
    const joinInfo = csvData.csvJoined
      ? `Joined: ${csvData.csvJoined.rowCount} rows, ${csvData.csvJoined.columnCount} columns\n`
      : '';
    const filterInfo = filters.length > 0
      ? `Filters: ${filters.length} active\n`
      : '';

    alert(
      `Validation passed!\n\n${csvAInfo}${csvBInfo}${joinInfo}${filterInfo}Mappings: ${mappedFields.length} fields\nJSON Output: ${jsonOutput.length} objects`
    );
  };

  /**
   * Export generated JSON to file
   * Creates a downloadable .json file with the current JSON output
   */
  const handleExportJSON = () => {
    if (jsonOutput.length === 0) {
      alert('No JSON data to export. Please create mappings first.');
      return;
    }

    // Create JSON blob
    const jsonString = JSON.stringify(jsonOutput, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement('a');
    link.href = url;

    // Generate filename based on source
    let filename = 'output';
    if (csvData.csvJoined) {
      filename = 'joined-output';
    } else if (csvData.csvA) {
      filename = csvData.csvA.fileName.replace('.csv', '');
    }
    link.download = `${filename}.json`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ═══════════════════════════════════════════════════════════════════
  // Computed Values
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Check if any CSV data exists
   */
  const hasData = csvData.csvA || csvData.csvB || csvData.csvJoined;

  /**
   * Generate footer status text showing current data state
   * UPDATED: Now includes filter count
   */
  const statusText = hasData
    ? csvData.csvJoined
      ? `${csvData.csvJoined.rowCount} joined rows · ${mappedFields.length} fields mapped · ${jsonOutput.length} JSON objects${filters.length > 0 ? ` · ${filters.length} filter${filters.length !== 1 ? 's' : ''} applied` : ''}`
      : `${csvData.csvA ? csvData.csvA.rowCount : 0}${
          csvData.csvB ? ' + ' + csvData.csvB.rowCount : ''
        } rows · ${mappedFields.length} fields mapped · ${jsonOutput.length} JSON objects${filters.length > 0 ? ` · ${filters.length} filter${filters.length !== 1 ? 's' : ''} applied` : ''}`
    : 'Ready to transform your CSV data into JSON';

  /**
   * Generate SQL query from current mappings, join config, and filters
   * UPDATED: Now includes filters parameter
   */
  const sqlQuery = generateSQLQuery(csvData, mappedFields, joinConfig, filters);

  // ═══════════════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════════════

  return (
    <S.AppContainer>
      {/* Header with theme toggle, Query Lab, and Export buttons */}
      <Header
        onExportJSON={handleExportJSON}
        hasData={jsonOutput.length > 0}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenQueryLab={handleOpenQueryLab}
      />

      {/* Query Lab Modal (conditional) */}
      {showQueryLab && (
        <QueryLab sqlQuery={sqlQuery} onClose={handleCloseQueryLab} />
      )}

      {/* Main content: 3-panel layout */}
      <S.ContentContainer>
        {/* Left Panel: CSV Upload & Join Configuration */}
        <S.LeftPanel>
          <CSVInspector onCSVUpload={handleCSVUpload} />
        </S.LeftPanel>

        {/* Middle Panel: Field Mapping + Filters (NEW) */}
        <S.MiddlePanel>
          <MappingPanel
            csvData={csvData}
            templateFields={templateFields}
            onFieldMapping={handleFieldMapping}
          />
        </S.MiddlePanel>

        {/* Right Panel: Template Editor & JSON Preview */}
        <S.RightPanel>
          <TemplateEditor
            template={template}
            onTemplateChange={handleTemplateChange}
            onTemplateParse={handleTemplateParse}
            jsonOutput={jsonOutput}
            activePreviewTab={previewTab}
            onTabChange={handlePreviewTabChange}
          />
        </S.RightPanel>
      </S.ContentContainer>

      {/* Footer: Status + Action Buttons */}
      <S.Footer>
        <S.StatusText>{statusText}</S.StatusText>
        <S.ActionButtonsContainer>
          {/* Validate Button */}
          <S.ActionButton
            onClick={handleValidate}
            disabled={!hasData || mappedFields.length === 0}
            title="Validate your field mappings"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Validate
          </S.ActionButton>

          {/* Submit Button */}
          <S.ActionButton
            variant="primary"
            onClick={handleSubmit}
            disabled={!hasData || mappedFields.length === 0}
            title="Submit and preview JSON output"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Submit
          </S.ActionButton>
        </S.ActionButtonsContainer>
      </S.Footer>
    </S.AppContainer>
  );
}

export default App;
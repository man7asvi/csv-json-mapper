import React, { useState, useEffect, useMemo } from 'react';
import * as S from './TemplateEditor.styles';
import {
  parseTemplatePlaceholders,
  applyTemplate,
} from '../../utils/mappingUtils';

/**
 * Template Editor & Live Preview panel.
 *
 * - Template tab: write/paste a JSON template with {{placeholder}} syntax.
 *   "Parse Template" extracts placeholders and sends them to the parent
 *   so the MappingPanel can auto-create field mappings.
 *
 * - Preview tab: shows generated JSON output (flat or template-applied).
 */
const TemplateEditor = ({
  template,
  onTemplateChange,
  onTemplateParse,
  jsonOutput,
  activePreviewTab,
  onTabChange,
}) => {
  const [localTemplate, setLocalTemplate] = useState(template || '');
  const [templateMode, setTemplateMode] = useState('placeholder');
  const [previewRows, setPreviewRows] = useState(5);
  const [viewMode, setViewMode] = useState('pretty');

  // Sync local template when prop changes externally
  useEffect(() => {
    if (template !== undefined && template !== localTemplate) {
      setLocalTemplate(template);
    }
    // Only react to prop changes, not local edits
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);

  // Auto-detect template mode
  useEffect(() => {
    if (!localTemplate.trim()) {
      setTemplateMode('placeholder');
      return;
    }
    if (/\{\{[\s\S]*?\}\}/.test(localTemplate) || /\{%[\s\S]*?%\}/.test(localTemplate)) {
      setTemplateMode('jinja');
    } else {
      try {
        JSON.parse(localTemplate);
        setTemplateMode('json');
      } catch {
        setTemplateMode('placeholder');
      }
    }
  }, [localTemplate]);

  /* ── Template Actions ── */

  const handleTemplateEdit = (e) => {
    const val = e.target.value;
    setLocalTemplate(val);
    onTemplateChange(val);
  };

  const handleParseTemplate = () => {
    const placeholders = parseTemplatePlaceholders(localTemplate);
    if (placeholders.length === 0) {
      alert('No {{placeholders}} found in the template.');
      return;
    }
    onTemplateParse(placeholders);
  };

  const clearTemplate = () => {
    setLocalTemplate('');
    onTemplateChange('');
  };

  const loadExample = () => {
    const example = `{
  "store": {
    "id": "{{store_id}}",
    "name": "{{store_name}}",
    "location": "{{location}}"
  },
  "revenue": {{revenue}},
  "employees": {{employee_count}},
  "active": {{is_active}}
}`;
    setLocalTemplate(example);
    onTemplateChange(example);
  };

  /* ── Preview Data ── */

  const previewData = useMemo(() => {
    if (!jsonOutput || jsonOutput.length === 0) return null;
    const sliced = jsonOutput.slice(0, previewRows);

    // If there's a template with placeholders, apply it
    if (localTemplate.trim() && /\{\{[\s\S]*?\}\}/.test(localTemplate)) {
      const applied = applyTemplate(localTemplate, sliced);
      if (applied.length > 0) return applied;
    }

    return sliced;
  }, [jsonOutput, previewRows, localTemplate]);

  const previewText = useMemo(() => {
    if (!previewData) return '';
    if (viewMode === 'pretty') {
      return JSON.stringify(previewData, null, 2);
    }
    return previewData.map((obj) => JSON.stringify(obj)).join('\n');
  }, [previewData, viewMode]);

  const handleCopy = () => {
    if (previewText) {
      navigator.clipboard.writeText(previewText).catch(() => {});
    }
  };

  const handleDownload = () => {
    if (!jsonOutput?.length) return;

    const fullData = localTemplate.trim() && /\{\{[\s\S]*?\}\}/.test(localTemplate)
      ? applyTemplate(localTemplate, jsonOutput)
      : jsonOutput;

    const content =
      viewMode === 'pretty'
        ? JSON.stringify(fullData, null, 2)
        : fullData.map((obj) => JSON.stringify(obj)).join('\n');

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `output${viewMode === 'ndjson' ? '.ndjson' : '.json'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /* ── Active tab ── */
  const activeTab = activePreviewTab || 'editor';

  return (
    <S.Container>
      <S.TabNavigation>
        <S.TabButton
          active={activeTab === 'editor'}
          onClick={() => onTabChange('editor')}
        >
          Template Editor
        </S.TabButton>
        <S.TabButton
          active={activeTab === 'preview'}
          onClick={() => onTabChange('preview')}
        >
          Live Preview
          {jsonOutput?.length > 0 && ` (${jsonOutput.length})`}
        </S.TabButton>
      </S.TabNavigation>

      <S.TabContent>
        {activeTab === 'editor' ? (
          <>
            <S.EditorHeader>
              <S.EditorTitle>
                Template Editor
                <S.ModeBadge mode={templateMode}>{templateMode}</S.ModeBadge>
              </S.EditorTitle>
              <S.ActionButtonGroup>
                <S.ActionButton
                  primary
                  onClick={handleParseTemplate}
                  disabled={!localTemplate.trim()}
                  title="Parse template placeholders and create field mappings"
                >
                  Parse Template
                </S.ActionButton>
                <S.IconButton onClick={clearTemplate} title="Clear template">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </S.IconButton>
              </S.ActionButtonGroup>
            </S.EditorHeader>

            <S.ExampleButtonGroup>
              <S.ExampleButton onClick={loadExample}>
                Load Example Template
              </S.ExampleButton>
            </S.ExampleButtonGroup>

            <S.TextArea
              value={localTemplate}
              onChange={handleTemplateEdit}
              placeholder={`Paste a JSON template with {{placeholders}} here...\n\nExample:\n{\n  "name": "{{name}}",\n  "email": "{{email}}"\n}`}
            />

            {templateMode === 'jinja' && localTemplate.trim() && (
              <S.Alert>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>
                  Template with {'{{placeholders}}'} detected. Click "Parse
                  Template" to auto-create field mappings.
                </span>
              </S.Alert>
            )}
          </>
        ) : (
          /* ── Live Preview Tab ── */
          <>
            <S.PreviewHeader>
              <S.PreviewTitle>Live Preview</S.PreviewTitle>
              <S.PreviewActions>
                <S.IconButton
                  onClick={handleCopy}
                  disabled={!previewText}
                  title="Copy to clipboard"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 4V16C8 16.5304 8.21071 17.0391 8.58579 17.4142C8.96086 17.7893 9.46957 18 10 18H18C18.5304 18 19.0391 17.7893 19.4142 17.4142C19.7893 17.0391 20 16.5304 20 16V7.242C20 6.97556 19.9467 6.71181 19.8433 6.46624C19.7399 6.22068 19.5885 5.99824 19.398 5.812L16.083 2.57C15.7094 2.20466 15.2076 2.00007 14.685 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 18V20C16 20.5304 15.7893 21.0391 15.4142 21.4142C15.0391 21.7893 14.5304 22 14 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V9C4 8.46957 4.21071 7.96086 4.58579 7.58579C4.96086 7.21071 5.46957 7 6 7H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </S.IconButton>
                <S.IconButton
                  onClick={handleDownload}
                  disabled={!jsonOutput?.length}
                  title="Download JSON"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </S.IconButton>
              </S.PreviewActions>
            </S.PreviewHeader>

            <S.ControlPanel>
              <S.ControlGroup>
                <S.ControlLabel>Rows:</S.ControlLabel>
                <S.Select
                  value={previewRows}
                  onChange={(e) => setPreviewRows(Number(e.target.value))}
                >
                  <option value={1}>1</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </S.Select>
              </S.ControlGroup>

              <S.ToggleGroup>
                <S.ToggleButton
                  active={viewMode === 'pretty'}
                  onClick={() => setViewMode('pretty')}
                >
                  Pretty
                </S.ToggleButton>
                <S.ToggleButton
                  active={viewMode === 'ndjson'}
                  onClick={() => setViewMode('ndjson')}
                >
                  NDJSON
                </S.ToggleButton>
              </S.ToggleGroup>
            </S.ControlPanel>

            <S.PreviewContainer>
              {previewText ? (
                <pre>{previewText}</pre>
              ) : (
                <S.EmptyPreview>
                  Upload CSV, create mappings, and click Submit to see preview
                </S.EmptyPreview>
              )}
            </S.PreviewContainer>

            {jsonOutput?.length > 0 && (
              <S.RowCount>
                Showing {Math.min(previewRows, jsonOutput.length)} of{' '}
                {jsonOutput.length} rows
              </S.RowCount>
            )}
          </>
        )}
      </S.TabContent>
    </S.Container>
  );
};

export default TemplateEditor;

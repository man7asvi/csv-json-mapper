import styled from 'styled-components';

/* ── Layout ── */

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

/* ── Tabs ── */

export const TabNavigation = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border);
  margin-bottom: 14px;
`;

export const TabButton = styled.button`
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Geist', sans-serif;
  color: ${(props) => (props.active ? 'var(--primary)' : 'var(--text-muted)')};
  background: none;
  border: none;
  border-bottom: 2px solid
    ${(props) => (props.active ? 'var(--primary)' : 'transparent')};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: var(--text);
  }

  &:focus {
    outline: none;
  }
`;

export const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

/* ── Editor Header ── */

export const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 8px;
`;

export const EditorTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ModeBadge = styled.span`
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 4px;

  background-color: ${(props) => {
    switch (props.mode) {
      case 'json':
        return 'var(--mode-json-bg)';
      case 'placeholder':
        return 'var(--mode-placeholder-bg)';
      case 'jinja':
        return 'var(--mode-jinja-bg)';
      default:
        return 'var(--type-default-bg)';
    }
  }};

  color: ${(props) => {
    switch (props.mode) {
      case 'json':
        return 'var(--mode-json)';
      case 'placeholder':
        return 'var(--mode-placeholder)';
      case 'jinja':
        return 'var(--mode-jinja)';
      default:
        return 'var(--text-muted)';
    }
  }};
`;

/* ── Buttons ── */

export const ActionButtonGroup = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

export const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Geist', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.15s ease;
  border: 1px solid ${(props) => (props.primary ? 'var(--primary)' : 'var(--border-light)')};
  background-color: ${(props) => (props.primary ? 'var(--primary)' : 'transparent')};
  color: ${(props) => (props.primary ? '#fff' : 'var(--text-secondary)')};

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.primary ? 'var(--primary-hover)' : 'var(--hover-overlay)'};
    color: ${(props) => (props.primary ? '#fff' : 'var(--text)')};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    width: 13px;
    height: 13px;
  }
`;

export const IconButton = styled.button`
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-muted);
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background-color: var(--hover-overlay);
    color: var(--text);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const ExampleButtonGroup = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
`;

export const ExampleButton = styled.button`
  flex: 1;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Geist', sans-serif;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid ${(props) => (props.active ? 'var(--primary)' : 'var(--border-light)')};
  background-color: ${(props) => (props.active ? 'var(--primary)' : 'transparent')};
  color: ${(props) => (props.active ? '#fff' : 'var(--text-secondary)')};

  &:hover {
    border-color: var(--primary);
    color: var(--text);
  }
`;

/* ── Text Area ── */

export const TextArea = styled.textarea`
  flex: 1;
  padding: 12px;
  border: 1px solid var(--input-border);
  border-radius: 8px;
  font-family: 'Geist Mono', 'SF Mono', 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  line-height: 1.6;
  resize: none;
  background-color: var(--surface-alt);
  color: var(--code-muted-text);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-15);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

/* ── Alerts ── */

export const Alert = styled.div`
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background-color: var(--primary-10);
  border: 1px solid var(--primary-20);
  color: var(--join-info-text);

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    margin-top: 1px;
  }
`;

/* ── Preview ── */

export const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const PreviewTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: var(--text);
`;

export const PreviewActions = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

export const ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px 10px;
  background-color: var(--surface-alt);
  border-radius: 8px;
  border: 1px solid var(--border);
`;

export const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ControlLabel = styled.label`
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
`;

export const Select = styled.select`
  padding: 5px 8px;
  border: 1px solid var(--input-border);
  border-radius: 6px;
  font-size: 12px;
  font-family: 'Geist', sans-serif;
  background-color: var(--input-bg);
  color: var(--text);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }

  option {
    background: var(--surface-alt);
    color: var(--text);
  }
`;

export const ToggleGroup = styled.div`
  display: flex;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  overflow: hidden;
`;

export const ToggleButton = styled.button`
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 500;
  font-family: 'Geist', sans-serif;
  cursor: pointer;
  border: none;
  background-color: ${(props) => (props.active ? 'var(--primary)' : 'transparent')};
  color: ${(props) => (props.active ? '#fff' : 'var(--text-muted)')};
  transition: all 0.15s ease;

  &:not(:last-child) {
    border-right: 1px solid var(--border-light);
  }

  &:hover {
    background-color: ${(props) =>
      props.active ? 'var(--primary)' : 'var(--hover-overlay)'};
    color: ${(props) => (props.active ? '#fff' : 'var(--text)')};
  }
`;

export const PreviewContainer = styled.div`
  flex: 1;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--surface-alt);
  overflow: auto;
  font-family: 'Geist Mono', 'SF Mono', 'Monaco', 'Menlo', monospace;
  font-size: 11px;
  line-height: 1.6;
  color: var(--code-text);
  white-space: pre-wrap;
  word-break: break-word;
`;

export const EmptyPreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  font-size: 13px;
  font-family: 'Geist', sans-serif;
`;

export const RowCount = styled.div`
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-muted);
  text-align: right;
`;

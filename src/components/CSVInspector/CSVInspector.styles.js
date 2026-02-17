import styled from 'styled-components';

/* ── Layout ── */

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Title = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--text);
`;

/* ── Tabs ── */

export const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--border);
  flex-wrap: nowrap;
  overflow-x: auto;
`;

export const Tab = styled.button`
  padding: 7px 12px;
  background-color: ${(props) => (props.active ? 'var(--surface-alt)' : 'transparent')};
  border: 1px solid ${(props) => (props.active ? 'var(--border-light)' : 'transparent')};
  border-bottom: ${(props) =>
    props.active ? '2px solid var(--primary)' : '2px solid transparent'};
  border-radius: 6px 6px 0 0;
  margin-right: 2px;
  font-size: 13px;
  font-weight: ${(props) => (props.active ? '600' : '400')};
  font-family: 'Geist', sans-serif;
  color: ${(props) => (props.active ? 'var(--text)' : 'var(--text-muted)')};
  cursor: pointer;
  display: flex;
  align-items: center;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    color: var(--text);
    background-color: ${(props) => (props.active ? 'var(--surface-alt)' : 'var(--hover-overlay)')};
  }

  &:focus {
    outline: none;
  }
`;

export const TabContent = styled.div`
  display: ${(props) => (props.active ? 'flex' : 'none')};
  flex-direction: column;
  flex: 1;
  overflow: auto;
`;

export const CSVBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.csvId === 'A'
      ? 'var(--badge-a)'
      : props.csvId === 'B'
      ? 'var(--badge-b)'
      : 'var(--badge-joined)'};
  color: white;
  font-size: ${(props) => (props.csvId === 'Joined' ? '9px' : '11px')};
  font-weight: 600;
  margin-right: 4px;
  flex-shrink: 0;
`;

/* ── Join Section ── */

export const JoinSection = styled.div`
  margin-bottom: 12px;
`;

export const JoinButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 12px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Geist', sans-serif;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: var(--primary-hover);
  }

  svg {
    stroke: white;
    flex-shrink: 0;
  }
`;

export const JoinAppliedBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  background: var(--primary-10);
  border: 1px solid var(--primary-20);
  border-radius: 8px;
`;

export const JoinAppliedInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--join-info-text);
  min-width: 0;
  flex: 1;

  svg {
    stroke: var(--success);
    flex-shrink: 0;
  }

  > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    font-weight: 700;
    color: var(--join-info-strong);
  }
`;

export const JoinAppliedActions = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
`;

export const JoinSmallButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 6px;
  background: ${(props) =>
    props.variant === 'danger'
      ? 'var(--danger-12)'
      : 'var(--primary-15)'};
  color: ${(props) => (props.variant === 'danger' ? 'var(--danger)' : 'var(--primary)')};
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${(props) =>
      props.variant === 'danger'
        ? 'var(--danger-22)'
        : 'var(--primary-20)'};
  }

  svg {
    stroke: currentColor;
  }
`;

export const JoinConfigPanel = styled.div`
  background: var(--surface-alt);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
  box-sizing: border-box;
`;

export const JoinConfigTitle = styled.h4`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    stroke: var(--primary);
    flex-shrink: 0;
  }
`;

export const JoinConfigRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const JoinConfigGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const JoinLabel = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const JoinSelect = styled.select`
  width: 100%;
  padding: 7px 8px;
  border: 1px solid var(--input-border);
  border-radius: 6px;
  font-size: 12px;
  font-family: 'Geist', sans-serif;
  color: var(--text);
  background: var(--input-bg);
  transition: border-color 0.15s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-20);
  }

  option {
    background: var(--surface-alt);
    color: var(--text);
  }
`;

export const JoinHelpText = styled.p`
  font-size: 10px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.3;
`;

/* ── Multi-Key Pairs ── */

export const JoinKeyPairsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const JoinKeyPairRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

export const JoinKeyPairSelects = styled.div`
  flex: 1;
  display: flex;
  gap: 6px;
  align-items: center;
  min-width: 0;
`;

export const JoinKeyPairSelectWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

export const JoinKeyEqualsInline = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--primary);
  flex-shrink: 0;
`;

export const JoinKeyPairRemoveBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 4px;
  background: var(--danger-12);
  color: var(--danger);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
  padding: 0;

  &:hover {
    background: var(--danger-22);
  }

  svg {
    stroke: currentColor;
  }
`;

export const JoinAddKeyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: 1px dashed var(--border-light);
  border-radius: 6px;
  background: transparent;
  color: var(--primary);
  font-size: 11px;
  font-weight: 600;
  font-family: 'Geist', sans-serif;
  cursor: pointer;
  transition: all 0.15s;
  align-self: flex-start;

  &:hover {
    background: var(--primary-08);
    border-color: var(--primary);
  }

  svg {
    stroke: currentColor;
    flex-shrink: 0;
  }
`;

export const JoinConfigActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export const JoinApplyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Geist', sans-serif;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: var(--primary-hover);
  }

  svg {
    stroke: white;
  }
`;

export const JoinCancelButton = styled.button`
  padding: 7px 14px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Geist', sans-serif;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: var(--hover-overlay);
    color: var(--text);
  }
`;

/* ── Dropzone ── */

export const DropzoneContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed ${(props) => (props.isDragActive ? 'var(--primary)' : 'var(--border-light)')};
  border-radius: 12px;
  background-color: ${(props) =>
    props.isDragActive ? 'var(--primary-08)' : 'var(--surface-alt)'};
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
  min-height: 180px;

  &:hover {
    border-color: var(--primary);
    background-color: var(--primary-06);
  }
`;

export const UploadIcon = styled.div`
  margin-bottom: 12px;
  color: ${(props) => (props.isDragActive ? 'var(--primary)' : 'var(--text-muted)')};
  transition: color 0.15s ease;
`;

export const UploadText = styled.p`
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--text-secondary);
`;

export const UploadButton = styled.button`
  margin-top: 8px;
  padding: 8px 18px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Geist', sans-serif;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background-color: var(--primary-hover);
  }
`;

export const FileTypeInfo = styled.p`
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--text-muted);
`;

/* ── CSV Preview ── */

export const CSVPreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: var(--success-10);
  border: 1px solid var(--success-20);
  border-radius: 8px;
`;

export const FileName = styled.span`
  font-size: 13px;
  color: var(--text);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const FileStats = styled.span`
  font-size: 12px;
  color: var(--text-secondary);
`;

export const ClearButton = styled.button`
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.15s ease;

  &:hover {
    color: var(--danger);
  }
`;

/* ── Search ── */

export const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 9px 12px 9px 38px;
  border: 1px solid var(--input-border);
  border-radius: 8px;
  font-size: 13px;
  font-family: 'Geist', sans-serif;
  background: var(--input-bg);
  color: var(--text);
  transition: border-color 0.15s ease;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-20);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

/* ── Columns List ── */

export const ColumnsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ColumnsCount = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
`;

export const ColumnsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;
`;

export const ColumnChip = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background-color: var(--surface-alt);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: grab;
  transition: all 0.15s ease;

  &:hover {
    border-color: var(--primary);
    background-color: var(--primary-06);
  }

  &:active {
    cursor: grabbing;
  }
`;

export const ColumnInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

export const DragHandle = styled.div`
  color: var(--text-muted);
  display: flex;
  align-items: center;
`;

export const ColumnName = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TypeBadge = styled.span`
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;

  background-color: ${(props) => {
    switch (props.type) {
      case 'number':
        return 'var(--type-number-bg)';
      case 'string':
        return 'var(--type-string-bg)';
      case 'boolean':
        return 'var(--type-boolean-bg)';
      case 'date':
        return 'var(--type-date-bg)';
      default:
        return 'var(--type-default-bg)';
    }
  }};

  color: ${(props) => {
    switch (props.type) {
      case 'number':
        return 'var(--type-number)';
      case 'string':
        return 'var(--type-string)';
      case 'boolean':
        return 'var(--type-boolean)';
      case 'date':
        return 'var(--type-date)';
      default:
        return 'var(--type-default)';
    }
  }};
`;

/* ── Sample Data Table ── */

export const SampleDataContainer = styled.div`
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
`;

export const SampleDataTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 8px;
`;

export const SampleDataTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 180px;
  overflow: auto;
  background-color: var(--surface-alt);
  border-radius: 8px;
  padding: 6px;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    `repeat(${props.columnCount}, minmax(90px, 1fr))`};
  gap: 8px;
  padding: 5px 6px;
  background-color: ${(props) => (props.isHeader ? 'var(--surface)' : 'transparent')};
  border-radius: 4px;
  font-weight: ${(props) => (props.isHeader ? '600' : '400')};
  font-size: 12px;
  color: ${(props) => (props.isHeader ? 'var(--text)' : 'var(--text-secondary)')};
`;

export const TableCell = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 3px 0;
`;

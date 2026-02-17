import styled from 'styled-components';

/* ── Layout ── */

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Title = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--text);
`;

export const MappingCount = styled.span`
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 400;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const Button = styled.button`
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Geist', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.15s ease;
  border: 1px solid ${(props) =>
    props.variant === 'primary' ? 'var(--primary)' : 'var(--border-light)'};
  background-color: ${(props) =>
    props.variant === 'primary' ? 'var(--primary)' : 'transparent'};
  color: ${(props) => (props.variant === 'primary' ? '#fff' : 'var(--text-secondary)')};

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.variant === 'primary' ? 'var(--primary-hover)' : 'var(--hover-overlay)'};
    color: ${(props) => (props.variant === 'primary' ? '#fff' : 'var(--text)')};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

/* ── Mappings Container ── */

export const MappingsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
`;

/* ── Empty State ── */

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: var(--text-muted);
  gap: 10px;
`;

export const EmptyStateIcon = styled.div`
  color: var(--border-light);
  svg {
    width: 56px;
    height: 56px;
  }
`;

export const EmptyStateText = styled.p`
  font-size: 14px;
  margin: 0;
  color: var(--text-secondary);
`;

export const EmptyStateTip = styled.p`
  font-size: 12px;
  margin: 0;
  color: var(--text-muted);
  max-width: 380px;
  line-height: 1.5;
`;

/* ── Field Mapping Card ── */

export const FieldMappingCard = styled.div`
  background-color: ${(props) =>
    props.isDragOver ? 'var(--primary-08)' : 'var(--surface-alt)'};
  border: 1px solid ${(props) =>
    props.isDragOver ? 'var(--primary)' : 'var(--border)'};
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 10px;
  transition: all 0.15s ease;

  &:hover {
    border-color: var(--border-light);
  }
`;

export const FieldHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const FieldLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
`;

export const FieldName = styled.span`
  font-weight: 600;
  color: var(--text);
`;

export const FieldContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FieldValue = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EmptyValue = styled.span`
  font-style: italic;
  color: var(--text-muted);
`;

export const DeleteButton = styled.button`
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

  svg {
    width: 15px;
    height: 15px;
  }
`;

/* ── Drop Zone ── */

export const DropZone = styled.div`
  border: 2px dashed ${(props) =>
    props.isDragOver ? 'var(--primary)' : 'var(--border-light)'};
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  background-color: ${(props) =>
    props.isDragOver ? 'var(--primary-08)' : 'var(--surface)'};
  color: var(--text-muted);
  font-size: 12px;
  transition: all 0.15s ease;
  margin-bottom: 8px;
`;

/* ── Form Controls ── */

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Label = styled.label`
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

export const Input = styled.input`
  padding: 8px 10px;
  border: 1px solid var(--input-border);
  border-radius: 6px;
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

  &:disabled {
    background-color: var(--surface);
    color: var(--text-muted);
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  padding: 8px 10px;
  border: 1px solid var(--input-border);
  border-radius: 6px;
  font-size: 13px;
  font-family: 'Geist', sans-serif;
  background-color: var(--input-bg);
  color: var(--text);
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-20);
  }

  &:disabled {
    background-color: var(--surface);
    color: var(--text-muted);
    cursor: not-allowed;
  }

  option {
    background: var(--surface-alt);
    color: var(--text);
  }
`;

/* ── Transformations & Actions ── */

export const TransformationsRow = styled.div`
  display: flex;
  gap: 16px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  user-select: none;

  input[type='checkbox'] {
    cursor: pointer;
    accent-color: var(--primary);
  }
`;

export const ErrorMessage = styled.div`
  font-size: 12px;
  color: var(--danger);
  margin-top: 4px;
`;

export const SaveCancelButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

export const SaveButton = styled.button`
  padding: 6px 14px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Geist', sans-serif;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background-color: var(--primary-hover);
  }
`;

export const CancelButton = styled.button`
  padding: 6px 14px;
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Geist', sans-serif;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: var(--hover-overlay);
    color: var(--text);
  }
`;

/* ── CSV Badge (used in FieldMapping) ── */

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
      : props.csvId === 'joined'
      ? 'var(--badge-joined)'
      : 'var(--text-muted)'};
  color: white;
  font-size: ${(props) => (props.csvId === 'joined' ? '10px' : '11px')};
  font-weight: 600;
  margin-right: 4px;
`;

/* ═══════════════════════════════════════════════════════════════════ */
/* NEW FILTER SECTION STYLES */
/* ═══════════════════════════════════════════════════════════════════ */

export const FilterSection = styled.div`
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface-alt);
  overflow: hidden;
  transition: all 0.15s ease;
`;

export const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s ease;
  
  &:hover {
    background: var(--hover-overlay);
  }
`;

export const FilterTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);

  svg {
    stroke: var(--primary);
  }
`;

export const FilterBadge = styled.span`
  padding: 3px 8px;
  border-radius: 12px;
  background: var(--primary);
  color: white;
  font-size: 11px;
  font-weight: 600;
`;

export const FilterBody = styled.div`
  display: ${props => props.expanded ? 'flex' : 'none'};
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border-top: 1px solid var(--border);
  background: var(--surface);
`;

export const FiltersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FilterRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 140px 1fr 32px;
  gap: 10px;
  align-items: end;
  padding: 12px;
  background: var(--surface-alt);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: var(--border-light);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

export const FilterFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
`;

export const FilterLabel = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

export const LogicOperatorBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  padding: 6px 12px;
  background: var(--primary-15);
  color: var(--primary);
  border: 1px solid var(--primary-20);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
  letter-spacing: 0.5px;
  
  &:hover {
    background: var(--primary-20);
    border-color: var(--primary);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const AddFilterButton = styled.button`
  padding: 8px 12px;
  background: transparent;
  border: 1px dashed var(--border-light);
  border-radius: 6px;
  color: var(--primary);
  font-size: 12px;
  font-weight: 500;
  font-family: 'Geist', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s ease;
  
  &:hover {
    background: var(--primary-08);
    border-color: var(--primary);
  }

  svg {
    flex-shrink: 0;
  }
`;

export const RemoveFilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
  flex-shrink: 0;
  
  &:hover {
    background: var(--danger-12);
    color: var(--danger);
  }

  svg {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 36px;
  }
`;
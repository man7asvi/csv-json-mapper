import styled from 'styled-components';

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  background-color: var(--bg);
  color: var(--text);
  font-family: 'Geist', sans-serif;
  transition: background-color 0.2s ease, color 0.2s ease;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  gap: 16px;
  margin-top: 20px;
  margin-bottom: 60px;
  height: calc(100vh - 140px);
  overflow-x: auto;
  width: 100%;
  padding: 0 16px;

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
    overflow-x: visible;
    overflow-y: auto;
  }
`;

export const Panel = styled.div`
  background-color: var(--surface);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;

export const LeftPanel = styled(Panel)`
  flex: 0 0 360px;
  overflow-y: auto;

  @media (max-width: 1024px) {
    flex: none;
    max-height: 500px;
  }
`;

export const MiddlePanel = styled(Panel)`
  flex: 2;
  min-width: 0;

  @media (max-width: 1024px) {
    flex: none;
    min-width: unset;
    max-height: 600px;
  }
`;

export const RightPanel = styled(Panel)`
  flex: 1;
  min-width: 0;

  @media (max-width: 1024px) {
    flex: none;
    min-width: unset;
    max-height: 600px;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-top: 1px solid var(--border);
  background-color: var(--surface);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;

export const StatusText = styled.div`
  color: var(--text-secondary);
  font-size: 13px;
`;

export const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const ActionButton = styled.button`
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Geist', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
  border: 1px solid ${(props) =>
    props.variant === 'primary' ? 'var(--primary)' : 'var(--border-light)'};
  background-color: ${(props) =>
    props.variant === 'primary' ? 'var(--primary)' : 'var(--surface-alt)'};
  color: ${(props) => (props.variant === 'primary' ? '#fff' : 'var(--text)')};

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.variant === 'primary' ? 'var(--primary-hover)' : 'var(--border-light)'};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

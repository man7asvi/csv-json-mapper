import styled from 'styled-components';

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  background-color: var(--surface);
  height: 64px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;

export const Spacer = styled.div`
  height: 64px;
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MainTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--text);
  font-family: 'Geist', sans-serif;
`;

export const SubTitle = styled.p`
  font-size: 12px;
  color: var(--text-secondary);
  margin: 2px 0 0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HeaderButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Geist', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
  border: 1px solid ${(props) => (props.primary ? 'var(--primary)' : 'var(--border)')};
  background-color: ${(props) => (props.primary ? 'var(--primary)' : 'transparent')};
  color: ${(props) => (props.primary ? '#fff' : 'var(--text)')};

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.primary ? 'var(--primary-hover)' : 'var(--hover-overlay)'};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* ── Theme Toggle ── */

export const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: var(--hover-overlay);
    color: var(--text);
    border-color: var(--border-light);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

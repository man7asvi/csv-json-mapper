import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(4px);
`;

export const Modal = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    stroke: var(--primary);
  }
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background: var(--hover-overlay);
    color: var(--text);
  }
`;

export const Description = styled.p`
  padding: 16px 24px;
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
`;

export const QueryContainer = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
`;

export const QueryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const QueryLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Geist', sans-serif;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: var(--primary-hover);
  }

  svg {
    flex-shrink: 0;
  }
`;

export const QueryCode = styled.pre`
  flex: 1;
  margin: 0;
  padding: 16px;
  background: var(--surface-alt);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-family: 'Geist Mono', 'SF Mono', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: var(--code-text);
  overflow: auto;
  white-space: pre;
`;

export const Footer = styled.div`
  padding: 16px 24px;
  border-top: 1px solid var(--border);
`;

export const InfoText = styled.p`
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
`;

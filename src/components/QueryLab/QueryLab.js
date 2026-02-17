/**
 * Query Lab Modal Component
 * 
 * Displays a modal with the generated SQL query that replicates
 * the CSV-to-JSON transformation. Includes copy-to-clipboard functionality.
 * 
 * @component
 * @param {Object} props
 * @param {string} props.sqlQuery - The generated SQL query string
 * @param {Function} props.onClose - Callback to close the modal
 */

import React, { useState } from 'react';
import * as S from './QueryLab.styles';

const QueryLab = ({ sqlQuery, onClose }) => {
  // Track copy button state for visual feedback
  const [copied, setCopied] = useState(false);

  /**
   * Copy SQL query to clipboard and show temporary success feedback
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(sqlQuery).then(() => {
      setCopied(true);
      // Reset after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <S.Overlay onClick={onClose}>
      {/* Modal content - stop propagation to prevent closing when clicking inside */}
      <S.Modal onClick={(e) => e.stopPropagation()}>
        
        {/* Header with title and close button */}
        <S.Header>
          <S.Title>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Query Lab
          </S.Title>
          <S.CloseButton onClick={onClose} title="Close Query Lab">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </S.CloseButton>
        </S.Header>

        {/* Description text */}
        <S.Description>
          SQL query generated from your CSV mappings and joins. This query produces the same JSON output.
        </S.Description>

        {/* Query display area */}
        <S.QueryContainer>
          <S.QueryHeader>
            <S.QueryLabel>Generated SQL</S.QueryLabel>
            
            {/* Copy button with state-based icon */}
            <S.CopyButton onClick={handleCopy}>
              {copied ? (
                // Checkmark icon when copied
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Copied!
                </>
              ) : (
                // Copy icon by default
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 4V16C8 16.5304 8.21071 17.0391 8.58579 17.4142C8.96086 17.7893 9.46957 18 10 18H18C18.5304 18 19.0391 17.7893 19.4142 17.4142C19.7893 17.0391 20 16.5304 20 16V7.242C20 6.97556 19.9467 6.71181 19.8433 6.46624C19.7399 6.22068 19.5885 5.99824 19.398 5.812L16.083 2.57C15.7094 2.20466 15.2076 2.00007 14.685 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 18V20C16 20.5304 15.7893 21.0391 15.4142 21.4142C15.0391 21.7893 14.5304 22 14 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V9C4 8.46957 4.21071 7.96086 4.58579 7.58579C4.96086 7.21071 5.46957 7 6 7H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Copy
                </>
              )}
            </S.CopyButton>
          </S.QueryHeader>

          {/* SQL query code block with monospace font */}
          <S.QueryCode>{sqlQuery}</S.QueryCode>
        </S.QueryContainer>

        {/* Footer with informational text */}
        <S.Footer>
          <S.InfoText>
            💡 This query is a representation. Adjust table/column names to match your actual database schema.
          </S.InfoText>
        </S.Footer>
      </S.Modal>
    </S.Overlay>
  );
};

export default QueryLab;

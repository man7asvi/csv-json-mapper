import React from 'react';
import { useDropzone } from 'react-dropzone';
import * as S from './CSVInspector.styles';

/**
 * Reusable panel for a single CSV upload tab.
 * Handles upload dropzone, column list with drag support, and sample data preview.
 */
const CSVTabPanel = ({
  csvId,
  csvData,
  searchTerm,
  onSearchChange,
  onDrop,
  onClear,
  isReadOnly = false,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'], 'text/plain': ['.txt'] },
    maxFiles: 1,
    multiple: false,
  });

  const filteredColumns =
    csvData?.columns.filter((col) =>
      col.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleDragStart = (e, column) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        csvId,
        columnName: column.name,
        columnType: column.type,
      })
    );
  };

  if (!csvData) {
    return (
      <S.DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} />
        <S.UploadIcon isDragActive={isDragActive}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 16L12 12L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.39 18.39C21.3654 17.8583 22.1359 17.0169 22.5799 15.9986C23.024 14.9804 23.1162 13.8432 22.8422 12.7667C22.5682 11.6901 21.9435 10.7355 21.0667 10.0534C20.1898 9.37137 19.1109 9.00072 18 9.00001H16.74C16.4373 7.82926 15.8732 6.74235 15.09 5.82101C14.3067 4.89967 13.3249 4.16785 12.2181 3.68061C11.1114 3.19336 9.90856 2.96336 8.70012 3.00787C7.49169 3.05237 6.31036 3.36987 5.24151 3.93765C4.17267 4.50543 3.24558 5.30968 2.53213 6.28577C1.81868 7.26186 1.33495 8.38841 1.11923 9.57764C0.903509 10.7669 0.960139 11.9911 1.28497 13.1534C1.6098 14.3158 2.19521 15.3854 2.99999 16.27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </S.UploadIcon>
        <S.UploadText>
          {isDragActive
            ? 'Drop your CSV file here...'
            : `Drag and drop CSV ${csvId} or`}
        </S.UploadText>
        <S.UploadButton>Upload CSV {csvId}</S.UploadButton>
        <S.FileTypeInfo>Accepts .csv files</S.FileTypeInfo>
      </S.DropzoneContainer>
    );
  }

  return (
    <S.CSVPreviewContainer>
      {/* File Info */}
      <S.FileInfo>
        <S.FileName>
          <S.CSVBadge csvId={csvId}>{csvId}</S.CSVBadge>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 2V9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {csvData.fileName}
        </S.FileName>
        <S.FileStats>
          {csvData.rowCount} rows x {csvData.columnCount} columns
        </S.FileStats>
        <S.ClearButton onClick={onClear} title={`Clear CSV ${csvId}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </S.ClearButton>
      </S.FileInfo>

      {/* Search */}
      <S.SearchContainer>
        <S.SearchIcon>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </S.SearchIcon>
        <S.SearchInput
          type="text"
          placeholder="Search columns..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </S.SearchContainer>

      {/* Columns */}
      <S.ColumnsHeader>
        <S.ColumnsCount>{filteredColumns.length} columns</S.ColumnsCount>
      </S.ColumnsHeader>

      <S.ColumnsList>
        {filteredColumns.map((column, index) => (
          <S.ColumnChip
            key={column.name}
            draggable
            onDragStart={(e) => handleDragStart(e, column)}
          >
            <S.ColumnInfo>
              <S.DragHandle>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H9.01M9 12H9.01M9 19H9.01M15 5H15.01M15 12H15.01M15 19H15.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </S.DragHandle>
              <S.ColumnName>
                {csvId}.{column.name}
              </S.ColumnName>
            </S.ColumnInfo>
            <S.TypeBadge type={column.type}>{column.type}</S.TypeBadge>
          </S.ColumnChip>
        ))}
      </S.ColumnsList>

      {/* Sample Data */}
      <S.SampleDataContainer>
        <S.SampleDataTitle>Sample Data (CSV {csvId})</S.SampleDataTitle>
        <S.SampleDataTable>
          <S.TableRow isHeader columnCount={csvData.columnCount}>
            {csvData.headers.map((header) => (
              <S.TableCell key={header} title={header}>
                {csvId}.{header}
              </S.TableCell>
            ))}
          </S.TableRow>

          {csvData.rows.slice(0, 10).map((row, rowIndex) => (
            <S.TableRow key={rowIndex} columnCount={csvData.columnCount}>
              {csvData.headers.map((header) => (
                <S.TableCell key={header} title={row[header]}>
                  {row[header]}
                </S.TableCell>
              ))}
            </S.TableRow>
          ))}

          {csvData.rows.length > 10 && (
            <S.TableRow columnCount={csvData.columnCount}>
              <S.TableCell style={{ color: '#999', fontStyle: 'italic' }}>
                ... and {csvData.rows.length - 10} more rows
              </S.TableCell>
            </S.TableRow>
          )}
        </S.SampleDataTable>
      </S.SampleDataContainer>
    </S.CSVPreviewContainer>
  );
};

export default CSVTabPanel;

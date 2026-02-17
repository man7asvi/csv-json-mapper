/**
 * CSV Parser Utility
 * Parses CSV files and detects column data types
 */

/**
 * Detect the data type of a column based on its values
 */
const detectDataType = (values) => {
  const nonEmptyValues = values.filter(
    (val) => val !== null && val !== undefined && val !== ''
  );

  if (nonEmptyValues.length === 0) return 'string';

  const allNumbers = nonEmptyValues.every((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && isFinite(num);
  });
  if (allNumbers) return 'number';

  const allBooleans = nonEmptyValues.every((val) => {
    const lower = String(val).toLowerCase();
    return ['true', 'false', '1', '0'].includes(lower);
  });
  if (allBooleans) return 'boolean';

  const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
  const allDates = nonEmptyValues.every(
    (val) => !isNaN(new Date(val).getTime()) && dateRegex.test(String(val))
  );
  if (allDates) return 'date';

  return 'string';
};

/**
 * Detect delimiter in CSV content by sampling multiple lines
 */
const detectDelimiter = (csvString) => {
  const lines = csvString.split('\n').slice(0, 5);
  const delimiters = [',', ';', '\t', '|'];

  let maxCount = 0;
  let detectedDelimiter = ',';

  delimiters.forEach((delimiter) => {
    const escapedDelimiter = delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const totalCount = lines.reduce((sum, line) => {
      return sum + (line.match(new RegExp(escapedDelimiter, 'g')) || []).length;
    }, 0);

    if (totalCount > maxCount) {
      maxCount = totalCount;
      detectedDelimiter = delimiter;
    }
  });

  return detectedDelimiter;
};

/**
 * Parse a single CSV line handling quoted values
 */
const parseCSVLine = (line, delimiter) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

/**
 * Main CSV parser function
 * @param {string} csvString - Raw CSV content
 * @returns {Object} Parsed CSV data with headers, rows, columns, delimiter, counts
 */
export const parseCSV = (csvString) => {
  try {
    if (!csvString || typeof csvString !== 'string') {
      return { error: 'Invalid CSV content' };
    }

    const delimiter = detectDelimiter(csvString);
    const lines = csvString.split('\n').filter((line) => line.trim() !== '');

    if (lines.length === 0) {
      return { error: 'Empty CSV file' };
    }

    const headers = parseCSVLine(lines[0], delimiter);

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i], delimiter);
      if (values.length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        rows.push(row);
      }
    }

    const columns = headers.map((header) => {
      const columnValues = rows.map((row) => row[header]);
      return {
        name: header,
        type: detectDataType(columnValues),
        sampleValues: columnValues.slice(0, 5),
      };
    });

    return {
      headers,
      rows,
      columns,
      delimiter,
      rowCount: rows.length,
      columnCount: headers.length,
    };
  } catch (error) {
    return { error: error.message };
  }
};

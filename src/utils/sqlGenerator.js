/**
 * SQL Query Generator
 * 
 * Generates SQL queries that replicate the CSV-to-JSON transformation logic.
 * Supports:
 * - Simple SELECT queries from single CSV
 * - JOIN queries (INNER, LEFT, RIGHT, FULL OUTER) from multiple CSVs
 * - Multi-key (composite) join conditions
 * - Column transformations (TRIM, CAST to NUMERIC)
 * - Column aliasing for renamed fields
 * - WHERE clause filtering with AND/OR logic
 * 
 * @module sqlGenerator
 */

/**
 * Generate WHERE clause from filters
 * @param {Array} filters - Filter configuration array
 * @returns {string} - SQL WHERE clause (empty string if no filters)
 */
const generateWhereClause = (filters) => {
  if (!filters || filters.length === 0) return '';

  const conditions = [];
  
  filters.forEach((filter, index) => {
    // Skip incomplete filters
    if (!filter.field || filter.value === null || filter.value === undefined || filter.value === '') {
      return;
    }

    let condition = '';
    const field = `"${filter.field}"`;
    const value = filter.value;

    switch (filter.operator) {
      case '=':
      case '!=':
      case '>':
      case '<':
      case '>=':
      case '<=':
        // Try to detect if value is numeric
        const isNumeric = !isNaN(parseFloat(value)) && isFinite(value);
        condition = `${field} ${filter.operator} ${isNumeric ? value : `'${value}'`}`;
        break;
      
      case 'LIKE':
        // SQL LIKE pattern with wildcards
        condition = `${field} LIKE '%${value}%'`;
        break;
      
      case 'IN':
        // Split comma-separated values and quote each one
        const inValues = value.split(',').map(v => {
          const trimmed = v.trim();
          const isNum = !isNaN(parseFloat(trimmed)) && isFinite(trimmed);
          return isNum ? trimmed : `'${trimmed}'`;
        }).join(', ');
        condition = `${field} IN (${inValues})`;
        break;
      
      case 'NOT IN':
        // Split comma-separated values and quote each one
        const notInValues = value.split(',').map(v => {
          const trimmed = v.trim();
          const isNum = !isNaN(parseFloat(trimmed)) && isFinite(trimmed);
          return isNum ? trimmed : `'${trimmed}'`;
        }).join(', ');
        condition = `${field} NOT IN (${notInValues})`;
        break;
      
      default:
        // Fallback to equality
        const isFallbackNumeric = !isNaN(parseFloat(value)) && isFinite(value);
        condition = `${field} = ${isFallbackNumeric ? value : `'${value}'`}`;
    }

    // Add logic operator (AND/OR) between conditions
    if (index > 0) {
      const logic = filter.logicOperator || 'AND';
      conditions.push(`  ${logic} ${condition}`);
    } else {
      conditions.push(`  ${condition}`);
    }
  });

  if (conditions.length === 0) return '';

  return `\nWHERE\n${conditions.join('\n')}`;
};

/**
 * Main entry point: Generate SQL query from CSV data, mappings, join config, and filters
 * 
 * @param {Object} csvData - CSV data object containing csvA, csvB, csvJoined
 * @param {Array<Object>} mappedFields - Array of field mapping objects
 * @param {Object|null} joinConfig - Join configuration (type, keys array) or null
 * @param {Array} filters - Filter configuration array (optional)
 * @returns {string} Generated SQL query
 * 
 * @example
 * // Simple query with filter
 * generateSQLQuery(
 *   { csvA: {...}, csvB: null, csvJoined: null },
 *   [{ source: {column: 'name'}, targetField: 'user_name', transformations: {trim: true} }],
 *   null,
 *   [{ field: 'store_id', operator: '=', value: '1234', logicOperator: 'AND' }]
 * )
 * // Returns: SELECT TRIM("name") AS "user_name" FROM csv_table_a WHERE "store_id" = '1234';
 * 
 * @example
 * // JOIN query with multiple filters
 * generateSQLQuery(
 *   { csvA: {...}, csvB: {...}, csvJoined: {...} },
 *   [{ source: {column: 'A_id'}, targetField: 'id', ... }],
 *   { type: 'inner', keys: [{keyA: 'id', keyB: 'store_id'}] },
 *   [
 *     { field: 'revenue', operator: '>', value: '5000', logicOperator: 'AND' },
 *     { field: 'status', operator: '=', value: 'active', logicOperator: 'AND' }
 *   ]
 * )
 * // Returns: SELECT a."id" AS "id" FROM csv_table_a AS a 
 * //          INNER JOIN csv_table_b AS b ON a."id" = b."store_id"
 * //          WHERE "revenue" > 5000 AND "status" = 'active';
 */
export function generateSQLQuery(csvData, mappedFields, joinConfig, filters = []) {
  // Validate inputs
  if (!csvData || mappedFields.length === 0) {
    return '-- No data or mappings available';
  }

  const { csvA, csvB, csvJoined } = csvData;
  
  // If joined data exists, generate JOIN query
  if (csvJoined && joinConfig) {
    return generateJoinQuery(csvA, csvB, mappedFields, joinConfig, filters);
  }
  
  // Otherwise, generate simple SELECT query from first available CSV
  if (csvA) {
    return generateSimpleQuery(csvA, mappedFields, 'csv_table_a', filters);
  }
  
  return '-- No valid data source';
}

/**
 * Generate a simple SELECT query from a single CSV table
 * 
 * @param {Object} csv - CSV data object
 * @param {Array<Object>} mappedFields - Field mappings
 * @param {string} tableName - SQL table name
 * @param {Array} filters - Filter configuration array
 * @returns {string} SQL SELECT query
 * 
 * @private
 */
function generateSimpleQuery(csv, mappedFields, tableName, filters = []) {
  // Build SELECT column expressions
  const selectColumns = mappedFields.map(field => {
    const sourceColumn = field.source.column;
    const targetField = field.targetField;
    const transforms = field.transformations;
    
    let columnExpr = `"${sourceColumn}"`;
    
    // Apply transformations in sequence
    if (transforms.trim) {
      columnExpr = `TRIM(${columnExpr})`;
    }
    if (transforms.toNumber) {
      columnExpr = `CAST(${columnExpr} AS NUMERIC)`;
    }
    
    // Add alias if target field name differs from source
    if (sourceColumn !== targetField) {
      columnExpr += ` AS "${targetField}"`;
    }
    
    return columnExpr;
  });

  // Generate WHERE clause
  const whereClause = generateWhereClause(filters);

  // Format final query
  const query = `SELECT\n  ${selectColumns.join(',\n  ')}\nFROM ${tableName}${whereClause};`;
  
  return query;
}

/**
 * Generate a JOIN query from two CSV tables
 * 
 * Handles:
 * - Multiple join types (INNER, LEFT, RIGHT, FULL OUTER)
 * - Multi-key (composite) joins
 * - Column prefix detection (A_ / B_) for table disambiguation
 * - Transformations and aliasing
 * - WHERE clause filtering
 * 
 * @param {Object} csvA - First CSV data
 * @param {Object} csvB - Second CSV data  
 * @param {Array<Object>} mappedFields - Field mappings
 * @param {Object} joinConfig - Join configuration { type, keys }
 * @param {Array} filters - Filter configuration array
 * @returns {string} SQL JOIN query
 * 
 * @private
 */
function generateJoinQuery(csvA, csvB, mappedFields, joinConfig, filters = []) {
  const { type, keys } = joinConfig;
  
  // Determine SQL JOIN type from config
  let joinType = 'INNER JOIN';
  switch (type) {
    case 'left':
      joinType = 'LEFT JOIN';
      break;
    case 'right':
      joinType = 'RIGHT JOIN';
      break;
    case 'full':
      joinType = 'FULL OUTER JOIN';
      break;
    default:
      joinType = 'INNER JOIN';
  }

  // Build SELECT columns with table qualifiers
  const selectColumns = mappedFields.map(field => {
    const sourceColumn = field.source.column;
    const targetField = field.targetField;
    const transforms = field.transformations;
    
    // Determine which table the column comes from based on A_ or B_ prefix
    let tableAlias = 'a';
    let actualColumn = sourceColumn;
    
    if (sourceColumn.startsWith('A_')) {
      tableAlias = 'a';
      actualColumn = sourceColumn.substring(2); // Remove 'A_' prefix
    } else if (sourceColumn.startsWith('B_')) {
      tableAlias = 'b';
      actualColumn = sourceColumn.substring(2); // Remove 'B_' prefix
    }
    
    // Build column expression with table qualifier
    let columnExpr = `${tableAlias}."${actualColumn}"`;
    
    // Apply transformations
    if (transforms.trim) {
      columnExpr = `TRIM(${columnExpr})`;
    }
    if (transforms.toNumber) {
      columnExpr = `CAST(${columnExpr} AS NUMERIC)`;
    }
    
    // Add alias for target field name
    columnExpr += ` AS "${targetField}"`;
    
    return columnExpr;
  });

  // Build JOIN ON conditions from key pairs
  // Supports multi-key (composite) joins: ON a.key1 = b.key1 AND a.key2 = b.key2
  const joinConditions = keys.map(keyPair => {
    return `a."${keyPair.keyA}" = b."${keyPair.keyB}"`;
  }).join(' AND ');

  // Generate WHERE clause
  const whereClause = generateWhereClause(filters);

  // Format final JOIN query
  const query = `SELECT
  ${selectColumns.join(',\n  ')}
FROM csv_table_a AS a
${joinType} csv_table_b AS b
  ON ${joinConditions}${whereClause};`;

  return query;
}

/**
 * Format SQL query with proper indentation (utility function)
 * 
 * @param {string} sql - Raw SQL string
 * @returns {string} Formatted SQL
 * 
 * @example
 * formatSQL('SELECT  id,name FROM table;')
 * // Returns: 'SELECT\n  id,\n  name\nFROM table;'
 */
export function formatSQL(sql) {
  return sql
    .replace(/\n\s+/g, '\n  ') // Normalize indentation to 2 spaces
    .trim();
}
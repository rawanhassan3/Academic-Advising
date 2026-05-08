const XLSX = require('xlsx');

/**
 * Parse an Excel file and return an array of row objects.
 * @param {string} filePath - Absolute path to the Excel file
 * @returns {Array<Object>} - Array of row objects keyed by column headers
 */
const parseExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Use first sheet
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  return jsonData;
};

module.exports = { parseExcel };

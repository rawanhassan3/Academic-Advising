import { useState, useMemo } from 'react';

const DataTable = ({ data, columns }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter data based on search term
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search records..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent sm:text-sm transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-200 rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => requestSort(col.key)}
                    className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] cursor-pointer hover:text-[#1e3a5f] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {sortConfig.key === col.key ? (
                          sortConfig.direction === 'asc' ? '↑' : '↓'
                        ) : '↕'}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sortedData.length > 0 ? (
                sortedData.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1e3a5f]">
                        {row[col.key] || '-'}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 font-medium">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter ml-2">
        Showing {sortedData.length} of {data.length} total records
      </div>
    </div>
  );
};

export default DataTable;

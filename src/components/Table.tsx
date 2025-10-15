
import React, { useState, useMemo } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

interface TableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  itemsPerPage?: number;
}

const Table = <T extends object>({ columns, data, itemsPerPage = 10 }: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColumn, setFilterColumn] = useState<keyof T | ''>('');
  const [filterOperator, setFilterOperator] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const operators = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
  ];

  const filteredData = useMemo(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        columns.some(column => {
          const value = typeof column.accessor === 'function' 
            ? column.accessor(item)
            : item[column.accessor];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    if (filterColumn && filterOperator && filterValue) {
      filtered = filtered.filter(item => {
        const itemValue = item[filterColumn];
        if (itemValue === null || itemValue === undefined) {
          return false;
        }
        const value = itemValue.toString().toLowerCase();
        const filter = filterValue.toLowerCase();

        switch (filterOperator) {
          case 'contains':
            return value.includes(filter);
          case 'equals':
            return value === filter;
          case 'startsWith':
            return value.startsWith(filter);
          case 'endsWith':
            return value.endsWith(filter);
          case 'greaterThan':
            return parseFloat(value) > parseFloat(filter);
          case 'lessThan':
            return parseFloat(value) < parseFloat(filter);
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [data, searchTerm, filterColumn, filterOperator, filterValue, columns]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleClearFilter = () => {
    setFilterColumn('');
    setFilterOperator('');
    setFilterValue('');
    setCurrentPage(1);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Global Search..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex w-full md:w-auto space-x-2">
          <select
            value={filterColumn as string}
            onChange={e => setFilterColumn(e.target.value as keyof T)}
            className="p-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Column</option>
            {columns.map(col => (
              <option key={String(col.accessor)} value={String(col.accessor)}>{col.header}</option>
            ))}
          </select>
          <select
            value={filterOperator}
            onChange={e => setFilterOperator(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!filterColumn}
          >
            <option value="">Select Operator</option>
            {operators.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Value"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterValue}
            onChange={e => setFilterValue(e.target.value)}
            disabled={!filterOperator}
          />
          <button
            onClick={handleClearFilter}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th key={String(col.accessor)} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-100">
                {columns.map(col => (
                  <td key={String(col.accessor)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {typeof col.accessor === 'function' ? col.accessor(row) : String(row[col.accessor])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Showing {paginatedData.length} of {filteredData.length} results
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;

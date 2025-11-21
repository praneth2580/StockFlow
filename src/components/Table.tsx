
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

function deepGet(obj: any, path: string): any {
  return path
    .split(".")
    .reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
}

function getValue<T>(
  row: T,
  accessor: string | number | symbol | ((r: T) => any)
): any {
  // Case 1: function accessor
  if (typeof accessor === "function") {
    return accessor(row);
  }

  // Convert number or symbol to string
  const key = String(accessor);

  // Case 2: deep path (ex: "product.category.name")
  if (key.includes(".")) {
    return deepGet(row, key);
  }

  // Case 3: direct accessor
  return (row as any)[key];
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
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap">
        {/* Search */}
        <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Global Search..."
            className="w-full p-3 border border-gray-300 dark:border-gray-700 
            rounded-lg bg-white dark:bg-gray-800 
            text-gray-900 dark:text-gray-200 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Filters */}
        <div
          className="
            flex items-center w-full md:w-auto
            rounded-xl border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-800
            overflow-hidden
            focus-within:ring-2 focus-within:ring-blue-500
            transition
          "
        >
          {/* Column Select */}
          <select
            value={filterColumn as string}
            onChange={(e) => setFilterColumn(e.target.value as keyof T)}
            className="
              px-4 py-2.5 min-w-[150px]
              bg-transparent
              border-none outline-none
              text-gray-900 dark:text-gray-200
            "
          >
            <option className='bg-white dark:bg-gray-800' value="">Column</option>
            {columns.map((col) => (
              <option className='bg-white dark:bg-gray-800' key={String(col.accessor)} value={String(col.accessor)}>
                {col.header}
              </option>
            ))}
          </select>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

          {/* Operator Select */}
          <select
            value={filterOperator}
            onChange={(e) => setFilterOperator(e.target.value)}
            disabled={!filterColumn}
            className="
              px-4 py-2.5 min-w-[130px]
              bg-transparent
              border-none outline-none
              text-gray-900 dark:text-gray-200
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <option className='bg-white dark:bg-gray-800' value="">Operator</option>
            {operators.map((op) => (
              <option className='bg-white dark:bg-gray-800' key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

          {/* Value Input */}
          <input
            type="text"
            placeholder="Value"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            disabled={!filterOperator}
            className="
              px-4 py-2.5 min-w-[150px]
              bg-transparent
              border-none outline-none
              text-gray-900 dark:text-gray-200
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          />

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

          {/* Clear Button */}
          <button
            onClick={handleClearFilter}
            className="
              px-4 py-2.5 font-medium
              bg-transparent
              text-red-600 dark:text-red-400
              hover:bg-red-50 dark:hover:bg-red-900/20
              transition
            "
          >
            Clear
          </button>
        </div>

      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full bg-white dark:bg-gray-900">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.accessor)}
                  className="px-6 py-3 text-left text-xs font-semibold 
                  text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {columns.map(col => (
                  <td
                    key={String(col.accessor)}
                    className="px-6 py-4 whitespace-nowrap text-sm 
                    text-gray-800 dark:text-gray-200"
                  >
                    {getValue(row, col.accessor)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Showing {paginatedData.length} of {filteredData.length} results
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium 
            text-gray-700 dark:text-gray-200 
            bg-white dark:bg-gray-800 
            border border-gray-300 dark:border-gray-700 
            rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium 
            text-gray-700 dark:text-gray-200 
            bg-white dark:bg-gray-800 
            border border-gray-300 dark:border-gray-700 
            rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;

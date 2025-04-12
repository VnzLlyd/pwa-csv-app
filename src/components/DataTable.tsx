import React, { useMemo, useState } from 'react';
import { CSVRow, db } from '../db';
import { RowDetailsModal } from './RowDetailsModal';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface DataTableProps {
  data: CSVRow[];
  searchQuery: string;
  onConfirm: () => void;
}

export function DataTable({ data, searchQuery, onConfirm }: DataTableProps) {
  const [selectedRow, setSelectedRow] = useState<CSVRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    const firstRow = data[0];
    const cols = Object.keys(firstRow).filter(key => key !== 'id');
    if (!cols.includes('Confirmed')) {
      cols.push('Confirmed');
    }
    return cols;
  }, [data]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return data.filter(row =>
      Object.entries(row).some(([key, value]) =>
        key !== 'id' && String(value).toLowerCase().includes(query)
      )
    );
  }, [data, searchQuery]);

  const handleRowClick = (row: CSVRow) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (selectedRow?.id) {
      await db.csvData.update(selectedRow.id, {
        ...selectedRow,
        Confirmed: 'YES'
      });
      setIsModalOpen(false);
      onConfirm();
    }
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        No data available. Please upload a file.
      </div>
    );
  }

  if (!searchQuery) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Enter a search term to view matching rows.
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        No matching results found.
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        onClick={() => handleRowClick(row)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        {columns.map((column) => (
                          <td
                            key={`${rowIndex}-${column}`}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {column === 'Confirmed' ? (
                              row[column] === 'YES' ? (
                                <span className="inline-flex items-center text-green-700">
                                  <CheckCircleIcon className="h-5 w-5 mr-1" />
                                  YES
                                </span>
                              ) : (
                                '-'
                              )
                            ) : (
                              String(row[column] ?? '')
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t">
          <p className="text-sm text-gray-500">
            Showing {filteredData.length} matching {filteredData.length === 1 ? 'result' : 'results'}
          </p>
        </div>
      </div>

      <RowDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        row={selectedRow}
        onConfirm={handleConfirm}
        isConfirmed={selectedRow?.Confirmed === 'YES'}
      />
    </>
  );
} 
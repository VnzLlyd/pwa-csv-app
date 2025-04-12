import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { ChartBarIcon, TableCellsIcon, TrashIcon, ArrowUpTrayIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { FileUpload } from './FileUpload';
import * as XLSX from 'xlsx';

interface DashboardProps {
  onExportComplete: () => void;
  onUploadComplete: () => void;
}

export function Dashboard({ onExportComplete, onUploadComplete }: DashboardProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const rows = useLiveQuery(() => db.csvData.toArray());
  const totalRows = rows?.length || 0;
  const columns = rows?.[0] ? Object.keys(rows[0]).filter(key => key !== 'id') : [];

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to remove the current data?')) {
      await db.csvData.clear();
    }
  };

  const handleExportData = async () => {
    if (!rows || rows.length === 0) {
      alert('No data to export');
      return;
    }

    try {
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Convert the data to worksheet format
      // Remove id field and clean up the data
      const cleanData = rows.map(row => {
        const cleanRow = { ...row };
        delete cleanRow.id;
        return cleanRow;
      });
      
      const ws = XLSX.utils.json_to_sheet(cleanData);
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      
      // Generate the file
      XLSX.writeFile(wb, 'exported_data.xlsx');

      onExportComplete();
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Stats and Actions Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TableCellsIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Rows</h3>
                <p className="text-2xl font-semibold text-blue-600">{totalRows}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            {totalRows > 0 && (
              <button
                onClick={handleClearData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                Clear Data
              </button>
            )}
            
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              Upload File
            </button>

            {totalRows > 0 && (
              <button
                onClick={handleExportData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Export Data
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Columns Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start">
          <ChartBarIcon className="h-8 w-8 text-green-500" />
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Columns</h3>
            <div className="mt-2">
              {columns.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {columns.map((column) => (
                    <span
                      key={column}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {column}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No columns available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <FileUpload
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={() => {
          setIsUploadModalOpen(false);
          onUploadComplete();
        }}
      />
    </div>
  );
} 
import React from 'react';
import { TableCellsIcon } from '@heroicons/react/24/outline';

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="bg-blue-600 p-2 rounded-lg">
        <TableCellsIcon className="h-8 w-8 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-gray-900">CSV</span>
        <span className="text-sm text-gray-500">Data Manager</span>
      </div>
    </div>
  );
} 
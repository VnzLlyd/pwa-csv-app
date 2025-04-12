import React from 'react';
import { Modal } from './Modal';
import { CSVRow } from '../db';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface RowDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  row: CSVRow | null;
  onConfirm: () => void;
  isConfirmed: boolean;
}

export function RowDetailsModal({ isOpen, onClose, row, onConfirm, isConfirmed }: RowDetailsModalProps) {
  if (!row) return null;

  const fields = Object.entries(row).filter(([key]) => key !== 'id' && key !== 'Confirmed');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Row Details"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {fields.map(([key, value]) => (
            <div key={key} className="bg-gray-50 px-4 py-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-700">
                {key}
              </label>
              <div className="mt-1 text-sm text-gray-900">
                {value?.toString() || '-'}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          {!isConfirmed && (
            <button
              onClick={onConfirm}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Confirm
            </button>
          )}
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
} 
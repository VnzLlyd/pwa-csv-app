import React, { ChangeEvent } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { db } from '../db';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { Modal } from './Modal';

interface FileUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export function FileUpload({ isOpen, onClose, onUploadComplete }: FileUploadProps) {
  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    try {
      let data: any[] = [];

      if (fileExtension === 'csv') {
        // Handle CSV files
        await new Promise<void>((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              data = results.data as any[];
              resolve();
            },
            error: reject
          });
        });
      } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
        // Handle Excel files
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Get the range of cells that contain data
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        
        // Get header row
        const headers: string[] = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell = worksheet[XLSX.utils.encode_cell({ r: range.s.r, c: C })];
          headers[C] = cell?.v || `Column${C + 1}`;
        }

        // Convert to array of objects with headers
        data = [];
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
          const row: any = {};
          let hasData = false;
          
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
            const value = cell?.v;
            if (value !== undefined && value !== null) {
              hasData = true;
              row[headers[C]] = value;
            } else {
              row[headers[C]] = '';
            }
          }
          
          if (hasData) {
            data.push(row);
          }
        }
      } else {
        throw new Error('Unsupported file format');
      }

      // Remove empty rows and clean data
      data = data.filter(row => Object.values(row).some(value => value !== null && value !== undefined && value !== ''));

      if (data.length === 0) {
        throw new Error('No valid data found in the file');
      }

      // Clear existing data and add new data
      await db.csvData.clear();
      await db.csvData.bulkAdd(data);
      onUploadComplete();
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please make sure the file contains valid data.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload CSV or Excel File"
    >
      <div className="flex flex-col items-center justify-center">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ArrowUpTrayIcon className="w-8 h-8 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">CSV, Excel files (.xlsx, .xls)</p>
          </div>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>
    </Modal>
  );
} 
import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { FileUpload } from './components/FileUpload';
import { SearchBar } from './components/SearchBar';
import { Dashboard } from './components/Dashboard';
import { DataTable } from './components/DataTable';
import { Toast, ToastType } from './components/Toast';
import { Logo } from './components/Logo';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });
  const rows = useLiveQuery(() => db.csvData.toArray(), []);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  const handleUploadComplete = () => {
    showToast('File uploaded successfully!', 'success');
  };

  const handleExportComplete = () => {
    showToast('Data exported successfully!', 'success');
  };

  const handleConfirmation = () => {
    showToast('Row confirmed successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Logo />
        </div>
        
        {/* Dashboard */}
        <div className="mb-8">
          <Dashboard 
            onExportComplete={handleExportComplete}
            onUploadComplete={handleUploadComplete}
          />
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Data Table */}
        <div className="mb-8">
          <DataTable 
            data={rows || []} 
            searchQuery={searchQuery}
            onConfirm={handleConfirmation}
          />
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}

export default App;

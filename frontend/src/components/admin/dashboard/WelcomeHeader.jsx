import React, { useState } from 'react';
import { DownloadCloud, Loader2 } from 'lucide-react';
import { dashboardApi } from '../../../api/dashboard';

const WelcomeHeader = ({ user, currentDate }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await dashboardApi.exportLeadsCSV();
      const url = window.URL.createObjectURL(new Blob([blob]));
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Leads_Export_${new Date().toISOString().split('T')[0]}.csv`);
      
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Failed to export leads:", error);
      alert("Something went wrong while exporting leads. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 transition-colors duration-300">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight transition-colors duration-300">
          Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-medium tracking-wide transition-colors duration-300">
          {currentDate}
        </p>
      </div>
      
      <button 
        onClick={handleExport}
        disabled={isExporting}
        className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin text-zinc-500 dark:text-zinc-400" />
        ) : (
          <DownloadCloud className="w-4 h-4" />
        )}
        {isExporting ? 'Exporting...' : 'Export Leads'}
      </button>
    </div>
  );
};

export default WelcomeHeader;
import React from 'react';
import { Layout } from 'lucide-react';

const GeneralCustomization = ({ generalData, onChange }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
      
      {/* Header Section */}
      <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 transition-colors duration-300">General Settings</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-300">Configure global settings for your landing page.</p>
          </div>
        </div>
      </div>
      
      {/* Body Section */}
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Active Homepage Layout</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Main Homepage Option */}
            <label className={`relative flex cursor-pointer rounded-xl border p-4 transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
              generalData.landingPage === 'default' 
                ? 'border-zinc-900 bg-zinc-50/50 shadow-sm ring-1 ring-zinc-900 dark:border-blue-500 dark:bg-blue-500/10 dark:ring-blue-500/50 dark:shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                : 'border-zinc-200 dark:border-zinc-700'
            }`}>
              <input
                type="radio"
                name="landingPage"
                value="default"
                className="sr-only"
                checked={generalData.landingPage === 'default'}
                onChange={onChange}
              />
              <span className="flex flex-col pr-8">
                <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition-colors duration-300">Main Homepage</span>
                <span className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed transition-colors duration-300">The standard layout featuring customizable sections.</span>
              </span>
              {/* Radio Circle */}
              <span className={`absolute right-4 top-4 h-5 w-5 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                generalData.landingPage === 'default' 
                  ? 'border-zinc-900 bg-zinc-900 dark:border-blue-500 dark:bg-blue-500' 
                  : 'border-zinc-300 dark:border-zinc-600'
              }`}>
                {generalData.landingPage === 'default' && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>
            </label>

            {/* Reference Homepage Option */}
            <label className={`relative flex cursor-pointer rounded-xl border p-4 transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
              generalData.landingPage === 'reference' 
                ? 'border-zinc-900 bg-zinc-50/50 shadow-sm ring-1 ring-zinc-900 dark:border-blue-500 dark:bg-blue-500/10 dark:ring-blue-500/50 dark:shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                : 'border-zinc-200 dark:border-zinc-700'
            }`}>
              <input
                type="radio"
                name="landingPage"
                value="reference"
                className="sr-only"
                checked={generalData.landingPage === 'reference'}
                onChange={onChange}
              />
              <span className="flex flex-col pr-8">
                <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition-colors duration-300">Alternative Homepage</span>
                <span className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed transition-colors duration-300">The alternative landing reference layout.</span>
              </span>
              {/* Radio Circle */}
              <span className={`absolute right-4 top-4 h-5 w-5 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                generalData.landingPage === 'reference' 
                  ? 'border-zinc-900 bg-zinc-900 dark:border-blue-500 dark:bg-blue-500' 
                  : 'border-zinc-300 dark:border-zinc-600'
              }`}>
                {generalData.landingPage === 'reference' && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>
            </label>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralCustomization;
import React from 'react';
import { List } from 'lucide-react';
import TipTapEditor from './TipTapEditor';

const ServicesCustomization = ({
  servicesData,
  onChange,
  onServiceItemChange
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
      <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors">
        <List className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">Services Section</h2>
      </div>

      <div className="p-8 space-y-8">
        {/* Header Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Badge Text
            </label>
            <input 
              type="text" 
              name="badgeText"
              value={servicesData.badgeText || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-blue-500/30 focus:bg-white dark:focus:bg-zinc-950 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Section Title (Use <code className="text-xs bg-zinc-200 dark:bg-zinc-800 dark:text-purple-300 px-1.5 py-0.5 rounded">[text]</code> to highlight in primary color)
            </label>
            <input 
              type="text" 
              name="title"
              value={servicesData.title || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-blue-500/30 focus:bg-white dark:focus:bg-zinc-950 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Description
            </label>
            <TipTapEditor 
              value={servicesData.description || ''} 
              onChange={(html) => onChange({ target: { name: 'description', value: html } })} 
              placeholder="Enter main description here..."
            />
          </div>
        </div>

        {/* Services Cards */}
        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-6">
            Service Cards (4 Items)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(servicesData.services || []).map((service, index) => (
              <div key={index} className="p-6 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl space-y-4 transition-colors">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 dark:bg-blue-600 text-white text-xs font-bold shadow-sm">
                  {index + 1}
                </span>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Service Title (use <code className="text-[10px] bg-zinc-200 dark:bg-zinc-800 dark:text-purple-300 px-1 py-0.5 rounded">\n</code> for newline)
                  </label>
                  <input 
                    type="text" 
                    value={service.title || ''}
                    onChange={(e) => onServiceItemChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-blue-500/30 text-sm transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Service Description
                  </label>
                  <TipTapEditor 
                    value={service.description || ''} 
                    onChange={(html) => onServiceItemChange(index, 'description', html)} 
                    placeholder={`Enter description for service ${index + 1}...`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesCustomization;
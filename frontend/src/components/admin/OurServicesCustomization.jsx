import React from 'react';
import { List, Plus, Trash2 } from 'lucide-react';
import TipTapEditor from './TipTapEditor';
import ImageField from './ImageField';

const OurServicesCustomization = ({
  ourServicesData,
  onChange,
  onServiceItemChange,
  onStatItemChange,
  onAddService,
  onDeleteService
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
      <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
        <List className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">Our Services Section</h2>
      </div>

      <div className="p-8 space-y-10">
        {/* Header Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Badge Text</label>
            <input 
              type="text" 
              name="badgeText"
              value={ourServicesData.badgeText || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/20 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Section Title (Use `[text]` to highlight in primary color)</label>
            <input 
              type="text" 
              name="title"
              value={ourServicesData.title || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/20 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Description</label>
            <TipTapEditor 
              value={ourServicesData.description || ''} 
              onChange={(html) => onChange({ target: { name: 'description', value: html } })} 
              placeholder="Enter section description here..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
          
          {/* Main Section Image */}
          <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl p-6 transition-colors duration-300">
            <div className="mb-4">
              <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 transition-colors">Main Section Image</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 transition-colors">Service preview backdrop image</p>
            </div>
            
            <ImageField 
              value={ourServicesData.image || ''} 
              onChange={(url) => onChange({ target: { name: 'image', value: url } })} 
            />
          </div>

          {/* Bottom Blueprint Image */}
          <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl p-6 transition-colors duration-300">
            <div className="mb-4">
              <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 transition-colors">Bottom Blueprint Image</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 transition-colors">Architectural 3D floor plan image</p>
            </div>

            <ImageField 
              value={ourServicesData.bottomImage || ''} 
              onChange={(url) => onChange({ target: { name: 'bottomImage', value: url } })} 
            />
          </div>

        </div>

        {/* Services Titles */}
        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase transition-colors">
              Service Offerings List ({(ourServicesData.services || []).length} Items)
            </h3>
            <button
              type="button"
              onClick={onAddService}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Service
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(ourServicesData.services || []).map((service, index) => (
              <div key={index} className="p-5 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl flex flex-col gap-4 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950 dark:bg-zinc-700 text-white dark:text-zinc-100 text-xs font-bold shrink-0 shadow-inner transition-colors">
                      {service.id || `0${index + 1}`}
                    </span>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 transition-colors">Service Offering {service.id || `0${index + 1}`}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteService(index)}
                    className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
                <div className="space-y-3 pl-11">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1 transition-colors">Service Title</label>
                    <input 
                      type="text" 
                      value={service.title || ''}
                      onChange={(e) => onServiceItemChange(index, 'title', e.target.value)}
                      placeholder="Service title"
                      className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/20 text-sm transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1 transition-colors">Service Link / URL path</label>
                    <input 
                      type="text" 
                      value={service.link || ''}
                      onChange={(e) => onServiceItemChange(index, 'link', e.target.value)}
                      placeholder="e.g., /services/residential-interior-design"
                      className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/20 text-sm font-mono transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            ))}
            {(ourServicesData.services || []).length === 0 && (
              <p className="col-span-2 text-zinc-400 dark:text-zinc-500 text-sm italic text-center py-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 border-dashed transition-colors duration-300">
                No services added yet. Click "Add Service" to create one.
              </p>
            )}
          </div>
        </div>

        {/* Stats Section (4 Items) */}
        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-6 transition-colors">Performance Statistics (4 Items)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(ourServicesData.stats || []).map((stat, index) => (
              <div key={index} className="p-6 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl space-y-4 transition-colors duration-300">
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-transparent dark:border-blue-500/20 text-xs font-semibold transition-colors">
                  Stat {index + 1}
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 transition-colors">Value (e.g. 26+)</label>
                    <input 
                      type="text" 
                      value={stat.value || ''}
                      onChange={(e) => onStatItemChange(index, 'value', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/20 text-sm transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 transition-colors">Title (e.g. LOCATION)</label>
                    <input 
                      type="text" 
                      value={stat.title || ''}
                      onChange={(e) => onStatItemChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/20 text-sm transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 transition-colors">Description</label>
                  <textarea 
                    value={stat.description || ''}
                    onChange={(e) => onStatItemChange(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/20 text-sm resize-none transition-all duration-300"
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

export default OurServicesCustomization;
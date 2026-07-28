import React from 'react';
import { Send } from 'lucide-react';

const CtaCustomization = ({
  ctaData,
  onChange
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
      <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
        <Send className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">CTA (Call To Action) Section</h2>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Badge Text</label>
            <input 
              type="text" 
              name="badgeText"
              value={ctaData.badgeText || ''}
              onChange={onChange}
              className="block w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl leading-5 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors sm:text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Button Text</label>
            <input 
              type="text" 
              name="buttonText"
              value={ctaData.buttonText || ''}
              onChange={onChange}
              className="block w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl leading-5 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors sm:text-sm font-medium"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              CTA Title <span className="text-[10px] font-normal text-zinc-400 dark:text-zinc-500 lowercase tracking-normal ml-1">(Use `[text]` to highlight)</span>
            </label>
            <input 
              type="text" 
              name="title"
              value={ctaData.title || ''}
              onChange={onChange}
              className="block w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl leading-5 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors sm:text-sm font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaCustomization;
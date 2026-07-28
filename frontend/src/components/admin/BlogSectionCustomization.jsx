import React from 'react';
import { FileText, Info } from 'lucide-react';

const BlogSectionCustomization = ({
  blogSectionData,
  onChange
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
      <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
        <FileText className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Blog & Articles Section</h2>
      </div>

      <div className="p-8 space-y-10">
        <div className="flex gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-4 rounded-xl text-sm text-blue-800 dark:text-blue-400 transition-colors duration-300">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-500" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-blue-900 dark:text-blue-300">Note:</strong> The articles displayed in this section are now automatically fetched from your latest published blogs in the Blog Module. You only need to configure the section titles here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Badge Text</label>
            <input 
              type="text" 
              name="badgeText"
              value={blogSectionData.badgeText || ''}
              onChange={onChange}
              className="block w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl leading-5 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors sm:text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Section Title <span className="text-[10px] font-normal text-zinc-400 dark:text-zinc-500 lowercase tracking-normal ml-1">(Use `[text]` to highlight, `\n` for newline)</span>
            </label>
            <input 
              type="text" 
              name="title"
              value={blogSectionData.title || ''}
              onChange={onChange}
              className="block w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl leading-5 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors sm:text-sm font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSectionCustomization;
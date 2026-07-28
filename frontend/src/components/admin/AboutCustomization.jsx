import React from 'react';
import { User } from 'lucide-react';
import TipTapEditor from './TipTapEditor';
import ImageField from './ImageField';

const AboutCustomization = ({
  aboutData,
  onChange,
  onHighlightChange,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
      <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
        <User className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">About Section</h2>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* About Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-4">Text Content</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Badge Text</label>
              <input 
                type="text" 
                name="badgeText"
                value={aboutData.badgeText || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/20 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Button Text</label>
              <input 
                type="text" 
                name="buttonText"
                value={aboutData.buttonText || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/20 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Headline (Use `[text]` to highlight in primary color)</label>
            <input 
              type="text" 
              name="title"
              value={aboutData.title || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/20 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Description</label>
            <TipTapEditor 
              value={aboutData.description || ''} 
              onChange={(html) => onChange({ target: { name: 'description', value: html } })} 
              placeholder="Enter about description here..."
            />
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
            <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-4">Highlights Checkmarks (4 items)</h3>
            <div className="grid grid-cols-2 gap-4">
              {(aboutData.highlights || []).map((highlight, index) => (
                <div key={index}>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 transition-colors">Highlight {index + 1}</label>
                  <input 
                    type="text" 
                    value={highlight || ''}
                    onChange={(e) => onHighlightChange(index, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/20 focus:bg-white dark:focus:bg-zinc-900 text-sm transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Media Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-4">Media Assets</h3>
          <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl p-6 relative group overflow-hidden transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 transition-colors">About Feature Image</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 transition-colors">Main portrait image</p>
              </div>
            </div>
            
            <ImageField 
              value={aboutData.image || ''} 
              onChange={(url) => onChange({ target: { name: 'image', value: url } })} 
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCustomization;
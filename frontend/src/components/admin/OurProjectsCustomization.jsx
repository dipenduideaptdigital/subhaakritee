import React, { useState } from 'react';
import { FileText, Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import ImageField from './ImageField';
import TipTapEditor from './TipTapEditor';

const CollapsibleTiptap = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPreviewText = (html) => {
    if (!html) return 'No content added...';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    return text.length > 60 ? text.substring(0, 60) + '...' : text || 'No content added...';
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">{label}</label>}
      <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm transition-all duration-300">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors outline-none focus:ring-2 focus:ring-purple-500/20"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Edit2 className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0 transition-colors" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate transition-colors">
              {isOpen ? 'Close Rich Text Editor' : getPreviewText(value)}
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0 transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0 transition-colors" />
          )}
        </button>
        
        {isOpen && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 transition-colors">
            <TipTapEditor value={value || ''} onChange={onChange} />
          </div>
        )}
      </div>
    </div>
  );
};

const OurProjectsCustomization = ({
  ourProjectsData,
  onChange,
  onProjectItemChange,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
      <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors">
        <FileText className="w-6 h-6 text-purple-600 dark:text-purple-500 transition-colors" />
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 transition-colors">Our Projects Section</h2>
      </div>

      <div className="p-8 space-y-10">
        {/* Header Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Badge Text</label>
            <input 
              type="text" 
              name="badgeText"
              value={ourProjectsData.badgeText || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Section Title <span className="text-xs text-zinc-400 font-normal">(Use `[text]` to highlight)</span></label>
            <input 
              type="text" 
              name="title"
              value={ourProjectsData.title || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300"
            />
          </div>
          <div className="md:col-span-2">
            <CollapsibleTiptap 
              label="Description"
              value={ourProjectsData.description || ''}
              onChange={(htmlValue) => onChange({ target: { name: 'description', value: htmlValue } })}
            />
          </div>
        </div>

        {/* Media Graphic Asset */}
        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 transition-colors">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-4 transition-colors">Bottom Illustration Graphic</h3>
          <div className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl p-6 transition-colors duration-300">
            <div className="mb-4">
              <h4 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1 transition-colors">Interior Foreground Image</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 transition-colors">Wide silhouette/illustrative image placed above background typography</p>
            </div>
            
            <ImageField 
              value={ourProjectsData.bottomImage || ''} 
              onChange={(url) => onChange({ target: { name: 'bottomImage', value: url } })} 
            />

          </div>
        </div>

        {/* Projects Cards */}
        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 transition-colors">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-6 transition-colors">Carousel Projects (5 Items)</h3>
          <div className="space-y-6">
            {(ourProjectsData.projects || []).map((project, index) => (
              <div key={index} className="p-6 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-start transition-colors duration-300 hover:border-zinc-300 dark:hover:border-zinc-600">
                
                <div className="space-y-4">
                  <span className="inline-flex items-center justify-center px-4 h-8 rounded-full bg-zinc-950 dark:bg-purple-500/20 text-white dark:text-purple-400 border border-transparent dark:border-purple-500/30 text-xs font-bold transition-colors whitespace-nowrap">
                    Project {index + 1}
                  </span>
                  
                  <ImageField 
                    value={project.image || ''} 
                    onChange={(url) => onProjectItemChange(index, 'image', url)} 
                  />
                  
                </div>

                {/* Project Content Column */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 transition-colors">Category <span className="font-normal">(e.g. LANDSCAPE)</span></label>
                    <input 
                      type="text" 
                      value={project.category || ''}
                      onChange={(e) => onProjectItemChange(index, 'category', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 text-sm transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 transition-colors">Project Title</label>
                    <input 
                      type="text" 
                      value={project.title || ''}
                      onChange={(e) => onProjectItemChange(index, 'title', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 text-sm transition-all duration-300"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <CollapsibleTiptap 
                      label="Project Description"
                      value={project.description || ''}
                      onChange={(htmlValue) => onProjectItemChange(index, 'description', htmlValue)}
                    />
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OurProjectsCustomization;
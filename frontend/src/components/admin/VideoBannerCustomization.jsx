import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import ImageField from './ImageField';

const VideoBannerCustomization = ({
  videoBannerData,
  onChange
}) => {
  
  const handleImageSelect = (url) => {
    onChange({ target: { name: 'image', value: url } });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
      <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
        <ImageIcon className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">Video Play Banner Section</h2>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Content Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-4">Text Content</h3>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">
              YouTube Video Link or ID <span className="text-zinc-400 dark:text-zinc-500 font-normal">(e.g. https://www.youtube.com/watch?v=ScMzIvxBSi4)</span>
            </label>
            <input 
              type="text" 
              name="videoId"
              value={videoBannerData.videoId || ''}
              onChange={onChange}
              placeholder="Enter video URL"
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">
              Section Headline <span className="text-zinc-400 dark:text-zinc-500 font-normal">(Use `\n` for newline)</span>
            </label>
            <input 
              type="text" 
              name="title"
              value={videoBannerData.title || ''}
              onChange={onChange}
              placeholder="e.g. UNLOCK YOUR DREAM \n HOME TODAY!"
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">
              Description / Paragraph Text
            </label>
            <textarea 
              name="description"
              value={videoBannerData.description || ''}
              onChange={onChange}
              rows={4}
              placeholder="Write a short description..."
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300 resize-none"
            />
          </div>
        </div>

        {/* Cover Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-4">Cover Asset</h3>
          
          <div className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/60 rounded-2xl p-6 transition-colors duration-300">
            <div className="mb-6">
              <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 transition-colors">Thumbnail Cover Image</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Video background thumbnail image</p>
            </div>
            
            <ImageField 
              value={videoBannerData.image || ''} 
              onChange={handleImageSelect} 
            />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoBannerCustomization;
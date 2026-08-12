import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import ImageField from './ImageField';

const GalleryCustomization = ({
  galleryData,
  onChange
}) => {
  const images = Array.isArray(galleryData.images) ? galleryData.images : [];
  const paddedImages = [...images, ...Array(6)].slice(0, 6);

  const handleImageChange = (index, url) => {
    const newImages = [...paddedImages];
    newImages[index] = url;
    onChange({ target: { name: 'images', value: newImages } });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
      <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
        <ImageIcon className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">Gallery Section</h2>
      </div>

      <div className="p-8 space-y-10">
        {/* Header Settings */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">
            Huge Background Watermark Text
          </label>
          <input 
            type="text" 
            name="bgText"
            value={galleryData.bgText || ''}
            onChange={onChange}
            placeholder="e.g. gallery"
            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300 font-mono"
          />
        </div>

        {/* Gallery Images*/}
        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-6">Gallery Images (6 Items)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paddedImages.map((imageUrl, index) => (
              <div 
                key={index} 
                className="p-4 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/60 rounded-2xl space-y-4 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold shadow-sm transition-colors duration-300">
                    {index + 1}
                  </span>
                </div>

                <ImageField 
                  value={imageUrl || ''} 
                  onChange={(url) => handleImageChange(index, url)} 
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GalleryCustomization;
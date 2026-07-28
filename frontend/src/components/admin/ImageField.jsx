import React, { useState } from 'react';
import { Image as ImageIcon, X, FolderOpen } from 'lucide-react';
import { resolveAssetUrl } from '../../utils/assetResolver';
import MediaPickerModal from './MediaPickerModal';

const ImageField = ({ value, onChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectMedia = (url) => {
    onChange(url);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
  };

  const displayUrl = resolveAssetUrl(value);

  return (
    <div className="w-full transition-colors duration-300">
      {value ? (
        <div className="relative group w-full h-40 bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 transition-colors duration-300">
          <img 
            src={displayUrl} 
            alt="Selected Preview" 
            className="w-full h-full object-cover" 
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/50 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
            <button 
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-bold rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-transparent dark:border-zinc-700 shadow-sm flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <FolderOpen className="w-4 h-4" /> Change Image
            </button>
            <button 
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-700 dark:hover:bg-red-600 shadow-sm flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <X className="w-4 h-4" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => setIsModalOpen(true)}
          className="w-full h-40 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-400 bg-zinc-50 dark:bg-zinc-900 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 group"
        >
          <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-sm border border-transparent dark:border-zinc-700 mb-3 group-hover:scale-110 transition-all duration-300">
            <ImageIcon className="w-6 h-6 text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
          </div>
          <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Browse Media Library
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 transition-colors">
            Click to select or upload an image
          </span>
        </div>
      )}

      {/* Render the Modal outside the normal flow */}
      <MediaPickerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleSelectMedia} 
      />
    </div>
  );
};

export default ImageField;
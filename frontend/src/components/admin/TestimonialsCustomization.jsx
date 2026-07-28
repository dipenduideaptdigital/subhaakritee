import React, { useState } from 'react';
import { User, MessageSquare, FolderOpen, X, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import MediaPickerModal from './MediaPickerModal';
import { resolveAssetUrl } from '../../utils/assetResolver';
import TipTapEditor from './TipTapEditor';

// Collapsible Tiptap Wrapper Component
const CollapsibleTiptap = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPreviewText = (html) => {
    if (!html) return 'No content added...';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    return text.length > 50 ? text.substring(0, 50) + '...' : text || 'No content added...';
  };

  return (
    <div className="mb-4 transition-colors duration-300">
      {label && <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">{label}</label>}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm transition-all duration-300">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors outline-none cursor-pointer"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Edit2 className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
            <span className="text-sm text-zinc-600 dark:text-zinc-300 truncate font-normal">
              {isOpen ? 'Close Editor' : getPreviewText(value)}
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
          )}
        </button>
        
        {isOpen && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors duration-300">
            <TipTapEditor value={value || ''} onChange={onChange} />
          </div>
        )}
      </div>
    </div>
  );
};

const TestimonialsCustomization = ({
  testimonialsData,
  onChange,
  onItemChange,
  previewMain,
  previewAuthor,
  previewLogos,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  
  const [mediaModal, setMediaModal] = useState({ isOpen: false, targetField: null, index: null });

  const defaultItems = [
    {
      ratingValue: testimonialsData.ratingValue || "4.80",
      reviewCount: testimonialsData.reviewCount || "2,688 Reviews",
      conceptText: testimonialsData.conceptText || "From Concept To Reality, The Team Turned My Vision Into A Stunning, Livable Space. I Couldn't Be Happier With This!",
      mainQuote: testimonialsData.mainQuote || "I absolutely love my new modern living room! The clean lines, neutral tones, and minimalist interior create such a calming & stylish atmosphere. Highly recommend their modern interior design services!",
      authorName: testimonialsData.authorName || "Morgan Dufresne",
      authorRole: testimonialsData.authorRole || "Homeowner",
      image: testimonialsData.image || "",
      authorImage: testimonialsData.authorImage || ""
    },
    {
      ratingValue: "4.90",
      reviewCount: "1,420 Reviews",
      conceptText: "Design. Build. Deliver. Everything our office needed—handled end to end.",
      mainQuote: "It is a pleasure to work with subhAAkritee. Together we created our office interior decoration. The interior designing, planning and decoration is just GREAT! All members are cooperative.",
      authorName: "Tanmoy",
      authorRole: "Company owner",
      image: "",
      authorImage: ""
    },
    {
      ratingValue: "4.95",
      reviewCount: "850 Reviews",
      conceptText: "From dream homes to dynamic business spaces, they create architecture that reflects your vision.",
      mainQuote: "They delivered outstanding architectural planning. The space layout and structural designs are perfect. Exceeded our expectations at every level of the project.",
      authorName: "Rajesh Kumar",
      authorRole: "Property Developer",
      image: "",
      authorImage: ""
    }
  ];

  const items = (testimonialsData.items && testimonialsData.items.length >= 3)
    ? testimonialsData.items
    : defaultItems;

  const currentItem = items[activeTab] || defaultItems[activeTab];

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    if (onItemChange) {
      onItemChange(activeTab, name, value);
    } else if (onChange) {
      onChange(e);
    }
  };

  const handleTiptapFieldChange = (fieldName, htmlValue) => {
    if (onItemChange) {
      onItemChange(activeTab, fieldName, htmlValue);
    } else if (onChange) {
      onChange({ target: { name: fieldName, value: htmlValue } });
    }
  };

  const handleMediaSelect = (url) => {
    if (mediaModal.targetField === 'main') {
      if (onItemChange) onItemChange(activeTab, 'image', url);
      else onChange({ target: { name: 'image', value: url } });
    } else if (mediaModal.targetField === 'author') {
      if (onItemChange) onItemChange(activeTab, 'authorImage', url);
      else onChange({ target: { name: 'authorImage', value: url } });
    } else if (mediaModal.targetField === 'logo') {
      const newLogos = [...(testimonialsData.logos || ['', '', '', '', ''])];
      newLogos[mediaModal.index] = url;
      onChange({ target: { name: 'logos', value: newLogos } });
    }
  };

  const handleRemoveMedia = (targetField, index = null) => {
    if (targetField === 'main') {
      if (onItemChange) onItemChange(activeTab, 'image', '');
      else onChange({ target: { name: 'image', value: '' } });
    } else if (targetField === 'author') {
      if (onItemChange) onItemChange(activeTab, 'authorImage', '');
      else onChange({ target: { name: 'authorImage', value: '' } });
    } else if (targetField === 'logo') {
      const newLogos = [...(testimonialsData.logos || ['', '', '', '', ''])];
      newLogos[index] = '';
      onChange({ target: { name: 'logos', value: newLogos } });
    }
  };

  const getDisplayImage = (type) => {
    if (type === 'main') {
      return currentItem.image || (Array.isArray(previewMain) ? previewMain[activeTab] : previewMain) || '';
    }
    if (type === 'author') {
      return currentItem.authorImage || (Array.isArray(previewAuthor) ? previewAuthor[activeTab] : previewAuthor) || '';
    }
    return '';
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
      <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
        <User className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">Testimonials Section</h2>
      </div>

      <div className="p-8 space-y-10">
        {/* Header Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Badge Text</label>
            <input 
              type="text" 
              name="badgeText"
              value={testimonialsData.badgeText || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-blue-500/30 focus:border-zinc-900 dark:focus:border-blue-500 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Section Title (Use `[text]` to highlight, `\n` for newline)</label>
            <input 
              type="text" 
              name="title"
              value={testimonialsData.title || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-blue-500/30 focus:border-zinc-900 dark:focus:border-blue-500 transition-all text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <CollapsibleTiptap
              label="Description"
              value={testimonialsData.description || ''}
              onChange={(htmlVal) => onChange({ target: { name: 'description', value: htmlVal } })}
            />
          </div>
        </div>

        {/* Horizontal Tabs to select Testimonial 1, 2, or 3 */}
        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase transition-colors">Testimonials Slider Items</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 transition-colors">Select a testimonial tab below to customize its quote, author details, review score, and images.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-1.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl w-fit mb-8 transition-colors duration-300 overflow-x-auto">
            {['Testimonial 1', 'Testimonial 2', 'Testimonial 3'].map((tabLabel, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  activeTab === idx
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-900/40'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white/60 dark:hover:bg-zinc-700/50'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                {tabLabel}
              </button>
            ))}
          </div>

          {/* Active Testimonial Item Form */}
          <div className="bg-zinc-50/60 dark:bg-zinc-800/30 border border-zinc-200/80 dark:border-zinc-700/50 rounded-2xl p-6 md:p-8 space-y-8 transition-colors duration-300">
            
            {/* Media Uploads from Library */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Testimonial Showcase Image */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-zinc-800 dark:text-zinc-100">Testimonial {activeTab + 1} Image</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Wide showcase / room render image</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setMediaModal({ isOpen: true, targetField: 'main', index: null })}
                    className="flex items-center gap-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-blue-500/10 transition-colors shadow-sm cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4" /> Browse
                  </button>
                </div>
                {getDisplayImage('main') ? (
                  <div className="w-full h-40 rounded-xl overflow-hidden shadow-inner border border-zinc-200 dark:border-zinc-700 relative group">
                    <img src={resolveAssetUrl(getDisplayImage('main'))} alt={`Testimonial ${activeTab + 1} Preview`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                       <button onClick={() => handleRemoveMedia('main')} type="button" className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-transform hover:scale-110 shadow-lg cursor-pointer">
                          <X className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => setMediaModal({ isOpen: true, targetField: 'main', index: null })}
                    className="w-full h-40 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950/50 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer group"
                  >
                    <FolderOpen className="w-6 h-6 text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 mb-2 transition-colors" />
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium transition-colors">Select Image</span>
                  </div>
                )}
              </div>

              {/* Author Profile Image */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-zinc-800 dark:text-zinc-100">Author Profile Image</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Square avatar photo</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setMediaModal({ isOpen: true, targetField: 'author', index: null })}
                    className="flex items-center gap-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-blue-500/10 transition-colors shadow-sm cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4" /> Browse
                  </button>
                </div>
                {getDisplayImage('author') ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden shadow-inner border border-zinc-200 dark:border-zinc-700 mx-auto relative group">
                    <img src={resolveAssetUrl(getDisplayImage('author'))} alt="Author Avatar Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                       <button onClick={() => handleRemoveMedia('author')} type="button" className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-transform hover:scale-110 shadow-lg cursor-pointer">
                          <X className="w-3 h-3" />
                       </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => setMediaModal({ isOpen: true, targetField: 'author', index: null })}
                    className="w-20 h-20 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950/50 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer group mx-auto"
                  >
                    <FolderOpen className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 transition-colors" />
                  </div>
                )}
              </div>
            </div>

            {/* Review & Quote Settings */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Rating Value (e.g. 4.80)</label>
                  <input 
                    type="text" 
                    name="ratingValue"
                    value={currentItem.ratingValue || ''}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-blue-500/30 focus:border-zinc-900 dark:focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Review Count (e.g. 2,688 Reviews)</label>
                  <input 
                    type="text" 
                    name="reviewCount"
                    value={currentItem.reviewCount || ''}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-blue-500/30 focus:border-zinc-900 dark:focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Concept Summary Text</label>
                  <input 
                    type="text" 
                    name="conceptText"
                    value={currentItem.conceptText || ''}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-blue-500/30 focus:border-zinc-900 dark:focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Author Name</label>
                  <input 
                    type="text" 
                    name="authorName"
                    value={currentItem.authorName || ''}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-blue-500/30 focus:border-zinc-900 dark:focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Author Role</label>
                  <input 
                    type="text" 
                    name="authorRole"
                    value={currentItem.authorRole || ''}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-blue-500/30 focus:border-zinc-900 dark:focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <CollapsibleTiptap
                  label={`Main Quote Content (Testimonial ${activeTab + 1})`}
                  value={currentItem.mainQuote || ''}
                  onChange={(htmlVal) => handleTiptapFieldChange('mainQuote', htmlVal)}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Client Brands/Logos settings */}
        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-6 transition-colors duration-300">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase transition-colors">Customer Logos & Badges</h3>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">VIP Customer Headline (Use `[text]` to highlight)</label>
            <input 
              type="text" 
              name="bottomText"
              value={testimonialsData.bottomText || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-blue-500/30 focus:border-zinc-900 dark:focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, index) => {
              const logoUrl = (testimonialsData.logos && testimonialsData.logos[index]) || (previewLogos && previewLogos[index]) || '';
              return (
                <div key={index} className="flex flex-col items-center">
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 transition-colors">Client Logo {index + 1}</label>
                  <div 
                    onClick={() => setMediaModal({ isOpen: true, targetField: 'logo', index })}
                    className="w-full h-24 bg-zinc-50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 transition-colors overflow-hidden relative group"
                  >
                    {logoUrl ? (
                      <>
                        <img src={resolveAssetUrl(logoUrl)} alt={`Logo ${index + 1}`} className="h-full w-full object-contain p-3 opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0" />
                        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); handleRemoveMedia('logo', index); }}
                            className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-transform hover:scale-110 shadow-lg cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                        <FolderOpen className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-medium">Browse</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Shared Media Picker Modal */}
      <MediaPickerModal 
        isOpen={mediaModal.isOpen} 
        onClose={() => setMediaModal({ isOpen: false, targetField: null, index: null })} 
        onSelect={handleMediaSelect} 
      />

    </div>
  );
};

export default TestimonialsCustomization;
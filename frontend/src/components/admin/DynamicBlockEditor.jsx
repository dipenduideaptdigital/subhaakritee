import React, { useRef, useState, useEffect } from 'react';
import apiClient from '../../api/client';
import HeroCustomization from './HeroCustomization';
import ServicesCustomization from './ServicesCustomization';
import AboutCustomization from './AboutCustomization';
import OurServicesCustomization from './OurServicesCustomization';
import HowWeWorkCustomization from './HowWeWorkCustomization';
import OurProjectsCustomization from './OurProjectsCustomization';
import PanoramasCustomization from './PanoramasCustomization';
import TeamCustomization from './TeamCustomization';
import TestimonialsCustomization from './TestimonialsCustomization';
import VideoBannerCustomization from './VideoBannerCustomization';
import BlogSectionCustomization from './BlogSectionCustomization';
import GalleryCustomization from './GalleryCustomization';
import CtaCustomization from './CtaCustomization';
import { Type, Trash, Plus, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import TipTapEditor from './TipTapEditor';
import ImageField from './ImageField';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const CollapsibleTiptap = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPreviewText = (html) => {
    if (!html) return 'No content added...';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    return text.length > 60 ? text.substring(0, 60) + '...' : text || 'No content added...';
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm transition-colors duration-300">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors outline-none"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Edit2 className="w-4 h-4 text-zinc-500 dark:text-indigo-400 shrink-0" />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate">
            {isOpen ? 'Close Text Editor' : getPreviewText(value)}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors duration-300">
          <TipTapEditor value={value} onChange={onChange} />
        </div>
      )}
    </div>
  );
};
  
const DynamicBlockEditor = ({ block, index, updateBlockData }) => {
  const { type, data } = block;

  const [availableForms, setAvailableForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(false);

  useEffect(() => {
    if (type === 'contactForm') {
      const fetchForms = async () => {
        try {
          setLoadingForms(true);
          const res = await apiClient.get('/admin/contact-forms');
          if (res.data?.success && res.data?.data) {
            setAvailableForms(res.data.data);
          }
        } catch (err) {
          console.error('Failed to fetch contact forms:', err);
        } finally {
          setLoadingForms(false);
        }
      };
      fetchForms();
    }
  }, [type]);

  // Generic change handler for simple inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateBlockData(index, name, value);
  };

  // Tiptap Handler
  const handleTiptapChange = (name, value) => {
    updateBlockData(index, name, value);
  };

  // Array Item Change Handlers
  const handleArrayItemChange = (arrayField, itemIndex, itemField, value) => {
    const newArray = [...(data[arrayField] || [])];
    newArray[itemIndex] = { ...newArray[itemIndex], [itemField]: value };
    updateBlockData(index, arrayField, newArray);
  };

  const handleArrayStringChange = (arrayField, itemIndex, value) => {
    const newArray = [...(data[arrayField] || [])];
    newArray[itemIndex] = value;
    updateBlockData(index, arrayField, newArray);
  };

  const renderGenericFields = (fieldsConfig) => (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
      <div className="px-8 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-950/50 transition-colors duration-300">
        <Type className="w-5 h-5 text-zinc-700 dark:text-indigo-400" />
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Customize Block</h2>
      </div>
      <div className="p-8 space-y-4">
        {fieldsConfig.map((field, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 capitalize">
              {field.name.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            
            {field.type === 'tiptap' ? (
              <CollapsibleTiptap
                value={data[field.name] !== undefined ? data[field.name] : (field.defaultValue || '')}
                onChange={(htmlValue) => handleTiptapChange(field.name, htmlValue)}
              />
            ) : field.type === 'textarea' ? (
              <textarea
                rows="4"
                name={field.name}
                value={data[field.name] !== undefined ? data[field.name] : (field.defaultValue || '')}
                onChange={handleChange}
                placeholder={field.placeholder || ''}
                className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-indigo-500/30 focus:border-zinc-900 dark:focus:border-indigo-500 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-600"
              />
            ) : field.type === 'image' ? (
              <ImageField 
                value={data[field.name] || ''} 
                onChange={(url) => updateBlockData(index, field.name, url)} 
              />
            ) : field.type === 'array' ? (
              <div className="space-y-4 border border-zinc-200 dark:border-zinc-800/60 rounded-xl p-4 bg-zinc-50/50 dark:bg-zinc-950/30 transition-colors duration-300">
                {((data[field.name] === undefined ? field.defaultArray : data[field.name]) || []).map((item, itemIdx) => (
                  <div key={itemIdx} className="p-4 border border-zinc-200 dark:border-zinc-700/80 rounded-lg bg-white dark:bg-zinc-900 relative transition-colors duration-300">
                    <button 
                      type="button" 
                      onClick={() => {
                        const newArr = [...(data[field.name] || [])];
                        newArr.splice(itemIdx, 1);
                        updateBlockData(index, field.name, newArr);
                      }}
                      className="absolute top-2 right-2 p-1.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors z-10"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                    <div className="space-y-3 mt-4">
                      {field.itemFields.map((subField, subIdx) => (
                        <div key={subIdx} className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 capitalize">
                            {subField.name.replace(/([A-Z])/g, ' $1').trim()}
                          </label>

                          {subField.type === 'tiptap' ? (
                            <CollapsibleTiptap
                              value={item[subField.name] || ''}
                              onChange={(htmlValue) => handleArrayItemChange(field.name, itemIdx, subField.name, htmlValue)}
                            />
                          ) : subField.type === 'textarea' ? (
                            <textarea
                              rows="2"
                              value={item[subField.name] || ''}
                              onChange={(e) => handleArrayItemChange(field.name, itemIdx, subField.name, e.target.value)}
                              placeholder={subField.placeholder || ''}
                              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-500 text-sm bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-600 transition-colors"
                            />
                          ) : subField.type === 'image' ? (
                            <div className="flex-1">
                              <ImageField 
                                value={item[subField.name] || ''} 
                                onChange={(url) => handleArrayItemChange(field.name, itemIdx, subField.name, url)} 
                              />
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={item[subField.name] || ''}
                              onChange={(e) => handleArrayItemChange(field.name, itemIdx, subField.name, e.target.value)}
                              placeholder={subField.placeholder || ''}
                              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-500 text-sm bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-600 transition-colors"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newArr = [...(data[field.name] || []), field.defaultItem || {}];
                    updateBlockData(index, field.name, newArr);
                  }}
                  className="w-full py-2.5 border border-dashed border-zinc-300 dark:border-indigo-500/40 rounded-lg text-sm text-zinc-600 dark:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-indigo-500/10 flex items-center justify-center gap-2 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>
            ) : field.type === 'arrayString' ? (
              <div className="space-y-4 border border-zinc-200 dark:border-zinc-800/60 rounded-xl p-4 bg-zinc-50/50 dark:bg-zinc-950/30 transition-colors duration-300">
                {((data[field.name] === undefined ? field.defaultArray : data[field.name]) || []).map((itemStr, itemIdx) => (
                  <div key={itemIdx} className="p-3 border border-zinc-200 dark:border-zinc-700/80 rounded-lg bg-white dark:bg-zinc-900 relative flex gap-4 items-start transition-colors duration-300">
                    {field.isImage ? (
                      <div className="flex-1">
                        <ImageField 
                          value={itemStr || ''} 
                          onChange={(url) => handleArrayStringChange(field.name, itemIdx, url)} 
                        />
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={itemStr || ''}
                        onChange={(e) => handleArrayStringChange(field.name, itemIdx, e.target.value)}
                        className="flex-1 px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-500 text-sm bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-100 transition-colors"
                      />
                    )}
                    <button 
                      type="button" 
                      onClick={() => {
                        const newArr = [...(data[field.name] || [])];
                        newArr.splice(itemIdx, 1);
                        updateBlockData(index, field.name, newArr);
                      }}
                      className="p-1.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors shrink-0"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newArr = [...(data[field.name] || []), ''];
                    updateBlockData(index, field.name, newArr);
                  }}
                  className="w-full py-2.5 border border-dashed border-zinc-300 dark:border-indigo-500/40 rounded-lg text-sm text-zinc-600 dark:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-indigo-500/10 flex items-center justify-center gap-2 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>
            ) : (
              <input
                type="text"
                name={field.name}
                value={data[field.name] !== undefined ? data[field.name] : (field.defaultValue || '')}
                onChange={handleChange}
                placeholder={field.placeholder || ''}
                className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-indigo-500/30 focus:border-zinc-900 dark:focus:border-indigo-500 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-600"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  switch (type) {
    case 'heroSectionTwo':
      return renderGenericFields([
        { name: 'title', type: 'textarea', defaultValue: 'Find Your [Inspired]\n[Interior] Design', placeholder: 'Title...' },
        { name: 'badgeText', type: 'text', defaultValue: 'FAST AND RELIABLE', placeholder: 'FAST AND RELIABLE' },
        { name: 'description', type: 'tiptap', defaultValue: 'Transform your vision into reality with our innovative designs, creating modern spaces that blend functionality, aesthetics, and sustainability.', placeholder: 'Description...' },
        { name: 'watermarkText', type: 'text', defaultValue: 'Interior', placeholder: 'Interior' },
        { name: 'backgroundImage', type: 'image' },
      ]);
    case 'aboutSectionTwo':
      return renderGenericFields([
        { name: 'title', type: 'textarea', defaultValue: 'Architecture\n[And Interiors, Our Dual]\nExpertise', placeholder: 'Title...' },
        { name: 'badgeText', type: 'text', defaultValue: 'STARTED IN 1989', placeholder: 'STARTED IN 1989' },
        { name: 'paragraph1', type: 'tiptap', defaultValue: 'We believe that every space has the power to inspire, and that great design brings that inspiration to life. Our mission is to craft environments that stir creativity, evoke emotion, and reflect the essence of those who inhabit them.', placeholder: 'Paragraph 1...' },
        { name: 'paragraph2', type: 'tiptap', defaultValue: 'With a strong presence in Kolkata, Bhubaneswar, and Ranchi, our turnkey office interiors are thoughtfully crafted to enhance productivity, reflect your brand identity, and support the way your team works every day.', placeholder: 'Paragraph 2...' },
        { name: 'buttonText', type: 'text', defaultValue: "Let's Get Started", placeholder: "Let's Get Started" },
        { name: 'image1', type: 'image' },
        { name: 'image2', type: 'image' },
        { name: 'image3', type: 'image' }
      ]);
    case 'servicesSectionTwo':
      return renderGenericFields([
        { name: 'title', type: 'textarea', defaultValue: 'Explore Our [Comprehensive]\n[Interior Design] Services', placeholder: 'Title...' },
        { name: 'badgeText', type: 'text', defaultValue: 'OUR SERVICES', placeholder: 'OUR SERVICES' },
        { 
          name: 'services', type: 'array', defaultItem: { title: '', description: '', image: '' },
          defaultArray: [
            { title: 'Initial Consultation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.', image: '' },
            { title: 'Design & Planning', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.', image: '' },
            { title: 'Implementation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.', image: '' }
          ],
          itemFields: [
            { name: 'title', type: 'text', placeholder: 'Title' },
            { name: 'description', type: 'tiptap', placeholder: 'Description' },
            { name: 'image', type: 'image' }
          ]
        }
      ]);
    case 'processSectionTwo':
      return renderGenericFields([
        { name: 'title', type: 'textarea', defaultValue: 'Description [Architecture]\n[Process] For Exceptional Results.', placeholder: 'Title...' },
        { name: 'badgeText', type: 'text', defaultValue: 'GET IN TOUCH', placeholder: 'GET IN TOUCH' },
        { name: 'description', type: 'tiptap', defaultValue: 'We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.', placeholder: 'Description...' },
        { name: 'image', type: 'image' },
        { 
          name: 'steps', type: 'array', defaultItem: { title: '', description: '' },
          defaultArray: [
            { title: 'Initial Consultation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' },
            { title: 'Design & Planning', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' },
            { title: 'Implementation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' },
            { title: 'Project Handover', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' }
          ],
          itemFields: [
            { name: 'title', type: 'text', placeholder: 'Step Title' },
            { name: 'description', type: 'tiptap', placeholder: 'Step Description' }
          ]
        }
      ]);
    case 'projectSliderTwo':
      return renderGenericFields([
        { 
          name: 'projects', type: 'array', defaultItem: { title: '', year: '2024', location: '', image: '' },
          defaultArray: [
            { title: 'Industrial Elegance Condo', year: '2024', location: 'Kolkata', image: '' },
            { title: 'Residential Interior Design', year: '2024', location: 'Bhubaneswar', image: '' },
            { title: 'Serene Space Studio', year: '2024', location: 'Ranchi', image: '' },
            { title: 'Art Decor Revival', year: '2024', location: 'Kolkata', image: '' },
            { title: 'Modern Minimalist Oasis', year: '2024', location: 'Siliguri', image: '' },
            { title: 'Corporate Executive Suite', year: '2024', location: 'Delhi', image: '' }
          ],
          itemFields: [
            { name: 'title', type: 'text', placeholder: 'Project Title' },
            { name: 'year', type: 'text', placeholder: 'Year' },
            { name: 'location', type: 'text', placeholder: 'Location' },
            { name: 'image', type: 'image' }
          ]
        }
      ]);
    case 'trustedPartners':
      return renderGenericFields([
        { name: 'title', type: 'text', defaultValue: 'OUR [TRUSTED PARTNERS]', placeholder: 'OUR [TRUSTED PARTNERS]' },
        {
          name: 'partners', type: 'array', defaultItem: { name: '', logo: '', heightClass: 'h-11 md:h-[44px]' },
          defaultArray: [
            { name: 'Aristo', logo: '', heightClass: 'h-11 md:h-[44px]' },
            { name: 'Spitze', logo: '', heightClass: 'h-12 md:h-[48px]' },
            { name: 'Faber', logo: '', heightClass: 'h-11 md:h-[44px]' },
            { name: 'Everyday', logo: '', heightClass: 'h-12 md:h-[48px]' },
            { name: 'Fevicol', logo: '', heightClass: 'h-[54px] md:h-[60px]' },
            { name: 'Urban Ladder', logo: '', heightClass: 'h-11 md:h-[44px]' }
          ],
          itemFields: [
            { name: 'name', type: 'text', placeholder: 'Brand name' },
            { name: 'logo', type: 'image' },
            { name: 'heightClass', type: 'text', placeholder: 'e.g. h-11 md:h-[44px]' }
          ]
        }
      ]);
    case 'statsSectionTwo':
      return renderGenericFields([
        { name: 'title', type: 'textarea', defaultValue: 'Behind [Every Statistic]\n[Pulses] A Human Story', placeholder: 'Title...' },
        { name: 'badgeText', type: 'text', defaultValue: 'TRUSTED EXPERIENCE', placeholder: 'TRUSTED EXPERIENCE' },
        { name: 'buttonText', type: 'text', defaultValue: 'BOOK A FREE CONSULTATION', placeholder: 'BOOK A FREE CONSULTATION' },
        { name: 'backgroundImage', type: 'image' },
        { 
          name: 'stats', type: 'array', defaultItem: { value: '0', title: '', description: '' },
          defaultArray: [
            { value: '26+', title: 'YEARS EXPERIENCE', description: 'Improving homes with expert craftsmanship for years' },
            { value: '100', title: 'PROJECTS DONE', description: 'Over 250 successful projects delivered with quality and care' },
            { value: '100', title: 'SATISFIED CUSTOMER', description: 'Our team of 30 experts ensures top-quality results' },
            { value: '4+', title: 'LOCATION', description: 'All of our clients are satisfied with our work and service' }
          ],
          itemFields: [
            { name: 'value', type: 'text', placeholder: 'e.g. 26+' },
            { name: 'title', type: 'text', placeholder: 'Title' },
            { name: 'description', type: 'tiptap', placeholder: 'Description' }
          ]
        }
      ]);
    case 'happySpaces':
      return renderGenericFields([
        { name: 'badgeText', type: 'text', defaultValue: 'STRAIGHT FROM THE NEWSROOM', placeholder: 'STRAIGHT FROM THE NEWSROOM' },
        { name: 'titleLine1', type: 'text', defaultValue: 'Happy Spaces by', placeholder: 'Happy Spaces by' },
        { name: 'titleLine2', type: 'text', defaultValue: 'subhAAkritee', placeholder: 'subhAAkritee' },
        { 
          name: 'items', type: 'array', defaultItem: { title: '', description: '', image: '', videoUrl: '' },
          defaultArray: [
            { title: 'Functional Design Trends That Blend Style And Comfort', description: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '', videoUrl: 'https://www.youtube.com/embed/62bIsvRcPv0' },
            { title: 'Functional Design Trends That Blend Style And Comfort', description: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '', videoUrl: 'https://www.youtube.com/embed/62bIsvRcPv0' },
            { title: 'Functional Design Trends That Blend Style And Comfort', description: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '', videoUrl: 'https://www.youtube.com/embed/62bIsvRcPv0' }
          ],
          itemFields: [
            { name: 'title', type: 'text', placeholder: 'Title' },
            { name: 'description', type: 'tiptap', placeholder: 'Description' },
            { name: 'image', type: 'image' },
            { name: 'videoUrl', type: 'text', placeholder: 'YouTube Embed URL' }
          ]
        }
      ]);
    case 'happyCustomers':
      return renderGenericFields([
        { name: 'title', type: 'text', defaultValue: 'OUR [HAPPY CUSTOMERS]', placeholder: 'OUR [HAPPY CUSTOMERS]' },
        {
          name: 'partners', type: 'array', defaultItem: { name: '', logo: '', heightClass: 'h-11 md:h-[44px]' },
          defaultArray: [
            { name: 'Aristo', logo: '', heightClass: 'h-11 md:h-[44px]' },
            { name: 'Spitze', logo: '', heightClass: 'h-12 md:h-[48px]' },
            { name: 'Faber', logo: '', heightClass: 'h-11 md:h-[44px]' },
            { name: 'Everyday', logo: '', heightClass: 'h-12 md:h-[48px]' },
            { name: 'Fevicol', logo: '', heightClass: 'h-[54px] md:h-[60px]' },
            { name: 'Urban Ladder', logo: '', heightClass: 'h-11 md:h-[44px]' }
          ],
          itemFields: [
            { name: 'name', type: 'text', placeholder: 'Brand name' },
            { name: 'logo', type: 'image' },
            { name: 'heightClass', type: 'text', placeholder: 'e.g. h-11 md:h-[44px]' }
          ]
        }
      ]);
    case 'testimonialsTwo':
      return renderGenericFields([
        { name: 'title', type: 'textarea', defaultValue: 'Here s What [Warm Words]\n[Our Clients] Say', placeholder: 'Title...' },
        { name: 'badgeText', type: 'text', defaultValue: 'OUR CLIENTS SAY', placeholder: 'OUR CLIENTS SAY' },
        { name: 'description', type: 'tiptap', defaultValue: 'Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces functional and stylish commercial interiors', placeholder: 'Description...' },
        { name: 'mainQuote', type: 'tiptap', defaultValue: 'I absolutely love my the new modern living room! The clean lines, a neutral tones, and minimalist interior create such a calming & stylish atmosphere. Highly recommend their modern interior design services!', placeholder: 'Main Quote...' },
        { name: 'authorName', type: 'text', defaultValue: 'Morgan Dufresne', placeholder: 'Author Name' },
        { name: 'authorRole', type: 'text', defaultValue: 'Company owner', placeholder: 'Author Role' },
        { name: 'image', type: 'image' },
        { name: 'authorImage', type: 'image' },
      ]);
    case 'ctaSectionTwo':
      return renderGenericFields([
        { name: 'title', type: 'textarea', defaultValue: 'Have A Project In [Mind?] Let s\n[Make] It Happen', placeholder: 'Title...' },
        { name: 'badgeText', type: 'text', defaultValue: 'GET IN TOUCH', placeholder: 'GET IN TOUCH' },
        { name: 'buttonText', type: 'text', defaultValue: 'BOOK A FREE CONSULTATION', placeholder: 'BOOK A FREE CONSULTATION' }
      ]);
    case 'richText':
      return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
          <div className="px-8 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-950/50 transition-colors duration-300">
            <Type className="w-5 h-5 text-zinc-700 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Rich Text Editor</h2>
          </div>
          <div className="p-8">
            <CollapsibleTiptap 
              value={data.content || ''} 
              onChange={(htmlValue) => updateBlockData(index, 'content', htmlValue)} 
            />
          </div>
        </div>
      );

    case 'contactForm':
      return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
          <div className="px-8 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-950/50 transition-colors duration-300">
            <Type className="w-5 h-5 text-zinc-700 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Contact Form Module</h2>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Target Form *</label>
              {loadingForms ? (
                <div className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700/50 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-500 dark:text-zinc-400 animate-pulse transition-colors">
                  Loading available forms from database...
                </div>
              ) : (
                <select
                  value={data.formId || ''}
                  onChange={(e) => updateBlockData(index, 'formId', e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-indigo-500/30 focus:border-zinc-900 dark:focus:border-indigo-500 transition-colors bg-zinc-50/50 dark:bg-zinc-950 dark:text-zinc-100 text-sm cursor-pointer"
                >
                  <option value="" disabled className="dark:bg-zinc-900">-- Select a Contact Form --</option>
                  {availableForms.map((form) => (
                    <option key={form.id} value={form.id} className="dark:bg-zinc-900">
                      {form.name} ({form.slug}) - {form.isActive ? 'Active' : 'Inactive'}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">
                Select the form you want to display. You can create new forms from the Contact Forms module.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Form Override Title</label>
                <input 
                  type="text" 
                  value={data.formTitle || ''} 
                  onChange={(e) => updateBlockData(index, 'formTitle', e.target.value)}
                  placeholder="e.g. Reach Out Today"
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-indigo-500/30 focus:border-zinc-900 dark:focus:border-indigo-500 transition-colors bg-zinc-50/50 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-600 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Submit Button Text</label>
                <input 
                  type="text" 
                  value={data.submitButtonText || ''} 
                  onChange={(e) => updateBlockData(index, 'submitButtonText', e.target.value)}
                  placeholder="e.g. Send Application"
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-indigo-500/30 focus:border-zinc-900 dark:focus:border-indigo-500 transition-colors bg-zinc-50/50 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-600 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Redirect Path *</label>
              <input 
                type="text" 
                value={data.redirectPath || ''} 
                onChange={(e) => updateBlockData(index, 'redirectPath', e.target.value)}
                placeholder="e.g. /thank-you"
                className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-indigo-500/30 focus:border-zinc-900 dark:focus:border-indigo-500 transition-colors bg-zinc-50/50 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-600 text-sm"
              />
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">
                Leave blank to stay on the same page. Must start with a forward slash (/).
              </p>
            </div>

          </div>
        </div>
      );
      case 'heading':
        return renderGenericFields([
          { name: 'content', type: 'tiptap', placeholder: 'Enter your section heading here...' }
        ]);
      
    case 'paragraph':
      return renderGenericFields([
        { name: 'content', type: 'tiptap', placeholder: 'Write your paragraph content...' }
      ]);

    case 'quote':
      return renderGenericFields([
        { name: 'content', type: 'tiptap', placeholder: 'Enter the quote text...' }
      ]);

    case 'image':
      return renderGenericFields([
        { name: 'url', type: 'image' },
        { name: 'caption', type: 'text', placeholder: 'Image caption (optional)' }
      ]);

    case 'video':
      return renderGenericFields([
        { name: 'platform', type: 'text', defaultValue: 'youtube', placeholder: 'youtube or vimeo' },
        { name: 'videoId', type: 'text', placeholder: 'e.g. ScMzIvxBSi4' }
      ]);

    case 'gallery':
      return renderGenericFields([
        { 
          name: 'images', 
          type: 'arrayString', 
          isImage: true, 
          defaultArray: [] 
        }
      ]);

    case 'divider':
      return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden p-6 text-center transition-colors duration-300">
          <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 my-4 transition-colors"></div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Line Divider (No settings required)</p>
        </div>
        );
        
    case 'serviceBanner':
      return renderGenericFields([
        { name: 'title', type: 'text', defaultValue: 'Residential Interior', placeholder: 'Title...' },
        { name: 'subTitle', type: 'text', defaultValue: 'Services', placeholder: 'Subtitle...' },
        { name: 'backgroundImage', type: 'image' }
      ]);

    case 'serviceDetails':
      return renderGenericFields([
        { name: 'aboutTitle', type: 'text', defaultValue: 'About The Service' },
        { name: 'aboutDescription', type: 'tiptap', defaultValue: 'Commercial interior design is constantly evolving...' },
        { name: 'typesTitle', type: 'text', defaultValue: 'Types Of Commercial Spaces' },
        { name: 'typesDescription', type: 'tiptap', defaultValue: 'In design, we bring characteristics...' },
        { name: 'elementsTitle', type: 'text', defaultValue: 'Key Elements Of Interior Design' },
        { name: 'elementsDescription', type: 'tiptap', defaultValue: 'Several key elements are essential...' },
        { name: 'footerDescription', type: 'tiptap', defaultValue: 'Commercial interior design is a dynamic...' },
        { name: 'sidebarImage', type: 'image' },
        { name: 'mainImage', type: 'image' },
        { name: 'midImage1', type: 'image' },
        { name: 'midImage2', type: 'image' },
        { 
          name: 'features', type: 'array', defaultItem: { title: '', description: '' },
          defaultArray: [{ title: "Space Optimization", description: "Through The Best Smart Space Optimisation." }],
          itemFields: [
            { name: 'title', type: 'text', placeholder: 'Feature Title' },
            { name: 'description', type: 'tiptap', placeholder: 'Feature Description' }
          ]
        },
        { 
          name: 'leftBullets', type: 'array', defaultItem: { text: '' },
          defaultArray: [{ text: "We provide high quality design services." }],
          itemFields: [{ name: 'text', type: 'text', placeholder: 'Bullet Text' }]
        },
        { 
          name: 'rightBullets', type: 'array', defaultItem: { text: '' },
          defaultArray: [{ text: "Flexible with any structure of the building" }],
          itemFields: [{ name: 'text', type: 'text', placeholder: 'Bullet Text' }]
        },
        { 
          name: 'faqs', type: 'array', defaultItem: { question: '' },
          defaultArray: [{ question: "What Interior Design Services Do You Offer?" }],
          itemFields: [{ name: 'question', type: 'text', placeholder: 'FAQ Question' }]
        }
      ]);

    case 'ctaSection':
      return renderGenericFields([
        { name: 'badgeText', type: 'text', defaultValue: 'GET IN TOUCH' },
        { name: 'title', type: 'textarea', defaultValue: 'Have A Project In [Mind? Let\'s]\n[Make] It Happen' },
        { name: 'buttonText', type: 'text', defaultValue: 'BOOK A FREE CONSULTATION' }
      ]);

    case 'contactBanner':
      return renderGenericFields([
        { name: 'title', type: 'text', defaultValue: 'Contact Us' },
        { name: 'breadcrumbText', type: 'text', defaultValue: 'Contact Us' },
        { name: 'backgroundImage', type: 'image' }
      ]);

    case 'contactInfo':
      return renderGenericFields([
        { name: 'badgeText', type: 'text', defaultValue: 'GET IN TOUCH' },
        { name: 'title', type: 'textarea', defaultValue: 'Have a Project In [Mind? Let\'s]\n[Make] It Happen.' },
        { name: 'addressTitle', type: 'text', defaultValue: 'Address:' },
        { name: 'addressText', type: 'textarea', defaultValue: 'Office: AG 40 , Sector II, Salt Lake\nCity, Kolkata: 700091' },
        { name: 'supportTitle', type: 'text', defaultValue: 'Support' },
        { name: 'supportPhone', type: 'text', defaultValue: '+91 9831-637-409' },
        { name: 'supportEmail', type: 'text', defaultValue: 'Subhaakritee@Hotmail.Com' },
        { name: 'mapIframeUrl', type: 'textarea', defaultValue: 'https://www.google.com/maps/embed?pb=...' },
        { name: 'workspaceImage', type: 'image' },
      ]);

    case 'aboutBanner':
      return renderGenericFields([
        { name: 'title', type: 'text', defaultValue: 'About Us' },
        { name: 'breadcrumbText', type: 'text', defaultValue: 'About Us' },
        { name: 'backgroundImage', type: 'image' }
      ]);

    case 'aboutExperience':
      return renderGenericFields([
        { name: 'badgeText', type: 'text', defaultValue: 'Started in 1989' },
        { name: 'title', type: 'textarea', defaultValue: 'We Shape [Interior Designs,]\n[Crafting Timeless] And Inspiring\nSpaces' },
        { name: 'yearsOfExperience', type: 'text', defaultValue: '26' },
        { name: 'experienceTitle', type: 'textarea', defaultValue: 'Years Of\nExperience' },
        { name: 'paragraph', type: 'tiptap', defaultValue: '<p>We believe that every space has the power to inspire...</p>' },
        { name: 'buttonText', type: 'text', defaultValue: 'Learn More' },
        { name: 'buttonLink', type: 'text', defaultValue: '#' },
        { name: 'image1', type: 'image' },
        { name: 'image2', type: 'image' }
      ]);

    case 'aboutProcess':
      return renderGenericFields([
        { name: 'backgroundImage', type: 'image' },
        { 
          name: 'steps', type: 'array', defaultItem: { number: '', title: '', desc: '' },
          defaultArray: [
            { number: '01', title: 'Concept Design', desc: 'Initial ideation and space planning.' }
          ],
          itemFields: [
            { name: 'number', type: 'text', placeholder: '01' },
            { name: 'title', type: 'text', placeholder: 'Step Title' },
            { name: 'desc', type: 'tiptap', placeholder: 'Step Description' }
          ]
        }
      ]);

    case 'timeline':
      return renderGenericFields([
        { name: 'badgeText', type: 'text', defaultValue: 'GET IN TOUCH' },
        { name: 'title', type: 'textarea', defaultValue: 'Our History [Is Full Of]\n[Interesting] Stages And\nEvents.' },
        { 
          name: 'items', type: 'array', defaultItem: { year: '', description: '', image: '' },
          defaultArray: [
            { year: '1990', description: 'A business house born out of passion for fish keeping.', image: '' }
          ],
          itemFields: [
            { name: 'year', type: 'text', placeholder: 'Year' },
            { name: 'description', type: 'tiptap', placeholder: 'Description' },
            { name: 'image', type: 'image' }
          ]
        }
      ]);

    case 'aboutAwards':
      return renderGenericFields([
        { name: 'badgeText', type: 'text', defaultValue: 'AWARD & ACHIEVEMENT' },
        { name: 'title', type: 'textarea', defaultValue: 'Design That [Speaks Our]\n[Industry] Awards' },
        { name: 'mainImage', type: 'image' },
        { 
          name: 'awards', type: 'array', defaultItem: { year: '', title: '' },
          defaultArray: [{ year: '2020', title: 'Residential Interior Design' }],
          itemFields: [
            { name: 'year', type: 'text', placeholder: 'Year' },
            { name: 'title', type: 'text', placeholder: 'Award Title' }
          ]
        }
      ]);

    case 'aboutGallery':
      return renderGenericFields([
        { name: 'badgeText', type: 'text', defaultValue: 'OUR GALLERY' },
        { name: 'title', type: 'textarea', defaultValue: 'Interior \n Design' },
        { name: 'description', type: 'tiptap', defaultValue: '<p>Lorem ipsum dolor sit amet consectetur...</p>' },
        { name: 'backgroundImage', type: 'image' },
        { 
          name: 'galleryItems', type: 'array', defaultItem: { title: '', image: '' },
          defaultArray: [{ title: 'Project 1', image: '' }],
          itemFields: [
            { name: 'title', type: 'text', placeholder: 'Project Title' },
            { name: 'image', type: 'image' }
          ]
        }
      ]);

    case 'projectsBanner':
      return renderGenericFields([
        { name: 'title', type: 'text', defaultValue: 'Projects' },
        { name: 'backgroundImage', type: 'image' }
      ]);

    default:
      return (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-xl text-yellow-800 dark:text-yellow-400 text-sm transition-colors duration-300">
          Unknown block type: {type}
        </div>
      );
  }
};

export default DynamicBlockEditor;
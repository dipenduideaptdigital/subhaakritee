import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { blogsApi } from '../../../api/blogs';
import apiClient from '../../../api/client';
import { resolveAssetUrl } from '../../../utils/assetResolver';
import { Save, ArrowLeft, Layout, Type, Plus, Trash2, Settings, ChevronDown, Upload, Calendar } from 'lucide-react';
import DynamicBlockEditor from '../../../components/admin/DynamicBlockEditor';
import Can from '../../../components/shared/Can';
import PreviewManager from '../../../components/admin/PreviewManager';
import MediaPickerModal from '../../../components/admin/MediaPickerModal';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const BLOG_BLOCKS = [
    { type: 'richText', label: 'Rich Text Paragraph' },
    { type: 'heading', label: 'Section Heading' },
    { type: 'quote', label: 'Blockquote (Figma Style)' },
    { type: 'image', label: 'Single Image' },
    { type: 'gallery', label: 'Image Grid (Use for 2-column layout)' },
    { type: 'video', label: 'Video Embed' },
    { type: 'divider', label: 'Line Divider' }
  ];

  // Added all Advanced SEO Engine Fields
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', status: 'DRAFT', publishedAt: '',
    categoryIds: [], tagIds: [], featuredImageId: null, content: { blocks: [] },
    isFeatured: false,
    metaTitle: '', metaDescription: '', metaKeywords: '',
    includeInSitemap: true, noIndex: false, noFollow: false, 
    canonicalUrl: '', ogTitle: '', ogDescription: '', ogImageId: null
  });

  useEffect(() => {
    fetchTaxonomies();
    if (isEditMode) fetchBlog();
  }, [id]);

  const fetchTaxonomies = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([blogsApi.getPublicCategories(), blogsApi.getPublicTags()]);
      setCategories(catRes.data || []);
      setTags(tagRes.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/admin/blogs/${id}`);
      const data = res.data.data;
      
      setFormData({
        ...data,
        categoryIds: data.categories.map(c => c.id),
        tagIds: data.tags.map(t => t.id),
        publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().slice(0, 16) : '',
        includeInSitemap: data.includeInSitemap ?? true,
        noIndex: data.noIndex ?? false,
        noFollow: data.noFollow ?? false,
      });

      if (data.featuredImage) {
        setCoverPreview(resolveAssetUrl(data.featuredImage.url));
      }
    } catch (err) { 
      alert('Failed to load blog.'); 
    } finally { 
      setLoading(false); 
    }
  };


  const addBlock = (type) => {
    const newBlock = { id: Date.now().toString(), type, data: {} };
    setFormData(prev => ({ ...prev, content: { blocks: [...(prev.content?.blocks || []), newBlock] } }));
    setShowBlockMenu(false);
  };

  const removeBlock = (index) => {
    const newBlocks = [...formData.content.blocks];
    newBlocks.splice(index, 1);
    setFormData(prev => ({ ...prev, content: { blocks: newBlocks } }));
  };

  const updateBlockData = (index, field, value) => {
    const newBlocks = [...formData.content.blocks];
    newBlocks[index].data[field] = value;
    setFormData(prev => ({ ...prev, content: { blocks: newBlocks } }));
  };

  const toggleArrayItem = (arrayName, id) => {
    setFormData(prev => {
      const arr = prev[arrayName];
      return { ...prev, [arrayName]: arr.includes(id) ? arr.filter(i => i !== id) : [...arr, id] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (payload.status === 'SCHEDULED' && !payload.publishedAt) return alert('Please set a publish date for scheduled posts.');
    if (payload.status !== 'SCHEDULED') delete payload.publishedAt;
    
    try {
      setSaving(true);
      if (isEditMode) await blogsApi.updateBlogPost(id, payload);
      else await blogsApi.createBlogPost(payload);
      navigate('/admin/blogs');
    } catch (err) { alert(err.response?.data?.message || 'Failed to save.'); } finally { setSaving(false); }
  };

  if (loading) return <div className="h-64 flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-zinc-900 dark:border-zinc-100"></div></div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20 font-sans transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors duration-300 gap-4 sm:gap-0">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Link to="/admin/blogs" className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5"/>
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 truncate">{isEditMode ? 'Edit Blog Post' : 'Draft New Article'}</h1>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          
          <Can permission="blog.preview">
            <PreviewManager id={isEditMode ? id : null} entityType="blog" />
          </Can>

          <select 
            value={formData.status} 
            onChange={e => setFormData(p => ({...p, status: e.target.value}))} 
            className="px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 transition-colors"
          >
            <option value="DRAFT">Draft</option>
            
            <Can permission="blog.publish">
              <option value="PUBLISHED">Published</option>
              <option value="SCHEDULED">Scheduled</option>
            </Can>
          </select>
          
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#3B82F6] dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-sm focus:ring-2 focus:ring-[#3B82F6]/20 disabled:opacity-70 flex-shrink-0">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4"/>}
            {saving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-5 transition-colors duration-300">
            <h2 className="text-lg font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Layout className="w-5 h-5 text-zinc-400 dark:text-zinc-500"/> Article Meta
            </h2>
            <div>
              <label className="block text-sm font-bold mb-1 text-zinc-800 dark:text-zinc-200">Article Title *</label>
              <input type="text" required value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))} className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-colors"/>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-zinc-800 dark:text-zinc-200">
                URL Slug <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal">(Leave blank to auto-generate)</span>
              </label>
              <input type="text" value={formData.slug || ''} onChange={e => setFormData(p => ({...p, slug: e.target.value}))} placeholder="my-awesome-post" className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 font-mono text-sm transition-colors"/>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-zinc-800 dark:text-zinc-200">Excerpt</label>
              <textarea rows="3" value={formData.excerpt || ''} onChange={e => setFormData(p => ({...p, excerpt: e.target.value}))} placeholder="A brief summary for blog listings..." className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 resize-y transition-colors"/>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-5 transition-colors duration-300">
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <Type className="w-5 h-5 text-zinc-400 dark:text-zinc-500"/> Content Builder
              </h2>
              <div className="relative">
                <button type="button" onClick={() => setShowBlockMenu(!showBlockMenu)} className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                  <Plus className="w-4 h-4"/> Add Block <ChevronDown className="w-4 h-4"/>
                </button>
                {showBlockMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl py-2 z-20 transition-colors">
                    <div className="px-3 py-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Available Blocks</div>
                    {BLOG_BLOCKS.map(b => (
                      <button key={b.type} type="button" onClick={() => addBlock(b.type)} className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors">
                        {b.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              {formData.content?.blocks?.length === 0 && (
                <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 transition-colors">
                  <Type className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No content blocks yet.</p>
                </div>
              )}
              {formData.content?.blocks?.map((block, idx) => (
                <div key={block.id || idx} className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors group">
                  <button type="button" onClick={() => removeBlock(idx)} className="absolute right-2 top-2 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                  <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700 rounded-t-xl text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center transition-colors">
                    <span className="bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 w-5 h-5 rounded flex items-center justify-center mr-2 transition-colors">{idx + 1}</span>
                    Block: {BLOG_BLOCKS.find(b => b.type === block.type)?.label || block.type}
                  </div>
                  <div className="p-0 relative">
                    <DynamicBlockEditor block={block} index={idx} updateBlockData={updateBlockData} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
            <h2 className="text-lg font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-4 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Upload className="w-5 h-5 text-zinc-400 dark:text-zinc-500"/> Cover Image
            </h2>
            <div 
              className="w-full h-40 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl flex items-center justify-center overflow-hidden relative cursor-pointer border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 transition-colors group" 
              onClick={() => setIsMediaModalOpen(true)}
            >
              {coverPreview ? (
                <img src={coverPreview} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"/>
              ) : (
                <span className="text-zinc-400 dark:text-zinc-500 font-bold flex flex-col items-center group-hover:text-blue-500 transition-colors">
                  <Upload className="w-6 h-6 mb-2"/> Select Cover
                </span>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
            <h2 className="text-lg font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-4 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Layout className="w-5 h-5 text-zinc-400 dark:text-zinc-500"/> Taxonomies
            </h2>
            <div className="mb-6">
              <label className="text-sm font-bold block mb-3 text-zinc-700 dark:text-zinc-300">Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <span 
                    key={c.id} 
                    onClick={() => toggleArrayItem('categoryIds', c.id)} 
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border transition-all ${
                      formData.categoryIds.includes(c.id) 
                        ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20 dark:bg-blue-600 dark:border-blue-600' 
                        : 'bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400'
                    }`}
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-bold block mb-3 text-zinc-700 dark:text-zinc-300">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map(t => (
                  <span 
                    key={t.id} 
                    onClick={() => toggleArrayItem('tagIds', t.id)} 
                    className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-all ${
                      formData.tagIds.includes(t.id) 
                        ? 'bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-800 dark:border-zinc-100 shadow-md' 
                        : 'bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                    }`}
                  >
                    #{t.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SEO ENGINE BLOCK */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-6 transition-colors duration-300">
            <h2 className="text-lg font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Settings className="w-5 h-5 text-zinc-400 dark:text-zinc-500"/> Advanced SEO
            </h2>
            
            {/* Standard SEO */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-800 dark:text-zinc-200">Meta Title</label>
                <input type="text" value={formData.metaTitle || ''} onChange={e => setFormData(p => ({...p, metaTitle: e.target.value}))} placeholder="Keep empty to use page title" className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 text-sm transition-colors"/>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-800 dark:text-zinc-200">Meta Description</label>
                <textarea rows="3" value={formData.metaDescription || ''} onChange={e => setFormData(p => ({...p, metaDescription: e.target.value}))} className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 text-sm resize-y transition-colors"/>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-800 dark:text-zinc-200">Meta Keywords</label>
                <input type="text" value={formData.metaKeywords || ''} onChange={e => setFormData(p => ({...p, metaKeywords: e.target.value}))} placeholder="interior, design, architecture" className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 text-sm transition-colors"/>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">Comma separated</p>
              </div>
            </div>

            {/* Crawler Rules */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4 transition-colors">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Crawler Instructions</h3>
              
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.includeInSitemap} onChange={e => setFormData(p => ({...p, includeInSitemap: e.target.checked}))} className="w-4 h-4 text-blue-500 dark:text-blue-400 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-blue-500"/>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">Include in Sitemap.xml</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.noIndex} onChange={e => setFormData(p => ({...p, noIndex: e.target.checked}))} className="w-4 h-4 text-red-500 dark:text-red-400 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-red-500"/>
                  <div>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium block">noIndex (Hide from Google)</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Search engines will drop this page from results.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.noFollow} onChange={e => setFormData(p => ({...p, noFollow: e.target.checked}))} className="w-4 h-4 text-amber-500 dark:text-amber-400 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-amber-500"/>
                  <div>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium block">noFollow (Ignore Links)</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Crawlers won't follow any links on this page.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Social Graph */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4 transition-colors">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Social Graph & Advanced</h3>
              
              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-800 dark:text-zinc-200">Canonical URL</label>
                <input type="url" value={formData.canonicalUrl || ''} onChange={e => setFormData(p => ({...p, canonicalUrl: e.target.value}))} placeholder="https://domain.com/original-source" className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 text-sm transition-colors"/>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">Use only if this content is copied from another URL.</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-800 dark:text-zinc-200">OG Title</label>
                <input type="text" value={formData.ogTitle || ''} onChange={e => setFormData(p => ({...p, ogTitle: e.target.value}))} placeholder="Facebook/Twitter Title" className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 text-sm transition-colors"/>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-800 dark:text-zinc-200">OG Description</label>
                <textarea rows="2" value={formData.ogDescription || ''} onChange={e => setFormData(p => ({...p, ogDescription: e.target.value}))} placeholder="Facebook/Twitter Description" className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 text-sm resize-y transition-colors"/>
              </div>
            </div>
          </div>

          {formData.status === 'SCHEDULED' && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
              <h2 className="text-lg font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-4 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <Calendar className="w-5 h-5 text-zinc-400 dark:text-zinc-500"/> Schedule
              </h2>
              <input type="datetime-local" value={formData.publishedAt} onChange={e => setFormData(p => ({...p, publishedAt: e.target.value}))} className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 text-sm transition-colors [color-scheme:light] dark:[color-scheme:dark]"/>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-start mt-8 pt-4">
        <button 
          type="submit" 
          disabled={saving} 
          className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 dark:shadow-none disabled:opacity-70 text-sm w-full sm:w-auto"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saving ? 'Saving...' : 'Save Post'}
        </button>
      </div>
      <MediaPickerModal 
        isOpen={isMediaModalOpen} 
        onClose={() => setIsMediaModalOpen(false)} 
        onSelect={(url, id) => {
          setCoverPreview(resolveAssetUrl(url));
          setFormData(prev => ({ ...prev, featuredImageId: id }));
        }} 
      />
    </form>
  );
};

export default BlogEditor;
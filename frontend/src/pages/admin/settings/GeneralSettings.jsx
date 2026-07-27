import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Save, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon, X, FolderOpen } from 'lucide-react';
import apiClient from '../../../api/client';
import MediaPickerModal from '../../../components/admin/MediaPickerModal';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  let baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
  const safePath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${safePath}`;
};

const GeneralSettings = () => {
  const [formData, setFormData] = useState({
    websiteName: 'Subhaakritee',
    supportEmail: 'support@subhaakritee.com',
    faviconImage: '',
    adminLoginLogo: '',
    errorPageImage: '',
    errorPageTitle: 'Page Not Found',
    errorPageDescription: "The page you are looking for doesn't exist or has been moved.",
    errorPageButtonText: 'Back to Home'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Media Library States
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [activeMediaField, setActiveMediaField] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/cms/section/global_general_settings');
      const content = res.data?.data?.content || res.data?.content;
      if (content && Object.keys(content).length > 0) {
        setFormData(prev => ({ ...prev, ...content }));
      }
    } catch (error) {
      console.error('Failed to load general settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await apiClient.put('/cms/section/global_general_settings', { content: formData });
      setMessage({ type: 'success', text: 'General settings updated successfully!' });
    } catch (error) {
      console.error('Failed to save general settings:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const openMediaPicker = (fieldName) => {
    setActiveMediaField(fieldName);
    setIsMediaModalOpen(true);
  };

  const handleMediaSelect = (url) => {
    if (activeMediaField) {
      setFormData(prev => ({ ...prev, [activeMediaField]: url }));
    }
    setIsMediaModalOpen(false);
    setActiveMediaField(null);
  };

  const removeImage = (fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: '' }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-zinc-900 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-500 text-zinc-900 font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-zinc-100">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-zinc-900" />
            General Settings
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage global configurations, branding, and fallback pages.
          </p>
        </div>

        <button 
          type="submit" 
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors shadow-sm focus:ring-2 focus:ring-zinc-900/20 flex-shrink-0 disabled:opacity-70 text-sm"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          {/* Website Identity */}
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-100 bg-zinc-50/50">
              <h2 className="text-sm font-bold text-zinc-900">Website Identity</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Website Name</label>
                <input
                  type="text"
                  name="websiteName"
                  value={formData.websiteName}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Support Email</label>
                <input
                  type="email"
                  name="supportEmail"
                  value={formData.supportEmail}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm font-medium"
                />
              </div>
              
              {/* Favicon Upload Section*/}
              <div className="pt-3 border-t border-zinc-100">
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Website Favicon (Browser Tab Icon)</label>
                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => openMediaPicker('faviconImage')}
                    className="w-20 h-20 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all shrink-0 group relative"
                  >
                    {formData.faviconImage ? (
                      <>
                        <img src={getAssetUrl(formData.faviconImage)} alt="Favicon" className="max-w-full max-h-full object-contain p-2" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <ImageIcon className="w-4 h-4 text-white" />
                        </div>
                      </>
                    ) : (
                      <ImageIcon className="w-6 h-6 text-zinc-400 group-hover:text-zinc-500 transition-colors" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      type="button"
                      onClick={() => openMediaPicker('faviconImage')}
                      className="px-4 py-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors w-max"
                    >
                      <FolderOpen className="w-3.5 h-3.5" /> Browse Media
                    </button>
                    {formData.faviconImage && (
                      <button 
                        type="button"
                        onClick={() => removeImage('faviconImage')}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors w-max"
                      >
                        <X className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Login Customization */}
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-100 bg-zinc-50/50">
              <h2 className="text-sm font-bold text-zinc-900">Admin Login Page</h2>
            </div>
            <div className="p-5">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Custom Login Logo</label>
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => openMediaPicker('adminLoginLogo')}
                  className="w-24 h-24 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all shrink-0 group relative"
                >
                  {formData.adminLoginLogo ? (
                    <>
                      <img src={getAssetUrl(formData.adminLoginLogo)} alt="Admin Logo" className="max-w-full max-h-full object-contain p-2" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ImageIcon className="w-5 h-5 text-white" />
                      </div>
                    </>
                  ) : (
                    <ImageIcon className="w-8 h-8 text-zinc-400 group-hover:text-zinc-500 transition-colors" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    type="button"
                    onClick={() => openMediaPicker('adminLoginLogo')}
                    className="px-4 py-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors w-max"
                  >
                    <FolderOpen className="w-3.5 h-3.5" /> Browse Media
                  </button>
                  {formData.adminLoginLogo && (
                    <button 
                      type="button"
                      onClick={() => removeImage('adminLoginLogo')}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors w-max"
                    >
                      <X className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                  <p className="text-[10px] text-zinc-400 leading-tight max-w-[200px] mt-1">
                    Appears on the login screen. Leave blank for default logo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 404 Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden h-fit">
          <div className="px-5 py-3 border-b border-zinc-100 bg-zinc-50/50">
            <h2 className="text-sm font-bold text-zinc-900">404 Error Page (Not Found)</h2>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Page Title</label>
                <input
                  type="text"
                  name="errorPageTitle"
                  value={formData.errorPageTitle}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Button Text</label>
                <input
                  type="text"
                  name="errorPageButtonText"
                  value={formData.errorPageButtonText}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                name="errorPageDescription"
                rows="2"
                value={formData.errorPageDescription}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm font-medium resize-none"
              ></textarea>
            </div>

            <div className="pt-2 border-t border-zinc-100">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">404 Graphic / Illustration</label>
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => openMediaPicker('errorPageImage')}
                  className="w-24 h-24 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all shrink-0 group relative"
                >
                  {formData.errorPageImage ? (
                    <>
                      <img src={getAssetUrl(formData.errorPageImage)} alt="404 Graphic" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ImageIcon className="w-5 h-5 text-white" />
                      </div>
                    </>
                  ) : (
                    <ImageIcon className="w-8 h-8 text-zinc-300 group-hover:text-zinc-400 transition-colors" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    type="button"
                    onClick={() => openMediaPicker('errorPageImage')}
                    className="px-4 py-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors w-max"
                  >
                    <FolderOpen className="w-3.5 h-3.5" /> Browse Media
                  </button>
                  {formData.errorPageImage && (
                    <button 
                      type="button"
                      onClick={() => removeImage('errorPageImage')}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors w-max"
                    >
                      <X className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Media Library Modal */}
      <MediaPickerModal 
        isOpen={isMediaModalOpen} 
        onClose={() => setIsMediaModalOpen(false)} 
        onSelect={handleMediaSelect} 
      />
      
    </form>
  );
};

export default GeneralSettings;
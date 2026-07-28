import React, { useState, useEffect } from 'react';
import { Layout, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import apiClient from '../../../api/client';

const CmsSettings = () => {
  const [cmsName, setCmsName] = useState('IDPL CMS');
  const [cmsTagline, setCmsTagline] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/cms/section/cms_settings');
      const content = res.data?.data?.content || res.data?.content;
      if (content) {
        if (content.cmsName) setCmsName(content.cmsName);
        if (content.cmsTagline) setCmsTagline(content.cmsTagline);
      }
    } catch (error) {
      console.error('Failed to load CMS settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const payload = {
        content: {
          cmsName: cmsName.trim() || 'IDPL CMS',
          cmsTagline: cmsTagline.trim(),
        },
      };
      await apiClient.put('/cms/section/cms_settings', payload);

      // Store in localStorage as instant cache for snappy page loads
      localStorage.setItem('idpl_cms_name', cmsName.trim() || 'IDPL CMS');
      localStorage.setItem('idpl_cms_tagline', cmsTagline.trim());

      // Dispatch event to update AdminLayout sidebar immediately
      window.dispatchEvent(
        new CustomEvent('cms_settings_updated', {
          detail: { cmsName: cmsName.trim() || 'IDPL CMS', cmsTagline: cmsTagline.trim() },
        })
      );

      setMessage({ type: 'success', text: 'CMS settings updated successfully!' });
    } catch (error) {
      console.error('Failed to save CMS settings:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Layout className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            CMS Branding Settings
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Customize the system title and branding displayed in the admin portal header and navigation.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors shadow-sm focus:ring-2 focus:ring-emerald-600/20 flex-shrink-0"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border transition-colors duration-300 ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
              : 'bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-400 border-red-200 dark:border-red-500/20'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">CMS Name & Branding</h2>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Sidebar Header</span>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                CMS Name
              </label>
              <input
                type="text"
                value={cmsName}
                onChange={(e) => setCmsName(e.target.value)}
                placeholder="e.g. IDPL CMS"
                className="block w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl leading-5 bg-white dark:bg-zinc-950 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 transition-colors sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                required
              />
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">
                This name is displayed at the top left of the admin navigation sidebar.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                CMS Tagline / Subtitle (Optional)
              </label>
              <input
                type="text"
                value={cmsTagline}
                onChange={(e) => setCmsTagline(e.target.value)}
                placeholder="e.g. Content Management System"
                className="block w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl leading-5 bg-white dark:bg-zinc-950 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 transition-colors sm:text-sm font-medium text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 flex flex-col justify-between transition-colors duration-300">
          <div>
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4">
              Live Sidebar Preview
            </h3>
            <div className="bg-blue-900 dark:bg-zinc-950 text-white dark:text-zinc-100 rounded-2xl p-6 shadow-xl border border-blue-800 dark:border-zinc-800 transition-colors duration-300">
              <div className="text-center py-4 border-b border-blue-800/50 dark:border-zinc-800">
                <div className="text-2xl font-sans font-extrabold tracking-wider uppercase text-white dark:text-zinc-100">
                  {cmsName.trim() || 'IDPL CMS'}
                </div>
                {cmsTagline.trim() && (
                  <div className="text-xs text-blue-200 dark:text-zinc-400 tracking-wide mt-1 font-medium">
                    {cmsTagline.trim()}
                  </div>
                )}
              </div>
              <div className="mt-4 px-3 py-2 bg-blue-950/40 dark:bg-zinc-900/50 rounded-xl text-xs text-blue-200 dark:text-zinc-400 border border-blue-800/40 dark:border-zinc-700 text-center font-medium transition-colors duration-300">
                Admin Sidebar Header Preview
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-zinc-400 dark:text-zinc-500 text-center">
            Changes will take effect instantly across all admin views upon saving.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsSettings;
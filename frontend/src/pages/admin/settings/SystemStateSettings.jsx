import React, { useState, useEffect } from 'react';
import { ShieldAlert, Save, Loader2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import apiClient from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ImageField from '../../../components/admin/ImageField';

const SystemStateSettings = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    state: 'ACTIVE',
    title: '',
    description: '',
    estimatedCompletion: '',
    supportEmail: '',
    supportPhone: '',
    version: 1,
    bypassToken: null,
    backgroundImage: '' 
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchState();
  }, []);

  const fetchState = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/system-state');
      const data = res.data.data;
      setFormData({
        ...data,
        estimatedCompletion: data.estimatedCompletion ? new Date(data.estimatedCompletion).toISOString().slice(0, 16) : '',
        backgroundImage: data.backgroundImage || ''
      });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load system state.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStateToggle = (newState) => {
    setFormData(prev => ({ ...prev, state: newState }));
  };

  const handlePreviewClick = () => {
    const link = `${window.location.origin}/?maintenance_bypass=${formData.bypassToken}`;
    window.open(link, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const payload = { ...formData };
      if (!payload.estimatedCompletion) payload.estimatedCompletion = null;
      else payload.estimatedCompletion = new Date(payload.estimatedCompletion).toISOString();

      delete payload.enabledBy;
      delete payload.enabledAt;
      delete payload.disabledAt;
      delete payload.reason;

      const res = await apiClient.put('/admin/system-state', payload);
      setFormData(prev => ({ 
        ...res.data.data, 
        estimatedCompletion: res.data.data.estimatedCompletion ? new Date(res.data.data.estimatedCompletion).toISOString().slice(0, 16) : '',
        backgroundImage: res.data.data.backgroundImage || ''
      }));
      setMessage({ type: 'success', text: `System state updated to ${res.data.data.state} successfully!` });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update system state. Conflict may have occurred.' });
    } finally {
      setSaving(false);
    }
  };

  // Strict RBAC: Only Super Admin
  if (user?.systemRole?.slug !== 'SUPER_ADMIN') {
    return <Navigate to="/admin/dashboard" />;
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-zinc-500 dark:text-zinc-400 w-8 h-8" /></div>;

  const isMaintenance = formData.state !== 'ACTIVE';

  return (
    <div className="max-w-4xl space-y-6 font-sans transition-colors duration-300">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex justify-between items-center transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <ShieldAlert className="w-6 h-6 text-red-500" /> System State Engine
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Control public access to the website during major updates.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors duration-300 ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-500/20'}`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
        
        {/* Toggle & Preview on the same line */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300">
          
          {/* Left Side: Label & Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex bg-zinc-200/60 dark:bg-zinc-950 p-1.5 rounded-xl w-full sm:w-auto shadow-inner transition-colors duration-300">
              <button
                type="button"
                onClick={() => handleStateToggle('ACTIVE')}
                className={`flex-1 sm:px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                  !isMaintenance 
                    ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                ACTIVE
              </button>
              <button
                type="button"
                onClick={() => handleStateToggle('MAINTENANCE')}
                className={`flex-1 sm:px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                  isMaintenance 
                    ? 'bg-red-600 text-white shadow-md ring-1 ring-red-500' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                MAINTENANCE
              </button>
            </div>
          </div>

          {/* Right Side: Preview Button */}
          {isMaintenance && formData.bypassToken && (
            <button 
              type="button" 
              onClick={handlePreviewClick}
              className="px-5 py-2.5 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
            >
              <ExternalLink className="w-4 h-4" /> Preview Live Site
            </button>
          )}
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Maintenance Page Background</label>
            <ImageField 
              value={formData.backgroundImage} 
              onChange={(val) => setFormData({ ...formData, backgroundImage: val })} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Page Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-500 focus:ring-1 focus:ring-zinc-900/10 dark:focus:ring-zinc-500/20 text-sm transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Est. Completion Time (Optional)</label>
              <input type="datetime-local" name="estimatedCompletion" value={formData.estimatedCompletion} onChange={handleChange} className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-500 focus:ring-1 focus:ring-zinc-900/10 dark:focus:ring-zinc-500/20 text-sm transition-colors [color-scheme:light] dark:[color-scheme:dark]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Description</label>
            <textarea rows="3" name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-500 focus:ring-1 focus:ring-zinc-900/10 dark:focus:ring-zinc-500/20 text-sm resize-none transition-colors"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Support Email</label>
              <input type="email" name="supportEmail" value={formData.supportEmail} onChange={handleChange} className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-500 focus:ring-1 focus:ring-zinc-900/10 dark:focus:ring-zinc-500/20 text-sm transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Support Phone</label>
              <input type="text" name="supportPhone" value={formData.supportPhone} onChange={handleChange} className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-500 focus:ring-1 focus:ring-zinc-900/10 dark:focus:ring-zinc-500/20 text-sm transition-colors" />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex justify-start transition-colors duration-300">
          <button type="submit" disabled={saving} className="w-full sm:w-auto px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-white disabled:opacity-70 transition-all shadow-sm">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save State & Execute
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemStateSettings;
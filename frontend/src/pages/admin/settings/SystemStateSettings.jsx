import React, { useState, useEffect } from 'react';
import { ShieldAlert, Save, Loader2, AlertCircle, CheckCircle, Copy, Link as LinkIcon } from 'lucide-react';
import apiClient from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const SystemStateSettings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    state: 'ACTIVE',
    title: '',
    description: '',
    estimatedCompletion: '',
    supportEmail: '',
    supportPhone: '',
    reason: '',
    version: 1,
    bypassToken: null
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
        reason: '' // Clear reason as it's required for audit per update
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (!formData.reason || formData.reason.length < 5) {
      setMessage({ type: 'error', text: 'An administrative reason (min 5 chars) is required for the audit log.' });
      setSaving(false);
      return;
    }

    try {
      const payload = { ...formData };
      if (!payload.estimatedCompletion) payload.estimatedCompletion = null;
      else payload.estimatedCompletion = new Date(payload.estimatedCompletion).toISOString();

      delete payload.enabledBy;
      delete payload.enabledAt;
      delete payload.disabledAt;

      const res = await apiClient.put('/admin/system-state', payload);
      setFormData(prev => ({ 
        ...res.data.data, 
        estimatedCompletion: res.data.data.estimatedCompletion ? new Date(res.data.data.estimatedCompletion).toISOString().slice(0, 16) : '',
        reason: '' 
      }));
      setMessage({ type: 'success', text: `System state updated to ${res.data.data.state} successfully!` });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update system state. Conflict may have occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const copyBypassLink = () => {
    const link = `${window.location.origin}/?maintenance_bypass=${formData.bypassToken}`;
    navigator.clipboard.writeText(link);
    alert('Bypass link copied to clipboard!');
  };

  // Strict RBAC: Only Super Admin
  if (user?.systemRole?.slug !== 'SUPER_ADMIN') {
    return <Navigate to="/admin/dashboard" />;
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-zinc-500 w-8 h-8" /></div>;

  const isMaintenance = formData.state !== 'ACTIVE';

  return (
    <div className="max-w-4xl space-y-6 font-sans">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900">
            <ShieldAlert className="w-6 h-6 text-red-500" /> System State Engine
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Control public access to the website during major updates.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
          <label className="block text-sm font-bold text-zinc-900 mb-2">Target System State</label>
          <select 
            name="state" 
            value={formData.state} 
            onChange={handleChange}
            className={`block w-full px-4 py-3 border rounded-xl font-bold focus:outline-none transition-colors ${isMaintenance ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}
          >
            <option value="ACTIVE">ACTIVE (Publicly Accessible)</option>
            <option value="MAINTENANCE">MAINTENANCE (503 Service Unavailable)</option>
          </select>
        </div>

        {isMaintenance && formData.bypassToken && (
          <div className="p-6 border-b border-zinc-100 bg-blue-50/50">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 mb-2">
              <LinkIcon className="w-4 h-4 text-blue-500" /> Stakeholder Bypass Link
            </h3>
            <p className="text-xs text-zinc-500 mb-3">Use this secure link to view the live website while maintenance is active.</p>
            <div className="flex items-center gap-2">
              <input type="text" readOnly value={`${window.location.origin}/?maintenance_bypass=${formData.bypassToken}`} className="w-full px-4 py-2 border border-zinc-200 rounded-lg text-sm bg-white font-mono text-zinc-600 outline-none" />
              <button type="button" onClick={copyBypassLink} className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Copy className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Page Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl bg-white focus:border-zinc-900 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Est. Completion Time (Optional)</label>
              <input type="datetime-local" name="estimatedCompletion" value={formData.estimatedCompletion} onChange={handleChange} className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl bg-white focus:border-zinc-900 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Description</label>
            <textarea rows="3" name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl bg-white focus:border-zinc-900 text-sm resize-none"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Support Email</label>
              <input type="email" name="supportEmail" value={formData.supportEmail} onChange={handleChange} className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl bg-white focus:border-zinc-900 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Support Phone</label>
              <input type="text" name="supportPhone" value={formData.supportPhone} onChange={handleChange} className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl bg-white focus:border-zinc-900 text-sm" />
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-5 mt-5">
            <label className="block text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Administrative Reason (Required for Audit Log) *</label>
            <input type="text" required name="reason" value={formData.reason} onChange={handleChange} placeholder="e.g. Migrating database to new cluster" className="w-full px-4 py-2.5 border border-red-200 rounded-xl bg-red-50/30 focus:border-red-500 focus:outline-none text-sm" />
          </div>
        </div>

        <div className="p-6 border-t border-zinc-100 bg-zinc-50">
          <button type="submit" disabled={saving} className="w-full sm:w-auto px-8 py-3 bg-zinc-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 disabled:opacity-70 transition-all">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save State & Execute
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemStateSettings;
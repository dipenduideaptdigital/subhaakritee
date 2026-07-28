import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { contactFormsApi } from '../../../api/contactForms';
import { Can } from '../../../components/shared/Can';
import { Save, ArrowLeft, AlertCircle, Settings, Mail, Link as LinkIcon, Plus, X, Loader2 } from 'lucide-react';

const ContactFormEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    successMessage: 'Thank you! Your submission has been successfully processed.',
    redirectUrl: '',
    isActive: true,
    notifyEmails: []
  });

  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    if (isEditMode) fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const res = await contactFormsApi.getFormById(id);
      setFormData({
        name: res.data.name || '',
        slug: res.data.slug || '',
        successMessage: res.data.successMessage || '',
        redirectUrl: res.data.redirectUrl || '',
        isActive: res.data.isActive,
        notifyEmails: res.data.notifyEmails || []
      });
    } catch (err) {
      setError('Failed to load form data.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addEmail = () => {
    if (emailInput && emailInput.includes('@') && !formData.notifyEmails.includes(emailInput)) {
      setFormData(prev => ({ ...prev, notifyEmails: [...prev.notifyEmails, emailInput] }));
      setEmailInput('');
    }
  };

  const removeEmail = (email) => {
    setFormData(prev => ({ ...prev, notifyEmails: prev.notifyEmails.filter(e => e !== email) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      if (isEditMode) {
        await contactFormsApi.updateForm(id, formData);
      } else {
        await contactFormsApi.createForm(formData);
      }
      navigate('/admin/contact-forms');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save form. Check inputs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-zinc-900 dark:text-zinc-100 w-8 h-8" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500 pb-20 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <Link to="/admin/contact-forms" className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{isEditMode ? 'Edit Contact Form' : 'Create Contact Form'}</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Configure your lead generation engine.</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="sr-only" />
              <div className={`block w-10 h-6 rounded-full transition-colors duration-300 ${formData.isActive ? 'bg-emerald-500 dark:bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${formData.isActive ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <div className="ml-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">{formData.isActive ? 'Active' : 'Disabled'}</div>
          </label>
          <Can permission={isEditMode ? 'contact_form.edit' : 'contact_form.create'}>
            <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-sm disabled:opacity-70 text-sm shrink-0">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {saving ? 'Saving...' : 'Save Form'}
            </button>
          </Can>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 transition-colors duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Details */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-5 transition-colors duration-300">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3 uppercase tracking-wider">
            <Settings className="w-5 h-5 text-zinc-400 dark:text-zinc-500" /> General Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Form Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="e.g. Sales Inquiry" className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">System Slug <span className="text-[10px] text-zinc-400 dark:text-zinc-500 lowercase normal-case">(Auto-generated if blank)</span></label>
              <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} placeholder="sales-inquiry" className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors font-mono text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Success Message</label>
              <textarea name="successMessage" rows="3" value={formData.successMessage} onChange={handleInputChange} placeholder="Message shown after submission..." className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors resize-y text-sm"></textarea>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><LinkIcon className="w-4 h-4"/> Success Redirect URL (Optional)</label>
              <input type="text" name="redirectUrl" value={formData.redirectUrl} onChange={handleInputChange} placeholder="e.g. /thank-you" className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm" />
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1.5">If provided, users will be redirected here instead of seeing the success message.</p>
            </div>
          </div>
        </div>

        {/* Email Routing */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-5 transition-colors duration-300">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3 uppercase tracking-wider">
            <Mail className="w-5 h-5 text-zinc-400 dark:text-zinc-500" /> Email Routing
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Whenever someone fills this specific form, notification emails will be sent to the addresses below.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                value={emailInput} 
                onChange={(e) => setEmailInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEmail())}
                placeholder="e.g. sales@company.com" 
                className="flex-1 px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm" 
              />
              <button type="button" onClick={addEmail} className="px-4 py-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-transparent dark:border-blue-500/20 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-500/20 flex items-center gap-1.5 transition-colors text-sm shrink-0">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.notifyEmails.length === 0 && <span className="text-xs text-zinc-400 dark:text-zinc-500 italic">No specific emails set. Will use system default.</span>}
              {formData.notifyEmails.map((email, i) => (
                <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700 transition-colors">
                  {email}
                  <button type="button" onClick={() => removeEmail(email)} className="text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ContactFormEditor;
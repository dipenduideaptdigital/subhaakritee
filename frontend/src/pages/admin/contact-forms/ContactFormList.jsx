import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contactFormsApi } from '../../../api/contactForms';
import { Can } from '../../../components/shared/Can';
import { Inbox, Plus, Edit3, Trash2, AlertCircle, Search, Loader2 } from 'lucide-react';

const ContactFormList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const data = await contactFormsApi.getForms();
      setForms(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch forms:', err);
      setError('Failed to load contact forms.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;
    try {
      setIsDeleting(id);
      await contactFormsApi.deleteForm(id);
      setForms(forms.filter(f => f.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete form. It might be in use.');
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredForms = forms.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin text-zinc-500 dark:text-zinc-400 w-8 h-8 mb-3" />
        <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Loading forms...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Inbox className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
            Contact Forms
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Create and manage your dynamic lead capture forms.</p>
        </div>
        <Can permission="contact_form.create">
          <Link 
            to="/admin/contact-forms/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-sm focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20 text-sm shrink-0"
          >
            <Plus className="w-4 h-4" /> Create Form
          </Link>
        </Can>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 transition-colors duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 transition-colors duration-300">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Form Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Submissions</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800 transition-colors duration-300">
              {filteredForms.length > 0 ? filteredForms.map((form) => (
                <tr key={form.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{form.name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded inline-block mt-1 transition-colors">/{form.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    {form.isActive ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 transition-colors">Active</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors">Disabled</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-500/20 transition-colors">
                      {form._count?.submissions || 0} Leads
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100">
                      
                      <Can permission="contact_form.edit">
                        <Link to={`/admin/contact-forms/edit/${form.id}`} className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </Link>
                      </Can>

                      <Can permission="contact_form.delete">
                        <button onClick={() => handleDelete(form.id)} disabled={isDeleting === form.id} className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50">
                          {isDeleting === form.id ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </Can>

                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400 font-medium text-sm">No forms found. Create one to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactFormList;
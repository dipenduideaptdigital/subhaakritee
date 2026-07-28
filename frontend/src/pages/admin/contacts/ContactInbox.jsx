import React, { useState, useEffect } from 'react';
import { contactsApi } from '../../../api/contacts';
import { 
  Mail, Search, Phone, Clock, CheckCircle, Trash2, ShieldAlert, X, 
  MessageSquare, User, Calendar, Loader2, ArrowRight
} from 'lucide-react';
import { Can } from '../../../components/shared/Can';

const TABS = [
  { id: 'NEW', label: 'New Leads' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'RESOLVED', label: 'Resolved' },
  { id: 'SPAM', label: 'Spam' }
];

const ContactInbox = () => {
  const [activeTab, setActiveTab] = useState('NEW');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [selectedLead, setSelectedLead] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [activeTab, searchTerm]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await contactsApi.getSubmissions({ status: activeTab, search: searchTerm, limit: 15 });
      setSubmissions(data.data || []);
      setMeta(data.meta);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLead = async (id) => {
    try {
      const res = await contactsApi.getSubmissionDetails(id);
      setSelectedLead(res.data);
      setSubmissions(subs => subs.map(s => s.id === id ? { ...s, isViewed: true } : s));
    } catch (err) {
      alert("Failed to load details");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await contactsApi.updateStatus(selectedLead.id, newStatus, "Status updated via admin panel.");
      setSelectedLead(null);
      fetchSubmissions();
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Permanently delete/anonymize this data?")) return;
    try {
      await contactsApi.deleteSubmission(id);
      setSelectedLead(null);
      fetchSubmissions();
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if(!noteText) return;
    try {
      setUpdating(true);
      await contactsApi.addInternalNote(selectedLead.id, noteText);
      setNoteText('');
      // Reload specific lead to get new notes
      const res = await contactsApi.getSubmissionDetails(selectedLead.id);
      setSelectedLead(res.data);
    } catch (err) {
      alert("Failed to add note");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans space-y-8 animate-in fade-in duration-500 transition-colors duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <Mail className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
            Lead Inbox
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Manage customer inquiries and contact forms.
          </p>
        </div>
      </div>

      {/* Main Panel — two-column inbox layout */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row h-[720px] overflow-hidden transition-colors duration-300">

        {/* Left Sidebar — list */}
        <div className="w-full md:w-[300px] flex-shrink-0 border-r border-zinc-100 dark:border-zinc-800 flex flex-col bg-zinc-50/30 dark:bg-zinc-950/30 transition-colors duration-300">

          {/* Tabs */}
          <div className="flex border-b border-zinc-100 dark:border-zinc-800 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-xs font-semibold whitespace-nowrap px-3 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800/50'
                    : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
            <div className="relative border border-zinc-200 dark:border-zinc-700 focus-within:border-zinc-900 dark:focus-within:border-zinc-400 rounded-xl transition-colors bg-white dark:bg-zinc-950 overflow-hidden">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search name or email…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 outline-none text-sm bg-transparent placeholder-zinc-400 dark:placeholder-zinc-500 transition-colors text-zinc-900 dark:text-zinc-100 font-medium"
              />
            </div>
          </div>

          {/* Submissions list */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/50 transition-colors duration-300">
            {loading ? (
              <div className="p-10 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-400 dark:text-zinc-500" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-10 text-center italic text-zinc-500 dark:text-zinc-400 text-sm">
                No leads in this folder.
              </div>
            ) : (
              submissions.map(sub => (
                <div
                  key={sub.id}
                  onClick={() => handleOpenLead(sub.id)}
                  className={`p-4 cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors relative border-l-4 ${
                    selectedLead?.id === sub.id 
                      ? 'bg-zinc-50/80 dark:bg-zinc-800/80 border-zinc-950 dark:border-zinc-100' 
                      : 'border-transparent'
                  }`}
                >
                  {/* Unread indicator */}
                  {!sub.isViewed && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 shadow-sm" />
                  )}
                  <h4 className={`text-sm ${sub.isViewed ? 'font-semibold text-zinc-500 dark:text-zinc-400' : 'font-bold text-zinc-900 dark:text-zinc-100'}`}>
                    {sub.name}
                  </h4>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 truncate">{sub.email}</p>
                  <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 mt-2 uppercase tracking-wider">
                    {new Date(sub.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right panel — detail viewer */}
        <div className="flex-1 bg-white dark:bg-zinc-900 flex flex-col min-w-0 transition-colors duration-300">
          {selectedLead ? (
            <div className="flex-1 overflow-y-auto flex flex-col">

              {/* Sticky toolbar */}
              <div className="sticky top-0 z-10 px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 backdrop-blur-sm flex items-center justify-between gap-4 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Status</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updating}
                    className="block w-max pl-3 pr-8 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-xl leading-5 bg-white dark:bg-zinc-950 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-zinc-900 dark:text-zinc-100 disabled:opacity-60"
                  >
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="SPAM">Spam</option>
                  </select>
                </div>

                <Can permission="contact.delete">
                  <button
                    onClick={() => handleDelete(selectedLead.id)}
                    className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </Can>
              </div>

              {/* Lead details */}
              <div className="p-6 md:p-8 flex-1">

                {/* Name & contact row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
                  <div>
                    <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">{selectedLead.name}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-1.5 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
                        <Mail className="w-3.5 h-3.5" /> {selectedLead.email}
                      </a>
                      {selectedLead.phone && (
                        <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-1.5 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
                          <Phone className="w-3.5 h-3.5" /> {selectedLead.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">Received on</span>
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {new Date(selectedLead.createdAt).toLocaleString(undefined, { 
                        year: 'numeric', month: 'short', day: 'numeric', 
                        hour: '2-digit', minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>

                {/* Message body */}
                <div className="border border-zinc-200 dark:border-zinc-700/50 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/30 p-5 mb-8 shadow-inner transition-colors duration-300">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">Message</h3>
                  <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
                    {selectedLead.message}
                  </p>
                </div>

                {/* Internal Notes */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2 transition-colors duration-300">
                    <MessageSquare className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                    Internal Notes
                  </h3>

                  {selectedLead.internalNotes?.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {selectedLead.internalNotes.map(note => (
                        <div key={note.id} className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-1 transition-colors duration-300">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                              {note.author?.name || 'Admin'}
                            </span>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">
                              {new Date(note.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300 pt-1">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm italic text-zinc-500 dark:text-zinc-400 mb-4">No internal notes yet.</p>
                  )}

                  <Can permission="contact.edit">
                    <form onSubmit={handleAddNote} className="flex gap-2">
                      <div className="flex-grow border border-zinc-200 dark:border-zinc-700 focus-within:border-zinc-900 dark:focus-within:border-blue-500 rounded-xl transition-colors bg-white dark:bg-zinc-950 overflow-hidden">
                        <input
                          type="text"
                          value={noteText}
                          onChange={e => setNoteText(e.target.value)}
                          placeholder="Add a note for the team…"
                          className="block w-full px-4 py-2.5 outline-none text-sm bg-transparent placeholder-zinc-400 dark:placeholder-zinc-500 transition-colors text-zinc-900 dark:text-zinc-100 font-medium"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={updating || !noteText}
                        className="inline-flex items-center justify-center p-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-sm focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20 disabled:opacity-50 flex-shrink-0 cursor-pointer"
                      >
                        {updating
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <ArrowRight className="w-4 h-4" />
                        }
                      </button>
                    </form>
                  </Can>
                </div>

              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-zinc-50/10 dark:bg-zinc-950/50 transition-colors duration-300">
              <Mail className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">Select a Lead</h3>
              <p className="text-sm italic text-zinc-500 dark:text-zinc-400">
                Choose a contact submission from the list to view details.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ContactInbox;
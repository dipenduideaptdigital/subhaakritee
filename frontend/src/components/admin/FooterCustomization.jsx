import React from 'react';
import { Settings, Plus, Trash2, Mail, Phone, MapPin, Globe } from 'lucide-react';

const FooterCustomization = ({
  footerData,
  onChange,
  onLinkChange,
  onAddLink,
  onDeleteLink
}) => {
  return (
    <div className="space-y-8 font-sans text-left transition-colors duration-300">
      {/* General Settings Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
        <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
          <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400 transition-colors" />
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 transition-colors">Footer Identity & Socials</h2>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">About / Description</label>
              <textarea
                name="description"
                value={footerData.description || ''}
                onChange={onChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm resize-y"
                placeholder="Enter general about text shown in the footer..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Copyright Text</label>
              <input
                type="text"
                name="copyrightText"
                value={footerData.copyrightText || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Instagram Link</label>
              <input
                type="text"
                name="instagram"
                value={footerData.instagram || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Twitter Link</label>
              <input
                type="text"
                name="twitter"
                value={footerData.twitter || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Facebook Link</label>
              <input
                type="text"
                name="facebook"
                value={footerData.facebook || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">LinkedIn Link</label>
              <input
                type="text"
                name="linkedin"
                value={footerData.linkedin || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address & Contacts */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
        <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
          <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400 transition-colors" />
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 transition-colors">Address &amp; Contacts</h2>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Address Info</label>
              <textarea
                name="address"
                value={footerData.address || ''}
                onChange={onChange}
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5 transition-colors">
                <Phone className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> Main Phone
              </label>
              <input
                type="text"
                name="phone"
                value={footerData.phone || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5 transition-colors">
                <Phone className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> Mobile / Secondary Phone
              </label>
              <input
                type="text"
                name="phone2"
                value={footerData.phone2 || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5 transition-colors">
                <Mail className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> Primary Email
              </label>
              <input
                type="email"
                name="email"
                value={footerData.email || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5 transition-colors">
                <Mail className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> Secondary Email
              </label>
              <input
                type="email"
                name="email2"
                value={footerData.email2 || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Link Columns Customization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1 Links */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
          <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex justify-between items-center transition-colors duration-300">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-colors" />
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 transition-colors">Links Column 1</h2>
            </div>
            <button
              type="button"
              onClick={() => onAddLink('links1')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white transition-colors cursor-pointer shadow-sm focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
            >
              <Plus className="w-3.5 h-3.5" /> Add Link
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Column Title</label>
              <input
                type="text"
                name="linksTitle1"
                value={footerData.linksTitle1 || ''}
                onChange={onChange}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {(footerData.links1 || []).map((link, idx) => (
                <div key={idx} className="flex gap-3 items-center p-4 bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/50 rounded-xl transition-colors duration-300">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Label"
                      value={link.label || ''}
                      onChange={(e) => onLinkChange('links1', idx, 'label', e.target.value)}
                      className="px-3 py-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-xs font-medium"
                    />
                    <input
                      type="text"
                      placeholder="URL"
                      value={link.url || ''}
                      onChange={(e) => onLinkChange('links1', idx, 'url', e.target.value)}
                      className="px-3 py-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-xs font-medium"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteLink('links1', idx)}
                    className="p-2.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(footerData.links1 || []).length === 0 && (
                <p className="text-zinc-400 dark:text-zinc-500 text-xs italic text-center py-4 transition-colors">No links added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Column 2 Links */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
          <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex justify-between items-center transition-colors duration-300">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-colors" />
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 transition-colors">Links Column 2</h2>
            </div>
            <button
              type="button"
              onClick={() => onAddLink('links2')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white transition-colors cursor-pointer shadow-sm focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
            >
              <Plus className="w-3.5 h-3.5" /> Add Link
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Column Title</label>
              <input
                type="text"
                name="linksTitle2"
                value={footerData.linksTitle2 || ''}
                onChange={onChange}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {(footerData.links2 || []).map((link, idx) => (
                <div key={idx} className="flex gap-3 items-center p-4 bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/50 rounded-xl transition-colors duration-300">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Label"
                      value={link.label || ''}
                      onChange={(e) => onLinkChange('links2', idx, 'label', e.target.value)}
                      className="px-3 py-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-xs font-medium"
                    />
                    <input
                      type="text"
                      placeholder="URL"
                      value={link.url || ''}
                      onChange={(e) => onLinkChange('links2', idx, 'url', e.target.value)}
                      className="px-3 py-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-xs font-medium"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteLink('links2', idx)}
                    className="p-2.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(footerData.links2 || []).length === 0 && (
                <p className="text-zinc-400 dark:text-zinc-500 text-xs italic text-center py-4 transition-colors">No links added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterCustomization;
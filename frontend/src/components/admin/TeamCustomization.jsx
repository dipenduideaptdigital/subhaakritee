import React, { useState } from 'react';
import { User, Image as ImageIcon } from 'lucide-react';
import { resolveAssetUrl } from '../../utils/assetResolver';
import MediaPickerModal from './MediaPickerModal';

const TeamCustomization = ({
  teamData,
  onChange,
  onMemberChange
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(null);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
      <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
        <User className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">Team Section</h2>
      </div>

      <div className="p-8">
        <div className="space-y-6 max-w-3xl mb-10">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-4">Text Content</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Badge Text</label>
              <input 
                type="text" 
                name="badgeText"
                value={teamData.badgeText || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/20 focus:bg-white dark:focus:bg-zinc-900 transition-colors duration-300 placeholder-zinc-400 dark:placeholder-zinc-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Section Title</label>
              <input 
                type="text" 
                name="title"
                value={teamData.title || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/20 focus:bg-white dark:focus:bg-zinc-900 transition-colors duration-300 placeholder-zinc-400 dark:placeholder-zinc-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Description</label>
            <textarea 
              name="description"
              value={teamData.description || ''}
              onChange={onChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/20 focus:bg-white dark:focus:bg-zinc-900 transition-colors duration-300 resize-none placeholder-zinc-400 dark:placeholder-zinc-600"
            />
          </div>
        </div>

        {/* Team Members List */}
        <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-6">Team Members & Photos (5 Items)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(teamData.members || []).map((member, index) => (
              <div key={index} className="p-6 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/60 rounded-2xl space-y-4 shadow-sm dark:shadow-none hover:border-zinc-300 dark:hover:border-zinc-500 transition-colors duration-300">
                
                <div className="flex justify-between items-center mb-2">
                  {/* Subtle Blue/Purple premium badge for dark mode */}
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 text-xs font-bold transition-colors duration-300">
                    {member.id || `0${index + 1}`}
                  </span>
                </div>

                {/* Member Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Name</label>
                    <input 
                      type="text" 
                      value={member.name || ''}
                      onChange={(e) => onMemberChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/30 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Role</label>
                    <input 
                      type="text" 
                      value={member.role || ''}
                      onChange={(e) => onMemberChange(index, 'role', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/30 text-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-700/60 mt-3 transition-colors duration-300">
                   <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Member Photo</label>
                   <div className="flex items-center gap-4">
                     {member.image ? (
                        <img src={resolveAssetUrl(member.image)} alt="Member Preview" className="w-16 h-16 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shadow-sm" />
                     ) : (
                        <div className="w-16 h-16 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 transition-colors">
                          <User className="w-6 h-6 text-zinc-300 dark:text-zinc-500" />
                        </div>
                     )}
                     
                     <button 
                       type="button" 
                       onClick={() => setActiveMediaIndex(index)} 
                       className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg hover:border-blue-500 dark:hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm font-medium flex items-center gap-2"
                     >
                       <ImageIcon className="w-4 h-4"/> Browse Media
                     </button>
                     
                   </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal 
        isOpen={activeMediaIndex !== null}
        onClose={() => setActiveMediaIndex(null)}
        onSelect={(url) => {
          onMemberChange(activeMediaIndex, 'image', url);
        }}
      />
    </div>
  );
};

export default TeamCustomization;
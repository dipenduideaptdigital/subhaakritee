import React from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';

const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const RecentInquiries = ({ leads }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm p-6 flex flex-col h-full transition-colors duration-300">
      <div className="flex justify-between items-center mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4 transition-colors duration-300">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 transition-colors duration-300">Recent Inquiries</h2>
        <Link to="/admin/contacts/inbox" className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </Link>
      </div>
      <div className="space-y-5 flex-1">
        {leads.length > 0 ? (
          leads.map(lead => (
            <Link to="/admin/contacts/inbox" key={lead.id} className="flex items-center gap-3 group cursor-pointer">
              {/* Avatar Circle */}
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-600 dark:text-zinc-400 shrink-0 group-hover:bg-amber-50 dark:group-hover:bg-amber-500/20 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:border-amber-200 dark:group-hover:border-amber-500/30 transition-colors uppercase">
                {lead.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {lead.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate transition-colors">
                  {lead.email}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border transition-colors ${
                  lead.status === 'NEW' 
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' :
                  lead.status === 'IN_PROGRESS' 
                    ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' :
                  'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                }`}>
                  {lead.status.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium transition-colors">
                  {getTimeAgo(lead.createdAt)}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400 dark:text-zinc-500 text-sm italic transition-colors">
            No recent inquiries.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentInquiries;
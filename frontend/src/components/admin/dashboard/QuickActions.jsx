import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileText, PenTool, LayoutTemplate, MessageSquare, ShieldAlert } from 'lucide-react';
import Can from '../../shared/Can';
import { useAuth } from '../../../context/AuthContext';

const QuickActions = () => {
  const { user } = useAuth();
  
  const isSuperAdmin = typeof user?.systemRole === 'string' 
    ? user.systemRole === 'SUPER_ADMIN' 
    : user?.systemRole?.slug === 'SUPER_ADMIN';

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm p-6 flex flex-col h-full transition-colors duration-300">
      <div className="mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4 transition-colors duration-300">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 transition-colors duration-300">Quick Actions</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1 transition-colors duration-300">Shortcuts to common tasks</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Can permission="blog.create">
          <Link to="/admin/blogs/create" className="flex flex-col items-center justify-center p-5 rounded-2xl bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 text-purple-700 dark:text-purple-400 transition-colors group">
            <PenTool className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold">Write Blog</span>
          </Link>
        </Can>

        <Can permission="project.create">
          <Link to="/admin/projects/create" className="flex flex-col items-center justify-center p-5 rounded-2xl bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 transition-colors group">
            <LayoutTemplate className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold">Add Project</span>
          </Link>
        </Can>

        <Can permission="page.create">
          <Link to="/admin/pages/create" className="flex flex-col items-center justify-center p-5 rounded-2xl bg-yellow-50 dark:bg-yellow-500/10 hover:bg-yellow-100 dark:hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 transition-colors group">
            <FileText className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold">Create Page</span>
          </Link>
        </Can>
        
        <Can permission="user.view">
          <Link to="/admin/settings/users" className="flex flex-col items-center justify-center p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors group">
            <PlusCircle className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold">Manage Users</span>
          </Link>
        </Can>

        {/* WhatsApp Settings */}
        <Can permission="settings.manage">
          <Link to="/admin/settings/whatsapp" className="flex flex-col items-center justify-center p-5 rounded-2xl bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20 text-green-700 dark:text-green-400 transition-colors group">
            <MessageSquare className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold text-center">WhatsApp</span>
          </Link>
        </Can>

        {/* Maintenance Mode (System State) - Only for Super Admin */}
        {isSuperAdmin && (
          <Link to="/admin/settings/system" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 transition-colors group">
            <ShieldAlert className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold text-center">Maintenance Mode</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuickActions;
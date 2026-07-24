import React from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { Settings, Users, Shield, SlidersHorizontal, Layout, MessageSquare, ShieldAlert } from 'lucide-react';
import { usePermission } from '../../hooks/usePermission';
import { useAuth } from '../../context/AuthContext';

const SettingsLayout = () => {
  const { hasPermission } = usePermission();
  const { user } = useAuth();
  const location = useLocation();

  const tabs = [
    { name: 'General', path: '/admin/settings/general', icon: SlidersHorizontal, permission: 'settings.manage' },
    { name: 'Team & Users', path: '/admin/settings/users', icon: Users, permission: 'user.view' },
    { name: 'Access Roles', path: '/admin/settings/roles', icon: Shield, permission: 'role.view' },
    { name: 'CMS Settings', path: '/admin/settings/cms', icon: Layout, permission: 'settings.manage' },
    { name: 'WhatsApp Settings', path: '/admin/settings/whatsapp', icon: MessageSquare, permission: 'settings.manage' },
    { name: 'System State', path: '/admin/settings/system', icon: ShieldAlert, superAdminOnly: true },
  ];

  const visibleTabs = tabs.filter(tab => {
    if (tab.superAdminOnly) {
      const roleSlug = typeof user?.systemRole === 'string' ? user.systemRole : user?.systemRole?.slug;
      return roleSlug === 'SUPER_ADMIN';
    }
    return hasPermission(tab.permission);
  });

  if (visibleTabs.length === 0) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (location.pathname === '/admin/settings' || location.pathname === '/admin/settings/') {
    return <Navigate to={visibleTabs[0].path} replace />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10 max-w-6xl mx-auto text-zinc-900 font-sans">
      {/* Settings Navigation Sidebar */}
      <div className="lg:w-60 flex-shrink-0">
        <div className="sticky top-6 border-r border-zinc-200 lg:pr-6">
          <div className="border-b border-zinc-200 pb-4 mb-6">
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-1">Workspace</p>
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-zinc-700" strokeWidth={2} />
              Settings
            </h2>
          </div>

          <nav className="space-y-1">
            {visibleTabs.map((tab, idx) => (
              <NavLink
                key={tab.name}
                to={tab.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold group ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`
                }
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{tab.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsLayout;
import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Image as ImageIcon, Settings, LogOut, FileText, 
  Globe, Inbox, Menu, X, BookOpen, Tag, Layers, Briefcase, Wrench, ChevronDown, FolderOpen, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; 
import { usePermission } from '../../hooks/usePermission'; 
import apiClient from '../../api/client';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logoutContext } = useAuth(); 
  const { hasPermission } = usePermission(); 
  
  const roleSlug = user?.systemRole?.slug?.toUpperCase();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainContentRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [cmsName, setCmsName] = useState(() => localStorage.getItem('idpl_cms_name') || 'IDPL CMS');
  const [cmsTagline, setCmsTagline] = useState(() => localStorage.getItem('idpl_cms_tagline') || '');
  const [systemStateInfo, setSystemStateInfo] = useState(null);

  useEffect(() => {
    const fetchCmsSettings = async () => {
      try {
        const res = await apiClient.get('/cms/section/cms_settings');
        const content = res.data?.data?.content || res.data?.content;
        if (content) {
          if (content.cmsName) {
            setCmsName(content.cmsName);
            localStorage.setItem('idpl_cms_name', content.cmsName);
          }
          if (content.cmsTagline !== undefined) {
            setCmsTagline(content.cmsTagline);
            localStorage.setItem('idpl_cms_tagline', content.cmsTagline);
          }
        }
      } catch (err) {
        console.error('Failed to fetch CMS settings in AdminLayout:', err);
      }
    };
    fetchCmsSettings();

    const handleSettingsUpdated = (e) => {
      if (e.detail?.cmsName) {
        setCmsName(e.detail.cmsName);
      }
      if (e.detail?.cmsTagline !== undefined) {
        setCmsTagline(e.detail.cmsTagline);
      }
    };
    window.addEventListener('cms_settings_updated', handleSettingsUpdated);
    return () => window.removeEventListener('cms_settings_updated', handleSettingsUpdated);
  }, []);

  useEffect(() => {
    const fetchSysState = async () => {
      try {
        const res = await apiClient.get('/admin/system-state');
        setSystemStateInfo(res.data?.data);
      } catch (err) {
        console.error('Could not fetch system state', err);
      }
    };
    
    if (roleSlug === 'SUPER_ADMIN' || roleSlug === 'ADMIN') {
      fetchSysState();
    }
  }, [roleSlug]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [openMenus, setOpenMenus] = useState({
    'Blogs': location.pathname.includes('/admin/blogs'),
    'Home page': location.pathname.includes('/admin/home-customization'),
    'Contacts': location.pathname.includes('/admin/contact')
  });
  
  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const handleWheel = (e) => {
    const nav = e.currentTarget;
    const isAtTop = nav.scrollTop === 0;
    const isAtBottom = Math.abs(nav.scrollHeight - nav.scrollTop - nav.clientHeight) < 2;
    const canScrollNav = nav.scrollHeight > nav.clientHeight;
    
    const scrollingUp = e.deltaY < 0;
    const scrollingDown = e.deltaY > 0;
    
    if (!canScrollNav || (scrollingUp && isAtTop) || (scrollingDown && isAtBottom)) {
      if (mainContentRef.current) {
        mainContentRef.current.scrollTop += e.deltaY;
      }
    }
  };

  if (!isAuthenticated || !user || (roleSlug !== 'SUPER_ADMIN' && roleSlug !== 'ADMIN')) {
    return <Navigate to="/login?mode=admin" replace />;
  }

  const handleLogout = async () => {
    await logoutContext(); 
    navigate('/login?mode=admin');
  };

  const canViewSettings = hasPermission('settings.manage') || hasPermission('user.view') || hasPermission('role.view');

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', superAdminOnly: true },
    { name: 'Media Library', icon: FolderOpen, path: '/admin/media', permission: 'media.view' },
    { name: 'Landing pages', icon: FileText, path: '/admin/pages', permission: 'page.view' },
    { 
      name: 'Home page', 
      icon: ImageIcon, 
      permission: 'page.edit',
      children: [
        { name: 'Home Customization', path: '/admin/home-customization', permission: 'page.edit' },
        { name: 'Footer Settings', path: '/admin/home-customization?tab=footer', permission: 'page.edit' },
      ]
    },
    { name: 'Pages', icon: Layers, path: '/admin/site-pages', permission: 'page.view' },
    { name: 'Service Pages', icon: Wrench, path: '/admin/services', permission: 'page.view' },
    { 
      name: 'Blogs', 
      icon: BookOpen, 
      permission: 'blog.view',
      children: [
        { name: 'All Posts', path: '/admin/blogs', permission: 'blog.view' },
        { name: 'Categories & Tags', path: '/admin/blogs/taxonomies', permission: 'blog.view' },
      ]
    },
    { 
      name: 'Contacts', 
      icon: Inbox, 
      permission: 'contact.view',
      children: [
        { name: 'Inbox', path: '/admin/contacts/inbox', permission: 'contact.view' },
        { name: 'Forms', path: '/admin/contact-forms', permission: 'contact.view' }, 
      ]
    },
    { name: 'Projects', icon: Briefcase, path: '/admin/projects', permission: 'project.view' },
  ];

  const visibleNavItems = navItems.filter(item => {
    if (item.superAdminOnly && roleSlug !== 'SUPER_ADMIN') return false;
    if (!item.permission && !item.superAdminOnly) return true;
    return hasPermission(item.permission);
  }).map(item => {
    if (item.children) {
      return {
        ...item,
        children: item.children.filter(child => !child.permission || hasPermission(child.permission))
      };
    }
    return item;
  });

  const isPathActive = (path) => {
    const currentFull = location.pathname + location.search;
    if (path.includes('?')) {
      return currentFull === path;
    }
    return location.pathname === path && !location.search.includes('tab=');
  };

  const currentPath = location.pathname;

  if (
    currentPath === '/admin' || 
    currentPath === '/admin/' || 
    (currentPath === '/admin/dashboard' && roleSlug !== 'SUPER_ADMIN')
  ) {
    let firstAssignedPath = null;
    if (visibleNavItems.length > 0) {
      firstAssignedPath = visibleNavItems[0].path || (visibleNavItems[0].children ? visibleNavItems[0].children[0].path : null);
    }
    
    if (!firstAssignedPath && canViewSettings) {
      return <Navigate to="/admin/settings" replace />;
    }

    if (firstAssignedPath) {
      return <Navigate to={firstAssignedPath} replace />;
    } 
    
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-50 flex-col font-sans">
        <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm text-center max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Access Restricted</h2>
          <p className="text-sm text-zinc-500 mb-6">Your staff account is active, but you have 0 functional permissions assigned. Please ask a Super Admin to assign you a role.</p>
          <button onClick={handleLogout} className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-sm transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f8f9fa] text-zinc-900 overflow-hidden font-sans relative">
      
      {/* GLOBAL MAINTENANCE BANNER */}
      {systemStateInfo && systemStateInfo.state !== "ACTIVE" && (
        <div className="w-full bg-red-600 text-white px-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs font-bold tracking-wide z-[100] shadow-md relative shrink-0">
          <span className="flex items-center gap-2 uppercase">
            <AlertTriangle className="w-4 h-4" /> 
            WEBSITE IS UNDER {systemStateInfo.state} MODE
          </span>
          <span className="hidden sm:inline opacity-90 font-medium">|</span>
          <span>Enabled By: {systemStateInfo.enabledBy || 'System'}</span>
          <span className="hidden sm:inline opacity-90 font-medium">|</span>
          <span>Time: {new Date(systemStateInfo.enabledAt).toLocaleString()}</span>
        </div>
      )}

      {/* Main Layout Wrapper */}
      <div className="flex flex-1 overflow-hidden relative w-full">
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed md:relative w-72 h-full bg-blue-900 text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-blue-800/50 shadow-2xl z-30 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-3 mt-2 flex flex-col items-center justify-center border-b border-blue-800/50 relative">
            <div className="text-2xl font-sans font-extrabold tracking-wider mt-1.5 uppercase text-white text-center">
              {cmsName}
            </div>
            {cmsTagline && (
              <div className="text-xs text-blue-200 tracking-wide mt-0.5 font-medium text-center">
                {cmsTagline}
              </div>
            )}
            <button className="absolute right-8 md:hidden text-white hover:bg-blue-800 p-2 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
          </div>

          <nav 
            onWheel={handleWheel}
            className="flex-1 py-8 px-4 space-y-2 overflow-y-auto hide-scrollbar"
          >
            <NavLink 
              to="/" 
              className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-blue-800/40 bg-blue-950/40 text-white transition-all duration-300 group shadow-inner mb-4 hover:bg-blue-800 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-950/30"
            >
              <Globe className="w-5 h-5 text-white group-hover:rotate-12 group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />
              <span className="font-semibold tracking-wide text-sm">Subhaakritee</span>
            </NavLink>
            
            {visibleNavItems.map((item) => {
              if (item.children && item.children.length > 0) {
                const isOpen = openMenus[item.name];
                const isChildActive = item.children.some(child => isPathActive(child.path));

                return (
                  <div key={item.name} className="flex flex-col mb-2 space-y-1">
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group w-full ${
                        isChildActive && !isOpen
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 border border-blue-500/50'
                          : isOpen
                          ? 'text-white bg-blue-800/30'
                          : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <item.icon className={`w-5 h-5 transition-transform ${isOpen ? 'scale-110 text-white' : 'group-hover:scale-110'}`} strokeWidth={1.5} />
                        <span className="font-medium tracking-wide text-sm">{item.name}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : 'text-blue-300'}`} />
                    </button>
                    
                    {/* Dropdown*/}
                    <div className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                      <div className="pl-5 pr-2 py-1 space-y-1 border-l-2 border-blue-800/50 ml-6">
                        {item.children.map(child => (
                          <NavLink
                            key={child.name}
                            to={child.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            end
                            className={() =>
                              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                                isPathActive(child.path) 
                                  ? 'bg-blue-500/20 text-white font-semibold' 
                                  : 'text-blue-200/70 hover:text-white hover:bg-blue-800/40'
                              }`
                            }
                          >
                            <span className="text-sm tracking-wide">{child.name}</span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Standard NavLink
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                      isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 border border-blue-500/50' : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                  <span className="font-medium tracking-wide text-sm">{item.name}</span>
                </NavLink>
              );
            })}

            {canViewSettings && (
              <NavLink
                to="/admin/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className={() =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                    location.pathname.includes('/admin/settings') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 border border-blue-500/50' : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`
                }
              >
                <Settings className="w-5 h-5 transition-transform group-hover:rotate-90 duration-500" strokeWidth={1.5} />
                <span className="font-medium tracking-wide text-sm">Settings</span>
              </NavLink>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-[#f4f4f5] w-full">
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-200 flex items-center justify-between px-4 sm:px-10 z-10 shadow-sm shrink-0">
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 -ml-2 rounded-xl text-zinc-600 hover:bg-zinc-100" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-6 h-6" /></button>
              <h2 className="text-lg sm:text-xl font-semibold text-zinc-800 tracking-tight">Admin Portal</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative" ref={profileDropdownRef}>
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-zinc-100 active:bg-zinc-200/70 transition-all duration-200 cursor-pointer focus:outline-none select-none border border-transparent hover:border-zinc-200/50"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-zinc-800 leading-tight">{user?.name || 'Staff'}</p>
                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">{user?.systemRole?.name || 'Admin'}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md uppercase shrink-0 hover:scale-105 transition-transform duration-200">
                    {user?.name ? user.name.charAt(0) : 'S'}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200/80 rounded-xl shadow-xl py-1.5 z-50 transform origin-top-right transition-all duration-200 divide-y divide-zinc-100">
                    <div className="px-4 py-2.5">
                      <p className="text-xs text-zinc-500">Signed in as</p>
                      <p className="text-sm font-semibold text-zinc-800 truncate">{user?.name || 'Staff'}</p>
                      <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider mt-0.5">{user?.systemRole?.name || 'Admin'}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50/70 transition-all duration-200 font-semibold text-sm text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" strokeWidth={2} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div ref={mainContentRef} className="flex-1 overflow-auto p-4 sm:p-10 relative">
            <div className="max-w-6xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
import React, { useState, useEffect } from 'react';
import { usersApi } from '../../../api/users';
import { rolesApi } from '../../../api/roles';
import { 
  Users, Search, Shield, UserPlus, CheckCircle, PowerOff, 
  Trash2, Mail, X, Loader2, AlertTriangle, Eye, Clock, Key, Activity 
} from 'lucide-react';
import { Can } from '../../../components/shared/Can';
import { useAuth } from '../../../context/AuthContext';

const TABS = [
  { id: 'team', label: 'Staff & Team', filter: { systemRole: 'ADMIN' } },
  { id: 'super', label: 'Super Admins', filter: { systemRole: 'SUPER_ADMIN' } },
  { id: 'pending', label: 'Pending Invites', filter: { status: 'PENDING' } }
];

const UsersList = () => {
  const { user: currentUser } = useAuth();
  
  // Data States
  const [users, setUsers] = useState([]);
  const [functionalRoles, setFunctionalRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  
  // UI States
  const [activeTab, setActiveTab] = useState('team');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modals & User Selections
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [detailsModalUser, setDetailsModalUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null); 

  // Invite Form State
  const [inviteData, setInviteData] = useState({ name: '', email: '', systemRoleSlug: 'ADMIN', functionalRoleIds: [] });
  const [inviting, setInviting] = useState(false);

  // Edit Role Form State
  const [editRoleData, setEditRoleData] = useState({ systemRoleSlug: '', functionalRoleIds: [] });
  const [updatingRoles, setUpdatingRoles] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRolesForDropdown();
  }, [currentPage, searchTerm, activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const currentTabFilter = TABS.find(t => t.id === activeTab)?.filter || {};
      const res = await usersApi.getAllUsers({ 
        page: currentPage, 
        limit: 10, 
        search: searchTerm,
        ...currentTabFilter
      });
      setUsers(res.data || []);
      setMeta({ totalPages: res.totalPages, page: res.currentPage });
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRolesForDropdown = async () => {
    try {
      const res = await rolesApi.getAllRoles();
      setFunctionalRoles(res.data || []);
    } catch (err) {
      console.error("Failed to fetch functional roles", err);
    }
  };

  // --- Handlers for User Actions ---

  const handleOpenDetails = async (userId) => {
    try {
      setDetailsLoading(true);
      setDetailsModalUser({ id: userId, isLoading: true }); 
      const res = await usersApi.getUserDetails(userId);
      setDetailsModalUser({ ...res.data, isLoading: false });
    } catch (err) {
      alert("Failed to load user details.");
      setDetailsModalUser(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleRevokeSessions = async (userId) => {
    if (!window.confirm("This will forcefully log the user out from all devices immediately. Continue?")) return;
    try {
      await usersApi.revokeSessions(userId);
      alert("All sessions revoked successfully.");
      setDetailsModalUser(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to revoke sessions.");
    }
  };

  const handleCancelInvite = async (email) => {
    if (!window.confirm("Are you sure you want to cancel this invitation?")) return;
    try {
      await usersApi.cancelInvite(email);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel invite.");
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const isActivating = currentStatus !== 'ACTIVE';
    const action = isActivating ? 'activate' : 'suspend';
    if (!window.confirm(`Are you sure you want to ${action} this account?`)) return;
    try {
      await usersApi.updateUserStatus(userId, isActivating ? 'ACTIVE' : 'SUSPENDED');
      fetchUsers();
      if (detailsModalUser?.id === userId) setDetailsModalUser(null); 
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} user.`);
    }
  };

  // --- Handlers for Forms & Roles ---

  const toggleFunctionalRoleArray = (stateObj, setter, roleId) => {
    const arr = stateObj.functionalRoleIds;
    setter(prev => ({
      ...prev,
      functionalRoleIds: arr.includes(roleId) ? arr.filter(id => id !== roleId) : [...arr, roleId]
    }));
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteData.name || !inviteData.email) return;

    try {
      setInviting(true);
      await usersApi.inviteAdmin(inviteData);
      setIsInviteModalOpen(false);
      setInviteData({ name: '', email: '', systemRoleSlug: 'ADMIN', functionalRoleIds: [] });
      if (activeTab === 'pending') fetchUsers();
      else setActiveTab('pending');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send invite.');
    } finally {
      setInviting(false);
    }
  };

  const openEditRolesModal = async (u) => {
    setEditingUser(u);
    try {
      const res = await usersApi.getUserFunctionalRoles(u.id);
      const assignedIds = res.data.map(r => r.id);
      setEditRoleData({
        systemRoleSlug: u.systemRole.slug,
        functionalRoleIds: assignedIds
      });
    } catch (err) {
      alert('Failed to fetch user roles.');
    }
  };

  const handleUpdateUserRoles = async (e) => {
    e.preventDefault();
    try {
      setUpdatingRoles(true);
      
      if (editRoleData.systemRoleSlug !== editingUser.systemRole.slug) {
        await usersApi.updateSystemRole(editingUser.id, editRoleData.systemRoleSlug);
      }

      await usersApi.assignFunctionalRoles(editingUser.id, editRoleData.functionalRoleIds);
      
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update roles.');
    } finally {
      setUpdatingRoles(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">

      {/* Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 mb-8 animate-in fade-in duration-500 transition-colors">
        <div>
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Personnel Register</p>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
            Team &amp; Users
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Manage staff accounts, invites, and system access.</p>
        </div>

        <Can permission="user.create">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-sm focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20 flex-shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Invite Staff
          </button>
        </Can>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-colors">

        {/* TABS NAVIGATION */}
        <div className="flex border-b border-zinc-100 dark:border-zinc-800 px-6 gap-6 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-x-auto transition-colors">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
              className={`py-3.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id 
                  ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white font-bold' 
                  : 'border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Toolbar */}
        <div className="p-6 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 transition-colors">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="block w-full pl-10 pr-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl leading-5 bg-white dark:bg-zinc-950 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-zinc-100/10 focus:border-zinc-950 dark:focus:border-zinc-100 transition-colors text-sm font-medium text-zinc-800 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-zinc-50/70 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800 transition-colors">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">User</th>
                {activeTab !== 'pending' && <th className="px-6 py-3.5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Roles</th>}
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900 transition-colors">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-400 dark:text-zinc-500" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-zinc-400 dark:text-zinc-500 font-medium italic text-sm">
                    No users found in this category.
                  </td>
                </tr>
              ) : (
                users.map((u, idx) => {
                  const isSelf = u.id === currentUser.id;
                  const isSuperAdmin = u.systemRole.slug === 'SUPER_ADMIN';

                  return (
                    <tr key={u.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500 tabular-nums w-8 flex-shrink-0">
                            {String((currentPage - 1) * 10 + idx + 1).padStart(3, '0')}
                          </span>
                          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                              {u.name}
                              {isSelf && (
                                <span className="bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 text-[9px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium truncate">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      
                      {activeTab !== 'pending' && (
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5 items-start">
                            <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full tracking-wider border ${
                              isSuperAdmin 
                                ? 'border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10' 
                                : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800'
                            }`}>
                              {u.systemRole.name.toUpperCase()}
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {u.functionalRoles?.map(fr => (
                                <span key={fr.functionalRole.slug} className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100/80 dark:bg-zinc-800 px-2 py-0.5 rounded">
                                  {fr.functionalRole.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                      )}

                      <td className="px-6 py-4">
                        {u.status === 'ACTIVE' && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100/80 dark:border-emerald-500/20">
                            <CheckCircle className="w-3.5 h-3.5" /> Active
                          </span>
                        )}
                        {u.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-100/80 dark:border-amber-500/20">
                            <Clock className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                        {u.status === 'SUSPENDED' && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-100/80 dark:border-red-500/20">
                            <PowerOff className="w-3.5 h-3.5" /> Suspended
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          
                          {/* Cancel Invite Button (Only for Pending) */}
                          {activeTab === 'pending' && (
                            <Can permission="user.delete">
                              <button onClick={() => handleCancelInvite(u.email)} className="p-2 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer" title="Cancel Invite">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </Can>
                          )}

                          {/* View Profile / Settings (For Active/Suspended) */}
                          {activeTab !== 'pending' && (
                            <Can permission="user.view">
                              <button onClick={() => handleOpenDetails(u.id)} className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg transition-colors cursor-pointer" title="View Profile">
                                <Eye className="w-4 h-4" />
                              </button>
                            </Can>
                          )}

                          {/* Edit Roles (Manage Access) */}
                          {!isSelf && (!isSuperAdmin || currentUser.systemRole === 'SUPER_ADMIN') && activeTab !== 'pending' && (
                            <Can permission="user.edit">
                              <button onClick={() => openEditRolesModal(u)} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-300 rounded-lg transition-colors cursor-pointer" title="Manage Access">
                                <Shield className="w-4 h-4" />
                              </button>
                            </Can>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Pagination */}
      {meta?.totalPages > 1 && (
        <div className="pt-6 flex justify-center items-center gap-4 text-sm font-sans">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1} 
            className="inline-flex items-center justify-center px-4 py-2 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-40 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <span className="text-zinc-500 dark:text-zinc-400 font-semibold tabular-nums">
            {String(currentPage).padStart(2, '0')} / {String(meta.totalPages).padStart(2, '0')}
          </span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(meta.totalPages, p + 1))} 
            disabled={currentPage === meta.totalPages} 
            className="inline-flex items-center justify-center px-4 py-2 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-40 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/*DETAILS MODAL*/}
      {detailsModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 dark:bg-zinc-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl font-sans transition-colors duration-300">
            
            {detailsModalUser.isLoading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-600 dark:text-zinc-400" />
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                      {detailsModalUser.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{detailsModalUser.name}</h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{detailsModalUser.email}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="px-2.5 py-0.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {detailsModalUser.systemRole?.name}
                        </span>
                        {detailsModalUser.status === 'ACTIVE' ? (
                          <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">Suspended</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setDetailsModalUser(null)} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors flex-shrink-0 cursor-pointer"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 space-y-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                      <Key className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> Granted Permissions
                    </h3>
                    {detailsModalUser.permissionsList?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {detailsModalUser.permissionsList.map(perm => (
                          <span key={perm} className="px-2.5 py-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-semibold rounded-lg transition-colors">
                            {perm}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium italic">No specific functional permissions granted.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                      <Activity className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> Recent Activity
                    </h3>
                    {detailsModalUser.recentActivity?.length > 0 ? (
                      <div className="space-y-4 pt-1">
                        {detailsModalUser.recentActivity.map((activity, idx) => (
                          <div key={activity.id || idx} className="flex flex-col gap-1 border-l-2 border-zinc-300 dark:border-zinc-700 pl-3 py-0.5">
                            <span className="text-sm text-zinc-800 dark:text-zinc-200 font-medium">
                              Updated blog: <span className="font-semibold text-zinc-900 dark:text-white">{activity.blog?.title}</span>
                            </span>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold tracking-wide">
                              {new Date(activity.createdAt).toLocaleString(undefined, { 
                                year: 'numeric', month: 'short', day: 'numeric', 
                                hour: '2-digit', minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium italic">No recent system activity logged for this user.</p>
                    )}
                  </div>

                  {currentUser.id !== detailsModalUser.id && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-red-500 dark:text-red-400 mb-3 flex items-center gap-2 border-b border-red-100 dark:border-red-500/20 pb-2">
                        <Shield className="w-4 h-4" /> Security Controls
                      </h3>
                      <div className="flex gap-3 flex-wrap pt-1">
                        <Can permission="user.suspend">
                          <button 
                            onClick={() => handleToggleStatus(detailsModalUser.id, detailsModalUser.status)} 
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border rounded-xl transition-colors cursor-pointer ${
                              detailsModalUser.status === 'ACTIVE' 
                                ? 'border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100/50 dark:hover:bg-amber-500/20' 
                                : 'border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100/50 dark:hover:bg-emerald-500/20'
                            }`}
                          >
                            {detailsModalUser.status === 'ACTIVE' ? 'Suspend Account' : 'Re-activate Account'}
                          </button>
                          
                          <button 
                            onClick={() => handleRevokeSessions(detailsModalUser.id)} 
                            className="px-4 py-2 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100/50 dark:hover:bg-red-500/20 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                          >
                            Force Logout (All Devices)
                          </button>
                        </Can>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/*INVITE MODAL*/}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 dark:bg-zinc-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 w-full max-w-lg shadow-2xl overflow-hidden font-sans transition-colors duration-300">
             <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                  <UserPlus className="w-5 h-5 text-zinc-600 dark:text-zinc-400" /> Invite Staff
                </h2>
                <button onClick={() => setIsInviteModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
             </div>
             <form onSubmit={handleInviteSubmit} className="p-6 space-y-5">
               <div>
                 <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Full Name</label>
                 <input 
                   required 
                   type="text" 
                   value={inviteData.name} 
                   onChange={e => setInviteData(p => ({ ...p, name: e.target.value }))} 
                   className="block w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-zinc-100/10 focus:border-zinc-950 dark:focus:border-zinc-100 transition-colors text-sm font-medium text-zinc-800 dark:text-zinc-100" 
                 />
               </div>
               <div>
                 <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
                 <input 
                   required 
                   type="email" 
                   value={inviteData.email} 
                   onChange={e => setInviteData(p => ({ ...p, email: e.target.value }))} 
                   className="block w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-zinc-100/10 focus:border-zinc-950 dark:focus:border-zinc-100 transition-colors text-sm font-medium text-zinc-800 dark:text-zinc-100" 
                 />
               </div>
               
               <div>
                 <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">System Role</label>
                 <select 
                   value={inviteData.systemRoleSlug} 
                   onChange={e => setInviteData(p => ({ ...p, systemRoleSlug: e.target.value }))} 
                   className="block w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-zinc-100/10 focus:border-zinc-950 dark:focus:border-zinc-100 transition-colors text-sm font-semibold text-zinc-800 dark:text-zinc-100"
                 >
                   <option value="ADMIN">ADMIN (Standard)</option>
                   <option value="SUPER_ADMIN">SUPER ADMIN (Full Access)</option>
                 </select>
               </div>

               {inviteData.systemRoleSlug !== 'SUPER_ADMIN' && (
                 <div>
                   <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Functional Roles (Access Bundles)</label>
                   <div className="flex flex-wrap gap-2 p-3 bg-zinc-50/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl max-h-40 overflow-y-auto">
                     {functionalRoles.map(role => (
                       <label 
                         key={role.id} 
                         className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg cursor-pointer transition-colors ${
                           inviteData.functionalRoleIds.includes(role.id) 
                             ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-900 shadow-sm' 
                             : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                         }`}
                       >
                         <input type="checkbox" className="hidden" checked={inviteData.functionalRoleIds.includes(role.id)} onChange={() => toggleFunctionalRoleArray(inviteData, setInviteData, role.id)} />
                         <span className="text-xs font-semibold">{role.name}</span>
                       </label>
                     ))}
                   </div>
                 </div>
               )}

               <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                 <button 
                   type="button" 
                   onClick={() => setIsInviteModalOpen(false)} 
                   className="px-5 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   disabled={inviting} 
                   className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-sm focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                 >
                   {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />} Send Invite
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}

      {/*EDIT ROLES MODAL*/}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 dark:bg-zinc-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 w-full max-w-lg shadow-2xl overflow-hidden font-sans transition-colors duration-300">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Manage Access
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                  Modifying roles for <span className="font-semibold text-zinc-900 dark:text-zinc-100">{editingUser.name}</span>
                </p>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleUpdateUserRoles} className="p-6 space-y-5">
              <div className="border border-amber-200 dark:border-amber-500/30 bg-amber-50/65 dark:bg-amber-500/10 rounded-xl p-3 flex gap-2 text-amber-800 dark:text-amber-300 text-sm font-medium transition-colors">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" /> The user's active sessions will be terminated automatically to apply these changes securely.
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">System Role</label>
                <select 
                  value={editRoleData.systemRoleSlug} 
                  onChange={e => setEditRoleData(p => ({ ...p, systemRoleSlug: e.target.value }))} 
                  className="block w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-zinc-100/10 focus:border-zinc-950 dark:focus:border-zinc-100 transition-colors text-sm font-semibold text-zinc-800 dark:text-zinc-100"
                >
                  <option value="ADMIN">ADMIN (Standard)</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN (Full Access)</option>
                </select>
              </div>

              {editRoleData.systemRoleSlug !== 'SUPER_ADMIN' && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Functional Roles (Access Bundles)</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-zinc-50/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl max-h-48 overflow-y-auto">
                    {functionalRoles.map(role => (
                      <label 
                        key={role.id} 
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg cursor-pointer transition-colors ${
                          editRoleData.functionalRoleIds.includes(role.id) 
                            ? 'bg-blue-600 dark:bg-blue-600 border-blue-600 dark:border-blue-600 text-white shadow-sm' 
                            : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        <input type="checkbox" className="hidden" checked={editRoleData.functionalRoleIds.includes(role.id)} onChange={() => toggleFunctionalRoleArray(editRoleData, setEditRoleData, role.id)} />
                        <span className="text-xs font-semibold">{role.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)} 
                  className="px-5 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={updatingRoles} 
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm focus:ring-2 focus:ring-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {updatingRoles ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />} Apply Security Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsersList;
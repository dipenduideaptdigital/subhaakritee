import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rolesApi } from '../../../api/roles';
import { ShieldCheck, Plus, Edit3, Trash2, AlertCircle, Users, KeyRound } from 'lucide-react';
import { Can } from '../../../components/shared/Can';

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await rolesApi.getAllRoles();
      setRoles(res.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch roles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, userCount) => {
    if (userCount > 0) {
      alert(`Cannot delete this role because ${userCount} user(s) are currently assigned to it.`);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this functional role?')) return;

    try {
      setIsDeleting(id);
      await rolesApi.deleteRole(id);
      setRoles(roles.filter(r => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete role.');
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="h-72 flex flex-col justify-center items-center gap-3">
        <div className="w-8 h-8 border-2 border-zinc-200 dark:border-zinc-700 border-t-[#3F5C73] dark:border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-sm font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Loading roles…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
            Access Roles
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Manage functional roles and their granular permissions.
          </p>
        </div>

        <Can permission="role.create">
          <Link
            to="/admin/settings/roles/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-sm focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20 flex-shrink-0 text-sm"
          >
            <Plus className="w-4 h-4" /> Create Role
          </Link>
        </Can>
      </div>

      {error && (
        <div className="border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors duration-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Roles Grid */}
      {roles.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-16 text-center shadow-sm transition-colors duration-300">
          <ShieldCheck className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">No roles yet</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Create your first role to start managing access.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map(role => (
            <div
              key={role.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-black/50 transition-all duration-300 group flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 truncate">{role.name}</h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-full px-2.5 py-0.5 mt-1.5 transition-colors duration-300">
                      <KeyRound className="w-3 h-3" /> {role.slug}
                    </span>
                  </div>

                  {/* Hover actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <Can permission="role.edit">
                      <Link
                        to={`/admin/settings/roles/edit/${role.id}`}
                        className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg transition-colors"
                        title="Edit role"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                    </Can>
                    <Can permission="role.delete">
                      <button
                        onClick={() => handleDelete(role.id, role._count?.users)}
                        disabled={isDeleting === role.id}
                        className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete role"
                      >
                        {isDeleting === role.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </Can>
                  </div>
                </div>

                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2 h-10">
                  {role.description || 'No description provided for this role.'}
                </p>

                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6 transition-colors duration-300">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1 bg-zinc-50 dark:bg-zinc-800/50 transition-colors duration-300">
                    <Users className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    {role._count?.users || 0} Users
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Custom Role
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default RolesList;
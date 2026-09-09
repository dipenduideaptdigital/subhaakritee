import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi } from '../../../api/projects';
import { Plus, Edit3, Trash2, Briefcase, AlertCircle, CheckCircle, FileEdit, Archive, Search } from 'lucide-react';

const TABS = [
  { id: 'ALL', label: 'All Projects' },
  { id: 'PUBLISHED', label: 'Published', icon: CheckCircle },
  { id: 'DRAFT', label: 'Drafts', icon: FileEdit },
  { id: 'ARCHIVED', label: 'Archived', icon: Archive }
];
import Can from '../../../components/shared/Can';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getAdminProjects();
      setProjects(data.data || []);
    } catch (err) {
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        setIsDeleting(id);
        await projectsApi.deleteProject(id);
        setProjects(projects.filter(p => p.id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete project.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesTab = activeTab === 'ALL' ? true : project.status === activeTab;
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 transition-colors">Published</span>;
      case 'DRAFT':
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 transition-colors">Draft</span>;
      case 'ARCHIVED':
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-zinc-100 dark:bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-500/20 transition-colors">Archived</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors">{status}</span>;
    }
  };

  if (loading) return <div className="p-10 text-center text-zinc-500 dark:text-zinc-400 font-medium font-sans">Loading projects...</div>;

  return (
    <div className="space-y-6 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-zinc-800 dark:text-zinc-200" /> Manage Projects
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Add, update, or remove portfolio projects.</p>
        </div>
        
        <Can permission="project.create">
          <Link to="/admin/projects/create" className="px-5 py-2.5 bg-blue-600 dark:bg-indigo-600 text-white rounded-xl font-medium hover:bg-blue-700 dark:hover:bg-indigo-500 flex items-center gap-2 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Project
          </Link>
        </Can>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors">
          <AlertCircle className="w-5 h-5"/> {error}
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-colors">
        
        {/* TABS NAVIGATION */}
        <div className="flex border-b border-zinc-100 dark:border-zinc-800 px-6 gap-6 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-x-auto transition-colors duration-300">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id 
                  ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white font-bold' 
                  : 'border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder={`Search ${activeTab !== 'ALL' ? activeTab.toLowerCase() : ''} projects by title...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl leading-5 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 transition-colors sm:text-sm"
            />
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
          </div>
        </div>
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead className="bg-zinc-50/80 dark:bg-zinc-800/50 transition-colors">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Project Title</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            ]{filteredProjects.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                  {activeTab !== 'ALL' ? `No ${activeTab.toLowerCase()} projects found.` : 'No projects found.'}
                </td>
              </tr>
            ) : (
              filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">{project.title}</td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300 text-sm font-medium">{project.category}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(project.status)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-1.5 opacity-100 transition-opacity">
                      <Can permission="project.edit">
                        <Link 
                          to={`/admin/projects/edit/${project.id}`} 
                          className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Edit Project"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                      </Can>

                      <Can permission="project.delete">
                        <button 
                          onClick={() => handleDelete(project.id)} 
                          disabled={isDeleting === project.id}
                          className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Project"
                        >
                          {isDeleting === project.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </Can>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectList;
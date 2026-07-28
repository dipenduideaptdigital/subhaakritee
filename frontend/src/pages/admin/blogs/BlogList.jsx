import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogsApi } from '../../../api/blogs';
import Can from '../../../components/shared/Can';
import { 
  FileText, Plus, Edit3, Trash2, Search, 
  ExternalLink, AlertCircle, Clock, Eye 
} from 'lucide-react';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogsApi.getAdminBlogs({ limit: 50 }); 
      setBlogs(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      setError('Failed to load blogs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      setIsDeleting(id);
      await blogsApi.deleteBlogPost(id);
      setBlogs(blogs.filter(blog => blog.id !== id));
    } catch (err) {
      alert('Failed to delete blog.');
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED': 
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 uppercase tracking-wider transition-colors duration-300">Published</span>;
      case 'DRAFT': 
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 uppercase tracking-wider transition-colors duration-300">Draft</span>;
      case 'SCHEDULED': 
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex items-center gap-1 uppercase tracking-wider transition-colors duration-300"><Clock className="w-3 h-3"/> Scheduled</span>;
      case 'ARCHIVED': 
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 uppercase tracking-wider transition-colors duration-300">Archived</span>;
      default: 
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 uppercase tracking-wider transition-colors duration-300">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900 dark:border-t-zinc-100 dark:border-b-zinc-100"></div>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-medium">Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-zinc-900 dark:text-zinc-100" /> Blog Posts
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Manage articles, news, and publications.</p>
        </div>
        <Link 
          to="/admin/blogs/create" 
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors shadow-sm focus:ring-2 focus:ring-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Create New Post
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 transition-colors duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 dark:text-red-400" /> 
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
        
        {/* Search Toolbar */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Search articles by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl leading-5 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-colors sm:text-sm"
            />
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            {filteredBlogs.length} Articles
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 transition-colors duration-300">
            <thead className="bg-zinc-50/70 dark:bg-zinc-800/50 transition-colors duration-300">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Article</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Author & Stats</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800 transition-colors duration-300">
              {filteredBlogs.length > 0 ? filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {blog.featuredImage ? (
                        <img src={blog.featuredImage.thumbnailUrl || blog.featuredImage.url} alt="" className="w-12 h-12 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700 transition-colors"><FileText className="w-5 h-5"/></div>
                      )}
                      <div>
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{blog.title}</span>
                        <div className="flex gap-2 mt-1.5">
                          {blog.categories?.slice(0,2).map(c => (
                            <span key={c.id} className="text-[10px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 px-2 py-0.5 rounded font-semibold transition-colors duration-300">
                              {c.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(blog.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-zinc-900 dark:text-zinc-100 font-medium">{blog.author?.name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-1">
                      <Eye className="w-3 h-3"/> {blog.viewCount} views • {blog.readingTime} min
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      
                      <Can permission="blog.preview">
                        <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Preview Article">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Can>

                      <Can permission="blog.edit">
                        <Link to={`/admin/blogs/edit/${blog.id}`} className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors" title="Edit Article">
                          <Edit3 className="w-4 h-4" />
                        </Link>
                      </Can>

                      <Can permission="blog.delete">
                        <button onClick={() => handleDelete(blog.id)} disabled={isDeleting === blog.id} className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50" title="Delete Article">
                          {isDeleting === blog.id ? <div className="w-4 h-4 border-2 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin"></div> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </Can>

                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="text-center py-12 text-zinc-500 dark:text-zinc-400 italic">No blogs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { pagesApi } from '../../../api/pages';
import Can from '../../../components/shared/Can';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  ExternalLink,
  AlertCircle,
  Wrench,
} from 'lucide-react';

const PageList = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  const isSitePagesMode = location.pathname.includes('/admin/site-pages');
  const isServicesMode = location.pathname.includes('/admin/services');

  let basePath = '/admin/pages';
  if (isSitePagesMode) basePath = '/admin/site-pages';
  if (isServicesMode) basePath = '/admin/services';

  useEffect(() => {
    fetchPages();
  }, [location.pathname]); 

  const fetchPages = async () => {
    try {
      setLoading(true);
      const data = await pagesApi.getPages();
      setPages(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch pages:', err);
      setError('Failed to load pages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeleting(id);
      await pagesApi.deletePage(id);
      setPages(pages.filter(page => page.id !== id));
    } catch (err) {
      console.error('Failed to delete page:', err);
      alert('Failed to delete page. It might be in use or you do not have permission.');
    } finally {
      setIsDeleting(null);
    }
  };

  const staticPages = [
    {
      id: 'static-landing-reference',
      title: 'Original Landing Page (Reference)',
      fullPath: '/hero-preview',
      status: 'SYSTEM',
      author: { name: 'System' },
      isStatic: true,
      updatedAt: null
    },
    {
      id: 'static-landing-reference-2',
      title: 'Premium Landing Page (Reference 2)',
      fullPath: '/hero-preview-2',
      status: 'SYSTEM',
      author: { name: 'System' },
      isStatic: true,
      updatedAt: null
    }
  ];

  const coreSiteSlugs = [
    'about', 'about-us', 
    'projects', 'project', 'our-projects',
    'contact', 'contact-us', 
    'blog', 'blogs',
    'home', 'homepage'
  ];

  const relevantPages = pages.filter(page => {
    const currentSlug = (page.slug || '').toLowerCase().trim();
    const fullPath = (page.fullPath || '').toLowerCase().trim();
    
    // Check if the page is a service page
    const isServicePage = currentSlug === 'services' || currentSlug === 'service' || fullPath.startsWith('/services') || page.template === 'service-page';

    if (isServicesMode) {
      return isServicePage;
    } else if (isSitePagesMode) {
      return coreSiteSlugs.includes(currentSlug) && !isServicePage;
    } else {
      return !coreSiteSlugs.includes(currentSlug) && !isServicePage;
    }
  });

  const allPages = (isSitePagesMode || isServicesMode) ? relevantPages : [...staticPages, ...relevantPages];

  const filteredPages = allPages.filter(page => 
    page.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.fullPath?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 transition-colors duration-300">Published</span>;
      case 'DRAFT':
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 transition-colors duration-300">Draft</span>;
      case 'ARCHIVED':
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-zinc-100 dark:bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-500/20 transition-colors duration-300">Archived</span>;
      case 'SYSTEM':
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 transition-colors duration-300">System Reference</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors duration-300">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">Loading pages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            {isServicesMode ? <Wrench className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
            {isServicesMode ? 'Service Pages' : (isSitePagesMode ? 'Site Pages' : 'Landing Pages')}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            {isServicesMode 
              ? 'Manage all your service offerings and detailed service pages.'
              : isSitePagesMode 
              ? 'Manage main website pages like About Us, Contact, etc.' 
              : 'Manage your marketing and landing pages.'}
          </p>
        </div>
        
        <Can permission="page.create">
          <Link 
            to={`${basePath}/create`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-sm focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20 flex-shrink-0 text-sm"
          >
            <Plus className="w-4 h-4" />
            Create New Page
          </Link>
        </Can>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 transition-colors duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium text-sm">{error}</p>
          <button onClick={() => fetchPages()} className="ml-auto text-sm underline font-bold hover:text-red-800 dark:hover:text-red-300">Retry</button>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Search pages by title or URL path..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl leading-5 bg-white dark:bg-zinc-950 placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors sm:text-sm font-medium"
            />
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold tracking-wide">
            {filteredPages.length} {filteredPages.length === 1 ? 'page' : 'pages'}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 transition-colors duration-300">
            <thead className="bg-zinc-50/70 dark:bg-zinc-800/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Author
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800 transition-colors duration-300">
              {filteredPages.length > 0 ? (
                filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{page.title}</span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-zinc-700/50 px-2 py-0.5 rounded tracking-wide transition-colors">
                            {page.fullPath || `/${page.slug}`}
                          </span>
                          
                          <Can permission="page.preview">
                            <a 
                              href={page.fullPath?.startsWith('/') ? page.fullPath : `/${page.fullPath || page.slug}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-1 text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded transition-colors"
                              title="View Public Page"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </Can>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(page.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-600 dark:text-zinc-300 font-semibold">{page.author?.name || 'System'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">
                        {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown'}
                      </div>
                      <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider mt-0.5">
                        {page.updatedAt ? new Date(page.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-1">
                        {!page.isStatic && (
                          <>
                            <Can permission="page.edit">
                              <Link 
                                to={`${basePath}/edit/${page.id}`}
                                className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg transition-colors"
                                title="Edit Page"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Link>
                            </Can>
                            
                            <Can permission="page.delete">
                              <button 
                                onClick={() => handleDelete(page.id)}
                                disabled={isDeleting === page.id}
                                className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                                title="Delete Page"
                              >
                                {isDeleting === page.id ? (
                                  <div className="w-4 h-4 border-2 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </Can>
                          </>
                        )}
                        {page.isStatic && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mr-2 border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded-md bg-zinc-50 dark:bg-zinc-900/50">
                            Hardcoded reference
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-4 border border-zinc-100 dark:border-zinc-800">
                        <FileText className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                      </div>
                      <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No pages found</p>
                      <p className="text-sm mt-1 text-zinc-500 dark:text-zinc-400 font-medium">Get started by creating a new page.</p>
                      <Link 
                        to={`${basePath}/create`}
                        className="mt-4 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        Create your first page &rarr;
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PageList;
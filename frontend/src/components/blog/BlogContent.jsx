import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { blogsApi } from '../../api/blogs';
import { resolveAssetUrl } from '../../utils/assetResolver';
import BlogSidebar from './BlogSidebar';
import defaultThumbnail from '../../assets/blog/sample1.png';

const BlogContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [sidebarData, setSidebarData] = useState({ categories: [], popularTags: [], recentPosts: [] });
  const [loading, setLoading] = useState(true);

  // URL theke active filters ber kore ana
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const currentCategory = searchParams.get('categorySlug') || '';
  const currentTag = searchParams.get('tagSlug') || '';
  const currentSearch = searchParams.get('search') || '';

  useEffect(() => {
    const fetchBlogsAndSidebar = async () => {
      setLoading(true);
      try {
        // Parallel Network Call for Maximum Speed
        const [blogsRes, categoriesRes, tagsRes] = await Promise.all([
          blogsApi.getPublicBlogs({
            page: currentPage,
            limit: 6, // Grid er jonno 6ta post per page
            categorySlug: currentCategory,
            tagSlug: currentTag,
            search: currentSearch
          }),
          blogsApi.getPublicCategories(),
          blogsApi.getPublicTags()
        ]);

        setPosts(blogsRes.data || []);
        setMeta(blogsRes.meta);

        // Sidebar er data set kora
        setSidebarData({
          categories: categoriesRes.data || [],
          popularTags: tagsRes.data || [],
          recentPosts: blogsRes.data?.slice(0, 5) || [] 
        });

      } catch (error) {
        console.error("Failed to load blog lists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogsAndSidebar();
  }, [currentPage, currentCategory, currentTag, currentSearch]);

  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
      if (key !== 'page') newParams.set('page', 1); // Notun filter apply korle page 1 theke shuru hobe
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
    window.scrollTo({ top: 400, behavior: 'smooth' }); // Scroll back up smoothly
  };

  return (
    <div className="container mx-auto px-4 md:px-8 max-w-7xl mt-16 mb-24 min-h-[600px]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Blog Posts Engine */}
        <div className="lg:col-span-8 space-y-16">
          {loading ? (
            // Zero Layout Shift (CLS) Skeleton Loaders
            [...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-[400px] bg-zinc-200 rounded-2xl mb-6"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-24 bg-zinc-200 rounded-full"></div>
                  <div className="h-6 w-32 bg-zinc-200 rounded-full"></div>
                </div>
                <div className="h-10 bg-zinc-200 rounded-md w-3/4 mb-4"></div>
                <div className="h-4 bg-zinc-200 rounded-md w-full mb-2"></div>
                <div className="h-4 bg-zinc-200 rounded-md w-2/3"></div>
              </div>
            ))
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.id} className="group animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Link to={`/blog/${post.slug}`} className="block rounded-2xl overflow-hidden mb-6 bg-zinc-100 relative pt-[60%] sm:pt-[50%] shadow-sm">
                  <img 
                    src={resolveAssetUrl(post.featuredImage?.url, defaultThumbnail)} 
                    alt={post.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </Link>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex flex-wrap gap-2">
                    {post.categories?.map((cat) => (
                      <span key={cat.id} className="px-4 py-1.5 bg-[#ffc300] text-black text-[10px] sm:text-xs font-semibold rounded-full uppercase tracking-wider">
                        {cat.name}
                      </span>
                    ))}
                  </div>
                  <span className="text-zinc-500 text-sm font-medium">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <Link to={`/blog/${post.slug}`} className="block">
                  <h2 className="font-['Outfit'] text-3xl sm:text-[43px] font-semibold leading-[1.1] text-zinc-900 mb-4 hover:text-[#ffc300] transition-colors cursor-pointer line-clamp-2">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-zinc-500 mb-6 leading-relaxed line-clamp-3 text-lg font-light">
                  {post.excerpt || "Read the full article to explore deep insights and expert opinions on modern architectural and interior design concepts."}
                </p>

                <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-zinc-900 text-sm font-bold border-b-[3px] border-zinc-900 pb-0.5 hover:text-[#ffc300] hover:border-[#ffc300] transition-colors uppercase tracking-wider">
                  Read More
                </Link>
              </article>
            ))
          ) : (
            // No Results Fallback UI
            <div className="text-center py-20 bg-white rounded-3xl border border-zinc-100 shadow-sm">
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">No Articles Found</h3>
              <p className="text-zinc-500 mb-6">We couldn't find any posts matching your current filters.</p>
              <button 
                onClick={() => navigate('/blog')} 
                className="px-6 py-2.5 bg-zinc-900 text-white rounded-full font-bold hover:bg-zinc-800 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination Engine */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-16 pt-8 border-t border-zinc-200">
              <button 
                disabled={currentPage === 1}
                onClick={() => updateFilters('page', currentPage - 1)}
                className="w-10 h-10 rounded-full bg-white border border-zinc-200 text-zinc-900 flex items-center justify-center font-bold hover:bg-zinc-50 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              
              <span className="font-bold text-zinc-900 text-sm tracking-widest uppercase">
                Page {currentPage} of {meta.totalPages}
              </span>

              <button 
                disabled={currentPage === meta.totalPages}
                onClick={() => updateFilters('page', currentPage + 1)}
                className="w-10 h-10 rounded-full bg-[#ffc300] text-black flex items-center justify-center font-bold shadow-md hover:bg-[#e6b000] transition-colors disabled:opacity-50"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Shared Relational Sidebar */}
        <div className="lg:col-span-4">
          <BlogSidebar 
            sidebarData={sidebarData}
            activeCategorySlug={currentCategory}
            onSearchSubmit={(term) => updateFilters('search', term)}
            onCategorySelect={(slug) => updateFilters('categorySlug', slug)}
            onTagSelect={(slug) => updateFilters('tagSlug', slug)}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogContent;
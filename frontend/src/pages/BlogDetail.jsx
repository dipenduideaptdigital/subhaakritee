import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogsApi } from '../api/blogs';
import useScrollAnimation from '../hooks/useScrollAnimation';
import BlogDetailHero from '../components/blog/BlogDetailHero';
import BlogBlockParser from '../components/blog/BlogBlockParser';
import BlogSidebar from '../components/blog/BlogSidebar';
import BlogReviews from '../components/blog/BlogReviews';
import CallToAction from '../components/shared/CallToAction';
import SEOHead from '../components/shared/SEOHead';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useScrollAnimation();

  useEffect(() => {
    const fetchPostDetails = async () => {
      setLoading(true);
      try {
        const response = await blogsApi.getPublicBlogBySlug(slug);
        setData(response.data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error("Error fetching blog post:", error);
        
        if (error.response?.status === 301 && error.response?.data?.data?.redirect) {
          navigate(error.response.data.data.newUrl, { replace: true });
          return;
        }

        if (error.response?.status === 404) {
          navigate('/404', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#ffc300] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) return null;

  const { blog, sidebar, navigationSiblings } = data;

  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead data={blog} type="blog" />

      <BlogDetailHero post={blog} />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl mt-16 opal-move-up mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Article Body */}
          <div className="lg:col-span-8">
            <article className="bg-transparent">
              
              {/* Header Badges */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {blog.categories?.map(cat => (
                  <span key={cat.id} className="px-4 py-1.5 bg-[#ffc300] text-white text-xs font-bold rounded-full uppercase tracking-widest">
                    {cat.name}
                  </span>
                ))}
                <span className="text-zinc-500 text-sm font-medium">
                  {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-zinc-400 text-sm font-medium">• {blog.readingTime} min read</span>
              </div>

              <h1 className="font-['Outfit'] text-[36px] md:text-[50px] font-bold text-zinc-900 leading-[1.1] tracking-tight mb-8">
                {blog.title}
              </h1>

              {/* Layout Renderer (JSON to HTML) */}
              <div className="blog-content-wrapper">
                <BlogBlockParser contentPayload={blog.content} />
              </div>

              {/* Dynamic Previous / Next Navigation */}
             <div className="flex flex-col md:flex-row justify-between items-start border-y-2 border-zinc-200 pt-8 pb-8 mt-16 mb-8 gap-8">
                {navigationSiblings?.prev ? (
                  <Link to={`/blog/${navigationSiblings.prev.slug}`} className="group w-full md:w-1/2 flex flex-col items-start">
                    <div className="flex items-center gap-2 text-zinc-400 font-bold text-[13px] tracking-widest uppercase mb-3 group-hover:text-[#ffc300] transition-colors">
                      <span className="text-lg leading-none">&larr;</span> Previous Post
                    </div>
                    <div className="font-['Outfit'] font-bold text-lg md:text-xl leading-snug text-zinc-900 group-hover:text-[#ffc300] transition-colors pr-4">
                      {navigationSiblings.prev.title}
                    </div>
                  </Link>
                ) : <div className="w-full md:w-1/2" />}

                {navigationSiblings?.next && (
                  <Link to={`/blog/${navigationSiblings.next.slug}`} className="group w-full md:w-1/2 flex flex-col items-start md:items-end text-left md:text-right">
                    <div className="flex items-center gap-2 text-zinc-400 font-bold text-[13px] tracking-widest uppercase mb-3 group-hover:text-[#ffc300] transition-colors">
                      Next Post <span className="text-lg leading-none">&rarr;</span>
                    </div>
                    <div className="font-['Outfit'] font-bold text-lg md:text-xl leading-snug text-zinc-900 group-hover:text-[#ffc300] transition-colors md:pl-4">
                      {navigationSiblings.next.title}
                    </div>
                  </Link>
                )}
              </div>

              {/* Customer Reviews Section */}
              <BlogReviews />
            </article>
          </div>

          {/* Right Column: Shared Relational Sidebar */}
          <div className="lg:col-span-4">
            <BlogSidebar 
              sidebarData={sidebar} 
              onSearchSubmit={(term) => navigate(`/blog?search=${term}`)}
              onCategorySelect={(slug) => navigate(`/blog?categorySlug=${slug}`)}
              onTagSelect={(slug) => navigate(`/blog?tagSlug=${slug}`)}
            />
          </div>

        </div>
      </div>
      <CallToAction />
    </div>
  );
};

export default BlogDetail;
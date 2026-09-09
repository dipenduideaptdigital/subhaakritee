import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BlogHero from '../components/blog/BlogHero';
import BlogContent from '../components/blog/BlogContent';
import CallToAction from '../components/shared/CallToAction';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { pagesApi } from '../api/pages';
import PageRenderer from '../components/shared/PageRenderer';
import SEOHead from '../components/shared/SEOHead';

const Blog = () => {
  const [searchParams] = useSearchParams();
  const [pageData, setPageData] = useState(null);
  const [topBlocks, setTopBlocks] = useState([]);
  const [bottomBlocks, setBottomBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useScrollAnimation();

  useEffect(() => {
    const category = searchParams.get('categorySlug');
    const search = searchParams.get('search');
    
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const res = await pagesApi.getPublicPageBySlug('blog');
        if (res.data) {
          setPageData(res.data);
          const allBlocks = res.data.content?.blocks || [];
          setTopBlocks(allBlocks.filter(b => b.type === 'blogBanner'));
          setBottomBlocks(allBlocks.filter(b => b.type !== 'blogBanner'));
        }
      } catch (err) {
        console.error("Failed to fetch blog page content. Showing static fallback.", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPageData();

    let title = 'Blog & Articles | Subhaakritee';
    if (category) title = `Category: ${category} - Blog | Subhaakritee`;
    if (search) title = `Search: "${search}" - Blog | Subhaakritee`;

    document.title = title;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {pageData && (
        <SEOHead 
          data={{
            title: pageData.metaTitle || 'Blog & Articles | Subhaakritee',
            metaDescription: pageData.metaDescription || 'Read our latest blogs and articles.'
          }} 
          type="page" 
        />
      )}
      {topBlocks.length > 0 ? (
        <PageRenderer blocks={topBlocks} />
      ) : (
        <BlogHero />
      )}

      <BlogContent />
      {bottomBlocks.length > 0 ? (
        <PageRenderer blocks={bottomBlocks} />
      ) : (
        <CallToAction />
      )}
    </div>
  );
};

export default Blog;
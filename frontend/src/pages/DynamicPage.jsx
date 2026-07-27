import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { pagesApi } from '../api/pages';
import apiClient from '../api/client';
import { ArrowLeft } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import PageRenderer from '../components/shared/PageRenderer';
import SEOHead from '../components/shared/SEOHead'; 

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  let baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
  const safePath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${safePath}`;
};

const DynamicPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname; 
  
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorConfig, setErrorConfig] = useState(null);

  useScrollAnimation();

  // Fetch Page Data
  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await pagesApi.getPublicPageBySlug(currentPath);
        setPage(response.data);
        
      } catch (err) {
        console.error('Failed to load page:', err);
        
        if (err.response?.status === 301 && err.response?.data?.data?.redirect) {
          navigate(err.response.data.data.newUrl, { replace: true });
          return;
        }

        setError(err.response?.status === 404 ? 'not-found' : 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [currentPath, navigate]); 

  useEffect(() => {
    if (error === 'not-found') {
      apiClient.get('/cms/section/global_general_settings')
        .then(res => {
          const content = res.data?.data?.content || res.data?.content;
          if (content) {
            setErrorConfig(content);
          }
        })
        .catch(err => {
          console.error("Failed to load global error settings:", err);
        });
    }
  }, [error]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
        <p className="mt-4 text-zinc-500 font-medium tracking-wide">Loading page...</p>
      </div>
    );
  }

  if (error === 'not-found') {
    const errorTitle = errorConfig?.errorPageTitle || 'Page Not Found';
    const errorDesc = errorConfig?.errorPageDescription || "The page you are looking for doesn't exist or has been moved.";
    const errorBtn = errorConfig?.errorPageButtonText || 'Back to Home';
    const errorImg = errorConfig?.errorPageImage ? getAssetUrl(errorConfig.errorPageImage) : null;

    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 py-20 font-sans animate-in fade-in duration-700">
        
        {errorImg ? (
          <img 
            src={errorImg} 
            alt="404 Graphic" 
            className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain mb-8 animate-in slide-in-from-bottom-4 duration-700" 
          />
        ) : (
          <h1 className="text-8xl md:text-[150px] font-black text-zinc-100 mb-2 leading-none font-['Outfit'] select-none">
            404
          </h1>
        )}

        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4 tracking-tight">
          {errorTitle}
        </h2>
        
        <p className="text-zinc-500 mb-10 max-w-md mx-auto text-sm md:text-base leading-relaxed">
          {errorDesc}
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center gap-3 px-8 py-3.5 bg-zinc-900 text-white rounded-full font-bold hover:bg-[#3B82F6] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 uppercase tracking-wide text-xs group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {errorBtn}
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Something went wrong</h2>
        <p className="text-zinc-500">There was an issue loading this page. Please try again later.</p>
      </div>
    );
  }

  if (!page) return null;

  return (
    <>
      <SEOHead data={page} type="page" />
      <PageRenderer blocks={page.content?.blocks} />
    </>
  );
};

export default DynamicPage;
import { useEffect } from 'react';
import apiClient from '../api/client';

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

export const useDynamicHead = () => {
  useEffect(() => {
    const fetchAndApplySettings = async () => {
      try {
        const res = await apiClient.get('/cms/section/global_general_settings');
        const content = res.data?.data?.content || res.data?.content;

        if (content) {
          if (content.websiteName) {
            document.title = content.websiteName;
          }

          if (content.faviconImage) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            link.href = getAssetUrl(content.faviconImage);
          }
        }
      } catch (error) {
        console.error('Failed to load dynamic head settings:', error);
      }
    };

    fetchAndApplySettings();
  }, []);
};
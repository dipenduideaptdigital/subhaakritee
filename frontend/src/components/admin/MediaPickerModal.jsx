import React, { useState, useEffect, useCallback } from 'react';
import { X, Search, Loader2, Upload, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { mediaApi } from '../../api/media';
import { resolveAssetUrl } from '../../utils/assetResolver';

const MediaPickerModal = ({ isOpen, onClose, onSelect }) => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);

  const fetchMedia = useCallback(async (searchQuery = '', currentPage = 1) => {
    try {
      setLoading(true);
      const res = await mediaApi.getAllMedia({ search: searchQuery, page: currentPage, limit: 24 });
      setMediaList(res.data || []);
      setMeta(res.meta);
    } catch (error) {
      console.error("Failed to fetch media:", error);
      setMediaList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setPage(1);
      fetchMedia(searchTerm, 1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, isOpen, fetchMedia]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    if (files.length === 1) {
      formData.append('image', files[0]);
    } else {
      Array.from(files).forEach(file => formData.append('images', file));
    }

    try {
      setUploading(true);
      let res;
      if (files.length === 1) {
        res = await mediaApi.uploadImage(formData);
      } else {
        await mediaApi.uploadMultipleImages(formData);
      }
      setPage(1);
      fetchMedia(searchTerm, 1);
      if (files.length === 1 && res?.data) {
        setSelectedMedia(res.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedMedia) {
      onSelect(selectedMedia.url, selectedMedia.id); 
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950/60 dark:bg-zinc-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl border border-transparent dark:border-zinc-800 overflow-hidden font-sans transition-colors duration-300">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Select Media</h2>
            {/* Total File Count */}
            {meta && (
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-md text-xs font-bold border border-blue-200 dark:border-blue-500/20 transition-colors duration-300">
                {meta.total} Files
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0 transition-colors duration-300">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search images..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 rounded-lg text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400/50 transition-colors"
            />
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload New'}
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-zinc-950/50 transition-colors duration-300">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-400 dark:text-zinc-500" />
            </div>
          ) : mediaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-500">
              <p>No images found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {mediaList.map((media) => (
                <div 
                  key={media.id} 
                  onClick={() => setSelectedMedia(media)}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedMedia?.id === media.id 
                      ? 'border-blue-600 dark:border-blue-500 shadow-md scale-[0.98] ring-2 ring-blue-500/20 dark:ring-blue-400/20' 
                      : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm'
                  }`}
                >
                  <img 
                    src={resolveAssetUrl(media.thumbnailUrl || media.url)} 
                    alt={media.originalName} 
                    className="w-full h-full object-cover bg-white dark:bg-zinc-800 transition-colors duration-300"
                    loading="lazy"
                  />
                  {selectedMedia?.id === media.id && (
                    <div className="absolute inset-0 bg-blue-600/20 dark:bg-blue-500/30 flex items-center justify-center transition-colors">
                      <CheckCircle className="w-8 h-8 text-white drop-shadow-md" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer (with Pagination inside) */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between shrink-0 transition-colors duration-300">
          {/* Pagination Controls */}
          <div className="flex items-center gap-3">
            {meta?.totalPages > 1 && (
              <>
                <button 
                  onClick={() => {
                    const prevPage = Math.max(1, page - 1);
                    setPage(prevPage);
                    fetchMedia(searchTerm, prevPage);
                  }}
                  disabled={page === 1 || loading}
                  className="p-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  {page} / {meta.totalPages}
                </span>
                <button 
                  onClick={() => {
                    const nextPage = Math.min(meta.totalPages, page + 1);
                    setPage(nextPage);
                    fetchMedia(searchTerm, nextPage);
                  }}
                  disabled={page === meta.totalPages || loading}
                  className="p-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              className="px-5 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirmSelection}
              disabled={!selectedMedia}
              className="px-6 py-2.5 bg-blue-600 dark:bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Insert Image
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MediaPickerModal;
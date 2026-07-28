import React, { useState, useEffect, useCallback } from 'react';
import { mediaApi } from '../../../api/media';
import { resolveAssetUrl } from '../../../utils/assetResolver';
import { 
  Upload, Search, Copy, Trash2, X, Image as ImageIcon, 
  CheckCircle, Loader2, ArrowLeft, ArrowRight
} from 'lucide-react';
import { Can } from '../../../components/shared/Can';

const MediaLibrary = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [copied, setCopied] = useState(false);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);

  const fetchMedia = useCallback(async (searchQuery = '', currentPage = 1) => {
    try {
      setLoading(true);
      const res = await mediaApi.getAllMedia({ search: searchQuery, page: currentPage, limit: 30 });
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
    const timer = setTimeout(() => {
      setPage(1);
      fetchMedia(searchTerm, 1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchMedia]);

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
      if (files.length === 1) {
        await mediaApi.uploadImage(formData);
      } else {
        await mediaApi.uploadMultipleImages(formData);
      }
      setPage(1);
      fetchMedia(searchTerm, 1);
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this media?")) return;
    try {
      await mediaApi.deleteMedia(id);
      fetchMedia(searchTerm, page);
      if (selectedMedia?.id === id) setSelectedMedia(null);
    } catch (err) {
      alert("Failed to delete media.");
    }
  };

  const copyToClipboard = (url) => {
    const fullUrl = resolveAssetUrl(url);
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="h-[calc(100vh-125px)] flex flex-col font-sans animate-in fade-in duration-500 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-t-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 mb-4 shrink-0 transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
            Media Library
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 flex items-center gap-2">
            Manage all your uploaded images and assets centrally.
            {/* Total Item Count Badge */}
            {meta && (
              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md font-bold text-xs border border-blue-100 dark:border-blue-500/20">
                {meta.total} Files
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search files..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-colors"
            />
          </div>
          
          <Can permission="media.upload">
            <label className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors shadow-sm cursor-pointer disabled:opacity-50">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Uploading...' : 'Add New'}
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </Can>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        <div className={`flex-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-y-auto flex flex-col transition-all duration-300 ${selectedMedia ? 'w-2/3' : 'w-full'}`}>
          <div className="flex-1 p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-400 dark:text-zinc-600" />
              </div>
            ) : mediaList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-500">
                <ImageIcon className="w-16 h-16 mb-4 opacity-20 dark:opacity-30" />
                <p>No media files found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {mediaList.map((media) => (
                  <div 
                    key={media.id} 
                    onClick={() => setSelectedMedia(media)}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${selectedMedia?.id === media.id ? 'border-blue-500 dark:border-blue-400 shadow-md ring-2 ring-blue-500/20 dark:ring-blue-400/20' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-500'}`}
                  >
                    <img 
                      src={resolveAssetUrl(media.thumbnailUrl || media.url)} 
                      alt={media.originalName} 
                      className="w-full h-full object-cover bg-zinc-50 dark:bg-zinc-800"
                      loading="lazy"
                    />
                    {selectedMedia?.id === media.id && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-0.5 shadow-sm">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom Pagination */}
          {meta?.totalPages > 1 && (
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/50 rounded-b-2xl transition-colors">
              <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                Page {page} of {meta.totalPages}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const prevPage = Math.max(1, page - 1);
                    setPage(prevPage);
                    fetchMedia(searchTerm, prevPage);
                  }}
                  disabled={page === 1 || loading}
                  className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Prev
                </button>
                <button 
                  onClick={() => {
                    const nextPage = Math.min(meta.totalPages, page + 1);
                    setPage(nextPage);
                    fetchMedia(searchTerm, nextPage);
                  }}
                  disabled={page === meta.totalPages || loading}
                  className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Attachment Details Panel */}
        {selectedMedia && (
          <div className="w-1/3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-y-auto hidden md:flex flex-col animate-in slide-in-from-right-4 duration-300 transition-colors">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900 sticky top-0 z-10 transition-colors">
              <h2 className="font-bold text-zinc-800 dark:text-zinc-100">Attachment Details</h2>
              <button onClick={() => setSelectedMedia(null)} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500 dark:text-zinc-400 transition-colors"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6">
              <div className="w-full aspect-video rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 mb-6 shadow-sm">
                <img src={resolveAssetUrl(selectedMedia.url)} alt={selectedMedia.originalName} className="w-full h-full object-contain" />
              </div>

              <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 mb-8">
                <div className="flex gap-2"><strong className="w-24 text-zinc-800 dark:text-zinc-200">File name:</strong> <span className="break-all">{selectedMedia.originalName}</span></div>
                <div className="flex gap-2"><strong className="w-24 text-zinc-800 dark:text-zinc-200">File type:</strong> {selectedMedia.mimeType}</div>
                <div className="flex gap-2"><strong className="w-24 text-zinc-800 dark:text-zinc-200">File size:</strong> {formatBytes(selectedMedia.size)}</div>
                <div className="flex gap-2"><strong className="w-24 text-zinc-800 dark:text-zinc-200">Uploaded on:</strong> {new Date(selectedMedia.createdAt).toLocaleDateString()}</div>
                <div className="flex gap-2"><strong className="w-24 text-zinc-800 dark:text-zinc-200">Uploaded by:</strong> {selectedMedia.uploadedBy?.name || 'Admin'}</div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200">File URL:</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={resolveAssetUrl(selectedMedia.url)} 
                    className="flex-1 px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs text-zinc-600 dark:text-zinc-300 focus:outline-none transition-colors"
                  />
                </div>
                <button 
                  onClick={() => copyToClipboard(selectedMedia.url)}
                  className="w-full py-2.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied to clipboard!' : 'Copy URL to clipboard'}
                </button>
              </div>

              <Can permission="media.delete">
                <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <button 
                    onClick={() => handleDelete(selectedMedia.id)}
                    className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium flex items-center gap-2 hover:underline transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Permanently
                  </button>
                </div>
              </Can>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;
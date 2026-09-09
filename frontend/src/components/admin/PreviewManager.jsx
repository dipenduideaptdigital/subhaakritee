import React, { useState, useEffect } from 'react';
import { Eye, Copy, Trash2, CheckCircle, ExternalLink, RefreshCw, Sparkles, Clock, ShieldAlert } from 'lucide-react';
import { pagesApi } from '../../api/pages';
import { blogsApi } from '../../api/blogs';

const PreviewManager = ({ id, entityType = 'page' }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const api = entityType === 'blog' ? blogsApi : pagesApi;

  useEffect(() => {
    if (id) fetchStatus();
  }, [id, entityType]);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await api.getPreviewStatus(id);
      setStatus(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    try {
      setGenerating(true);
      const res = await api.generatePreviewLink(id);
      setStatus({ 
        isActive: true, 
        url: res.data.previewUrl, 
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() 
      });
    } catch (err) {
      alert(`Failed to generate ${entityType} preview.`);
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async (e) => {
    if (e) e.preventDefault();
    if (!window.confirm("Are you sure you want to revoke this link? Clients will no longer be able to view the preview.")) return;
    try {
      setLoading(true);
      await api.revokePreviewLink(id);
      setStatus({ isActive: false });
    } catch (err) {
      alert("Failed to revoke link.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (e) => {
    if (e) e.preventDefault();
    if (status?.url) {
      navigator.clipboard.writeText(status.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!id) {
    return (
      <button type="button" disabled className="h-[42px] px-5 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500 rounded-xl text-sm font-semibold border border-zinc-200 dark:border-zinc-700/50 cursor-not-allowed flex items-center gap-2 transition-colors">
        <Eye className="w-4 h-4" /> Save to Preview
      </button>
    );
  }

  if (loading) return <div className="w-32 h-[42px] animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>;

  return (
    <div className="flex flex-col items-end gap-1.5 animate-in fade-in zoom-in-95 duration-300">
      
      {/* No Active Preview */}
      {!status?.isActive && (
        <button 
          type="button" 
          onClick={handleGenerate}
          disabled={generating}
          className="h-[42px] px-5 rounded-xl text-sm font-bold text-white transition-all flex items-center gap-2 shadow-md shadow-orange-500/20 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-blue-600 hover:to-emerald-600 disabled:opacity-70 cursor-pointer"
        >
          {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate Preview
        </button>
      )}

      {/* Preview Active */}
      {status?.isActive && (
        <div className="h-[42px] flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/80 px-2 rounded-xl shadow-sm transition-colors duration-300">
          
          <div className="hidden sm:flex items-center gap-2 px-2.5 border-r border-zinc-200 dark:border-zinc-700/80" title="Preview is currently live">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300 tracking-wide uppercase">Live</span>
          </div>

          {/* Action Buttons based on URL availability */}
          {status.url ? (
            <>
              <a 
                href={status.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View
              </a>
              <button 
                type="button" 
                onClick={copyToClipboard}
                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />} 
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </>
          ) : (
            <button 
              type="button" 
              onClick={handleGenerate}
              disabled={generating}
              className="px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="URL hidden for security. Regenerate to view."
            >
              {generating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} 
              Regenerate
            </button>
          )}

          {/* Always show Revoke */}
          <button 
            type="button" 
            onClick={handleRevoke}
            className="px-3 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-red-100 dark:border-red-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" /> Revoke
          </button>

        </div>
      )}

      {/* Expiry Date Below */}
      {status?.isActive && status?.expiresAt && (
        <div className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1 pr-1 transition-colors duration-300">
          <Clock className="w-3 h-3" /> 
          Expires: {new Date(status.expiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  );
};

export default PreviewManager;
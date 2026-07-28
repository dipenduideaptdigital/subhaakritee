import React, { useState, useEffect } from 'react';
import { Archive, Stamp, Plus, Trash2, AlertCircle } from 'lucide-react';
import { blogsApi } from '../../../api/blogs';
import { Can } from '../../../components/shared/Can';

const TaxonomyManager = () => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, tagRes] = await Promise.all([
        blogsApi.getPublicCategories(),
        blogsApi.getPublicTags()
      ]);
      setCategories(catRes.data || []);
      setTags(tagRes.data || []);
    } catch (err) {
      setError('Failed to fetch taxonomies.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    try {
      await blogsApi.createCategory({ name: newCat });
      setNewCat('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding category');
    }
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    try {
      await blogsApi.createTag({ name: newTag });
      setNewTag('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding tag');
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Delete this ${type}? It will fail if currently used by any blog.`)) return;
    try {
      if (type === 'category') await blogsApi.deleteCategory(id);
      else await blogsApi.deleteTag(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || `Cannot delete. It is actively linked to a blog post.`);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Retrieving records…</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans space-y-8 animate-in fade-in duration-500 transition-colors duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Archive className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
            Categories &amp; Tags
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Manage blog classification taxonomies.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 transition-colors duration-300 text-sm font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Categories Drawer Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm flex flex-col justify-between transition-colors duration-300">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-5 transition-colors duration-300">
              <div className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Categories</h2>
              </div>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded-md border border-zinc-100 dark:border-zinc-700">
                {categories.length} entries
              </span>
            </div>

            <Can permission="taxonomy.create">
              <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  placeholder="Name a new category…"
                  className="flex-1 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl leading-5 bg-white dark:bg-zinc-950 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors sm:text-sm font-medium text-zinc-900 dark:text-zinc-100"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors text-sm flex-shrink-0 shadow-sm focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </form>
            </Can>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {categories.length === 0 && (
                <p className="text-sm italic text-zinc-500 dark:text-zinc-400 py-4">No categories filed yet.</p>
              )}
              {categories.map((c, idx) => (
                <div
                  key={c.id}
                  className="flex justify-between items-center py-3 group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 px-2 rounded-lg transition-colors -mx-2"
                >
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono tabular-nums flex-shrink-0">
                      {String(idx + 1).padStart(3, '0')}
                    </span>
                    <div className="min-w-0">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 block truncate">{c.name}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">/{c.slug}</span>
                    </div>
                  </div>
                  <Can permission="taxonomy.delete">
                    <button
                      onClick={() => handleDelete(c.id, 'category')}
                      className="p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Can>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tags Drawer Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm flex flex-col justify-between transition-colors duration-300">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-5 transition-colors duration-300">
              <div className="flex items-center gap-2">
                <Stamp className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Tags</h2>
              </div>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded-md border border-zinc-100 dark:border-zinc-700">
                {tags.length} entries
              </span>
            </div>

            <Can permission="taxonomy.create">
              <form onSubmit={handleAddTag} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Name a new tag…"
                  className="flex-1 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl leading-5 bg-white dark:bg-zinc-950 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors sm:text-sm font-medium text-zinc-900 dark:text-zinc-100"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors text-sm flex-shrink-0 shadow-sm focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </form>
            </Can>

            <div className="flex flex-wrap gap-2 max-h-[350px] overflow-y-auto content-start pr-2 custom-scrollbar">
              {tags.length === 0 && (
                <p className="text-sm italic text-zinc-500 dark:text-zinc-400 py-4 w-full">No tags stamped yet.</p>
              )}
              {tags.map((t) => (
                <div
                  key={t.id}
                  className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:border-zinc-300 dark:hover:border-zinc-500 transition-colors group"
                >
                  <span>{t.name}</span>
                  <Can permission="taxonomy.delete">
                    <button
                      onClick={() => handleDelete(t.id, 'tag')}
                      className="text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 p-0.5 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </Can>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaxonomyManager;
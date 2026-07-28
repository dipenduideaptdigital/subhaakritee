import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { projectsApi } from '../../../api/projects';
import ImageField from '../../../components/admin/ImageField';
import TipTapEditor from '../../../components/admin/TipTapEditor'; 
import { Save, ArrowLeft, Plus, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import Can from '../../../components/shared/Can';

const CollapsibleTiptap = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPreviewText = (html) => {
    if (!html) return 'No content added...';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    return text.length > 60 ? text.substring(0, 60) + '...' : text || 'No content added...';
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-zinc-200">{label}</label>}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm transition-all duration-200">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors outline-none cursor-pointer"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Edit2 className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
              {isOpen ? 'Close Editor' : getPreviewText(value)}
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
          )}
        </button>
        
        {isOpen && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <TipTapEditor value={value || ''} onChange={onChange} />
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectEditor = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '', category: 'Residential', year: '', location: '', client: '', area: '', 
    description: '', details: '', status: 'PUBLISHED', featuredImageId: '',
    bulletPoints: [''], 
    spaces: [{ size: '', label: '' }] 
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      projectsApi.getProjectById(id).then(res => {
        const data = res.data;
        
        if (!data.bulletPoints || data.bulletPoints.length === 0) data.bulletPoints = [''];
        if (!data.spaces || data.spaces.length === 0) data.spaces = [{ size: '', label: '' }];
        
        data.featuredImageId = data.featuredImage?.url || data.featuredImageId || '';
        
        setFormData(data);
      }).catch(console.error);
    }
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBulletChange = (index, value) => {
    const newBullets = [...formData.bulletPoints];
    newBullets[index] = value;
    setFormData({ ...formData, bulletPoints: newBullets });
  };
  const addBullet = () => setFormData({ ...formData, bulletPoints: [...formData.bulletPoints, ''] });
  const removeBullet = (index) => setFormData({ ...formData, bulletPoints: formData.bulletPoints.filter((_, i) => i !== index) });

  const handleSpaceChange = (index, field, value) => {
    const newSpaces = [...formData.spaces];
    newSpaces[index][field] = value;
    setFormData({ ...formData, spaces: newSpaces });
  };
  const addSpace = () => setFormData({ ...formData, spaces: [...formData.spaces, { size: '', label: '' }] });
  const removeSpace = (index) => setFormData({ ...formData, spaces: formData.spaces.filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData };
      
      payload.bulletPoints = payload.bulletPoints.filter(b => b.trim() !== '');
      payload.spaces = payload.spaces.filter(s => s.size.trim() !== '' && s.label.trim() !== '');

      if (!payload.featuredImageId || payload.featuredImageId.trim() === '') {
        payload.featuredImageId = null; 
      }

      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.featuredImage;

      if (isEditMode) await projectsApi.updateProject(id, payload);
      else await projectsApi.createProject(payload);
      
      navigate('/admin/projects');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors">
        <div className="flex items-center gap-4">
          <Link to="/admin/projects" className="p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5"/>
          </Link>
          <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Project' : 'Add New Project'}</h1>
        </div>
        <Can permission={isEditMode ? 'project.edit' : 'project.create'}>
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-zinc-900 dark:bg-indigo-600 text-white rounded-xl flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-indigo-500 transition-colors shadow-sm disabled:opacity-70 cursor-pointer text-sm font-medium">
            <Save className="w-4 h-4" /> Save
          </button>
        </Can>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Details */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-5 transition-colors">
            <h2 className="font-bold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3">Basic Details</h2>
            
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Title *</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full mt-1.5 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:border-indigo-500 transition-colors" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full mt-1.5 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors cursor-pointer">
                  <option>Residential</option><option>Commercial</option><option>Landscape</option><option>Interior</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full mt-1.5 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors cursor-pointer">
                  <option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Year</label>
                <input name="year" value={formData.year} onChange={handleChange} className="w-full mt-1.5 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Location</label>
                <input name="location" value={formData.location} onChange={handleChange} className="w-full mt-1.5 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Client</label>
                <input name="client" value={formData.client} onChange={handleChange} className="w-full mt-1.5 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Area (sq.ft)</label>
                <input name="area" value={formData.area} onChange={handleChange} className="w-full mt-1.5 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors" />
              </div>
            </div>

            <div className="pt-2">
              <CollapsibleTiptap
                label="Short Description (List View)"
                value={formData.description}
                onChange={(val) => setFormData({ ...formData, description: val })}
              />
            </div>

            <div>
              <CollapsibleTiptap
                label="Full Details (Project Page)"
                value={formData.details}
                onChange={(val) => setFormData({ ...formData, details: val })}
              />
            </div>
          </div>

          {/* Highlights & Spaces */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-8 transition-colors">
            <div>
              <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
                <h2 className="font-bold text-lg">Highlight Bullet Points</h2>
                <button type="button" onClick={addBullet} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer">
                  <Plus className="w-4 h-4"/> Add Point
                </button>
              </div>
              {formData.bulletPoints.map((bullet, index) => (
                <div key={index} className="flex items-center gap-3 mb-3">
                  <input value={bullet} onChange={(e) => handleBulletChange(index, e.target.value)} placeholder="e.g., Experienced engineers..." className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors" />
                  <button type="button" onClick={() => removeBullet(index)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
                <h2 className="font-bold text-lg">Spaces Breakdown</h2>
                <button type="button" onClick={addSpace} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer">
                  <Plus className="w-4 h-4"/> Add Space
                </button>
              </div>
              {formData.spaces.map((space, index) => (
                <div key={index} className="flex items-center gap-3 mb-3">
                  <input value={space.size} onChange={(e) => handleSpaceChange(index, 'size', e.target.value)} placeholder="e.g., (30M2)" className="w-1/3 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors" />
                  <input value={space.label} onChange={(e) => handleSpaceChange(index, 'label', e.target.value)} placeholder="e.g., Bedroom" className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors" />
                  <button type="button" onClick={() => removeSpace(index)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Image */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors">
            <h2 className="font-bold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-5">Featured Image</h2>
            <ImageField value={formData.featuredImageId} onChange={(val) => setFormData({...formData, featuredImageId: val})} />
          </div>
        </div>
      </div>
      
      {/* Bottom Save */}
      <div className="flex justify-start mt-8 pt-4">
        <Can permission={isEditMode ? 'project.edit' : 'project.create'}>
          <button 
            type="submit" 
            disabled={saving} 
            className="px-8 py-3 bg-zinc-900 dark:bg-indigo-600 hover:bg-zinc-800 dark:hover:bg-indigo-500 text-white rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-zinc-900/20 dark:shadow-indigo-900/20 disabled:opacity-70 text-sm font-semibold cursor-pointer"
          >
            <Save className="w-5 h-5" /> 
            {saving ? 'Saving...' : 'Save Project'}
          </button>
        </Can>
      </div>
    </form>
  );
};

export default ProjectEditor;
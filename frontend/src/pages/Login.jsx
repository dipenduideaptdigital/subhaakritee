import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import heroback from '../assets/homepage/banner_back.png';
import logo from '../assets/logos/logo2.svg';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

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

const Login = () => {
  const navigate = useNavigate();
  const { loginContext } = useAuth();
  const [searchParams] = useSearchParams();
  const isAdminMode = searchParams.get('mode') === 'admin';
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customLogo, setCustomLogo] = useState(logo);

  useEffect(() => {
    apiClient.get('/cms/section/global_general_settings')
      .then(res => {
        const dbLogo = res.data?.data?.content?.adminLoginLogo;
        if (dbLogo) setCustomLogo(getAssetUrl(dbLogo));
      })
      .catch(err => console.error('Failed to load custom logo', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!executeRecaptcha) {
      setError("Security verification is still loading. Please try again in a moment.");
      setLoading(false);
      return;
    }

     try {
      const recaptchaToken = await executeRecaptcha('login');

      const endpoint = isAdminMode ? '/auth/admin-login' : '/auth/login';
      const payload = {
        ...formData,
        recaptchaToken
      };

      const res = await apiClient.post(endpoint, payload);
      const { data } = res;

      setSuccess('Login successful! Redirecting...');
      
      const tokenPayload = JSON.parse(atob(data.data.accessToken.split('.')[1]));
      const userPermissions = tokenPayload.permissions || [];
      const loggedInUser = data.data.user;
      const roleSlug = loggedInUser?.systemRole?.slug?.toUpperCase();
      const isAdmin = roleSlug === 'SUPER_ADMIN' || roleSlug === 'ADMIN';

      loginContext(loggedInUser, data.data.accessToken);

      setTimeout(() => {
        if (isAdmin) {
          navigate('/admin', { replace: true }); 
        } else {
          navigate('/', { replace: true });
        }
      }, 1500);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Unable to connect to the server.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const activeColor = '#3B82F6';
  const shadowColor = 'rgba(59,130,246,0.25)';

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-zinc-950 px-4 py-8"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(9, 9, 11, 0.75), rgba(9, 9, 11, 0.9)), url(${heroback})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: activeColor, opacity: 0.15 }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: activeColor, opacity: 0.1 }}
      />

      <div 
        className="relative w-full max-w-md backdrop-blur-2xl bg-zinc-950/45 border rounded-[2rem] p-8 text-white transition-all duration-500 shadow-2xl flex flex-col items-center"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.08)',
          boxShadow: `0 0 50px ${shadowColor}, inset 0 0 20px rgba(255, 255, 255, 0.02)`,
        }}
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 cursor-pointer select-none">
          <Link to="/" className="flex items-center justify-center hover:opacity-90 transition-opacity">
            <img 
              src={customLogo} 
              alt="Subhaakritee Logo" 
              className="h-10 md:h-12 w-auto object-contain brightness-0 invert" 
            />
          </Link>
          <div className="text-[9px] tracking-[0.22em] mt-3 uppercase opacity-60 text-center">
            The Design People
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-wide text-zinc-100 mb-6 text-center">
          {isAdminMode ? 'Admin Portal Sign In' : 'Welcome Back'}
        </h2>

        {error && (
          <div className="w-full flex items-start gap-3 bg-red-950/45 border border-red-500/30 text-red-200 text-sm p-4 rounded-2xl mb-6 animate-shake animate-duration-300">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="w-full flex items-start gap-3 bg-emerald-950/45 border border-emerald-500/30 text-emerald-200 text-sm p-4 rounded-2xl mb-6">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase block">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-900/60 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-300 text-sm"
                style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
                onFocus={(e) => {
                  e.target.style.borderColor = activeColor;
                  e.target.style.boxShadow = `0 0 12px rgba(59,130,246,0.2)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase block">
                Password
              </label>
              <Link 
                to="/forgot-password" 
                className="text-xs text-zinc-500 hover:text-white transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3.5 bg-zinc-900/60 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-300 text-sm"
                style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
                onFocus={(e) => {
                  e.target.style.borderColor = activeColor;
                  e.target.style.boxShadow = `0 0 12px rgba(59,130,246,0.2)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-6"
            style={{
              backgroundColor: activeColor,
              color: 'white',
              boxShadow: `0 4px 20px ${shadowColor}`,
            }}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-sm text-zinc-400">
          New to subAAkritee?{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
            Sign Up
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 w-full text-center space-y-3">
          <p className="text-[10px] text-zinc-500 leading-relaxed max-w-[280px] mx-auto">
            This site is protected by reCAPTCHA and the Google{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400 hover:underline transition-colors">Privacy Policy</a> and{' '}
            <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400 hover:underline transition-colors">Terms of Service</a> apply.
          </p>
          <p className="text-[10px] text-zinc-600 leading-relaxed max-w-[280px] mx-auto">
            Secured access using corporate credentials. Managed by internal IT operations &trade;.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
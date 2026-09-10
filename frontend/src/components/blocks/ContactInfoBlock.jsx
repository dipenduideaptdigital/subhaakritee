import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import apiClient from '../../api/client';
import { resolveAssetUrl } from '../../utils/assetResolver';

const ContactInfoBlock = ({
  badgeText,
  title,
  addressTitle,
  addressText,
  supportTitle,
  supportPhone,
  supportEmail,
  workspaceImage,
  mapIframeUrl,
  formId
}) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formId) {
      setStatus({ loading: false, success: false, error: 'Configuration Error: No active Form ID is linked to this block.' });
      return;
    }

    if (!executeRecaptcha) {
      setStatus({ loading: false, success: false, error: 'Security verification is loading. Please try again in a moment.' });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    try {
      const recaptchaToken = await executeRecaptcha('contact_info');

      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const payload = {
        name: fullName,
        email: formData.email,
        phone: formData.contactNo,
        message: formData.message,
        formId: formId,
        recaptchaToken 
      };

      await apiClient.post('/contacts/submit', payload);

      setStatus({ loading: false, success: true, error: null });
      setFormData({ firstName: '', lastName: '', email: '', contactNo: '', message: '' });
      
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
    } catch (err) {
      console.error('Form submission failed:', err);
      setStatus({ 
        loading: false, 
        success: false, 
        error: err.response?.data?.message || 'Something went wrong. Please try again later.' 
      });
    }
  };

  // Iframe URL Extractor
  const getSafeMapUrl = (input) => {
    if (!input) return '';
    if (input.includes('<iframe')) {
      const match = input.match(/src="([^"]+)"/);
      return match ? match[1] : '';
    }
    return input;
  };
  const finalMapUrl = getSafeMapUrl(mapIframeUrl);

  // For rendering highlighted title
  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const parts = titleText.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-[#ffc300]">
            {part.slice(1, -1).split(/\\n|\n/).map((line, lIdx, arr) => (
              <React.Fragment key={lIdx}>
                {line}
                {lIdx < arr.length - 1 && <br className="hidden md:block" />}
              </React.Fragment>
            ))}
          </span>
        );
      }
      return part.split(/\\n|\n/).map((line, lIdx, arr) => (
        <React.Fragment key={lIdx}>
          {line}
          {lIdx < arr.length - 1 && <br className="hidden md:block" />}
        </React.Fragment>
      ));
    });
  };

  return (
    <section className="pt-20 md:pt-28 pb-0 bg-white font-helvetica flex flex-col">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-8 lg:gap-12 items-start mb-16 lg:mb-24">
          <div className="fadeInLeft shrink-0">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 lg:ml-13 rounded-full border border-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                {badgeText || 'GET IN TOUCH'}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start text-left opal-move-up w-full lg:ml-20">
            <h2 className="text-4xl md:text-5xl lg:text-[54px] xl:text-[56px] font-bold text-gray-950 leading-[1.12] tracking-tight font-helvetica w-full">
              {renderTitle(title || "Have a Project In [Mind? Let's]\n[Make] It Happen.")}
            </h2>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-8 lg:mb-12">
          <div className="flex flex-row flex-wrap gap-12 md:gap-24 fadeInLeft">
            <div className="flex flex-col text-left">
              <h4 className="text-[15px] font-bold text-gray-900 mb-3 md:mb-4">{addressTitle || 'Address:'}</h4>
              <p className="text-gray-600 text-sm leading-relaxed max-w-[220px] whitespace-pre-line">
                {addressText || 'Office: AG 40 , Sector II, Salt Lake\nCity, Kolkata: 700091'}
              </p>
            </div>
            <div className="flex flex-col text-left">
              <h4 className="text-[15px] font-bold text-gray-900 mb-3 md:mb-4">{supportTitle || 'Support'}</h4>
              <p className="text-gray-900 font-bold text-[15px] mb-1">{supportPhone || '+91 9831-637-409'}</p>
              <a href={`mailto:${supportEmail}`} className="text-gray-600 text-[15px] hover:text-[#ffc300] transition-colors">
                {supportEmail || 'Subhaakritee@Hotmail.Com'}
              </a>
            </div>
          </div>
          <div className="hidden lg:block"></div>
        </div>

        {/* Image and Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch pb-20 md:pb-28">
          
          <div className="w-full h-[400px] lg:h-full min-h-[450px] lg:min-h-[500px] rounded-[2.3rem] overflow-hidden fadeInLeft">
            <img 
              src={resolveAssetUrl(workspaceImage, '/default-workspace.png')} 
              alt="Our Workspace" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
            />
          </div>
          <div className="bg-white fadeInRight flex flex-col justify-center h-full">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-5 md:space-y-6">
              
              {status.success && (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Your message has been sent successfully. We will get back to you soon!
                </div>
              )}

              {status.error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  {status.error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div className="flex flex-col text-left">
                  <label className="text-sm font-medium text-gray-700 mb-2">First name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" required disabled={status.loading}
                    className="w-full bg-white text-gray-900 px-5 border border-gray-300 outline-none placeholder:text-gray-400 placeholder:font-light focus:border-[#ffc300] transition-colors text-sm disabled:opacity-50" 
                    style={{ height: '48.4px', borderRadius: '20px' }} />
                </div>
                <div className="flex flex-col text-left">
                  <label className="text-sm font-medium text-gray-700 mb-2">Last name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" required disabled={status.loading}
                    className="w-full bg-white text-gray-900 px-5 border border-gray-300 outline-none placeholder:text-gray-400 placeholder:font-light focus:border-[#ffc300] transition-colors text-sm disabled:opacity-50" 
                    style={{ height: '48.4px', borderRadius: '20px' }} />
                </div>
              </div>

              <div className="flex flex-col text-left">
                <label className="text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@gmail.com" required disabled={status.loading}
                  className="w-full bg-white text-gray-900 px-5 border border-gray-300 outline-none placeholder:text-gray-400 placeholder:font-light focus:border-[#ffc300] transition-colors text-sm disabled:opacity-50" 
                  style={{ height: '48.4px', borderRadius: '20px' }} />
              </div>

              <div className="flex flex-col text-left">
                <label className="text-sm font-medium text-gray-700 mb-2">Contact No.</label>
                <div className="relative flex items-center">
                  <input type="tel" name="contactNo" value={formData.contactNo} onChange={handleChange} placeholder="No." required disabled={status.loading}
                    className="w-full bg-white text-gray-900 px-5 border border-gray-300 outline-none placeholder:text-gray-400 placeholder:font-light focus:border-[#ffc300] transition-colors text-sm appearance-none disabled:opacity-50 pr-12" 
                    style={{ height: '48.4px', borderRadius: '20px' }} />
                  <div className="absolute right-5 pointer-events-none text-gray-500 flex items-center">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col text-left">
                <label className="text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Write your message..." required rows="5" disabled={status.loading}
                  className="w-full bg-white text-gray-900 px-5 py-4 border border-gray-300 outline-none placeholder:text-gray-400 placeholder:font-light focus:border-[#ffc300] transition-colors text-sm resize-y min-h-[120px] disabled:opacity-50"
                  style={{ borderRadius: '20px' }}
                ></textarea>
              </div>

              <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-4">
                <button type="submit" disabled={status.loading} className="group inline-flex items-center justify-between w-fit border border-gray-300 hover:border-gray-400 bg-white rounded-full transition-all duration-300 pl-8 pr-2 py-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                  <span className="text-sm font-bold text-gray-800 pr-10">
                    {status.loading ? 'Sending...' : 'Send Message'}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-[#ffc300] flex items-center justify-center text-black transition-transform group-hover:scale-105 shrink-0">
                    {status.loading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
                   </div>
                </button>
                
                {/* Google Compliance Text */}
                <p className="text-[10px] text-gray-400 text-center md:text-right max-w-[200px]">
                  This site is protected by reCAPTCHA and the Google 
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline mx-1">Privacy Policy</a> and 
                  <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline mx-1">Terms of Service</a> apply.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Map Iframe */}
      <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] opal-move-up mt-12 md:mt-16 bg-zinc-100">
        {finalMapUrl ? (
          <iframe 
            src={finalMapUrl} 
            className="w-full h-full border-0" 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location Map"
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            No Map URL Provided
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactInfoBlock;
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ThemeProvider>
      <GoogleReCaptchaProvider 
        reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "dummy_key"}
        scriptProps={{
          async: false,
          defer: false,
          appendTo: "head",
          nonce: undefined,
        }}
      >
        <App />
      </GoogleReCaptchaProvider>
    </ThemeProvider>
  </AuthProvider>
)
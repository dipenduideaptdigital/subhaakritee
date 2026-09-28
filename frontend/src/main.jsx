import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
// import { AuthProvider } from './context/AuthContext.jsx'
// import { ThemeProvider } from './context/ThemeContext.jsx'
import AuthBootstrap from './components/auth/AuthBootstrap.jsx'
import ThemeBootstrap from './components/theme/ThemeBootstrap.jsx'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthBootstrap>
      <ThemeBootstrap>
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
      </ThemeBootstrap>
    </AuthBootstrap>
  </Provider>
)
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'
import faviconUrl from './assets/Bayan-Icon.png'

const APP_VERSION = import.meta.env.VITE_APP_VERSION
const VERSION_STORAGE_KEY = 'bayan-app-version'

const checkAppVersion = () => {
  if (import.meta.env.DEV || !APP_VERSION || typeof window === 'undefined') return

  try {
    const storedVersion = window.localStorage.getItem(VERSION_STORAGE_KEY)
    window.localStorage.setItem(VERSION_STORAGE_KEY, APP_VERSION)

    if (storedVersion && storedVersion !== APP_VERSION) {
      window.location.reload()
    }
  } catch (error) {
    console.warn('App version check skipped:', error)
  }
}

// Dynamically set favicon using Vite-processed asset URL to avoid root public copying
const setFavicon = (url) => {
  try {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = url;

    // also set apple-touch-icon for mobile
    let apple = document.querySelector("link[rel='apple-touch-icon']");
    if (!apple) {
      apple = document.createElement('link');
      apple.rel = 'apple-touch-icon';
      document.getElementsByTagName('head')[0].appendChild(apple);
    }
    apple.href = url;
  } catch {
    // ignore in non-browser env
  }
}

checkAppVersion()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)

// Set favicon after initial render (safe when document available)
if (typeof document !== 'undefined') setFavicon(faviconUrl);
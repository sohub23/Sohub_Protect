import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Dynamic favicon switching for dark/light mode
const updateFavicon = (isDark: boolean) => {
  const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]');
  // For browsers that don't support SVG favicon media queries, also update PNG fallbacks
  const pngIcons = document.querySelectorAll<HTMLLinkElement>('link[rel="icon"][type="image/png"]');
  pngIcons.forEach(icon => {
    if (!icon.media) return; // skip icons without media query
    // Remove all PNG icons and add the correct one
  });
  
  // Force favicon refresh by updating the SVG href with a cache buster
  if (favicon) {
    favicon.href = '/favicon.svg?v=' + Date.now();
  }
  
  // Also set a direct PNG fallback for browsers that don't support SVG favicons
  let fallback = document.querySelector<HTMLLinkElement>('link[data-favicon-fallback]');
  if (!fallback) {
    fallback = document.createElement('link');
    fallback.rel = 'icon';
    fallback.type = 'image/png';
    fallback.setAttribute('data-favicon-fallback', 'true');
    document.head.appendChild(fallback);
  }
  fallback.href = isDark ? '/favicon-dark.png' : '/favicon.png';
};

const darkMatcher = window.matchMedia('(prefers-color-scheme: dark)');
updateFavicon(darkMatcher.matches);
darkMatcher.addEventListener('change', (e) => updateFavicon(e.matches));

createRoot(document.getElementById("root")!).render(<App />);

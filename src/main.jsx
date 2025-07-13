import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'

// Completely suppress Ant Design React compatibility warnings
const originalConsole = {
  warn: console.warn,
  error: console.error,
  log: console.log
};

// Override all console methods to filter Ant Design warnings
console.warn = function(...args) {
  const message = args.join(' ');
  if (
    message.includes('antd') ||
    message.includes('compatible') ||
    message.includes('React is 16') ||
    message.includes('v5-for-19')
  ) {
    return; // Completely suppress
  }
  originalConsole.warn.apply(console, args);
};

console.error = function(...args) {
  const message = args.join(' ');
  if (
    message.includes('antd') ||
    message.includes('compatible') ||
    message.includes('React is 16')
  ) {
    return; // Completely suppress
  }
  originalConsole.error.apply(console, args);
};

// Also override window.console in case it's called differently
if (typeof window !== 'undefined') {
  window.console.warn = console.warn;
  window.console.error = console.error;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster richColors position='top-center'/>
  </StrictMode>,
)

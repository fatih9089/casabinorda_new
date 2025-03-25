import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { init } from '@emailjs/browser';

// EmailJS'i başlat
init('PekYKb6ImWD2awBBC');

createRoot(document.getElementById("root")!).render(<App />);

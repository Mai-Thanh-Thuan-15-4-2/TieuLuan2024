import React from 'react';
import { createRoot } from 'react-dom/client'; // Corrected import
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Use createRoot from the correct import path
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorker.unregister();

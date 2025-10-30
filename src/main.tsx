import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import './satoshi.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { UiLibraryProvider } from './context/UiLibraryContext';
import './styles/bootstrap-custom.css';

// import bootstrap css (solo si instalaste bootstrap)
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <UiLibraryProvider>
        <App />
      </UiLibraryProvider>
    </Router>
  </React.StrictMode>
);

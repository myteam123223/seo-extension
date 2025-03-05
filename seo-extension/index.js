import React from 'react';
import ReactDOM from 'react-dom/client';
import './src/index.css';
import SEOExtension from './src/SEOExtension';

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  const rootElement = document.getElementById('root');
  
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <SEOExtension />
      </React.StrictMode>
    );
  } else {
    console.error("No se encontró el elemento 'root' en el DOM");
  }
});

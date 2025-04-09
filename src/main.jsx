import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// No need to import index.css here if App.jsx imports the CSS files

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
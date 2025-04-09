// src/pages/Settings.jsx
import React from 'react';
import '../styles/components.css'; // For button/toggle styles

// Basic Sun/Moon Icons
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a2.25 2.25 0 0 0-2.25 2.25 2.25 2.25 0 0 0 2.25 2.25c1.39 0 2.51-.9 2.75-2.131A7.501 7.501 0 0 1 12 12Z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>;

const Settings = ({ theme, toggleTheme }) => {
  const isDarkMode = theme === 'dark';

  return (
    <div>
      <h1>Settings</h1>

      <div className="card">
        <h2>Appearance</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Theme</span>
           <button onClick={toggleTheme} className="dark-mode-toggle" aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
                {isDarkMode ? <SunIcon /> : <MoonIcon />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                {/* Optional: Visual Switch */}
                {/* <label className="switch" style={{ marginLeft: '1rem' }}>
                    <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
                    <span className="slider"></span>
                </label> */}
          </button>
        </div>
         {/* Add more settings later (e.g., currency, categories) */}
         <p style={{marginTop: '1rem', color: 'var(--subtle-text-color)', fontSize: '0.9rem'}}>
             More settings coming soon!
         </p>
      </div>
    </div>
  );
};

export default Settings;
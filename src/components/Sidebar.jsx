// src/components/Sidebar.jsx
import React from 'react';
import '../styles/components.css'; // Make sure sidebar styles are here

// Basic SVG Icons (replace with better ones if desired)
const DashboardIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 1.667a8.333 8.333 0 100 16.666 8.333 8.333 0 000-16.666zM12.5 10.833H10v2.5a.833.833 0 01-1.667 0v-2.5H5.833a.833.833 0 110-1.666h2.5V6.667a.833.833 0 111.667 0v2.5h2.5a.833.833 0 010 1.666z" /></svg>;
const TransactionsIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.333 5a1.667 1.667 0 011.667-1.667h10A1.667 1.667 0 0116.667 5v1.667H3.333V5zm0 5.833V15a1.667 1.667 0 001.667 1.667h10A1.667 1.667 0 0016.667 15v-4.167H3.333zm9.167-4.166a.833.833 0 10-1.667 0v5a.833.833 0 101.667 0v-5z" clipRule="evenodd" /></svg>;
const SettingsIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.833 3.008a.833.833 0 00-1.666 0l-.5 1.684a6.64 6.64 0 00-1.35.69l-1.6-.6a.833.833 0 00-.976.27l-1.25 2.165a.833.833 0 00.27.976l1.334.999a6.71 6.71 0 000 2.13l-1.334 1a.833.833 0 00-.27.976l1.25 2.165a.833.833 0 00.976.27l1.6-.6a6.64 6.64 0 001.35.69l.5 1.684a.833.833 0 001.666 0l.5-1.684a6.64 6.64 0 001.35-.69l1.6.6a.833.833 0 00.976-.27l1.25-2.165a.833.833 0 00-.27-.976L13.1 11.1a6.71 6.71 0 000-2.13l1.334-1a.833.833 0 00.27-.976L13.454 4.83a.833.833 0 00-.976-.27l-1.6.6a6.64 6.64 0 00-1.35-.69l-.5-1.684zM10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" /></svg>;

const Sidebar = ({ currentPage, setCurrentPage, isMobileOpen, toggleMobileSidebar }) => {
  const navItems = [
    { name: 'Dashboard', page: 'dashboard', icon: <DashboardIcon /> },
    { name: 'Transactions', page: 'transactions', icon: <TransactionsIcon /> },
    { name: 'Settings', page: 'settings', icon: <SettingsIcon /> },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
         className={`sidebar-overlay ${isMobileOpen ? 'open' : ''}`}
         onClick={toggleMobileSidebar}
         aria-hidden="true" // Hide from screen readers when not visible
       ></div>

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
           {/* <span>💡</span> Luminary */}
           Luminary Finance
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map(item => (
              <li key={item.page}>
                <a
                  href="#"
                  className={currentPage === item.page ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(item.page);
                    if (isMobileOpen) toggleMobileSidebar(); // Close mobile sidebar on navigation
                  }}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          {/* Placeholder for potential footer elements like user info or logout */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
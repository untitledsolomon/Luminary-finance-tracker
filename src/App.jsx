import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import './styles/base.css';
import './styles/theme.css';
import './styles/App.css';
import './styles/components.css'; // Ensure component styles are loaded

// Basic menu icon for mobile
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;


function App() {
  const [transactions, setTransactions] = useLocalStorage('luminary_transactions', []);
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'transactions', 'settings'
  const [theme, setTheme] = useLocalStorage('luminary_theme', 'light'); // 'light' or 'dark'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Apply the theme class to the body
  useEffect(() => {
    document.body.className = ''; // Clear previous theme classes
    document.body.classList.add(`${theme}-mode`);
  }, [theme]);

  // CRUD Operations for Transactions (passed down as props)
  const addTransaction = (newTransaction) => {
    setTransactions(prev => [...prev, newTransaction]);
    // Auto-save handled by useLocalStorage hook
  };

  const editTransaction = (updatedTransaction) => {
    setTransactions(prev =>
      prev.map(t => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Theme Toggle
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

   // Mobile Sidebar Toggle
  const toggleMobileSidebar = () => {
      setIsMobileSidebarOpen(prev => !prev);
  }

  // Render current page based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard transactions={transactions} theme={theme} />;
      case 'transactions':
        return (
          <Transactions
            transactions={transactions}
            addTransaction={addTransaction}
            editTransaction={editTransaction}
            deleteTransaction={deleteTransaction}
          />
        );
      case 'settings':
        return <Settings theme={theme} toggleTheme={toggleTheme} />;
      default:
        return <Dashboard transactions={transactions} theme={theme} />;
    }
  };

  return (
    <div className="app">
        {/* Mobile Menu Button */}
        <button
            className="mobile-menu-button"
            onClick={toggleMobileSidebar}
            aria-label="Toggle navigation menu"
        >
            <MenuIcon />
        </button>

      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isMobileOpen={isMobileSidebarOpen}
        toggleMobileSidebar={toggleMobileSidebar}
       />
      <main className="main-content">
        {/* Basic transition wrapper - Requires react-transition-group for proper animations */}
        {/* <div className={`page-${currentPage}`}> */}
           {renderPage()}
        {/* </div> */}
      </main>
    </div>
  );
}

export default App;
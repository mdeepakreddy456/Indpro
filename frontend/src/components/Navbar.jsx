import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, CheckSquare, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <CheckSquare size={24} className="navbar-logo-icon" />
        <span>TaskManager</span>
      </div>
      
      <div className="navbar-actions">
        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme} 
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} 
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        
        {user && (
          <div className="navbar-user">
            <div className="user-info">
              <span className="username">{user.username}</span>
              <span className="user-email">{user.email}</span>
            </div>
            <button className="logout-btn" onClick={logout} title="Sign Out">
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

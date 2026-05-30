import React from 'react';
import { CheckSquare } from 'lucide-react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="dashboard-footer">
      <div className="footer-container">
        {/* Column 1: Brand Info & Socials */}
        <div className="footer-column brand-col">
          <div className="footer-brand">
            <CheckSquare size={20} className="footer-logo-icon" />
            <span>TaskManager</span>
          </div>
          <p className="footer-brand-desc">
            Organize your workflows, track your priorities, and manage tasks effortlessly.
          </p>
          <div className="footer-socials">
            <a href="#github" aria-label="GitHub" title="GitHub">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a href="#linkedin" aria-label="LinkedIn" title="LinkedIn">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="#twitter" aria-label="Twitter" title="Twitter">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a href="#youtube" aria-label="YouTube" title="YouTube">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Product */}
        <div className="footer-column">
          <h3>Product</h3>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#integrations">Integrations</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#changelog">Changelog</a></li>
            <li><a href="#roadmap">Roadmap</a></li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div className="footer-column">
          <h3>Resources</h3>
          <ul>
            <li><a href="#docs">Documentation</a></li>
            <li><a href="#guides">Guides</a></li>
            <li><a href="#api">API Reference</a></li>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#community">Community</a></li>
          </ul>
        </div>

        {/* Column 4: Company */}
        <div className="footer-column">
          <h3>Company</h3>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#press">Press Kit</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Column 5: Legal */}
        <div className="footer-column">
          <h3>Legal</h3>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#security">Security</a></li>
            <li><a href="#cookies">Cookie Settings</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TaskManager. Handcrafted for INDPRO. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

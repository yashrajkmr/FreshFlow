// FreshFlow Footer Component (Quiet editorial standard)
import React from 'react';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand-row">
          <span className="brand-name">FreshFlow</span>
          <span className="footer-copy">
            Dynamic Pricing Engine & Perishable Inventory Management Console
          </span>
        </div>

        <div className="footer-tags">
          <span className="footer-tag">React 18</span>
          <span className="footer-tag">Vite</span>
          <span className="footer-tag">Express.js</span>
          <span className="footer-tag">MongoDB Mongoose</span>
          <span className="footer-tag">Node.js fs.promises</span>
          <span className="footer-tag">Developer: Yashraj Kumar</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

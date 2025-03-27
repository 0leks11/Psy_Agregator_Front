import React from 'react';

const Footer = () => {
  return (
    <footer style={{ background: '#f9f9f9', padding: '20px', marginTop: 'auto', textAlign: 'center', borderTop: '1px solid #eee' }}>
      <p>© {new Date().getFullYear()} Gestalt Aggregator. All rights reserved.</p>
      {/* Add other links like Privacy Policy, Terms of Service later */}
    </footer>
  );
};

export default Footer;
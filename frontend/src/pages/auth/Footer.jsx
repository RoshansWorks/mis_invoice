import React from 'react';
import '../../css/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} MIS & INVOICE. All rights reserved.
    </footer>
  );
}

export default Footer;
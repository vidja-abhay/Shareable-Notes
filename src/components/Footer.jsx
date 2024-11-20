import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-indigo-600 text-white py-4 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Shareable Notes. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

// components/Userdashboard/layout/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-green-600 text-white p-4 text-center mt-auto">
      &copy; {new Date().getFullYear()} i-Mitra. All rights reserved.
    </footer>
  );
};

export default Footer;

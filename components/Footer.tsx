import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center p-4 mt-auto">
      <aside>
        <p>Copyright © {currentYear} - Berthose Fin</p>
      </aside>
    </footer>
  );
};

export default Footer;

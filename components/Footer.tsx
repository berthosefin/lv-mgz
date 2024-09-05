import React from "react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center p-4 mt-auto">
      <aside>
        <p>Copyright © {currentYear} - Berthose Fin</p>
      </aside>
    </footer>
  );
};

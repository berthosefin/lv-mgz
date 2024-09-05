import React from "react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center p-4 mt-auto">
      <aside>
        <p>© {currentYear} Berthose Fin &#8226; All Rights Reserved</p>
      </aside>
    </footer>
  );
};

"use client";

import React from 'react';

interface MobileMenuButtonProps {
  onClick: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="md:hidden p-4 bg-gray-900 text-white"
    >
      Menu
    </button>
  );
};

export default MobileMenuButton;

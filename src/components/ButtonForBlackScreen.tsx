import React from 'react';

const ButtonForBlackScreen = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
  return (
    <button className=" bg-black hover:bg-gray-700 rounded p-1 space-x-2" onClick={onClick}>
      {children}
    </button>
  );
};

export default ButtonForBlackScreen;

import React from 'react';

const ButtonForBlackScreen = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
  return (
    <button className=" bg-black hover:bg-gray-700 rounded p-2 space-x-2" onClick={onClick}>
      {children}
    </button>
  );
};

export default ButtonForBlackScreen;

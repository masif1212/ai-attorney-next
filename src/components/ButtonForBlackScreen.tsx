import React from 'react';

const ButtonForBlackScreen = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
  return (
    <button className=" bg-black hover:bg-gray-600 rounded py-1" onClick={onClick}>
      {children}
    </button>
  );
};

export default ButtonForBlackScreen;

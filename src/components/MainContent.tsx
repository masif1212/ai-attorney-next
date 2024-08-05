// components/MainContent.tsx
import React from 'react';
import Image from 'next/image';
// import logo from '../public/logo.png'; // Adjust the path to your project structure

const MainContent: React.FC = () => {
  return (
    <div className="flex p-4 overflow-auto ">
      {/* <Image src={logo} alt="AI Attorney Logo" width={150} height={150} /> */}
      <p className="mt-4 text-lg text-white">Welcome to AI Attorney</p>
    </div>
  );
};

export default MainContent;

const Header = () => {
  return (
    <div className="w-full bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="h-6 w-6 bg-gray-700"></div>
        <h1 className="text-xl">Ai Attorney</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="bg-gray-700 p-2 rounded">Contact Us</button>
        <button className="bg-gray-700 p-2 rounded">FAQs</button>
      </div>
    </div>
  );
};

export default Header;

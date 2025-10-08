export const SearchBar = () => {
  return (
    <div className="w-full pb-5 flex justify-center items-center"> {/* Parent with full width */}
      <div className="relative w-full max-w-xl"> {/* Full width, but limits to a max size on big screens */}
        <input
          type="text"
          placeholder="Hello"
          className="w-full pl-6 pr-16 py-4 rounded-full bg-white text-gray-600 text-lg shadow-md focus:outline-none"
        />
        <button className="absolute top-1/2 right-0 -translate-y-1/2 bg-gray-800 rounded-full p-4 shadow-lg">
          <svg
            className="w-10 h-7 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </div>
  );
};

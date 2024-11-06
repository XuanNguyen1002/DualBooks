import React, { useState } from "react";

type SearchBarProps = {
  onSearch: (searchTerm: string) => void; // Khai báo kiểu của onSearch
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(searchTerm); // Gọi hàm onSearch với giá trị tìm kiếm
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Tìm kiếm khách hàng..."
        className="w-full border rounded-lg p-2 pl-10 shadow-md focus:outline-none"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleSearch} // Gọi hàm handleSearch khi nhấn Enter
      />
      <i className="fas fa-search absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"></i>
    </div>
  );
};

export default SearchBar;

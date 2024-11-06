// SearchCustomer.tsx
import React, { useState } from 'react';

interface SearchCustomerProps {
  onSearch: (searchTerm: string) => void;
}

const SearchCustomer: React.FC<SearchCustomerProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Hàm xử lý khi nhấn phím
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {  // Kiểm tra nếu phím là "Enter"
      event.preventDefault();
      onSearch(searchTerm);  // Truyền từ khóa lên component cha
    }
  };

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={handleSearchChange}
      onKeyDown={handleKeyDown}  // Xử lý sự kiện khi nhấn phím
      placeholder="Tìm kiếm khách hàng..."
      className="w-full border rounded-lg p-2 pl-10 shadow-md focus:outline-none"
    />
  );
};

export default SearchCustomer;

"use client";

import useFetchBook from "@/app/hook/useFetchBook";
import useFetchCategory from "@/app/hook/useFetchCategory";
import Product from "../../component/product";
import Link from "next/link";
import { useState } from "react";

const ProductList = () => {
  const { books, loading, error, searchBooks } = useFetchBook();
  const { cate } = useFetchCategory();
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy tên danh mục theo ID
  const getCategoryName = (categoryId) => {
    const category = cate.find((cat) => cat.id === categoryId);
    return category ? category.name : "Không xác định"; // Nếu không tìm thấy danh mục
  };

  // Định dạng thời gian
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Hàm xử lý thay đổi ô tìm kiếm
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term.trim()) {
      searchBooks(term);
    } else {
     
      searchBooks(""); 
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading books!</p>;

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sản Phẩm</h1>
        <div className="flex items-center">
          {/* Ô tìm kiếm sản phẩm */}
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên..."
            className="border border-gray-300 rounded px-4 py-2 mr-4"
            value={searchTerm}
            onChange={handleSearchChange} // Hàm xử lý thay đổi khi người dùng nhập
          />
          <Link
            href={"/admin/addPro"}
            className="bg-primary-400 hover:bg-primary-300 text-white px-4 py-2 rounded"
          >
            Sản Phẩm Mới
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-nowrap">Hình ảnh</th> {/* Thêm cột Hình ảnh */}
              <th className="px-6 py-4 text-nowrap">Tiêu đề</th>
              <th className="px-6 py-4 text-nowrap">Tác giả</th>
              <th className="px-6 py-4 text-nowrap">Danh mục</th>
              <th className="px-6 py-4 text-nowrap">Giá</th>
              <th className="px-6 py-4 text-nowrap">Số lượng</th>
              <th className="px-6 py-4 text-nowrap">Thời gian</th>
              <th className="px-6 py-4 text-nowrap">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {books.map((product) => (
              <Product
                key={product.id}
                product={product}
                getCategoryName={getCategoryName}
                formatDateTime={formatDateTime}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;

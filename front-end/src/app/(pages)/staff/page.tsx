"use client";

import React, { useEffect, useState } from "react";
import useFetchBook from "@/app/hook/useFetchBook";
import CartItem from "./component/cartItem";
import ProductList from "./component/productList";
import { useRouter } from "next/navigation";
import { Books } from "@/app/types/Books";
import SearchProduct from "@/components/ui/searchProduct_byName";

interface CartItem {
  id: string;
  product: string;
  quantity: number;
  price: number;
}

const Staff: React.FC = () => {

const router = useRouter()
  const { books, loading, error, searchBooks, fetchDetail } = useFetchBook();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchId, setSearchId] = useState(""); // State for searching by ID

  useEffect(() => {
    const adminInfo = localStorage.getItem("admin");

    if (!adminInfo) {
      router.push("/login_admin"); 
    } else {
      const admin = JSON.parse(adminInfo);
      if (admin.role !== "staff") {
        alert("bạn không được phân quyền vào Staff")
        router.push("/login_admin"); 
      }
    }
  }, [router]);

  const addToCart = (book: Books) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === book.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevItems,
          { id: book.id, product: book.title, quantity: 1, price: book.price },
        ];
      }
    });
  };

  const updateCartItemQuantity = (id: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) {
    return <div className="text-center text-lg">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-600">Lỗi: {error}</div>;
  }

  const handleDelete = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    searchBooks(term);
  };

const handleSearchByIdChange = (id: string) => {
  setSearchId(id);
  if (id) {
    fetchDetail(id); // Tự động tìm kiếm chi tiết khi có ID
  }
};

  return (
    <div className="flex">
      <div className="w-4/5 p-3 flex flex-col max-h-[calc(100vh-80px)]">
        <div className="bg-white p-6 rounded-lg shadow-md h-screen overflow-y-auto flex-grow">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              id={item.id}
              product={item.product}
              quantity={item.quantity}
              price={item.price}
              onQuantityChange={updateCartItemQuantity}
              onDelete={handleDelete}
            />
          ))}
        </div>
        <div className="bg-primary-400 text-white p-6 rounded-lg shadow-md mt-4 font-semibold flex justify-between">
          <span>Tổng tiền sản phẩm:</span>
          <span>{totalQuantity} sản phẩm</span>
          <span>{(totalPrice * 1000).toLocaleString("vi-VN") + " đ"}</span>
        </div>
      </div>

      <div className="bg-white p-5 shadow-lg max-h-screen">
        <div className="mb-5 flex">
          <SearchProduct
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />

          <input
            type="text"
            placeholder="Tìm kiếm theo ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border rounded-md px-3 py-2 ml-2"
          />
          {/* {/* <button
            onClick={handleSearchById}
            className="bg-primary-400 text-white px-4 py-2 ml-2 rounded-md hover:bg-primary-300 transition-colors"
          > 
            Tìm ID
          </button> */}
        </div>

        <div className="grid grid-cols-3 gap-4 max-h-[calc(100vh-230px)] overflow-y-auto">
          {books.map((book: Books) => (
            <ProductList key={book.id} book={book} onAddToCart={addToCart} />
          ))}
        </div>

        <button className="w-full mt-4 py-2 bg-[#A05D3A] text-white rounded-lg hover:bg-[#8C4C2F] transition-colors">
          Thanh Toán
        </button>
      </div>
    </div>
  );
};

export default Staff;
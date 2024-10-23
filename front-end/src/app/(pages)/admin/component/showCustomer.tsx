"use client"; // Đánh dấu component này là Client Component

import React from 'react';
import { useCustomers } from '../hook/customerApi';
export default function ShowCustomer() {
  const { customers, loading, error, deleteCustomer,toggleCustomerStatus } = useCustomers();
  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>Có lỗi xảy ra: {error}</div>;
  }

  return (
    <div className="bg-white shadow-md">
      <table className="w-full table-auto border-separate border-spacing-0 rounded-tl-xl rounded-tr-lg">
        <thead>
          <tr className="bg-[#AF683E] text-left text-white border border-white rounded-tl-lg rounded-tr-lg">
            <th className="p-4 border border-white">Khách Hàng</th>
            <th className="p-4 border border-white">Email</th>
            <th className="p-4 border border-white">Số Điện Thoại</th>
            <th className="p-4 border border-white">Địa Chỉ</th>
            <th className="p-4 text-right border border-white rounded-tr-lg"></th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={index} className={`border border-white ${index % 2 === 0 ? 'bg-[#FBF3E9]' : 'bg-[#F4DCC8]'}`}>
              <td className="p-4 border border-white">{customer.name}</td>
              <td className="p-4 border border-white">{customer.email}</td>
              <td className="p-4 border border-white">{customer.phone}</td>
              <td className="p-4 border border-white">{customer.address}</td>
              <td className="p-4 text-right flex justify-center items-center border border-white">
            <button 
              className="text-red-500 hover:text-red-700 mr-2" // Thêm margin-right để tạo khoảng cách
              onClick={() => deleteCustomer(customer._id)}
            >
              <i className="fa-solid fa-circle-minus"></i>
            </button>
            <button 
              className="text-blue-500 hover:text-blue-700"
              onClick={() => toggleCustomerStatus(customer._id)}
            >
              <i className="fa-solid fa-sync"></i> {/* Biểu tượng cho nút chuyển đổi trạng thái */}
            </button>
          </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

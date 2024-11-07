'use client';  // Đánh dấu file là Client Component
import React from 'react';
import Link from "next/link";
import useFetchOrders from '@/app/hook/useFetchOrders';
interface typeCustomer {
  id: string;
  name: string;
  email: string;
  address?: string;
  phone: string;
}

// Kiểu đơn hàng
interface typeOrder {
  id: string;
  order_date: string;
  order_status: string;
  payment_status: string;
  shipping_address: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  customer?: typeCustomer; // Thêm customer nếu là đơn online
}

// Định dạng thời gian
const formatDateTime = (dateString:string) => {
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

// Lấy màu trạng thái
const getStatusColor = (status:string) => {
  switch (status) {
    case 'Chờ xác nhận':
      return 'bg-blue-500';  // Màu xanh dương
    case 'Đã xác nhận':
      return 'bg-yellow-500';  // Màu vàng
    case 'Đang giao hàng':
      return 'bg-orange-500';  // Màu cam
    case 'Hoàn thành':
      return 'bg-green-500';  // Màu xanh lá
    case 'Đã hủy':
      return 'bg-red-500';  // Màu đỏ
    default:
      return 'bg-gray-500';  // Màu xám nếu không có trạng thái khớp
  }
};

export default function ShowOrder() {
  const { orders, loading, error } = useFetchOrders(); // Sử dụng hook lấy dữ liệu đơn hàng

  // Nếu đang tải dữ liệu
  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  // Nếu có lỗi khi tải dữ liệu
  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  // Nếu không có đơn hàng nào
  if (!orders || orders.length === 0) {
    return <div>Không có đơn hàng nào!</div>;
  }

  return (
    <tbody>
      {orders.map((order, index) => (
        <tr key={order.id} className={`border-b ${index % 2 === 0 ? 'bg-[#FBF3E9]' : 'bg-[#F4DCC8]'}`}>
          <td className="p-4 border border-white">#...{order.id.slice(-5)}</td> {/* Hiển thị 5 ký tự cuối của Mã Đơn Hàng */}
          <td className="p-4 border border-white">
            {order.customer?.name ? order.customer.name : 'Đơn offline'}
          </td> {/* Khách Hàng */}
          <td className="p-4 border border-white">{formatDateTime(order.order_date)}</td> {/* Ngày Đặt */}
          <td className="p-4 border border-white">{order.shipping_address}</td> {/* Địa Chỉ */}
          <td className="p-4 border border-white">{order.total_amount.toLocaleString()} VND</td> {/* Tổng Tiền */}
          <td className="p-4 border border-white">
            <span className={`${getStatusColor(order.order_status)} text-white rounded px-2 py-1 text-xs`}>
              {order.order_status}
            </span>
          </td> {/* Trạng Thái */}
          <td className="p-4 text-right">
          <Link href={`/admin/OrderDetail/${order.id}`}>
          <button className="text-blue-500 hover:underline mr-2">
            Xem
          </button>
        </Link>
            <button className="text-yellow-500 hover:underline mr-2">Sửa</button>
            <button className="text-red-500 hover:underline">Hủy</button>
          </td> {/* Các nút hành động */}
        </tr>
      ))}
    </tbody>
  );
}

import React from 'react';
import ShowOrder from '../../component/ShowOrder'; 

const orders = [
  {
    _id: '1',
    orderNumber: '#123456',
    customerNames: 'Nguyễn Văn A / Lê Thu B',
    orderDate: '01/01/2023',
    address: '123 Đường ABC, Phường X, TP HCM',
    totalPrice: '2,000,000 VND',
    status: 'Hoàn thành'
  },
  {
    _id: '2',
    orderNumber: '#123457',
    customerNames: 'Trần Văn C',
    orderDate: '02/01/2023',
    address: '456 Đường DEF, Phường Y, TP HCM',
    totalPrice: '1,500,000 VND',
    status: 'Chờ xử lý'
  }
  // Thêm các đơn hàng khác
];

export default function Page() {
  return (
    <table className="w-full table-auto border-separate border-spacing-0 rounded-tl-xl rounded-tr-lg">
      <thead>
        <tr className="bg-[#AF683E] text-left text-white border border-white rounded-tl-lg rounded-tr-lg">
          <th className="p-4 border border-white">Mã Đơn Hàng</th>
          <th className="p-4 border border-white">Khách Hàng</th>
          <th className="p-4 border border-white">Ngày Đặt</th>
          <th className="p-4 border border-white">Địa Chỉ</th>
          <th className="p-4 border border-white">Tổng Tiền</th>
          <th className="p-4 border border-white">Trạng Thái</th>
          <th className="p-4 text-right border border-white rounded-tr-lg"></th>
        </tr>
      </thead>
      <ShowOrder orders={orders} />
    </table>
  );
}

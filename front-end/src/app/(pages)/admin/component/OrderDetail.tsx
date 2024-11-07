import React from 'react';
import OrderItem from './OrderItem';
import { typeOrderDetail } from '@/app/hook/useFetchOrders';

interface OrderDetailProps {
  orderDetail: typeOrderDetail;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ orderDetail }) => {
  return (
    <div>
      <h2>Thông tin đơn hàng</h2>
      <p><strong>Ngày đặt:</strong> {orderDetail.orderDate}</p>
      <p><strong>Trạng thái:</strong> {orderDetail.orderStatus}</p>
      <p><strong>Thanh toán:</strong> {orderDetail.paymentStatus}</p>
      <p><strong>Địa chỉ giao hàng:</strong> {orderDetail.shippingAddress}</p>
      <p><strong>Tổng tiền:</strong> {orderDetail.totalAmount}</p>
      <h3>Khách hàng</h3>
      {orderDetail.customerInfo && (
        <div>
          <p><strong>Tên:</strong> {orderDetail.customerInfo.name}</p>
          <p><strong>Email:</strong> {orderDetail.customerInfo.email}</p>
          <p><strong>Điện thoại:</strong> {orderDetail.customerInfo.phone}</p>
        </div>
      )}
      <h3>Sản phẩm trong đơn hàng</h3>
      {orderDetail.orderItems.map((item) => (
        <OrderItem key={item.id} orderItem={item} />
      ))}
    </div>
  );
};

export default OrderDetail;

import React from 'react';
import { typeOrderItem } from '@/app/hook/useFetchOrders'

interface OrderItemProps {
  orderItem: typeOrderItem;
}

const OrderItem: React.FC<OrderItemProps> = ({ orderItem }) => {
  return (
    <div>
      <p><strong>{orderItem.bookTitle}</strong> - Số lượng: {orderItem.quantity}</p>
      <p>Giá: {orderItem.price * orderItem.quantity} VND</p>
    </div>
  );
};

export default OrderItem;

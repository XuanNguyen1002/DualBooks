import { useState, useEffect, useCallback } from 'react';

// Định nghĩa kiểu dữ liệu cho một mục trong danh sách sản phẩm của đơn hàng
export interface typeOrderItem {
  id: string;
  bookId: string;
  bookTitle: string;
  quantity: number;
  price: number;
}

// Định nghĩa kiểu dữ liệu cho khách hàng
export interface typeCustomer {
  id: string;
  name: string;
  email: string;
  address?: string;
  phone: string;
}

// Định nghĩa kiểu dữ liệu cho chi tiết đơn hàng
export interface typeOrderDetail {
  id: string;
  orderType: string;
  orderDate: string;
  orderStatus: string;
  paymentStatus: string;
  shippingAddress: string;
  totalAmount: number;
  customerFeedback: string | null;
  orderItems: typeOrderItem[];
  customerInfo?: typeCustomer;
}

// Định nghĩa kiểu dữ liệu cho đơn hàng tổng quát (không bao gồm chi tiết sản phẩm)
export interface typeOrder {
  id: string;
  orderType: string;
  orderDate: string;
  orderStatus: string;
  paymentStatus: string;
  shippingAddress: string;
  totalAmount: number;
}

// Định nghĩa kiểu trả về cho custom hook useFetchOrders
export interface UseFetchOrdersResult {
  orders: typeOrder[];
  orderDetail: typeOrderDetail | null;
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  fetchOrderDetail: (orderId: string) => Promise<void>;
}

export default function useFetchOrders(): UseFetchOrdersResult {
  const [orders, setOrders] = useState<typeOrder[]>([]);
  const [orderDetail, setOrderDetail] = useState<typeOrderDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm lấy danh sách đơn hàng từ API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null); // Đặt lại lỗi khi bắt đầu tải
    try {
      const response = await fetch("http://localhost:3200/orders");
      if (!response.ok) {
        throw new Error("Lỗi khi lấy dữ liệu đơn hàng!");
      }
      const result = await response.json();
      setOrders(result.data); // Đặt dữ liệu đơn hàng vào state
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Hàm lấy chi tiết đơn hàng từ API theo orderId
  const fetchOrderDetail = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3200/orders/${orderId}`);
      if (!response.ok) {
        throw new Error("Lỗi khi lấy chi tiết đơn hàng!");
      }
      const result: typeOrderDetail = await response.json();
      setOrderDetail(result); // Đặt chi tiết đơn hàng vào state
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Gọi fetchOrders khi component lần đầu render
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    orderDetail,
    loading,
    error,
    fetchOrders,
    fetchOrderDetail,
  };
}

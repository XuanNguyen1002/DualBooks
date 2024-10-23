// src/app/(pages)/admin/component/useCustomers.ts
import { useEffect, useState } from 'react';
import { Customer } from '../models/Customer'; // Đảm bảo đường dẫn import chính xác

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:3200/customers');
      if (!response.ok) {
        throw new Error('Mã lỗi: ' + response.status);
      }
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?");
    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:3200/customers/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Không thể xóa khách hàng: ' + response.status);
        }

        // Cập nhật lại danh sách khách hàng sau khi xóa
        setCustomers(customers.filter(customer => customer.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []); // Chạy chỉ một lần khi component được mount

  return { customers, loading, error, deleteCustomer };
};

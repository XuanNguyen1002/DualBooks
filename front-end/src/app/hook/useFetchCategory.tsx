<<<<<<< HEAD

import { useEffect, useState } from "react";

interface typeCate {
  id: string;
  name: string;
  cate_image:string;
  description: string;
}


export default function useFetchCategory() {
  const [cate, setCate] = useState<typeCate[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:3200/categories");

      if (!res.ok) {
        throw new Error("lỗi khi lấy dữ liệu !!!");
      }

      const result = await res.json();

      setCate(result);
=======
import { useEffect, useState } from "react";

// Cập nhật giao diện để bao gồm cấu trúc _id chính xác
interface typeCate {
  _id: { $oid: string };
  name: string;
  cate_image: string;
  description: string;
}

export default function useFetchCategory() {
  const [cate, setCate] = useState<typeCate[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Thêm trạng thái loading
  const [error, setError] = useState<string | null>(null); // Thêm trạng thái error

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3200/categories");

        if (!res.ok) {
          throw new Error("Lỗi khi lấy dữ liệu!");
        }

        const result = await res.json();
        setCate(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra!");
      } finally {
        setLoading(false); // Đặt loading là false khi hoàn thành
      }
>>>>>>> origin/nhathuy
    };

    fetchData();
  }, []);

<<<<<<< HEAD
  return {cate};
=======
  return { cate, loading, error }; // Trả về cate, loading và error
>>>>>>> origin/nhathuy
}

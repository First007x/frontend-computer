'use client';
import { useAuth } from '../context/AuthContext';
import ProductList from '../components/ProductList';

export default function ProductPage() {
  const { user } = useAuth();

  return (
    <div>
      {/* แสดงรายการสินค้าปกติ */}
      <ProductList />
    </div>
  );
}
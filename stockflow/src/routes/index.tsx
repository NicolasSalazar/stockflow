import { Routes, Route, Navigate } from 'react-router-dom';
import { ProductPage } from '../pages/products/ProductPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/products" element={<ProductPage />} />
    </Routes>
  );
};

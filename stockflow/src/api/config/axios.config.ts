import axios from 'axios';

// Función para obtener las variables de entorno (desde window.ENV o import.meta.env)
const getEnvVar = (key: string, defaultValue: string): string => {
  // En producción (Docker), las variables vienen de window.ENV
  if (typeof window !== 'undefined' && (window as any).ENV) {
    return (window as any).ENV[key] || defaultValue;
  }
  // En desarrollo, usamos import.meta.env
  return import.meta.env[key] || defaultValue;
};

// Cliente para el servicio de productos (puerto 8080)
export const productsApiClient = axios.create({
  baseURL: getEnvVar('VITE_PRODUCTS_API_URL', 'http://localhost:8080/api'),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Cliente para el servicio de stocks (puerto 3000)
export const stocksApiClient = axios.create({
  baseURL: getEnvVar('VITE_STOCKS_API_URL', 'http://localhost:3001'),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
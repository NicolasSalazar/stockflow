import { useEffect, useState } from 'react';
import { stockService } from '../../api/stock/stockService';
import { productService } from '../../api/product/productService';
import type { Stock } from '../../api/types/stock.types';
import type { Product } from '../../api/types/product.types';

interface PurchaseModalProps {
  productCode: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const PurchaseModal = ({
  productCode,
  onClose,
  onSuccess,
}: PurchaseModalProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [stock, setStock] = useState<Stock | null>(null);
  const [quantity, setQuantity] = useState<string>('1');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [productCode]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productData, stockData] = await Promise.all([
        productService.getProductByCode(productCode),
        stockService.getStockByProductCode(productCode),
      ]);
      setProduct(productData);
      setStock(stockData);
    } catch (err: any) {
      console.error('Error al cargar datos:', err);
      setError(
        err.response?.data?.message ||
          'Error al cargar la información del producto'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotal = () => {
    if (!product) return 0;
    const qty = parseInt(quantity) || 0;
    return product.price * qty;
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === '') {
      setQuantity('');
      setError(null);
      return;
    }

    const value = parseInt(inputValue);
    if (isNaN(value) || value < 0) return;

    setQuantity(inputValue);

    if (stock && value > stock.quantity) {
      setError(`La cantidad no puede exceder el stock disponible (${stock.quantity} unidades)`);
    } else if (value === 0) {
      setError('La cantidad debe ser mayor a 0');
    } else {
      setError(null);
    }
  };

  const handleQuantityBlur = () => {
    if (quantity === '' || parseInt(quantity) === 0) {
      setQuantity('1');
      setError(null);
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!stock || !product) {
      setError('No hay información disponible');
      return;
    }

    const qty = parseInt(quantity);

    if (isNaN(qty) || quantity === '') {
      setError('Por favor ingresa una cantidad válida');
      return;
    }

    if (qty < 1) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    if (qty > stock.quantity) {
      setError(`Stock insuficiente. Disponible: ${stock.quantity}`);
      return;
    }

    setPurchasing(true);

    try {
      const result = await stockService.purchaseProduct(productCode, qty);

      setSuccessMessage(
        `¡Compra exitosa! ${result.data.quantityPurchased} unidad(es) de ${result.data.productName}. Stock actualizado: ${result.data.currentQuantity}`
      );

      // Actualizar el stock local
      setStock({
        ...stock,
        quantity: result.data.currentQuantity,
      });

      setQuantity('1');

      // Notificar al padre después de un breve delay
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Error al procesar la compra:', err);
      setError(
        err.response?.data?.message ||
          'Error al procesar la compra. Por favor, intente nuevamente.'
      );
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Registrar Compra
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 focus:outline-none"
              disabled={purchasing}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-sm text-gray-500">Cargando información...</p>
            </div>
          ) : error && !successMessage ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  <button
                    onClick={loadData}
                    className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          ) : successMessage ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    {successMessage}
                  </h3>
                </div>
              </div>
            </div>
          ) : product && stock ? (
            <form onSubmit={handlePurchase} className="space-y-4">
              {/* Información del Producto */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Producto</p>
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Precio Unitario</p>
                    <p className="text-lg font-bold text-purple-600">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Stock Disponible</p>
                    <p className={`text-lg font-bold ${
                      stock.quantity > 10 ? 'text-green-600' : stock.quantity > 0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {stock.quantity} unidades
                    </p>
                  </div>
                </div>
              </div>

              {/* Cantidad */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad a Comprar
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  onBlur={handleQuantityBlur}
                  placeholder="Ingresa la cantidad"
                  min="1"
                  max={stock.quantity}
                  disabled={stock.quantity === 0 || purchasing}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-lg font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {error && !successMessage && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              {/* Total */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total a Pagar:</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {parseInt(quantity) || 0} {(parseInt(quantity) || 0) === 1 ? 'unidad' : 'unidades'} × {formatCurrency(product.price)}
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  disabled={purchasing}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={stock.quantity === 0 || purchasing || !!error}
                >
                  {purchasing ? 'Procesando...' : 'Confirmar Compra'}
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
};

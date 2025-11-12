import { stocksApiClient } from '../config/axios.config';
import type { Stock, PurchaseRequest, PurchaseResponse } from '../types/stock.types';

class StockService {
  /**
   * Obtiene el stock disponible de un producto por su código
   * @param productCode - Código del producto
   * @returns Promise con la información del stock
   */
  async getStockByProductCode(productCode: number): Promise<Stock> {
    const response = await stocksApiClient.get<Stock>(`/stock/product/${productCode}`);
    return response.data;
  }

  /**
   * Registra una compra de producto y actualiza el stock
   * @param productCode - Código del producto
   * @param quantity - Cantidad a comprar
   * @returns Promise con la respuesta de la compra
   */
  async purchaseProduct(
    productCode: number,
    quantity: number
  ): Promise<PurchaseResponse> {
    const request: PurchaseRequest = { quantity };
    const response = await stocksApiClient.patch<PurchaseResponse>(
      `/stock/product/${productCode}/purchase`,
      request
    );
    return response.data;
  }
}

// Exportar instancia singleton
export const stockService = new StockService();

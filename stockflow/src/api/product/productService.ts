import { productsApiClient } from '../config/axios.config';
import type { ProductPage, ProductQueryParams, Product } from '../types/product.types';

class ProductService {
  /**
   * Obtiene lista paginada de productos
   * @param params - Parámetros de paginación y ordenamiento
   * @returns Promise con la página de productos
   */
  async getProducts(params?: ProductQueryParams): Promise<ProductPage> {
    const {
      page = 0,
      size = 10,
      sortBy = 'productCode',
      sortDirection = 'ASC',
    } = params || {};

    const response = await productsApiClient.get<ProductPage>('/products', {
      params: {
        page,
        size,
        sortBy,
        sortDirection,
      },
    });

    return response.data;
  }

  /**
   * Obtiene un producto por su código
   * @param productCode - Código del producto a buscar
   * @returns Promise con el producto encontrado
   */
  async getProductByCode(productCode: number): Promise<Product> {
    const response = await productsApiClient.get<Product>(`/products/${productCode}`);
    return response.data;
  }
}

// Exportar instancia singleton
export const productService = new ProductService();

// Tipos basados en el ProductDTO de Spring Boot
export interface Product {
  productCode: number;
  name: string;
  description: string;
  price: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tipos para la paginación de Spring Boot
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

// Respuesta paginada de Spring Boot Page<T>
export interface PageResponse<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number; // número de página actual (inicia en 0)
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// Tipo específico para productos paginados
export type ProductPage = PageResponse<Product>;

// Parámetros para consultar productos
export interface ProductQueryParams {
  page?: number; // inicia en 0
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

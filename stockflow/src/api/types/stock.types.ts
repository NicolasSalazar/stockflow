// Tipos para el microservicio de stock

export interface Stock {
  stockCode: number;
  productCode: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseRequest {
  quantity: number;
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  data: {
    stockCode: number;
    productCode: number;
    productName: string;
    quantityPurchased: number;
    previousQuantity: number;
    currentQuantity: number;
    purchaseDate: string;
  };
}

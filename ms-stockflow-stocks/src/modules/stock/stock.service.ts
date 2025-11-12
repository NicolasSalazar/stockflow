import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class StockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}


  async getStockByProductCode(productCode: number) {
    // 1. Validate product exists by calling products microservice
    const product = await this.productsService.getProductById(productCode);

    if (!product) {
      throw new NotFoundException(`Product with code ${productCode} not found`);
    }

    // 2. Find current stock in database
    const stock = await this.prisma.stock.findUnique({
      where: { productCode: productCode },
    });

    if (!stock) {
      throw new NotFoundException(`Stock not found for product ${productCode}`);
    }

    // 3. Return stock information
    return {
      stockCode: stock.stockCode,
      productCode: stock.productCode,
      quantity: stock.quantity,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    };
  }
  async purchaseProduct(productCode: number, quantity: number) {
    // 1. Validate product exists by calling products microservice
    const product = await this.productsService.getProductById(productCode);

    if (!product) {
      throw new NotFoundException(`Product with code ${productCode} not found`);
    }

    if (!product.active) {
      throw new BadRequestException(
        `Product with code ${productCode} is not active`,
      );
    }

    // 2. Find current stock in database
    const stock = await this.prisma.stock.findUnique({
      where: { productCode: productCode },
    });

    if (!stock) {
      throw new NotFoundException(`Stock not found for product ${productCode}`);
    }

    // 3. Validate sufficient stock available
    if (stock.quantity < quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${stock.quantity}, Requested: ${quantity}`,
      );
    }

    // 4. Update stock quantity (subtract purchased amount)
    const newQuantity = stock.quantity - quantity;
    const updatedStock = await this.prisma.stock.update({
      where: { productCode: productCode },
      data: {
        quantity: newQuantity,
        updatedAt: new Date(),
      },
    });

    // 6. Return purchase success response
    return {
      success: true,
      message: 'Purchase completed successfully',
      data: {
        stockCode: updatedStock.stockCode,
        productCode,
        productName: product.name,
        quantityPurchased: quantity,
        previousQuantity: stock.quantity,
        currentQuantity: updatedStock.quantity,
        purchaseDate: updatedStock.updatedAt,
      },
    };
  }
}

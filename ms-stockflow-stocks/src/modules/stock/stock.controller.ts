import { Controller, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { StockService } from './stock.service';
import { UpdateStockDto } from './dto/stock.dto';

@ApiTags('Stock')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Patch('product/:productCode/purchase')
  @ApiOperation({ summary: 'Compra de producto y actualizacion de stock' })
  @ApiParam({
    name: 'productCode',
    description: 'Product code',
    type: Number,
    example: 1,
  })
  @ApiBody({ type: UpdateStockDto })
  @ApiResponse({
    status: 200,
    description: 'Compra exitosa',
    schema: {
      example: {
        success: true,
        message: 'Compra exitosa',
        data: {
          stockCode: 1,
          productCode: 1,
          productName: 'Product Name',
          quantityPurchased: 5,
          previousQuantity: 100,
          currentQuantity: 95,
          purchaseDate: '2025-11-12T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Stock insuficiente o producto no activo',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto o stock no encontrado',
  })
  async purchaseProduct(
    @Param('productCode') productCode: number,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.stockService.purchaseProduct(
      productCode,
      updateStockDto.quantity,
    );
  }
}

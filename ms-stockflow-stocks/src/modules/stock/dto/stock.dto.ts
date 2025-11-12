import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class UpdateStockDto {
  @ApiProperty({
    description: 'Quantity to purchase',
    example: 5,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  quantity: number;
}

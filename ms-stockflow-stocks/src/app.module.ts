import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StockModule } from './modules/stock/stock.module';
import { PrismaModule } from './shared/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    StockModule,
  ],
})
export class AppModule {}

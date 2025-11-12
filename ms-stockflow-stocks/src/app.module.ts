import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StockModule } from './modules/stock/stock.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    StockModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

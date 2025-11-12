import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Handle Prisma errors and convert them to NestJS exceptions
   */
  handleError(error: any): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ConflictException(
            `Duplicate field value: ${error.meta?.target}`,
          );
        case 'P2025':
          throw new NotFoundException('Record not found');
        case 'P2003':
          throw new ConflictException('Foreign key constraint failed');
        default:
          throw new InternalServerErrorException(
            `Database error: ${error.message}`,
          );
      }
    }
    throw new InternalServerErrorException('An unexpected error occurred');
  }

  /**
   * Alias for backward compatibility
   */
  requestError(error: any): never {
    return this.handleError(error);
  }
}

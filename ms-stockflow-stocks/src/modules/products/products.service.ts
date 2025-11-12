import {
  Injectable,
  Logger,
  NotFoundException,
  BadGatewayException,
  ServiceUnavailableException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance } from 'axios';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  private readonly productsServiceUrl: string;
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.productsServiceUrl = this.configService.get<string>(
      'PRODUCTS_SERVICE_URL',
      'http://localhost:3001',
    );
    const httpTimeout = this.configService.get<number>('HTTP_TIMEOUT', 5000);

    this.axiosInstance = axios.create({
      timeout: httpTimeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.logger.log(
      'ProductsService inicializado - URL: ' +
        this.productsServiceUrl +
        ', Timeout: ' +
        httpTimeout +
        'ms',
    );
  }

  async getProductById(productCode: number): Promise<any> {
    const serviceUrl = this.productsServiceUrl + productCode;

    this.logger.log(
      'Consultando microservicio de productos - Codigo: ' + productCode,
    );
    this.logger.debug('URL: ' + serviceUrl);

    try {
      const response = await this.axiosInstance.get(serviceUrl);

      this.logger.log('Producto ' + productCode + ' obtenido exitosamente');

      return response.data;
    } catch (error: any) {
      this.handleMicroserviceError(error, productCode, serviceUrl);
    }
  }

  private handleMicroserviceError(
    error: any,
    productCode: number,
    serviceUrl: string,
  ): never {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      const errorMsg =
        'Timeout al consultar el microservicio de productos. ' +
        'Producto: ' +
        productCode +
        ', URL: ' +
        serviceUrl +
        ', Timeout configurado: ' +
        this.axiosInstance.defaults.timeout +
        'ms';

      this.logger.error(errorMsg);
      throw new ServiceUnavailableException({
        message: 'El microservicio de productos no respondio a tiempo',
        error: 'Service Timeout',
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        productCode,
      });
    }

    if (error.isAxiosError || error instanceof AxiosError) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 404) {
        this.logger.warn(
          'Producto ' + productCode + ' no encontrado en el microservicio',
        );
        throw new NotFoundException({
          message: 'El producto no existe en el sistema',
          error: 'Product Not Found',
          statusCode: HttpStatus.NOT_FOUND,
          productCode,
        });
      }

      if (axiosError.response?.status === 400) {
        this.logger.warn('Solicitud invalida para el producto: ' + productCode);
        throw new HttpException(
          {
            message: 'El codigo de producto no es valido',
            error: 'Bad Request',
            statusCode: HttpStatus.BAD_REQUEST,
            productCode,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (
        axiosError.response?.status === 401 ||
        axiosError.response?.status === 403
      ) {
        this.logger.error(
          'Error de autorizacion al consultar el microservicio. Status: ' +
            axiosError.response.status,
        );
        throw new HttpException(
          {
            message: 'Error de autorizacion con el microservicio de productos',
            error: 'Unauthorized',
            statusCode: axiosError.response.status,
          },
          axiosError.response.status,
        );
      }

      if (
        axiosError.response?.status &&
        axiosError.response.status >= 500 &&
        axiosError.response.status < 600
      ) {
        const errorMsg =
          'Error interno en el microservicio de productos. ' +
          'Status: ' +
          axiosError.response.status +
          ', Producto: ' +
          productCode +
          ', URL: ' +
          serviceUrl +
          ', Response: ' +
          JSON.stringify(axiosError.response.data || {});

        this.logger.error(errorMsg, axiosError.stack);
        throw new BadGatewayException({
          message: 'El microservicio de productos presenta problemas internos',
          error: 'Bad Gateway',
          statusCode: HttpStatus.BAD_GATEWAY,
          productCode,
          details: axiosError.response.data,
        });
      }

      if (axiosError.code === 'ECONNREFUSED') {
        this.logger.error(
          'No se pudo conectar con el microservicio de productos (ECONNREFUSED). URL: ' +
            serviceUrl,
          axiosError.stack,
        );
        throw new ServiceUnavailableException({
          message: 'El microservicio de productos no esta disponible',
          error: 'Connection Refused',
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          details: 'No se pudo establecer la conexion con el servicio',
        });
      }

      if (axiosError.code === 'ENOTFOUND') {
        this.logger.error(
          'No se pudo resolver el host del microservicio de productos (ENOTFOUND). URL: ' +
            serviceUrl,
          axiosError.stack,
        );
        throw new ServiceUnavailableException({
          message: 'No se pudo resolver la direccion del microservicio',
          error: 'Host Not Found',
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          details: 'Verifique la configuracion de PRODUCTS_SERVICE_URL',
        });
      }

      const errorMsg =
        'Error HTTP al consultar el microservicio de productos. ' +
        'Status: ' +
        (axiosError.response?.status || 'N/A') +
        ', Producto: ' +
        productCode +
        ', Mensaje: ' +
        axiosError.message +
        ', URL: ' +
        serviceUrl;

      this.logger.error(errorMsg, axiosError.stack);
      throw new BadGatewayException({
        message: 'Error al comunicarse con el microservicio de productos',
        error: 'Communication Error',
        statusCode: HttpStatus.BAD_GATEWAY,
        productCode,
        details: axiosError.message,
      });
    }

    const errorMsg =
      'Error inesperado al consultar el microservicio de productos. ' +
      'Producto: ' +
      productCode +
      ', Tipo: ' +
      (error?.constructor?.name || 'Unknown') +
      ', Mensaje: ' +
      (error.message || 'Sin mensaje') +
      ', URL: ' +
      serviceUrl;

    this.logger.error(errorMsg, error.stack);
    throw new HttpException(
      {
        message: 'Error inesperado al obtener la informacion del producto',
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        productCode,
        details: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

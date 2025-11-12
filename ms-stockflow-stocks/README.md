# Microservicio de Gestión de Stocks - StockFlow

API REST para la gestión de inventario y control de stock en el sistema StockFlow.

## Características

- ✅ Registro y control de stock por producto
- ✅ Operación de compra que descuenta unidades del inventario
- ✅ Validaciones de negocio (producto activo, stock suficiente)
- ✅ Integración con microservicio de productos vía HTTP
- ✅ Documentación con Swagger/OpenAPI
- ✅ Validación de datos con `class-validator`
- ✅ Prisma ORM con PostgreSQL

## Tecnologías

- Node.js 18+
- NestJS 11
- TypeScript
- Prisma ORM
- PostgreSQL

## Requisitos Previos

- Node.js 18+
- PostgreSQL 12+

## Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Puerto HTTP del microservicio
PORT=3000

# Conexión a la base de datos (PostgreSQL)
DATABASE_URL=postgresql://postgres:password@localhost:5432/stockflow_db?schema=public

# Origen permitido para CORS (opcional)
CORS_ORIGIN=http://localhost:5173

# URL del microservicio de productos (DEBE incluir la ruta base y la barra final)
# Ejemplo: http://localhost:8080/api/products/
PRODUCTS_SERVICE_URL=http://localhost:8080/api/products/

# Tiempo máximo de espera para llamadas HTTP al microservicio de productos (ms)
HTTP_TIMEOUT=5000
```

Nota: `PRODUCTS_SERVICE_URL` se concatena con el `productCode` en las llamadas. Asegúrate de que termine con `/` y apunte a la ruta base correcta del endpoint de productos (por ejemplo `http://localhost:8080/api/products/`).

### Base de Datos

Este microservicio utiliza Prisma. El esquema se encuentra en `prisma/schema.prisma` y define las tablas `products` y `stock` (con relación 1:1 basada en `productCode`).

Para crear las tablas y generar el cliente:

```bash
npx prisma generate
```

## Instalación y Ejecución

1. Instalar dependencias

```bash
npm install
```

2. Generar Prisma Client (si no lo has hecho)

```bash
npx prisma generate
```

3. Iniciar la aplicación

```bash
# modo desarrollo
npm run start:dev

# modo producción
npm run build
npm run start:prod
```

La aplicación se ejecutará en `http://localhost:3000` (o el puerto definido en `PORT`).

## Documentación de la API

Una vez que la aplicación esté ejecutándose, accede a la documentación de Swagger en:

- Swagger UI: `http://localhost:3000/api/docs`

## Endpoints

### Compra de Producto (Descuento de Stock)

```http
PATCH /stock/product/{productCode}/purchase
Content-Type: application/json

{
  "quantity": 5
}
```

**Descripción:**
- Descuenta la cantidad indicada del stock del producto.
- Valida que el producto exista y esté activo (consultando el microservicio de productos).
- Verifica que haya stock suficiente antes de descontar.

**Respuesta (200 OK):**

```json
{
  "success": true,
  "message": "Purchase completed successfully",
  "data": {
    "stockCode": 1,
    "productCode": 1001,
    "productName": "Laptop Dell Inspiron",
    "quantityPurchased": 5,
    "previousQuantity": 100,
    "currentQuantity": 95,
    "purchaseDate": "2025-11-12T10:00:00.000Z"
  }
}
```

**Errores Posibles:**
- `404 Not Found`: Producto o stock no encontrado.
- `400 Bad Request`: Stock insuficiente o producto no activo.
- `503 Service Unavailable`: Microservicio de productos no disponible o timeout.
- `502 Bad Gateway`: Error al comunicarse con el microservicio de productos.

## Manejo de Errores

La API maneja los siguientes tipos de errores con respuestas estructuradas:

### Producto No Encontrado (404)

```json
{
  "statusCode": 404,
  "message": "El producto no existe en el sistema",
  "error": "Product Not Found",
  "productCode": 1001
}
```

### Stock Insuficiente (400)

```json
{
  "statusCode": 400,
  "message": "Insufficient stock. Available: 2, Requested: 5"
}
```

### Producto Inactivo (400)

```json
{
  "statusCode": 400,
  "message": "Product with code 1001 is not active"
}
```

### Timeout al Consultar Productos (503)

```json
{
  "statusCode": 503,
  "message": "El microservicio de productos no respondio a tiempo",
  "error": "Service Timeout",
  "productCode": 1001
}
```

## Estructura del Proyecto

```
src/
├── app.module.ts
├── main.ts
├── modules/
│   ├── stock/
│   │   ├── dto/
│   │   │   └── stock.dto.ts        # DTO de actualización de stock
│   │   ├── stock.controller.ts     # Controlador REST
│   │   ├── stock.module.ts         # Módulo de stock
│   │   └── stock.service.ts        # Lógica de negocio de stock
│   └── products/
│       └── products.service.ts     # Cliente HTTP al microservicio de productos
└── shared/
    └── prisma/
        ├── prisma.module.ts        # Módulo Prisma
        └── prisma.service.ts       # Servicio Prisma

prisma/
└── schema.prisma                    # Esquema de datos Prisma
```

## Validaciones

- `quantity`: Obligatorio, entero positivo.
- Validación global con `ValidationPipe` para limpiar y transformar datos.

## Logging

- Se utiliza el `Logger` de NestJS en `ProductsService` para registrar eventos, errores y tiempo de espera.

## Contacto

Equipo de Desarrollo - nicolas0304salazar@gracialab.com.co

# Microservicio de Gestión de Productos - StockFlow

API REST para la gestión completa de productos en el sistema StockFlow.

## Características

- ✅ CRUD completo de productos
- ✅ Validación de datos con Bean Validation
- ✅ Manejo centralizado de errores
- ✅ Documentación con Swagger/OpenAPI
- ✅ Paginación y ordenamiento
- ✅ Eliminación lógica (soft delete)
- ✅ Auditoría de fechas (createdAt, updatedAt)

## Tecnologías

- Java 21
- Spring Boot 3.5.7
- Spring Data JPA
- PostgreSQL
- ModelMapper
- Lombok
- SpringDoc OpenAPI 3
- Maven

## Requisitos Previos

- JDK 21
- PostgreSQL 12+
- Maven 3.8+

## Configuración

### Base de Datos

Asegúrate de tener PostgreSQL ejecutándose y crea la base de datos:

```sql
CREATE DATABASE stockflow_db;
```

Ejecuta el script de creación de tablas ubicado en `../stockflow-database/schema.sql`

### Configuración de la Aplicación

Edita el archivo `src/main/resources/application.yml` si necesitas cambiar las credenciales de la base de datos:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/stockflow_db
    username: postgres
    password: 6150
```

## Instalación y Ejecución

1. Clona el repositorio
2. Navega al directorio del proyecto
3. Instala las dependencias:

```bash
mvn clean install
```

4. Ejecuta la aplicación:

```bash
mvn spring-boot:run
```

La aplicación se ejecutará en `http://localhost:8080`

## Documentación de la API

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

**Swagger UI:** http://localhost:8080/swagger-ui.html

**OpenAPI JSON:** http://localhost:8080/api-docs

## Endpoints

### Crear Producto

```http
POST /api/products
Content-Type: application/json

{
  "productCode": 1001,
  "name": "Laptop Dell Inspiron",
  "description": "Laptop con procesador Intel Core i5, 8GB RAM, 256GB SSD",
  "price": 1500000,
  "active": true
}
```

**Respuesta (201 Created):**
```json
{
  "productCode": 1001,
  "name": "Laptop Dell Inspiron",
  "description": "Laptop con procesador Intel Core i5, 8GB RAM, 256GB SSD",
  "price": 1500000,
  "active": true,
  "createdAt": "2025-11-11T10:30:00",
  "updatedAt": "2025-11-11T10:30:00"
}
```

### Obtener Producto por ID

```http
GET /api/products/{productCode}
```

**Respuesta (200 OK):**
```json
{
  "productCode": 1001,
  "name": "Laptop Dell Inspiron",
  "description": "Laptop con procesador Intel Core i5, 8GB RAM, 256GB SSD",
  "price": 1500000,
  "active": true,
  "createdAt": "2025-11-11T10:30:00",
  "updatedAt": "2025-11-11T10:30:00"
}
```

### Actualizar Producto

```http
PUT /api/products/{productCode}
Content-Type: application/json

{
  "name": "Laptop Dell Inspiron 15",
  "price": 1600000
}
```

**Nota:** Solo se actualizan los campos enviados (actualización parcial)

**Respuesta (200 OK):**
```json
{
  "productCode": 1001,
  "name": "Laptop Dell Inspiron 15",
  "description": "Laptop con procesador Intel Core i5, 8GB RAM, 256GB SSD",
  "price": 1600000,
  "active": true,
  "createdAt": "2025-11-11T10:30:00",
  "updatedAt": "2025-11-11T15:45:00"
}
```

### Eliminar Producto

```http
DELETE /api/products/{productCode}
```

**Respuesta (204 No Content)**

**Nota:** Esta es una eliminación lógica. El producto se marca como inactivo (`active = false`)

### Listar Productos con Paginación

```http
GET /api/products?page=0&size=10&sortBy=productCode&sortDirection=ASC
```

**Parámetros de consulta:**
- `page`: Número de página (inicia en 0, por defecto: 0)
- `size`: Tamaño de página (por defecto: 10)
- `sortBy`: Campo para ordenar (por defecto: productCode)
- `sortDirection`: Dirección de ordenamiento - ASC o DESC (por defecto: ASC)

**Respuesta (200 OK):**
```json
{
  "content": [
    {
      "productCode": 1001,
      "name": "Laptop Dell Inspiron",
      "description": "Laptop con procesador Intel Core i5, 8GB RAM, 256GB SSD",
      "price": 1500000,
      "active": true,
      "createdAt": "2025-11-11T10:30:00",
      "updatedAt": "2025-11-11T10:30:00"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    }
  },
  "totalElements": 1,
  "totalPages": 1,
  "last": true,
  "first": true,
  "number": 0,
  "size": 10,
  "numberOfElements": 1,
  "empty": false
}
```

## Manejo de Errores

La API maneja los siguientes tipos de errores con respuestas estructuradas:

### Producto No Encontrado (404)

```json
{
  "status": 404,
  "message": "Producto con código 1001 no encontrado",
  "details": [
    "El producto solicitado no existe en el sistema"
  ],
  "timestamp": "2025-11-11T10:30:00",
  "path": "/api/products/1001"
}
```

### Producto Ya Existe (409)

```json
{
  "status": 409,
  "message": "El producto con código 1001 ya existe",
  "details": [
    "Ya existe un producto con el código proporcionado"
  ],
  "timestamp": "2025-11-11T10:30:00",
  "path": "/api/products"
}
```

### Error de Validación (400)

```json
{
  "status": 400,
  "message": "Error de validación en los datos proporcionados",
  "details": [
    "name: El nombre del producto es obligatorio",
    "price: El precio debe ser un número positivo"
  ],
  "timestamp": "2025-11-11T10:30:00",
  "path": "/api/products"
}
```

## Estructura del Proyecto

```
src/main/java/com/linktic/ms_stockflow_products/
├── config/
│   ├── ModelMapperConfig.java          # Configuración de ModelMapper
│   └── OpenApiConfig.java              # Configuración de Swagger/OpenAPI
|   └── CorsConfig.java                 # Configuración de CORS
├── controller/
│   └── ProductController.java          # Controlador REST
│   ├── dto/
│   │   ├── ProductCreateDTO.java       # DTO para crear productos
│   │   ├── ProductUpdateDTO.java       # DTO para actualizar productos
│       └── ProductDTO.java             # DTO de respuesta
├── domain/
│   ├── builder/
│   │   └── ObjectBuilder.java          # Utilidad para mapeo de objetos
│   ├── entity/
│   │   ├── Product.java                # Entidad JPA
│   │   └── GeneralEntityAudit.java     # Entidad base con auditoría
│   └── repository/
│       └── ProductRepository.java      # Repositorio JPA
├── exception/
│   ├── ErrorResponse.java              # DTO de error
│   ├── GlobalExceptionHandler.java     # Manejador global de excepciones
│   ├── ProductNotFoundException.java   # Excepción personalizada
│   └── ProductAlreadyExistsException.java  # Excepción personalizada
└── service/
    ├── ProductService.java             # Interface del servicio
    └── impl/
        └── ProductServiceImpl.java     # Implementación del servicio
```

## Validaciones

Los siguientes campos tienen validaciones:

### ProductRequest (Crear)
- `productCode`: Obligatorio, debe ser positivo
- `name`: Obligatorio, entre 3 y 100 caracteres
- `description`: Opcional, máximo 500 caracteres
- `price`: Obligatorio, debe ser positivo
- `active`: Opcional, por defecto `true`

### ProductUpdateRequest (Actualizar)
- `name`: Opcional, entre 3 y 100 caracteres
- `description`: Opcional, máximo 500 caracteres
- `price`: Opcional, debe ser positivo
- `active`: Opcional

## Logging

El proyecto utiliza SLF4J con niveles de logging configurables:

- `INFO`: Operaciones principales del servicio
- `DEBUG`: SQL queries de Hibernate
- `TRACE`: Parámetros de las queries

## Licencia

Apache 2.0

## Contacto

Equipo de Desarrollo - nicolas0304salazar@gracialab.com.co

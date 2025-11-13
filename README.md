# StockFlow - Sistema de Gestión de Inventario

Sistema de gestión de inventario construido con arquitectura de microservicios, que incluye un backend en Spring Boot (Java) para productos, un microservicio en NestJS (Node.js) para stocks, y un frontend en React con Vite.

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      STOCKFLOW SYSTEM                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Frontend   │    │   Products   │    │    Stocks    │ │
│  │   (React)    │───▶│   Service    │◀───│   Service    │ │
│  │  Port: 5173  │    │   (Spring)   │    │   (NestJS)   │ │
│  └──────────────┘    │  Port: 8080  │    │  Port: 3000  │ │
│                      └──────┬───────┘    └──────┬───────┘ │
│                             │                     │         │
│                             └──────────┬──────────┘         │
│                                        ▼                     │
│                               ┌────────────────┐            │
│                               │   PostgreSQL   │            │
│                               │   Port: 5432   │            │
│                               └────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## Tecnologías Utilizadas

### Backend - Products Service
- **Java 17** con **Spring Boot 3.3**
- **Spring Data JPA** para persistencia
- **PostgreSQL** como base de datos
- **Maven** como gestor de dependencias
- **Swagger/OpenAPI** para documentación

### Backend - Stocks Service
- **Node.js 22** con **NestJS**
- **Prisma ORM** para acceso a datos
- **PostgreSQL** como base de datos
- **Axios** para comunicación entre servicios
- **Swagger** para documentación de API

### Frontend
- **React 19** con **TypeScript**
- **Vite 7** como build tool
- **React Router** para navegación
- **Tailwind CSS** para estilos
- **Axios** para peticiones HTTP

### Infrastructure
- **Docker** & **Docker Compose**
- **Nginx** como servidor web para el frontend
- **PostgreSQL 16** como base de datos

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Docker](https://www.docker.com/get-started) (versión 20.10 o superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versión 2.0 o superior)
- Git

Para verificar las versiones instaladas:

```bash
docker --version
docker-compose --version
```

## Estructura del Proyecto

```
linktic/
├── docker-compose.yml              # Orquestación de contenedores
├── stockflow/                      # Frontend React
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── env.sh
│   └── src/
├── ms-stockflow-products/          # Microservicio de Productos (Spring Boot)
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
├── ms-stockflow-stocks/            # Microservicio de Stocks (NestJS)
│   ├── Dockerfile
│   ├── docker-entrypoint.sh
│   ├── package.json
│   ├── prisma/
│   └── src/
└── stockflow-database/             # Scripts de base de datos
    └── schema.sql
```

## Instalación y Compilación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd linktic
```

### 2. Compilar Todas las Imágenes Docker

Para compilar todas las imágenes de los servicios desde cero:

```bash
docker-compose build
```

Para forzar una recompilación completa sin usar caché:

```bash
docker-compose build --no-cache
```

Para compilar un servicio específico:

```bash
# Solo el servicio de stocks
docker-compose build stocks

# Solo el frontend
docker-compose build frontend

# Solo el servicio de productos
docker-compose build products
```

### 3. Iniciar los Servicios

Para levantar todos los contenedores en segundo plano:

```bash
docker-compose up -d
```

Para levantar los servicios y ver los logs en tiempo real:

```bash
docker-compose up
```

### 4. Verificar el Estado de los Contenedores

```bash
docker-compose ps
```

Deberías ver algo como:

```
NAME                 IMAGE              STATUS                    PORTS
stockflow-db         postgres:16        Up (healthy)              0.0.0.0:5432->5432/tcp
stockflow-products   linktic-products   Up (healthy)              0.0.0.0:8080->8080/tcp
stockflow-stocks     linktic-stocks     Up (healthy)              0.0.0.0:3000->3000/tcp
stockflow-frontend   linktic-frontend   Up                        0.0.0.0:5173->80/tcp
```

## Acceso a los Servicios

Una vez que todos los contenedores estén ejecutándose, puedes acceder a:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:5173 | Aplicación web principal |
| **Products API** | http://localhost:8080/api/products | API REST de productos |
| **Products Swagger** | http://localhost:8080/swagger-ui.html | Documentación interactiva (Spring) |
| **Stocks API** | http://localhost:3000/stock | API REST de stocks |
| **Stocks Swagger** | http://localhost:3000/api/docs | Documentación interactiva (NestJS) |
| **PostgreSQL** | localhost:5432 | Base de datos (credenciales en docker-compose.yml) |

### Credenciales de Base de Datos

```
Host: localhost
Port: 5432
Database: stockflow_db
Username: postgres
Password: 6150
```

## Comandos Útiles

### Ver Logs

Ver logs de todos los servicios:

```bash
docker-compose logs -f
```

Ver logs de un servicio específico:

```bash
docker-compose logs -f stocks
docker-compose logs -f frontend
docker-compose logs -f products
docker-compose logs -f db
```

Ver las últimas 50 líneas de logs:

```bash
docker-compose logs --tail=50 stocks
```

### Detener los Servicios

Detener todos los contenedores:

```bash
docker-compose down
```

Detener y eliminar volúmenes (¡cuidado! esto borrará los datos de la base de datos):

```bash
docker-compose down -v
```

### Reiniciar un Servicio Específico

```bash
docker-compose restart stocks
docker-compose restart frontend
docker-compose restart products
```

### Reconstruir y Reiniciar un Servicio

```bash
# Reconstruir la imagen
docker-compose build stocks

# Recrear el contenedor con la nueva imagen
docker-compose up -d stocks
```

### Ejecutar Comandos Dentro de un Contenedor

```bash
# Acceder al shell del contenedor de stocks
docker-compose exec stocks sh

# Acceder al shell de PostgreSQL
docker-compose exec db psql -U postgres -d stockflow_db

# Ver archivos en el contenedor
docker-compose exec stocks ls -la /app
```

## Healthchecks

Todos los servicios incluyen healthchecks para asegurar que están funcionando correctamente:

- **Database**: `pg_isready -U postgres -d stockflow_db`
- **Products**: `curl -f http://localhost:8080/actuator/health`
- **Stocks**: `wget --no-verbose --tries=1 --spider http://localhost:3000/health`
- **Frontend**: Nginx health endpoint en `/health`

### Variables de Entorno

Las variables de entorno están configuradas en `docker-compose.yml`. Para modificarlas:

1. Edita el archivo `docker-compose.yml`
2. Localiza la sección `environment` del servicio
3. Modifica los valores necesarios
4. Reinicia el servicio:
   ```bash
   docker-compose up -d <servicio>
   ```


## Arquitectura de Datos

El sistema utiliza una base de datos PostgreSQL compartida con el siguiente esquema:

- **products**: Almacena información de productos
  - product_code (PK)
  - name
  - description
  - price
  - active
  - created_at
  - updated_at

- **stock**: Almacena niveles de inventario
  - stock_code (PK)
  - product_code (FK -> products)
  - quantity
  - created_at
  - updated_at

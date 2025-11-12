`# Frontend StockFlow
`
`Aplicación web para la gestión de productos e inventario del sistema StockFlow.
`
`## Características
`
`- ✅ Interfaz de usuario moderna y responsiva
`- ✅ Gestión de productos (visualización y consulta)
`- ✅ Modal de compra de productos
`- ✅ Modal de detalles de producto
`- ✅ Integración con microservicios backend
`- ✅ Enrutamiento con React Router
`- ✅ Estilizado con Tailwind CSS
`- ✅ TypeScript para tipado estático
`
`## Tecnologías
`
`- React 19.2
`- TypeScript 5.9
`- Vite 7.2
`- React Router DOM 7.9
`- Axios 1.13
`- Tailwind CSS 4.1
`- ESLint
`
`## Requisitos Previos
`
`- Node.js 18+
`- npm 9+
`- Microservicios backend ejecutándose:
`  - ms-stockflow-products (puerto 8080)
`  - ms-stockflow-stocks (puerto 3001)
`
`## Configuración
`
`### Variables de Entorno
`
`Crea un archivo \`.env\` en la raíz del proyecto basándote en \`.env.example\`:
`
`\`\`\`bash
`# URLs de los servicios backend
`# Para desarrollo local
`VITE_PRODUCTS_API_URL=http://localhost:8080/api
`VITE_STOCKS_API_URL=http://localhost:3001
`\`\`\`
`
`**Nota:** Las variables de entorno en Vite deben tener el prefijo \`VITE_\` para estar disponibles en el cliente.
`
`## Instalación y Ejecución
`
`1. Clona el repositorio
`2. Navega al directorio del proyecto
`3. Instala las dependencias:
`
`\`\`\`bash
`npm install
`\`\`\`
`
`4. Crea el archivo \`.env\` con la configuración apropiada (ver sección de Variables de Entorno)
`
`5. Ejecuta la aplicación en modo desarrollo:
`
`\`\`\`bash
`npm run dev
`\`\`\`
`
`La aplicación se ejecutará en \`http://localhost:5173\`
`
`## Scripts Disponibles
`
`- \`npm run dev\`: Inicia el servidor de desarrollo
`- \`npm run build\`: Compila TypeScript y construye la aplicación para producción
`- \`npm run preview\`: Previsualiza la build de producción
`- \`npm run lint\`: Ejecuta ESLint para verificar el código
`
`## Rutas de la Aplicación
`
`### Productos
`
`\`\`\`
`GET /products
`\`\`\`
`
`Página principal que muestra el listado de productos con las siguientes funcionalidades:
`- Visualización de productos disponibles
`- Botón para ver detalles de producto
`- Botón para realizar compra
`
`## Estructura del Proyecto
`
`\`\`\`
`stockflow/
`├── public/
`│   └── vite.svg                    # Favicon
`├── src/
`│   ├── api/
`│   │   ├── config/
`│   │   │   └── axios.config.ts     # Configuración de Axios
`│   │   ├── product/
`│   │   │   └── productService.ts   # Servicio de productos
`│   │   ├── stock/
`│   │   │   └── stockService.ts     # Servicio de stocks
`│   │   └── types/
`│   │       ├── product.types.ts    # Tipos de productos
`│   │       └── stock.types.ts      # Tipos de stocks
`│   ├── components/
`│   │   └── products/
`│   │       ├── ProductDetailModal.tsx  # Modal de detalles
`│   │       └── PurchaseModal.tsx       # Modal de compra
`│   ├── pages/
`│   │   └── products/
`│   │       └── ProductPage.tsx         # Página de productos
`│   ├── routes/
`│   │   └── index.tsx                   # Configuración de rutas
`│   ├── App.tsx                         # Componente principal
`│   ├── main.tsx                        # Punto de entrada
`│   └── index.css                       # Estilos globales
`├── .env.example                        # Ejemplo de variables de entorno
`├── eslint.config.js                    # Configuración de ESLint
`├── index.html                          # HTML principal
`├── package.json                        # Dependencias y scripts
`├── postcss.config.js                   # Configuración de PostCSS
`├── tailwind.config.js                  # Configuración de Tailwind (si existe)
`├── tsconfig.json                       # Configuración de TypeScript
`├── tsconfig.app.json                   # Configuración de TypeScript para la app
`├── tsconfig.node.json                  # Configuración de TypeScript para Node
`├── vite.config.ts                      # Configuración de Vite
`└── README.md                           # Este archivo
`\`\`\`
`
`## Componentes Principales
`
`### ProductPage
`
`Página principal que muestra el listado de productos y permite:
`- Ver información básica de productos
`- Abrir modal de detalles
`- Abrir modal de compra
`
`### ProductDetailModal
`
`Modal que muestra información detallada de un producto:
`- Código del producto
`- Nombre y descripción
`- Precio
`- Estado (activo/inactivo)
`- Stock disponible
`
`### PurchaseModal
`
`Modal para realizar compras:
`- Selección de cantidad
`- Validación de stock disponible
`- Confirmación de compra
`
`## Integración con Backend
`
`La aplicación se comunica con dos microservicios:
`
`### Microservicio de Productos (Java/Spring Boot)
`- **URL:** Configurada en \`VITE_PRODUCTS_API_URL\`
`- **Puerto:** 8080 (por defecto)
`- **Endpoints:**
`  - \`GET /api/products\`: Obtener todos los productos
`  - \`GET /api/products/{code}\`: Obtener producto por código
`
`### Microservicio de Stocks (NestJS)
`- **URL:** Configurada en \`VITE_STOCKS_API_URL\`
`- **Puerto:** 3001 (por defecto)
`- **Endpoints:**
`  - \`GET /stock/{productCode}\`: Obtener stock de un producto
`  - \`POST /stock/purchase\`: Realizar compra
`
`## Despliegue con Docker
`
`El proyecto incluye configuración para Docker:
`
`\`\`\`bash
`# Construir la imagen
`docker build -t stockflow-frontend .
`
`# Ejecutar el contenedor
`docker run -p 80:80 stockflow-frontend
`\`\`\`
`
`La aplicación estará disponible en \`http://localhost\`
`
`## Desarrollo
`
`### Añadir nuevas páginas
`
`1. Crea el componente de página en \`src/pages/\`
`2. Añade la ruta en \`src/routes/index.tsx\`
`3. Importa y usa el componente
`
`### Añadir nuevos servicios API
`
`1. Define los tipos en \`src/api/types/\`
`2. Crea el servicio en \`src/api/{nombre}/\`
`3. Usa la configuración de Axios en \`src/api/config/axios.config.ts\`
`
`## Mejores Prácticas
`
`- Utiliza TypeScript para todas las nuevas funcionalidades
`- Sigue las convenciones de nombres de archivos (PascalCase para componentes)
`- Mantén los componentes pequeños y enfocados en una sola responsabilidad
`- Usa hooks personalizados para lógica reutilizable
`- Añade tipos para todas las props y estados
`
`## Licencia
`
`Apache 2.0
`
`## Contacto
`
`Equipo de Desarrollo - nicolas0304salazar@gracialab.com.co

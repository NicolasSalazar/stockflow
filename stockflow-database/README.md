# 📥 Stockflow Database - Guía de Instalación

Base de datos PostgreSQL para la prueba técnica Full Stack.

---

## 📋 Contenido del Script

El archivo `schema.sql` contiene:

- ✅ **Función:** `update_updated_at_column()`
- ✅ **2 Tablas:** `products` y `stock`
- ✅ **Triggers:** Actualización automática de `updated_at`
- ✅ **Índices:** Para optimizar consultas
- ✅ **Datos de prueba:** 10 productos con stock

---

## 🚀 Instalación

### Paso 1: Crear la base de datos

Primero debes crear manualmente la base de datos `stockflow_db`:

#### Con psql:
```bash
psql -U postgres -c "CREATE DATABASE stockflow_db;"
```

#### Con pgAdmin:
1. Click derecho en **Databases**
2. **Create** → **Database...**
3. Nombre: `stockflow_db`
4. Click **Save**

---

### Paso 2: Ejecutar el script

Una vez creada la base de datos, ejecuta el script para crear las tablas y datos:

#### Con psql:
```bash
psql -U postgres -d stockflow_db -f schema.sql
```

#### Con pgAdmin:
1. Click derecho en `stockflow_db` → **Query Tool**
2. Abrir archivo `schema.sql` 📁
3. Click **Execute** ▶️

---

### Paso 3: Verificar la instalación

#### Con psql:
```bash
psql -U postgres -d stockflow_db -c "\dt"
psql -U postgres -d stockflow_db -c "SELECT COUNT(*) FROM products;"
```

#### Con pgAdmin:
1. Expandir: `stockflow_db` → `Schemas` → `public` → `Tables`
2. Deberías ver 2 tablas: `products` y `stock`
3. Click derecho en `products` → **View/Edit Data** → **All Rows**
4. Verás 10 productos

---

## 📦 Datos de Prueba Incluidos

El script incluye **10 productos** con stock:

| Producto | Precio | Stock |
|----------|--------|-------|
| Laptop Dell XPS 13 | $1,299.99 | 15 unidades |
| Mouse Logitech MX Master 3 | $99.99 | 50 unidades |
| Teclado Mecánico Keychron K2 | $79.99 | 30 unidades |
| Monitor LG UltraWide 34" | $599.99 | 8 unidades |
| Webcam Logitech C920 | $79.99 | 25 unidades |
| Auriculares Sony WH-1000XM4 | $349.99 | 20 unidades |
| SSD Samsung 1TB | $129.99 | 40 unidades |
| Router ASUS RT-AX88U | $299.99 | 12 unidades |
| Tablet iPad Air | $599.99 | 18 unidades |
| Smartwatch Garmin Fenix 6 | $449.99 | 10 unidades |
-- ============================================
-- STOCKFLOW - Database Schema
-- PostgreSQL Database Schema
-- ============================================
-- PREREQUISITO: Crear manualmente la base de datos 'stockflow_db'
-- EJECUCIÓN: psql -U postgres -d stockflow_db -f schema.sql
-- ============================================

-- Limpiar tablas existentes
DROP TABLE IF EXISTS stock CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================
-- FUNCIÓN: Actualizar updated_at automáticamente
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TABLA: products
-- ============================================

CREATE TABLE products (
    product_code SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_code ON products(product_code);

COMMENT ON TABLE products IS 'Catálogo de productos del sistema';
COMMENT ON COLUMN products.product_code IS 'Código único de producto';

-- ============================================
-- TABLA: stock
-- ============================================

CREATE TABLE stock (
    stock_code SERIAL PRIMARY KEY,
    product_code INTEGER NOT NULL UNIQUE REFERENCES products(product_code) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stock_product_code ON stock(product_code);

COMMENT ON TABLE stock IS 'Control de stock de productos';
COMMENT ON COLUMN stock.quantity IS 'Cantidad disponible en stock';
COMMENT ON COLUMN stock.stock_code IS 'Código único de stock';

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stock_updated_at
BEFORE UPDATE ON stock
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS DE PRUEBA
-- ============================================

INSERT INTO products (name, description, price) VALUES
('Laptop Dell XPS 13', 'Laptop ultrabook de alto rendimiento con procesador Intel i7', 1299000),
('Mouse Logitech MX Master 3', 'Mouse ergonómico inalámbrico para productividad', 99900),
('Teclado Mecánico Keychron K2', 'Teclado mecánico inalámbrico RGB', 79900),
('Monitor LG UltraWide 34"', 'Monitor curvo ultra wide 3440x1440', 599900),
('Webcam Logitech C920', 'Webcam Full HD 1080p para videoconferencias', 79900),
('Auriculares Sony WH-1000XM4', 'Auriculares con cancelación de ruido premium', 349900),
('SSD Samsung 1TB', 'Disco de estado sólido NVMe 1TB', 129900),
('Router ASUS RT-AX88U', 'Router WiFi 6 de alto rendimiento', 299900),
('Tablet iPad Air', 'Tablet Apple iPad Air 64GB', 599900),
('Smartwatch Garmin Fenix 6', 'Reloj inteligente deportivo con GPS', 449900);

INSERT INTO stock (product_code, quantity) VALUES
(1, 15), (2, 50), (3, 30), (4, 8), (5, 25),
(6, 20), (7, 40), (8, 12), (9, 18), (10, 10);

-- ============================================
-- FIN DEL SCHEMA
-- ============================================

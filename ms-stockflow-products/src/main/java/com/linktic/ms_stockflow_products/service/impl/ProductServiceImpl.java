package com.linktic.ms_stockflow_products.service.impl;

import com.linktic.ms_stockflow_products.domain.builder.ObjectBuilder;
import com.linktic.ms_stockflow_products.controller.dto.ProductCreateDTO;
import com.linktic.ms_stockflow_products.controller.dto.ProductDTO;
import com.linktic.ms_stockflow_products.controller.dto.ProductUpdateDTO;
import com.linktic.ms_stockflow_products.domain.entity.Product;
import com.linktic.ms_stockflow_products.domain.repository.ProductRepository;
import com.linktic.ms_stockflow_products.exception.ProductNotFoundException;
import com.linktic.ms_stockflow_products.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ObjectBuilder objectBuilder;

    @Override
    @Transactional
    public ProductDTO createProduct(ProductCreateDTO request) {
        try {
            log.info("Iniciando creación de producto con nombre: {}", request.getName());

            // Crear el producto (el código se genera automáticamente con @GeneratedValue)
            Product product = objectBuilder.map(request, Product.class);
            product.setCreatedAt(new Date());
            product.setUpdatedAt(new Date());

            // Si no se especifica el estado, se establece como activo por defecto
            if (product.getActive() == null) {
                product.setActive(true);
            }

            Product savedProduct = productRepository.save(product);
            log.info("Producto creado exitosamente con código: {}", savedProduct.getProductCode());

            return objectBuilder.map(savedProduct, ProductDTO.class);
        } catch (Exception e) {
            log.error("Error al crear producto: {}", e.getMessage(), e);
            throw new RuntimeException("Error al crear el producto: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getProductByCode(Integer productCode) {
        try {
            log.info("Buscando producto con código: {}", productCode);

            Product product = productRepository.findByProductCode(productCode);
            if (product == null) {
                log.error("Producto con código {} no encontrado", productCode);
                throw new ProductNotFoundException(productCode);
            }

            log.info("Producto encontrado: {}", product.getName());
            return objectBuilder.map(product, ProductDTO.class);
        } catch (ProductNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error al buscar producto con código {}: {}", productCode, e.getMessage(), e);
            throw new RuntimeException("Error al buscar el producto: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(Integer productCode, ProductUpdateDTO request) {
        try {
            log.info("Actualizando producto con código: {}", productCode);

            Product product = productRepository.findByProductCode(productCode);
            if (product == null) {
                log.error("Producto con código {} no encontrado", productCode);
                throw new ProductNotFoundException(productCode);
            }

            // Actualizar solo los campos que no sean nulos
            if (request.getName() != null) {
                product.setName(request.getName());
            }
            if (request.getDescription() != null) {
                product.setDescription(request.getDescription());
            }
            if (request.getPrice() != null) {
                product.setPrice(request.getPrice());
            }
            if (request.getActive() != null) {
                product.setActive(request.getActive());
            }

            product.setUpdatedAt(new Date());

            Product updatedProduct = productRepository.save(product);
            log.info("Producto actualizado exitosamente con código: {}", updatedProduct.getProductCode());

            return objectBuilder.map(updatedProduct, ProductDTO.class);
        } catch (ProductNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error al actualizar producto con código {}: {}", productCode, e.getMessage(), e);
            throw new RuntimeException("Error al actualizar el producto: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void deleteProduct(Integer productCode) {
        try {
            log.info("Eliminando producto con código: {}", productCode);

            Product product = productRepository.findByProductCode(productCode);
            if (product == null) {
                log.error("Producto con código {} no encontrado", productCode);
                throw new ProductNotFoundException(productCode);
            }

            // Eliminación lógica - marcar como inactivo
            product.setActive(false);
            product.setUpdatedAt(new Date());
            productRepository.save(product);

            log.info("Producto con código {} marcado como inactivo", productCode);
        } catch (ProductNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error al eliminar producto con código {}: {}", productCode, e.getMessage(), e);
            throw new RuntimeException("Error al eliminar el producto: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        try {
            log.info("Listando productos - Página: {}, Tamaño: {}",
                    pageable.getPageNumber(), pageable.getPageSize());

            Page<Product> productsPage = productRepository.findAll(pageable);

            log.info("Se encontraron {} productos", productsPage.getTotalElements());

            return productsPage.map(product -> objectBuilder.map(product, ProductDTO.class));
        } catch (Exception e) {
            log.error("Error al listar productos: {}", e.getMessage(), e);
            throw new RuntimeException("Error al listar los productos: " + e.getMessage(), e);
        }
    }
}

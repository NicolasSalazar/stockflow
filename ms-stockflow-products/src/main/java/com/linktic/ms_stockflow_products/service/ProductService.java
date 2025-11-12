package com.linktic.ms_stockflow_products.service;

import com.linktic.ms_stockflow_products.controller.dto.ProductCreateDTO;
import com.linktic.ms_stockflow_products.controller.dto.ProductDTO;
import com.linktic.ms_stockflow_products.controller.dto.ProductUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {

    /**
     * Crea un nuevo producto
     * @param request datos del producto a crear
     * @return producto creado
     */
    ProductDTO createProduct(ProductCreateDTO request);

    /**
     * Obtiene un producto por su código
     * @param productCode código del producto
     * @return producto encontrado
     */
    ProductDTO getProductByCode(Integer productCode);

    /**
     * Actualiza un producto existente
     * @param productCode código del producto a actualizar
     * @param request datos a actualizar
     * @return producto actualizado
     */
    ProductDTO updateProduct(Integer productCode, ProductUpdateDTO request);

    /**
     * Elimina un producto (eliminación lógica)
     * @param productCode código del producto a eliminar
     */
    void deleteProduct(Integer productCode);

    /**
     * Lista todos los productos con paginación
     * @param pageable configuración de paginación
     * @return página con productos
     */
    Page<ProductDTO> getAllProducts(Pageable pageable);
}

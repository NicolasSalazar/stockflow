package com.linktic.ms_stockflow_products.domain.repository;

import com.linktic.ms_stockflow_products.domain.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends CrudRepository<Product,Integer> {
    // Obtener producto  por ID
    Product findByProductCode(Integer productCode);

    // Listar todos los productos (activos e inactivos) con paginación
    Page<Product> findAll(Pageable pageable);
}

package com.linktic.ms_stockflow_products.exception;

public class ProductNotFoundException extends RuntimeException {

    public ProductNotFoundException(Integer productCode) {
        super("Producto con código " + productCode + " no encontrado");
    }

    public ProductNotFoundException(String message) {
        super(message);
    }
}

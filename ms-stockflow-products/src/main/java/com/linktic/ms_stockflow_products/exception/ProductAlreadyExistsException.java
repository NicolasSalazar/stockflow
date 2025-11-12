package com.linktic.ms_stockflow_products.exception;

public class ProductAlreadyExistsException extends RuntimeException {

    public ProductAlreadyExistsException(Integer productCode) {
        super("El producto con código " + productCode + " ya existe");
    }

    public ProductAlreadyExistsException(String message) {
        super(message);
    }
}

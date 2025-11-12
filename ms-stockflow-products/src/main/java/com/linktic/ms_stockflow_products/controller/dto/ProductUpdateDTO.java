package com.linktic.ms_stockflow_products.controller.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Request para actualizar un producto existente")
public class ProductUpdateDTO {

    @Schema(description = "Nombre del producto", example = "Laptop Dell Inspiron")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String name;

    @Schema(description = "Descripción del producto", example = "Laptop con procesador Intel Core i5, 8GB RAM, 256GB SSD")
    @Size(max = 500, message = "La descripción no puede superar los 500 caracteres")
    private String description;

    @Schema(description = "Precio del producto", example = "1500000")
    @Positive(message = "El precio debe ser un número positivo")
    private Integer price;

    @Schema(description = "Estado activo del producto", example = "true")
    private Boolean active;
}

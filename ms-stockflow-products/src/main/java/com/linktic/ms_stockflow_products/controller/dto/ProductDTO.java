package com.linktic.ms_stockflow_products.controller.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Response con los datos de un producto")
public class ProductDTO {

    @Schema(description = "Código único del producto", example = "1001")
    private Integer productCode;

    @Schema(description = "Nombre del producto", example = "Laptop Dell Inspiron")
    private String name;

    @Schema(description = "Descripción del producto", example = "Laptop con procesador Intel Core i5, 8GB RAM, 256GB SSD")
    private String description;

    @Schema(description = "Precio del producto", example = "1500000")
    private Integer price;

    @Schema(description = "Estado activo del producto", example = "true")
    private Boolean active;

    @Schema(description = "Fecha de creación", example = "2025-11-11T10:30:00")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date createdAt;

    @Schema(description = "Fecha de última actualización", example = "2025-11-11T15:45:00")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date updatedAt;
}

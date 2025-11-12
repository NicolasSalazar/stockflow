package com.linktic.ms_stockflow_products.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Respuesta de error estándar")
public class ErrorResponse {

    @Schema(description = "Código de estado HTTP", example = "400")
    private int status;

    @Schema(description = "Mensaje de error", example = "Validación fallida")
    private String message;

    @Schema(description = "Detalles adicionales del error")
    private List<String> details;

    @Schema(description = "Timestamp del error", example = "2025-11-11T10:30:00")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date timestamp;

    @Schema(description = "Ruta del endpoint que generó el error", example = "/api/products/123")
    private String path;
}

package com.linktic.ms_stockflow_products.controller;

import com.linktic.ms_stockflow_products.controller.dto.ProductCreateDTO;
import com.linktic.ms_stockflow_products.controller.dto.ProductDTO;
import com.linktic.ms_stockflow_products.controller.dto.ProductUpdateDTO;
import com.linktic.ms_stockflow_products.exception.ErrorResponse;
import com.linktic.ms_stockflow_products.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "API para la gestión de productos")
public class ProductController {

    private final ProductService productService;

    @Operation(
            summary = "Crear un nuevo producto",
            description = "Crea un nuevo producto en el sistema con los datos proporcionados"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Producto creado exitosamente",
                    content = @Content(schema = @Schema(implementation = ProductDTO.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos de entrada inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "El producto ya existe",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(
            @Valid @RequestBody ProductCreateDTO request) {
        ProductDTO response = productService.createProduct(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(
            summary = "Obtener producto por ID",
            description = "Obtiene un producto específico mediante su código identificador"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Producto encontrado",
                    content = @Content(schema = @Schema(implementation = ProductDTO.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Producto no encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @GetMapping("/{productCode}")
    public ResponseEntity<ProductDTO> getProductByCode(
            @Parameter(description = "Código del producto a buscar", required = true, example = "1001")
            @PathVariable Integer productCode) {
        ProductDTO response = productService.getProductByCode(productCode);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Actualizar producto",
            description = "Actualiza los datos de un producto existente. Solo se actualizan los campos enviados (no nulos)"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Producto actualizado exitosamente",
                    content = @Content(schema = @Schema(implementation = ProductDTO.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos de entrada inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Producto no encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @PutMapping("/{productCode}")
    public ResponseEntity<ProductDTO> updateProduct(
            @Parameter(description = "Código del producto a actualizar", required = true, example = "1001")
            @PathVariable Integer productCode,
            @Valid @RequestBody ProductUpdateDTO request) {
        ProductDTO response = productService.updateProduct(productCode, request);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Eliminar producto",
            description = "Elimina un producto del sistema (eliminación lógica - marca como inactivo)"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204",
                    description = "Producto eliminado exitosamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Producto no encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @DeleteMapping("/{productCode}")
    public ResponseEntity<Void> deleteProduct(
            @Parameter(description = "Código del producto a eliminar", required = true, example = "1001")
            @PathVariable Integer productCode) {
        productService.deleteProduct(productCode);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Listar todos los productos",
            description = "Obtiene una lista paginada de todos los productos del sistema"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de productos obtenida exitosamente",
                    content = @Content(schema = @Schema(implementation = Page.class))
            )
    })
    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
            @Parameter(description = "Número de página (inicia en 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Campo para ordenar", example = "productCode")
            @RequestParam(defaultValue = "productCode") String sortBy,
            @Parameter(description = "Dirección de ordenamiento (ASC o DESC)", example = "ASC")
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        Sort.Direction direction = sortDirection.equalsIgnoreCase("DESC")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<ProductDTO> response = productService.getAllProducts(pageable);
        return ResponseEntity.ok(response);
    }
}

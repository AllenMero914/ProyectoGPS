package com.binasystem.profact.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CompraRequestDTO {
    @NotNull
    private Long proveedorId;
    @NotEmpty @Valid
    private List<DetalleCompraDTO> detalles;

    @Data
    public static class DetalleCompraDTO {
        @NotNull private Long productoId;
        @Min(1) private int cantidad;
        @NotNull private BigDecimal precioUnitario;
    }
}

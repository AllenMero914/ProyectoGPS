package com.binasystem.profact.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VentaRequestDTO {
    @NotEmpty(message = "La venta debe tener al menos un producto")
    @Valid
    private List<DetalleVentaDTO> detalles;
}

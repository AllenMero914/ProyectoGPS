package com.binasystem.profact.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CompraResponseDTO {
    private Long id;
    private LocalDateTime fecha;
    private BigDecimal total;
    private String proveedorNombre;
}

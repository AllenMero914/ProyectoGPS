package com.binasystem.profact.service;

import com.binasystem.profact.dto.CompraRequestDTO;
import com.binasystem.profact.dto.CompraResponseDTO;
import com.binasystem.profact.entity.*;
import com.binasystem.profact.exception.RecursoNoEncontradoException;
import com.binasystem.profact.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompraService {

    private final CompraRepository compraRepository;
    private final ProductoRepository productoRepository;
    private final ProveedorRepository proveedorRepository;
    private final UsuarioRepository usuarioRepository;

    public CompraService(CompraRepository compraRepository,
                         ProductoRepository productoRepository,
                         ProveedorRepository proveedorRepository,
                         UsuarioRepository usuarioRepository) {
        this.compraRepository = compraRepository;
        this.productoRepository = productoRepository;
        this.proveedorRepository = proveedorRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<CompraResponseDTO> listar() {
        return compraRepository.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public CompraResponseDTO obtenerPorId(Long id) {
        return mapToDTO(compraRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Compra", id)));
    }

    @Transactional
    public CompraResponseDTO registrarCompra(CompraRequestDTO dto, Long usuarioId) {
        Proveedor proveedor = proveedorRepository.findById(dto.getProveedorId())
            .orElseThrow(() -> new RecursoNoEncontradoException("Proveedor", dto.getProveedorId()));
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario", usuarioId));

        Compra compra = new Compra();
        compra.setProveedor(proveedor);
        compra.setUsuario(usuario);

        BigDecimal total = BigDecimal.ZERO;
        List<DetalleCompra> detalles = new ArrayList<>();

        for (var item : dto.getDetalles()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto", item.getProductoId()));

            // CA-006.2: Aumentar stock al comprar
            producto.setStock(producto.getStock() + item.getCantidad());
            productoRepository.save(producto);

            BigDecimal subtotal = item.getPrecioUnitario()
                .multiply(BigDecimal.valueOf(item.getCantidad()));
            total = total.add(subtotal);

            DetalleCompra detalle = new DetalleCompra();
            detalle.setCompra(compra);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(item.getPrecioUnitario());
            detalle.setSubtotal(subtotal);
            detalles.add(detalle);
        }

        compra.setTotal(total);
        compra.setDetalles(detalles);

        return mapToDTO(compraRepository.save(compra));
    }

    private CompraResponseDTO mapToDTO(Compra c) {
        String prov = c.getProveedor() != null ? c.getProveedor().getNombre() : "N/A";
        return new CompraResponseDTO(c.getId(), c.getFecha(), c.getTotal(), prov);
    }
}

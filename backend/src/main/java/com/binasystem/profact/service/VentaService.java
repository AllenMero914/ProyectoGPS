package com.binasystem.profact.service;

import com.binasystem.profact.dto.DetalleVentaDTO;
import com.binasystem.profact.dto.VentaRequestDTO;
import com.binasystem.profact.dto.VentaResponseDTO;
import com.binasystem.profact.entity.*;
import com.binasystem.profact.exception.RecursoNoEncontradoException;
import com.binasystem.profact.exception.StockInsuficienteException;
import com.binasystem.profact.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;

    public VentaService(VentaRepository ventaRepository,
                        ProductoRepository productoRepository,
                        UsuarioRepository usuarioRepository,
                        ClienteRepository clienteRepository) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
    }

    public List<VentaResponseDTO> listar() {
        return ventaRepository.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public VentaResponseDTO obtenerPorId(Long id) {
        return mapToDTO(ventaRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Venta", id)));
    }

    // CA-005.5: @Transactional garantiza atomicidad (RNF-006)
    @Transactional
    public VentaResponseDTO registrarVenta(VentaRequestDTO dto, Long usuarioId) {
        Usuario vendedor = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario", usuarioId));

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
            .orElseThrow(() -> new RecursoNoEncontradoException("Cliente", dto.getClienteId()));

        Venta venta = new Venta();
        venta.setUsuario(vendedor);
        venta.setCliente(cliente);

        BigDecimal total = BigDecimal.ZERO;
        List<DetalleVenta> detalles = new ArrayList<>();

        for (DetalleVentaDTO item : dto.getDetalles()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto", item.getProductoId()));

            // CA-005.2: Verificar stock suficiente
            if (producto.getStock() < item.getCantidad()) {
                throw new StockInsuficienteException(
                    producto.getNombre(), producto.getStock(), item.getCantidad()
                );
            }

            // CA-005.4: Reducir stock
            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepository.save(producto);

            BigDecimal subtotal = producto.getPrecio()
                .multiply(BigDecimal.valueOf(item.getCantidad()));
            total = total.add(subtotal);

            DetalleVenta detalle = new DetalleVenta();
            detalle.setVenta(venta);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setSubtotal(subtotal);
            detalles.add(detalle);
        }

        // CA-005.3: Total calculado automáticamente
        venta.setTotal(total);
        venta.setDetalles(detalles);

        return mapToDTO(ventaRepository.save(venta));
    }

    private VentaResponseDTO mapToDTO(Venta v) {
        List<VentaResponseDTO.DetalleVentaResponseDTO> detallesDtos = v.getDetalles().stream()
            .map(d -> new VentaResponseDTO.DetalleVentaResponseDTO(
                d.getProducto().getId(),
                d.getProducto().getNombre(),
                d.getCantidad(),
                d.getPrecioUnitario(),
                d.getSubtotal()
            )).collect(Collectors.toList());

        String vendedor = v.getUsuario() != null ? v.getUsuario().getNombre() : "N/A";
        
        Long clienteId = null;
        String clienteNombre = "N/A";
        String clienteIdentificacion = "N/A";
        
        if (v.getCliente() != null) {
            clienteId = v.getCliente().getId();
            clienteNombre = v.getCliente().getNombre();
            clienteIdentificacion = v.getCliente().getIdentificacion();
        }
        
        return new VentaResponseDTO(v.getId(), v.getFecha(), v.getTotal(), vendedor, clienteId, clienteNombre, clienteIdentificacion, detallesDtos);
    }
}

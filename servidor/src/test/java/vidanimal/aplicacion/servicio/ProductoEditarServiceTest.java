package vidanimal.aplicacion.servicio;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import vidanimal.aplicacion.output.ProductoRepositorioPort;
import vidanimal.dominio.modelo.CategoriaProducto;
import vidanimal.dominio.modelo.Producto;

@ExtendWith(MockitoExtension.class)
class ProductoEditarServiceTest {

    @Mock
    private ProductoRepositorioPort repo;

    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @Test
    void editarProducto_copia_los_nuevos_campos() {
        Producto existente = new Producto("Viejo", "desc", CategoriaProducto.ALIMENTACION, 5);
        when(repo.buscarPorId(1L)).thenReturn(Optional.of(existente));

        Producto datosNuevos = new Producto();
        datosNuevos.setNombre("Nuevo");
        datosNuevos.setDescripcion("nueva desc");
        datosNuevos.setCategoria(CategoriaProducto.MEDICAMENTO);
        datosNuevos.setStockTotal(10);
        datosNuevos.setParaPerro(true);
        datosNuevos.setParaGato(true);
        datosNuevos.setStockMinimo(3);
        datosNuevos.setFechaCaducidad(LocalDate.of(2027, 5, 1));
        datosNuevos.setReservadoCer(true);

        AlmacenService service = new AlmacenService(repo, null, null, null);
        service.editarProducto(1L, datosNuevos);

        ArgumentCaptor<Producto> captor = ArgumentCaptor.forClass(Producto.class);
        org.mockito.Mockito.verify(repo).guardar(captor.capture());
        Producto guardado = captor.getValue();

        assertThat(guardado.getNombre()).isEqualTo("Nuevo");
        assertThat(guardado.isParaPerro()).isTrue();
        assertThat(guardado.isParaGato()).isTrue();
        assertThat(guardado.getStockMinimo()).isEqualTo(3);
        assertThat(guardado.getFechaCaducidad()).isEqualTo(LocalDate.of(2027, 5, 1));
        assertThat(guardado.isReservadoCer()).isTrue();
    }

    @Test
    void producto_serializa_los_nuevos_campos_en_json() throws Exception {
        Producto p = new Producto("Test", "desc", CategoriaProducto.ALIMENTACION, 2);
        p.setParaPerro(true);
        p.setParaGato(false);
        p.setStockMinimo(4);
        p.setFechaCaducidad(LocalDate.of(2027, 5, 1));
        p.setReservadoCer(true);

        String json = mapper.writeValueAsString(p);

        assertThat(json).contains("\"paraPerro\":true");
        assertThat(json).contains("\"paraGato\":false");
        assertThat(json).contains("\"stockMinimo\":4");
        assertThat(json).contains("\"reservadoCer\":true");
        assertThat(json).contains("\"caducado\":false");
        assertThat(json).contains("2027-05-01");
    }

    @Test
    void producto_caducado_true_cuando_la_fecha_ya_paso() throws Exception {
        Producto p = new Producto("Test", "desc", CategoriaProducto.ALIMENTACION, 2);
        p.setFechaCaducidad(LocalDate.of(2020, 1, 1));

        String json = mapper.writeValueAsString(p);
        assertThat(json).contains("\"caducado\":true");
    }
}

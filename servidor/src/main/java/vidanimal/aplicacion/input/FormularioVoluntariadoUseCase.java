package vidanimal.aplicacion.input;

import java.util.List;
import java.util.Optional;

import vidanimal.dominio.modelo.FormularioVoluntariado;
import vidanimal.dominio.modelo.TipoColaboracion;

public interface FormularioVoluntariadoUseCase {

    List<FormularioVoluntariado> listar();

    Optional<FormularioVoluntariado> obtenerPorTipo(TipoColaboracion tipo);

    FormularioVoluntariado crear(String nombre, TipoColaboracion tipo, String preguntasJson);

    void eliminar(Long id);
}
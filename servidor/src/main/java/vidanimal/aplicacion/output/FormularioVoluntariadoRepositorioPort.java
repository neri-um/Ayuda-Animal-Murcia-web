package vidanimal.aplicacion.output;

import java.util.List;
import java.util.Optional;

import vidanimal.dominio.modelo.FormularioVoluntariado;
import vidanimal.dominio.modelo.TipoColaboracion;

public interface FormularioVoluntariadoRepositorioPort {

    List<FormularioVoluntariado> buscarTodos();

    Optional<FormularioVoluntariado> buscarPorTipo(TipoColaboracion tipo);

    FormularioVoluntariado guardar(FormularioVoluntariado formulario);

    void eliminar(Long id);

    boolean existePorId(Long id);
}
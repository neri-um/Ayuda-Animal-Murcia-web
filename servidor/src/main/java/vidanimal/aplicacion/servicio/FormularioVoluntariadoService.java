package vidanimal.aplicacion.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import vidanimal.aplicacion.input.FormularioVoluntariadoUseCase;
import vidanimal.aplicacion.output.FormularioVoluntariadoRepositorioPort;
import vidanimal.dominio.excepcion.RecursoNoEncontradoException;
import vidanimal.dominio.modelo.FormularioVoluntariado;
import vidanimal.dominio.modelo.TipoColaboracion;

@Service
public class FormularioVoluntariadoService implements FormularioVoluntariadoUseCase {

    private final FormularioVoluntariadoRepositorioPort repo;

    public FormularioVoluntariadoService(FormularioVoluntariadoRepositorioPort repo) {
        this.repo = repo;
    }

    @Override
    public List<FormularioVoluntariado> listar() {
        return repo.buscarTodos();
    }

    @Override
    public Optional<FormularioVoluntariado> obtenerPorTipo(TipoColaboracion tipo) {
        return repo.buscarPorTipo(tipo);
    }

    @Override
    public FormularioVoluntariado crear(String nombre, TipoColaboracion tipo, String preguntasJson) {
        if (tipo == null || tipo == TipoColaboracion.ACOGIDA) {
            throw new IllegalArgumentException("Tipo de formulario de voluntariado inválido.");
        }
        FormularioVoluntariado formulario = new FormularioVoluntariado();
        formulario.setNombre(nombre);
        formulario.setTipo(tipo);
        formulario.setPreguntas(preguntasJson);
        return repo.guardar(formulario);
    }

    @Override
    public void eliminar(Long id) {
        if (!repo.existePorId(id)) {
            throw new RecursoNoEncontradoException("Formulario de voluntariado no encontrado: " + id);
        }
        repo.eliminar(id);
    }
}
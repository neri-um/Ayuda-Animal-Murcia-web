package vidanimal.infraestructura.persistencia.adaptador;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import vidanimal.aplicacion.output.FormularioAdopcionRepositorioPort;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.FormularioAdopcion;
import vidanimal.dominio.excepcion.RecursoNoEncontradoException;
import vidanimal.infraestructura.persistencia.FormularioAdopcionRepositorio;

@Repository
public class FormularioAdopcionPersistenciaAdapter implements FormularioAdopcionRepositorioPort {

    private final FormularioAdopcionRepositorio repo;

    public FormularioAdopcionPersistenciaAdapter(FormularioAdopcionRepositorio repo) {
        this.repo = repo;
    }

    @Override
    public Optional<FormularioAdopcion> buscarPorEspecieYCachorro(Especie especie, Boolean cachorro) {
        return repo.findByEspecieAndCachorro(especie, cachorro);
    }

    @Override
    public Optional<FormularioAdopcion> buscarPorEspecieSinEdad(Especie especie) {
        return repo.findByEspecieAndCachorroIsNull(especie);
    }

    @Override
    public Optional<FormularioAdopcion> buscarGenerico() {
        return repo.findByEspecieIsNull();
    }

    @Override
    public List<FormularioAdopcion> buscarTodos() {
        return repo.findAll();
    }

    @Override
    public FormularioAdopcion guardar(FormularioAdopcion formulario) {
        return repo.save(formulario);
    }

    @Override
    public void eliminar(Long id) {
        if (!repo.existsById(id)) {
            throw new RecursoNoEncontradoException("Formulario con id " + id + " no encontrado");
        }
        repo.deleteById(id);
    }

    @Override
    public boolean existePorId(Long id) {
        return repo.existsById(id);
    }
}
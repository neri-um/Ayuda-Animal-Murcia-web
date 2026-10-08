package vidanimal.infraestructura.persistencia.adaptador;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import vidanimal.aplicacion.output.FormularioVoluntariadoRepositorioPort;
import vidanimal.dominio.modelo.FormularioVoluntariado;
import vidanimal.dominio.modelo.TipoColaboracion;
import vidanimal.infraestructura.persistencia.FormularioVoluntariadoRepositorio;

@Repository
public class FormularioVoluntariadoPersistenciaAdapter implements FormularioVoluntariadoRepositorioPort {

    private final FormularioVoluntariadoRepositorio repo;

    public FormularioVoluntariadoPersistenciaAdapter(FormularioVoluntariadoRepositorio repo) {
        this.repo = repo;
    }

    @Override
    public java.util.List<FormularioVoluntariado> buscarTodos() {
        return repo.findAll();
    }

    @Override
    public java.util.Optional<FormularioVoluntariado> buscarPorTipo(TipoColaboracion tipo) {
        return repo.findFirstByTipoOrderByIdDesc(tipo);
    }

    @Override
    public FormularioVoluntariado guardar(FormularioVoluntariado formulario) {
        return repo.save(formulario);
    }

    @Override
    public void eliminar(Long id) {
        repo.deleteById(id);
    }

    @Override
    public boolean existePorId(Long id) {
        return repo.existsById(id);
    }
}
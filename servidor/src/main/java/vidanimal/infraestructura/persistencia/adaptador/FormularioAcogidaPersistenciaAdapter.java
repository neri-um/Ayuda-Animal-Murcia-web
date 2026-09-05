package vidanimal.infraestructura.persistencia.adaptador;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import vidanimal.aplicacion.output.FormularioAcogidaRepositorioPort;
import vidanimal.dominio.modelo.FormularioAcogida;
import vidanimal.infraestructura.persistencia.FormularioAcogidaRepositorio;

@Repository
public class FormularioAcogidaPersistenciaAdapter implements FormularioAcogidaRepositorioPort {

	private final FormularioAcogidaRepositorio repo;

	public FormularioAcogidaPersistenciaAdapter(FormularioAcogidaRepositorio repo) {
		this.repo = repo;
	}

	@Override
	public Optional<FormularioAcogida> buscarGenerico() {
		return repo.findByEspecieIsNull();
	}

	@Override
	public List<FormularioAcogida> buscarTodos() {
		return repo.findAll();
	}

	@Override
	public FormularioAcogida guardar(FormularioAcogida formulario) {
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

package vidanimal.infraestructura.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vidanimal.aplicacion.input.AnimalesUseCase;
import vidanimal.infraestructura.rest.dto.AnimalPublicoDTO;

@RestController
@RequestMapping("/vidanimal/administracion")
public class AdministracionController {

	private final AnimalesUseCase animales;

	public AdministracionController(AnimalesUseCase animales) {
		this.animales = animales;
	}

	// Todos los animales, en cualquier estado (para el dashboard)
	@PreAuthorize("hasAnyAuthority('ADMIN', 'VOLUNTARIO', 'ENCARGADO')")
	@GetMapping("/animales")
	public ResponseEntity<List<AnimalPublicoDTO>> listarTodos() {
		return ResponseEntity.ok(animales.listar(null, null, null, null, null)
				.stream().map(AnimalPublicoDTO::fromDominio).toList());
	}
}

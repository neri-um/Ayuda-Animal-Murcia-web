package vidanimal.infraestructura.rest;

import java.util.List;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vidanimal.aplicacion.input.AnimalesUseCase;
import vidanimal.aplicacion.input.EntradaBlogUseCase;
import vidanimal.aplicacion.output.UsuarioRepositorioPort;
import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.EntradaBlog;
import vidanimal.infraestructura.rest.dto.EntradaBlogDTO;
import vidanimal.infraestructura.rest.dto.EntradaBlogEditarDTO;
import vidanimal.infraestructura.rest.dto.EntradaBlogNuevaDTO;

@RestController
@RequestMapping("/vidanimal/blog")
public class BlogController {

	private final EntradaBlogUseCase entradas;
	private final AnimalesUseCase animales;
	private final UsuarioRepositorioPort usuarioRepo;

	public BlogController(EntradaBlogUseCase entradas, AnimalesUseCase animales, UsuarioRepositorioPort usuarioRepo) {
		this.entradas = entradas;
		this.animales = animales;
		this.usuarioRepo = usuarioRepo;
	}

	@GetMapping
	public ResponseEntity<List<EntradaBlogDTO>> listarGenerales(@RequestParam(required = false) String etiqueta) {
		return ResponseEntity.ok(entradas.listarGenerales(etiqueta).stream()
				.map(EntradaBlogDTO::fromDominio).toList());
	}

	@GetMapping("/{id}")
	public ResponseEntity<EntradaBlogDTO> obtenerPorId(@PathVariable Long id) {
		return ResponseEntity.ok(EntradaBlogDTO.fromDominio(entradas.obtenerPorId(id)));
	}

	@PreAuthorize("hasAnyAuthority('ADMIN', 'VOLUNTARIO', 'ENCARGADO')")
	@PostMapping
	public ResponseEntity<EntradaBlogDTO> crear(@RequestBody EntradaBlogNuevaDTO dto, Authentication authentication) {
		EntradaBlog entrada = dto.toDominio();
		Animal animal = null;
		if (dto.getAnimalId() != null) {
			animal = animales.obtenerPorId(dto.getAnimalId());
		}
		comprobarPermisoBlog(authentication, animal);
		Long usuarioId = Long.parseLong((String) authentication.getPrincipal());
		usuarioRepo.buscarPorId(usuarioId).ifPresent(entrada::setAutor);
		return ResponseEntity.ok(EntradaBlogDTO.fromDominio(entradas.crear(entrada, animal)));
	}

	@PreAuthorize("hasAnyAuthority('ADMIN', 'VOLUNTARIO', 'ENCARGADO')")
	@PutMapping("/{id}")
	public ResponseEntity<EntradaBlogDTO> editar(@PathVariable Long id, @RequestBody EntradaBlogEditarDTO dto, Authentication authentication) {
		Animal animal = null;
		if (dto.getAnimalId() != null) {
			animal = animales.obtenerPorId(dto.getAnimalId());
		}
		comprobarPermisoBlog(authentication, entradas.obtenerPorId(id).getAnimal());
		return ResponseEntity.ok(EntradaBlogDTO.fromDominio(entradas.editar(id, dto.toDominio(), animal)));
	}

	@PreAuthorize("hasAnyAuthority('ADMIN', 'VOLUNTARIO', 'ENCARGADO')")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id, Authentication authentication) {
		comprobarPermisoBlog(authentication, entradas.obtenerPorId(id).getAnimal());
		entradas.eliminar(id);
		return ResponseEntity.noContent().build();
	}

	private void comprobarPermisoBlog(Authentication authentication, Animal animal){
		Long usuarioId = Long.parseLong((String) authentication.getPrincipal());
		boolean esAdmin = authentication.getAuthorities().stream()
			.anyMatch(a -> a.getAuthority().equals("ADMIN"));
		if(esAdmin)
			return;
		if (animal == null) {
			throw new AccessDeniedException("Solo la administradora puede gestionar el blog general");
		}
		boolean esResponsable = animal.getResponsable() !=null && usuarioId.equals(animal.getResponsable().getId());
		if (!esResponsable) {
			throw new AccessDeniedException("Solo el responsable del animal puede gestionar esta entrada");
		}
	}
}

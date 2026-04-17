package vidanimal.infraestructura.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vidanimal.aplicacion.input.AnimalesUseCase;
import vidanimal.aplicacion.output.UsuarioRepositorioPort;
import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.Estado;
import vidanimal.dominio.modelo.Sexo;
import vidanimal.dominio.modelo.Tamanyo;
import vidanimal.infraestructura.rest.dto.AnimalEditarDTO;
import vidanimal.infraestructura.rest.dto.AnimalNuevoDTO;
import vidanimal.infraestructura.rest.dto.AnimalPublicoDTO;
import vidanimal.infraestructura.rest.dto.CambioEstadoDTO;
import vidanimal.infraestructura.rest.dto.CitaNuevaDTO;
import vidanimal.infraestructura.rest.dto.CitaResponseDTO;
import vidanimal.infraestructura.rest.dto.DtoParsers;

@RestController
@RequestMapping("/vidanimal/animales")
public class AnimalController {

	private final AnimalesUseCase animales;
	private final UsuarioRepositorioPort usuarioRepo; 

	public AnimalController(AnimalesUseCase animales, UsuarioRepositorioPort usuarioRepo) {
	    this.animales = animales;
	    this.usuarioRepo = usuarioRepo;
	}

	@GetMapping
	public ResponseEntity<List<AnimalPublicoDTO>> listar(
	        @RequestParam(required = false) String especie,
	        @RequestParam(required = false) String nombre,
	        @RequestParam(required = false) String tamanyo,
	        @RequestParam(required = false) String sexo) {

	    return ResponseEntity.ok(
	        animales.listar(
	                DtoParsers.parseEnum(Especie.class, especie, "especie"),
	                Estado.EN_ADOPCION,
	                nombre,
	                DtoParsers.parseEnum(Tamanyo.class, tamanyo, "tamanyo"),
	                DtoParsers.parseEnum(Sexo.class, sexo, "sexo")
	        ).stream()
	         .map(AnimalPublicoDTO::fromDominio)
	         .toList()
	    );
	}

	@GetMapping("/{id}")
	public ResponseEntity<AnimalPublicoDTO> obtener(@PathVariable Long id) {
	    Animal animal = animales.obtenerPorId(id);
	    if (animal.getEstado() != Estado.EN_ADOPCION) {
	        return ResponseEntity.notFound().build();
	    }
	    return ResponseEntity.ok(AnimalPublicoDTO.fromDominio(animal));
	}

	@PreAuthorize("hasAnyAuthority('ADMIN', 'VOLUNTARIO','ENCARGADO')")
	@PostMapping
	public ResponseEntity<Animal> crear(
	        @RequestBody AnimalNuevoDTO dto,
	        org.springframework.security.core.Authentication authentication) {

	    Animal animal = dto.toDominio();

	    // El principal es el email (claims.getSubject() del JWT)
	    String email = (String) authentication.getPrincipal();
	    usuarioRepo.buscarPorEmail(email).ifPresent(animal::setResponsable);

	    return ResponseEntity.ok(animales.crear(animal));
	}

	@PreAuthorize("hasAnyAuthority('ADMIN', 'VOLUNTARIO','ENCARGADO')")
	@PutMapping("/{id}")
	public ResponseEntity<Animal> editar(@PathVariable Long id, @RequestBody AnimalEditarDTO dto) {
		return ResponseEntity.ok(animales.editar(id, dto.toDominio()));
	}

	@PreAuthorize("hasAnyAuthority('ADMIN', 'VOLUNTARIO','ENCARGADO')")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
		animales.eliminar(id);
		return ResponseEntity.noContent().build();
	}

	@PreAuthorize("hasAnyAuthority('ADMIN', 'VOLUNTARIO','ENCARGADO')")
	@PatchMapping("/{id}/estado")
	public ResponseEntity<Animal> cambiarEstado(@PathVariable Long id, @RequestBody CambioEstadoDTO dto) {
		return ResponseEntity.ok(animales.cambiarEstado(id, dto.getEstado()));
	}

	// CU-11
	@PreAuthorize("hasAnyAuthority('ADMIN', 'VOLUNTARIO','ENCARGADO')")
	@PostMapping("/{id}/citas")
	public ResponseEntity<CitaResponseDTO> agregarCita(@PathVariable Long id, @RequestBody CitaNuevaDTO dto) {
		return ResponseEntity.ok(CitaResponseDTO.from(animales.agregarCita(id, dto.toDominio())));
	}

	// CU-12
	@PreAuthorize("hasAnyAuthority('ADMIN', 'VOLUNTARIO','ENCARGADO')")
	@GetMapping("/{id}/citas")
	public ResponseEntity<List<CitaResponseDTO>> listarCitas(@PathVariable Long id) {
		return ResponseEntity.ok(
			animales.listarCitas(id).stream().map(CitaResponseDTO::from).toList()
		);
	}

	// CU-13
	@PreAuthorize("hasAnyAuthority('ADMIN', 'VOLUNTARIO','ENCARGADO')")
	@PatchMapping("/{id}/citas/{citaId}/completar")
	public ResponseEntity<CitaResponseDTO> completarCita(@PathVariable Long id, @PathVariable Long citaId) {
		return ResponseEntity.ok(CitaResponseDTO.from(animales.completarCita(id, citaId)));
	}
}

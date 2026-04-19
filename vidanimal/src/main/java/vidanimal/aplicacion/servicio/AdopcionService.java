package vidanimal.aplicacion.servicio;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.EstadoSolicitudAdopcion;
import vidanimal.dominio.modelo.FormularioAdopcion;
import vidanimal.dominio.modelo.SolicitudAdopcion;
import vidanimal.infraestructura.persistencia.AnimalRepositorio;
import vidanimal.infraestructura.persistencia.FormularioAdopcionRepositorio;
import vidanimal.infraestructura.persistencia.SolicitudAdopcionRepositorio;
import vidanimal.infraestructura.rest.dto.FormularioAdopcionDTO;
import vidanimal.infraestructura.rest.dto.SolicitudAdopcionDTO;
import vidanimal.infraestructura.rest.dto.SolicitudAdopcionRespuestaDTO;

@Service
public class AdopcionService {

    private final FormularioAdopcionRepositorio formularioRepo;
    private final SolicitudAdopcionRepositorio solicitudRepo;
    private final AnimalRepositorio animalRepo;
    private final ObjectMapper objectMapper;

    public AdopcionService(FormularioAdopcionRepositorio formularioRepo,
                           SolicitudAdopcionRepositorio solicitudRepo,
                           AnimalRepositorio animalRepo,
                           ObjectMapper objectMapper) {
        this.formularioRepo = formularioRepo;
        this.solicitudRepo = solicitudRepo;
        this.animalRepo = animalRepo;
        this.objectMapper = objectMapper;
    }

    public FormularioAdopcionDTO getFormularioPorAnimal(Long animalId) {
        Animal animal = animalRepo.findById(animalId)
            .orElseThrow(() -> new RuntimeException("Animal no encontrado"));

        Especie especie = animal.getEspecie();
        boolean esCria = animal.getFechaNacimiento() != null &&
            ChronoUnit.MONTHS.between(animal.getFechaNacimiento(), LocalDate.now()) < 12;

        FormularioAdopcion form = formularioRepo.findByEspecieAndCachorro(especie, esCria)
            .or(() -> formularioRepo.findByEspecieAndCachorroIsNull(especie))
            .or(() -> formularioRepo.findByEspecieIsNull())
            .orElseThrow(() -> new RuntimeException("No hay formulario configurado"));

        return toFormularioDTO(form);
    }

    public SolicitudAdopcionRespuestaDTO crearSolicitud(SolicitudAdopcionDTO dto) {
        Animal animal = animalRepo.findById(dto.getAnimalId())
            .orElseThrow(() -> new RuntimeException("Animal no encontrado"));

        SolicitudAdopcion s = new SolicitudAdopcion();
        s.setAnimal(animal);
        s.setNombreAdoptante(dto.getNombreAdoptante());
        s.setEmail(dto.getEmail());
        s.setTelefono(dto.getTelefono());
        s.setDni(dto.getDni());
        s.setFechaSolicitud(LocalDate.now());
        s.setEstado(EstadoSolicitudAdopcion.PENDIENTE);
        try {
            s.setRespuestas(objectMapper.writeValueAsString(dto.getRespuestas()));
        } catch (JsonProcessingException e) {
            s.setRespuestas("{}");
        }
        return toResponseDTO(solicitudRepo.save(s));
    }

    public List<SolicitudAdopcionRespuestaDTO> listarSolicitudes() {
        return solicitudRepo.findAllByOrderByFechaSolicitudDesc()
            .stream().map(this::toResponseDTO).toList();
    }

    public SolicitudAdopcionRespuestaDTO cambiarEstado(Long id, EstadoSolicitudAdopcion nuevoEstado) {
        SolicitudAdopcion s = solicitudRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        s.setEstado(nuevoEstado);
        return toResponseDTO(solicitudRepo.save(s));
    }


    private FormularioAdopcionDTO toFormularioDTO(FormularioAdopcion f) {
        FormularioAdopcionDTO dto = new FormularioAdopcionDTO();
        dto.setId(f.getId());
        dto.setNombre(f.getNombre());
        dto.setEspecie(f.getEspecie() != null ? f.getEspecie().name() : null);
        try {
            dto.setPreguntas(objectMapper.readValue(f.getPreguntas(), Object.class));
        } catch (Exception e) {
            dto.setPreguntas(List.of());
        }
        return dto;
    }

    @SuppressWarnings("unchecked")
    private SolicitudAdopcionRespuestaDTO toResponseDTO(SolicitudAdopcion s) {
        SolicitudAdopcionRespuestaDTO dto = new SolicitudAdopcionRespuestaDTO();
        dto.setId(s.getId());
        dto.setAnimalId(s.getAnimalId());
        if (s.getAnimal() != null) {
            dto.setAnimalNombre(s.getAnimal().getNombre());
        }
        dto.setNombreAdoptante(s.getNombreAdoptante());
        dto.setEmail(s.getEmail());
        dto.setTelefono(s.getTelefono());
        dto.setDni(s.getDni());
        dto.setFechaSolicitud(s.getFechaSolicitud());
        dto.setEstado(s.getEstado());
        try {
            dto.setRespuestas(objectMapper.readValue(s.getRespuestas(), Map.class));
        } catch (Exception e) {
            dto.setRespuestas(Map.of());
        }
        return dto;
    }
}

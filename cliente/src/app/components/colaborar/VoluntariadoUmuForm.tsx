import VoluntariadoForm from './VoluntariadoForm';
import CrauNota from './CrauInfo';

export default function VoluntariadoUmuForm() {
  return (
    <VoluntariadoForm
      tipo="VOLUNTARIADO_UMU"
      esUmu
      titulo="Solicitud de voluntariado para estudiantes de la UMU"
      descripcion="Completa este cuestionario si eres estudiante de la UMU y quieres conseguir CRAU colaborando con la protectora."
      nota={<CrauNota />}
    />
  );
}
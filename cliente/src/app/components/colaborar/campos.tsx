import { useState } from 'react';

export const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none transition-colors";
const labelCls = "block text-sm mb-1.5";

function Etiqueta({ label, required }: { label: string; required?: boolean }) {
  return (
    <span className={labelCls} style={{ color: '#2e2e2e', fontWeight: 600 }}>
      {label} {required && <span style={{ color: '#b91c1c' }}>*</span>}
    </span>
  );
}

export function CampoTexto({
  label,
  required,
  placeholder,
  value,
  onChange,
  multiline,
  type = 'text',
  className = '',
}: {
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Etiqueta label={label} required={required} />
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputCls}
          style={{ resize: 'vertical' }}
        />
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputCls}
        />
      )}
    </div>
  );
}

const separador = '; ';
const esOtro = (s: string) => s.startsWith('Otro');

function itemsDe(value: string): string[] {
  return value ? value.split(separador).filter(Boolean) : [];
}

/**
 * Pregunta con opciones (radio o checkboxes) y opción "Otro:" opcional.
 * El valor combinado es una cadena; "Otro: texto" si se rellena el campo libre.
 */
export function PreguntaOpciones({
  label,
  required,
  opciones,
  conOtro,
  multiple,
  value,
  onChange,
  className = '',
}: {
  label: string;
  required?: boolean;
  opciones: string[];
  conOtro?: boolean;
  multiple?: boolean;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const items = itemsDe(value);
  const [otroTextoLocal, setOtroTextoLocal] = useState('');
  const otroTexto = items.filter(esOtro)[0]?.replace(/^Otro:?\s*/, '') ?? otroTextoLocal;
  const otroSeleccionado = items.some(esOtro);

  const setOtro = (texto: string) => {
    const resto = items.filter(i => !esOtro(i));
    onChange([...resto, texto.trim() ? `Otro: ${texto.trim()}` : 'Otro'].join(separador));
  };

  const toggle = (opcion: string) => {
    if (esOtro(opcion)) {
      if (otroSeleccionado) {
        onChange(items.filter(i => !esOtro(i)).join(separador));
      } else {
        onChange([...items, 'Otro'].join(separador));
      }
      return;
    }
    if (multiple) {
      onChange(
        items.includes(opcion)
          ? items.filter(i => i !== opcion).join(separador)
          : [...items, opcion].join(separador),
      );
    } else {
      onChange(opcion);
    }
  };

  const marcado = (opcion: string) => (esOtro(opcion) ? otroSeleccionado : items.includes(opcion));

  const opcionesReales = conOtro ? [...opciones, 'Otro'] : opciones;

  return (
    <div className={className}>
      <Etiqueta label={label} required={required} />
      <div className="flex flex-col gap-2">
        {opcionesReales.map(op => (
          <label key={op} className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: '#2e2e2e' }}>
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={label}
              required={!multiple && required}
              checked={marcado(op)}
              onChange={() => toggle(op)}
              className="w-4 h-4 mt-0.5"
            />
            <span className="leading-snug">{op}</span>
          </label>
        ))}
        {otroSeleccionado && (
          <input
            type="text"
            placeholder="Especifica..."
            value={otroTexto}
            onChange={e => setOtro(e.target.value)}
            className={inputCls}
          />
        )}
      </div>
    </div>
  );
}

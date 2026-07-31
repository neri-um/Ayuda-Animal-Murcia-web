// cliente/src/app/pages/PoliticaPrivacidad.tsx
// Política de Privacidad conforme al RGPD (UE) 2016/679 y LOPDGDD (LO 3/2018)

export default function PoliticaPrivacidad() {
  return (
    <div style={{ backgroundColor: '#f7f7f7' }} className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Cabecera */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: '#727272' }}>
            Información legal
          </p>
          <h1 className="text-3xl font-black mb-2" style={{ color: '#2e2e2e' }}>
            Política de Privacidad
          </h1>
          <p className="text-sm" style={{ color: '#727272' }}>
            Última actualización: julio de 2026
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: '#727272' }}>

          {/* 1 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              1. Responsable del tratamiento
            </h2>
            <div className="rounded-xl border p-4 space-y-1" style={{ backgroundColor: '#ffffff', borderColor: '#d9d9d9' }}>
              <p><strong style={{ color: '#2e2e2e' }}>Identidad:</strong> Ayuda Animal Murcia</p>
              <p><strong style={{ color: '#2e2e2e' }}>CIF:</strong> G-XXXXXXXX</p>
              <p><strong style={{ color: '#2e2e2e' }}>Domicilio:</strong> Murcia, Región de Murcia, España</p>
              <p><strong style={{ color: '#2e2e2e' }}>Correo de contacto (privacidad):</strong> ayudaanimalm@gmail.com</p>
            </div>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              2. Finalidades del tratamiento y base jurídica
            </h2>
            <p className="mb-4">Tratamos tus datos personales para las siguientes finalidades:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr style={{ backgroundColor: '#2e2e2e', color: '#f7e3b0' }}>
                    <th className="text-left p-3 font-semibold">Finalidad</th>
                    <th className="text-left p-3 font-semibold">Base jurídica (art. 6 RGPD)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Gestión de solicitudes de adopción', 'Ejecución de un contrato / medidas precontractuales (art. 6.1.b)'],
                    ['Tramitación del formulario de contacto', 'Interés legítimo de la asociación (art. 6.1.f)'],
                    ['Envío de comunicaciones informativas (newsletter)', 'Consentimiento del interesado (art. 6.1.a)'],
                    ['Gestión de voluntariado y colaboradores', 'Ejecución de relación contractual o estatutaria (art. 6.1.b)'],
                    ['Gestión de donaciones', 'Obligación legal y relación contractual (art. 6.1.b y 6.1.c)'],
                    ['Registro de usuarios en la plataforma web', 'Ejecución del contrato de usuario (art. 6.1.b)'],
                  ].map(([fin, base], i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f7f7f7', borderBottom: '1px solid #d9d9d9' }}>
                      <td className="p-3">{fin}</td>
                      <td className="p-3">{base}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              3. Categorías de datos tratados
            </h2>
            <ul className="space-y-1 list-disc list-inside">
              <li>Datos identificativos: nombre, apellidos, DNI/NIE (solo en adopciones).</li>
              <li>Datos de contacto: dirección postal, correo electrónico, teléfono.</li>
              <li>Datos económicos: cuenta bancaria o tarjeta (solo en donaciones, gestionados por pasarela de pago segura).</li>
              <li>Datos de navegación: dirección IP, cookies técnicas y analíticas (ver Política de Cookies).</li>
              <li>Información sobre el entorno doméstico (solo en solicitudes de adopción: vivienda, convivientes, animales actuales).</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              4. Plazo de conservación
            </h2>
            <p>
              Los datos se conservarán durante el tiempo estrictamente necesario para la finalidad
              para la que fueron recabados y, en todo caso, durante los plazos exigidos por la
              normativa legal aplicable:
            </p>
            <ul className="mt-3 space-y-1 list-disc list-inside">
              <li>Solicitudes de adopción: 5 años desde la resolución del expediente.</li>
              <li>Donaciones: 6 años por obligaciones fiscales (Ley General Tributaria).</li>
              <li>Comunicaciones comerciales: hasta la retirada del consentimiento.</li>
              <li>Formulario de contacto: 1 año desde la última comunicación.</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              5. Destinatarios y transferencias internacionales
            </h2>
            <p>
              No cedemos tus datos a terceros salvo obligación legal o cuando sea necesario para
              la prestación del servicio solicitado (por ejemplo, entidades veterinarias colaboradoras
              en el marco de un proceso de adopción).
            </p>
            <p className="mt-3">
              Algunos proveedores de servicios tecnológicos (alojamiento web, analítica) pueden
              estar ubicados fuera del Espacio Económico Europeo. En tales casos, nos aseguramos
              de que existan garantías adecuadas conforme al art. 46 RGPD (cláusulas contractuales
              tipo aprobadas por la Comisión Europea).
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              6. Derechos de los interesados
            </h2>
            <p>
              Conforme al RGPD y la LOPDGDD (LO 3/2018), puedes ejercer los siguientes derechos
              dirigiendo una comunicación escrita a <strong style={{ color: '#2e2e2e' }}>ayudaanimalm@gmail.com</strong>,
              adjuntando copia de tu DNI u otro documento identificativo:
            </p>
            <ul className="mt-3 space-y-1 list-disc list-inside">
              <li><strong style={{ color: '#2e2e2e' }}>Acceso:</strong> conocer qué datos personales tratamos sobre ti.</li>
              <li><strong style={{ color: '#2e2e2e' }}>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong style={{ color: '#2e2e2e' }}>Supresión («derecho al olvido»):</strong> solicitar la eliminación de tus datos.</li>
              <li><strong style={{ color: '#2e2e2e' }}>Oposición:</strong> oponerte al tratamiento basado en interés legítimo.</li>
              <li><strong style={{ color: '#2e2e2e' }}>Limitación:</strong> solicitar la restricción del tratamiento en ciertos supuestos.</li>
              <li><strong style={{ color: '#2e2e2e' }}>Portabilidad:</strong> recibir tus datos en formato estructurado y legible por máquina.</li>
              <li><strong style={{ color: '#2e2e2e' }}>Retirada del consentimiento:</strong> en cualquier momento, sin efecto retroactivo.</li>
            </ul>
            <p className="mt-3">
              Tienes derecho a presentar una reclamación ante la{' '}
              <strong style={{ color: '#2e2e2e' }}>Agencia Española de Protección de Datos (AEPD)</strong>{' '}
              — <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" style={{ color: '#2e2e2e', textDecoration: 'underline' }}>www.aepd.es</a> —
              si consideras que el tratamiento no es conforme a la normativa.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              7. Seguridad de los datos
            </h2>
            <p>
              Ayuda Animal Murcia aplica medidas técnicas y organizativas apropiadas para garantizar
              un nivel de seguridad adecuado al riesgo, conforme al art. 32 RGPD: cifrado de
              comunicaciones (HTTPS/TLS), control de acceso basado en roles, copias de seguridad
              periódicas y formación del equipo en materia de protección de datos.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              8. Delegado de Protección de Datos (DPD)
            </h2>
            <p>
              Dada la naturaleza y volumen de tratamientos, actualmente no es obligatorio designar
              un DPD conforme al art. 37 RGPD. No obstante, cualquier consulta en materia de
              privacidad puede dirigirse a{' '}
              <strong style={{ color: '#2e2e2e' }}>ayudaanimalm@gmail.com</strong>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

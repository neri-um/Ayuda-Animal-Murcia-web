// cliente/src/app/pages/AvisoLegal.tsx
// Aviso Legal conforme al art. 10 LSSI-CE (Ley 34/2002)

export default function AvisoLegal() {
  return (
    <div style={{ backgroundColor: '#f7f7f7' }} className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Cabecera */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: '#727272' }}>
            Información legal
          </p>
          <h1 className="text-3xl font-black mb-2" style={{ color: '#2e2e2e' }}>
            Aviso Legal
          </h1>
          <p className="text-sm" style={{ color: '#727272' }}>
            Última actualización: julio de 2026
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: '#727272' }}>

          {/* 1 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              1. Datos identificativos del titular
            </h2>
            <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se informa de los siguientes datos identificativos del responsable de este sitio web:</p>
            <div className="mt-4 rounded-xl border p-4 space-y-1" style={{ backgroundColor: '#ffffff', borderColor: '#d9d9d9' }}>
              <p><strong style={{ color: '#2e2e2e' }}>Denominación social:</strong> Ayuda Animal Murcia</p>
              <p><strong style={{ color: '#2e2e2e' }}>Naturaleza jurídica:</strong> Asociación sin ánimo de lucro</p>
              <p><strong style={{ color: '#2e2e2e' }}>CIF:</strong> G-30148472</p>
              <p><strong style={{ color: '#2e2e2e' }}>Domicilio social:</strong> Murcia, Región de Murcia, España</p>
              <p><strong style={{ color: '#2e2e2e' }}>Correo electrónico:</strong> ayudaanimalm@gmail.com</p>
              <p><strong style={{ color: '#2e2e2e' }}>Sitio web:</strong> https://ayuda-animal-murcia-web.vercel.app</p>
              <p><strong style={{ color: '#2e2e2e' }}>Inscripción:</strong> Registro de Asociaciones de la Región de Murcia</p>
            </div>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              2. Objeto y ámbito de aplicación
            </h2>
            <p>
              El presente Aviso Legal regula el acceso y uso del sitio web titularidad de Ayuda Animal Murcia,
              cuya finalidad es informar sobre la actividad de la asociación, facilitar los procesos de adopción
              responsable de animales, apadrinamiento y colaboración, así como recabar fondos solidarios para
              el sostenimiento de sus actividades.
            </p>
            <p className="mt-3">
              El acceso al sitio web implica la aceptación plena y sin reservas del presente Aviso Legal.
              La asociación se reserva el derecho a modificar en cualquier momento estos términos, siendo
              responsabilidad del usuario revisarlos periódicamente.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              3. Propiedad intelectual e industrial
            </h2>
            <p>
              Todos los contenidos del sitio web —textos, fotografías, imágenes, logotipos, gráficos,
              diseño y código fuente— son propiedad de Ayuda Animal Murcia o de sus colaboradores y
              están protegidos por la legislación española e internacional sobre propiedad intelectual
              e industrial.
            </p>
            <p className="mt-3">
              Queda expresamente prohibida la reproducción, distribución, comunicación pública o
              transformación de cualquier elemento del sitio sin autorización previa y por escrito de
              la asociación, salvo las excepciones previstas por la legislación vigente.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              4. Condiciones de uso
            </h2>
            <p>El usuario se compromete a hacer un uso lícito del sitio web, absteniéndose de:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside">
              <li>Introducir o difundir contenidos ilícitos, racistas, xenófobos, pornográficos o difamatorios.</li>
              <li>Realizar acciones que puedan dañar, inutilizar o deteriorar el sitio o sus servicios.</li>
              <li>Intentar acceder a áreas restringidas sin la debida autorización.</li>
              <li>Reproducir o copiar contenidos con fines comerciales sin permiso expreso.</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              5. Limitación de responsabilidad
            </h2>
            <p>
              Ayuda Animal Murcia no se responsabiliza de los daños o perjuicios derivados del uso del
              sitio web, de la imposibilidad de acceso, de fallos técnicos o de la presencia de virus
              informáticos. Del mismo modo, no garantiza la inexistencia de errores en los contenidos,
              ni que estos estén permanentemente actualizados.
            </p>
            <p className="mt-3">
              Los enlaces a sitios de terceros se facilitan únicamente como referencia informativa.
              La asociación no controla ni es responsable de los contenidos de dichos sitios externos.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              6. Legislación aplicable y jurisdicción
            </h2>
            <p>
              El presente Aviso Legal se rige por la legislación española. Para la resolución de
              cualquier controversia, las partes se someten a los Juzgados y Tribunales de Murcia,
              con renuncia expresa a cualquier otro fuero que pudiera corresponderles, salvo que la
              normativa aplicable disponga otra cosa.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

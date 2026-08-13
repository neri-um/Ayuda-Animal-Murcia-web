# Ayuda Animal Murcia - Web

### La web de la asociación, construida sobre la plataforma **Vidanimal**

[![React](https://img.shields.io/badge/React%2018-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%204-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java%2017-E00708?style=flat&logo=java&logoColor=white)](https://www.java.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render&logoColor=white)](https://render.com)

---

> **Ayuda Animal Murcia** es una asociación sin ánimo de lucro de la Región de Murcia
> dedicada al rescate, cuidado y adopción responsable de animales abandonados.
>
> Este repositorio contiene **todo el código de su web oficial**, desplegada en
> producción, y es el **mejor ejemplo aplicado** de la plataforma **Vidanimal**:
> mi herramienta creada para digitalizar protectoras y asociaciones.
>
> 🌐 **Web en producción:** https://www.ayudaanimalmurcia.org

---

## 📁 Estructura del repositorio

```
Ayuda-Animal-Murcia-web-main/
├── cliente/          # Frontend: React 18 + TypeScript + Vite (SPA)
├── servidor/         # Backend: Java 17 + Spring Boot 3 (API REST hexagonal)
├── docker-compose.yml
└── README.md
```

| Carpeta | Stack | Despliegue |
|---|---|---|
| `cliente/` | React 18 · TypeScript · Vite 6 · Tailwind 4 · React Router 7 | Vercel / Nginx (Docker) |
| `servidor/` | Java 17 · Spring Boot 3.2 · Spring Security · JPA/Hibernate | Render |

---

## Qué incluye

### 🌍 Zona pública (para adoptantes y colaboradores)

- **Portada** con la imagen de la asociación, el **animal del mes**, los últimos
  animales en adopción y las últimas novedades.
- **Catálogo de adopción** con **filtros por especie, tamaño y sexo** y búsqueda
  por nombre.
- **Ficha de cada animal**: fotos, historia, características, compatibilidad y
  estado sanitario.
- **Formulario de adopción dinámico**: un cuestionario diseñado desde el panel,
  adaptado por especie (gato, perro, cachorros…).
- **Apadrina**, **colabora** (voluntariado, acogida y programa universitario UMU),
  **dona** y **contacto** por WhatsApp o email.
- **Blog** con entradas de la asociación y de cada animal.
- **Páginas legales**: aviso legal, política de privacidad y cookies.

### 🔐 Panel interno (para el equipo de la protectora)

- **Panel de control** con métricas: animales en adopción, formularios pendientes,
  solicitudes de almacén y **avisos de stock bajo**.
- **Gestión de animales**: altas, fotos, estados, responsable asignado y selección
  del **animal del mes**.
- **Citas veterinarias** con **protocolo automático según especie y edad**
  (perro cachorro/adulto, gato) y checklist de vacunas/tratamientos.
- **Solicitudes de adopción**: revisar respuestas, **aceptar/rechazar** y
  **reubicar** en otro animal. Con **notificación por email** automática.
- **Almacén interno**: productos, categorías, stock, solicitudes de material de los
  voluntarios y flujo de **devoluciones**.
- **Gestión de usuarios** con roles (**VOLUNTARIO · ENCARGADO · ADMIN**).
- **Diseño de formularios de adopción** personalizados por especie.
- **Gestión del blog** completa.

---

## Stack tecnológico

**Frontend** | **Backend** | **Despliegue**
--- | --- | ---
React 18 + TypeScript | Java 17 + Spring Boot | Vercel (frontend)
Vite 6 + Tailwind CSS 4 | Spring Security (JWT + BCrypt) | Render (backend)
React Router 7 + lucide-react | JPA/Hibernate + arquitectura hexagonal | PostgreSQL 16 (Neon)
JSON-LD + sitemap + meta tags (SEO) | Resend API (emails) | Docker Compose (opcional)
ImgBB (subida de fotos) | Migraciones de esquema idempotentes | Nginx

---

## Puesta en marcha

### Con Docker

```bash
cp .env.example .env
docker compose up --build
```

- 🌐 Web: http://localhost
- 🔌 API: http://localhost:8080/vidanimal

### Desarrollo local

**Backend** (Java 17):

```bash
cd servidor
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/vidanimal
export SPRING_DATASOURCE_USERNAME=vidanimal
export SPRING_DATASOURCE_PASSWORD=vidanimal
export JWT_SECRET=clave_de_desarrollo
./mvnw spring-boot:run
```

**Frontend** (Node 18+):

```bash
cd cliente
npm install
export VITE_API_URL=http://localhost:8080/vidanimal
npm run dev
```

---

# Backend (`servidor/`)

API REST construida con **Java 17 + Spring Boot 3.2** y una arquitectura
**hexagonal** (puertos y adaptadores). Expone la API bajo el prefijo `/vidanimal`.

## Arquitectura hexagonal

La lógica de negocio es **independiente** de Spring, HTTP y la base de datos:

```
aplicacion/          ← casos de uso (servicios) y puertos
 ├── input/          ← interfaces de caso de uso (qué puede hacer el sistema)
 ├── output/         ← puertos de salida (qué necesita el sistema de fuera)
 └── servicio/       ← implementaciones de los casos de uso

dominio/             ← entidades, enums, factory y excepciones (sin dependencias)
 ├── factory/        ← AnimalFactory (crea animales con protocolo veterinario)
 ├── modelo/         ← Animal, Usuario, Producto, Solicitud*, CitaVeterinaria...
 ├── protocolo/      ← ProtocoloGato, ProtocoloPerroCachorro, ProtocoloPerroAdulto
 └── excepcion/      ← RecursoNoEncontradoException

infraestructura/     ← adaptadores: HTTP, seguridad, persistencia, configuración
 ├── rest/           ← controladores REST + DTOs (rest/dto)
 ├── seguridad/      ← SecurityConfig, JWT (JwtUtil, JwtTokenFilter)
 ├── persistencia/   ← repositorios Spring Data JPA + adaptadores
 └── config/         ← GlobalExceptionHandler, AsyncConfig, MigracionesEsquema
```

Flujo de una petición:

```
Controller → UseCase (input) → Service → Port (output) → PersistenciaAdapter → JPA Repository → PostgreSQL
```

## Mapa de la API

Todos los endpoints cuelgan de `/vidanimal`. Los permisos se definen en
`SecurityConfig` (reglas URL) y con `@PreAuthorize` en los controladores.

### Auth y usuarios

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/auth/login` | Login → devuelve `{ token, usuario }` (JWT, 1 h) | público |
| POST | `/auth/logout` | Logout (no-op: JWT es stateless) | autenticado |
| GET | `/usuarios` | Lista usuarios (filtro por `rol` y `nombre`) | autenticado |
| GET | `/usuarios/{id}` | Detalle de usuario | autenticado |
| GET | `/usuarios/{id}/animales` | Animales de los que es responsable | dueño / ENCARGADO / ADMIN |
| POST | `/usuarios` | Crear usuario (BCrypt) | autenticado |
| PUT | `/usuarios/{id}` | Editar usuario | autenticado |
| PATCH | `/usuarios/{id}/activo` | Activar/desactivar | autenticado |
| DELETE | `/usuarios/{id}` | Eliminar usuario | autenticado |

### Animales

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/animales` | Lista en adopción (filtros `especie`, `nombre`, `tamanyo`, `sexo`) | público |
| GET | `/animales/{id}` | Ficha del animal (solo si está `EN_ADOPCION`) | público |
| GET | `/animales/{id}/blog` | Entradas de blog del animal | público |
| POST | `/animales` | Crear animal (responsable = usuario autenticado) | VOLUNTARIO+ |
| PUT | `/animales/{id}` | Editar animal | VOLUNTARIO+ |
| DELETE | `/animales/{id}` | Eliminar animal | VOLUNTARIO+ |
| PATCH | `/animales/{id}/estado` | Cambiar estado (EN_ADOPCION, ADOPTADO…) | VOLUNTARIO+ |
| POST/GET | `/animales/{id}/citas` | Crear / listar citas veterinarias | VOLUNTARIO+ |
| PATCH | `/animales/{id}/citas/{citaId}/completar` | Marcar cita completada | VOLUNTARIO+ |

### Almacén

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/almacen/productos` | Lista productos (filtro `categoria`) | VOLUNTARIO+ |
| GET | `/almacen/productos/{id}` | Detalle de producto | VOLUNTARIO+ |
| POST/PUT | `/almacen/productos(/{id})` | Crear / editar producto | ENCARGADO+ |
| DELETE | `/almacen/productos/{id}` | Eliminar producto | ADMIN |
| GET/POST | `/almacen/solicitudes` | Listar / crear solicitud de material | VOLUNTARIO+ |
| PUT | `/almacen/solicitudes/{id}` (+ `/decision`) | Aceptar/rechazar solicitud (decrementa stock, crea asignación) | ENCARGADO+ |
| PUT | `/almacen/solicitudes/{id}/devolucion` | Voluntario notifica devolución | VOLUNTARIO+ |
| PUT | `/almacen/solicitudes/{id}/confirmacion` | Encargado confirma devolución (repone stock) | ENCARGADO+ |
| GET | `/almacen/asignaciones` | Todas las asignaciones | ENCARGADO+ |
| GET | `/almacen/asignaciones/voluntario/{id}` | Asignaciones activas de un voluntario | VOLUNTARIO+ |

### Adopciones y formularios

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/adopciones/formulario/{animalId}` | Formulario dinámico según especie/edad del animal | público |
| POST | `/adopciones` | Enviar solicitud de adopción (respuestas como JSON) | público |
| GET | `/adopciones` | Lista de solicitudes | autenticado |
| PATCH | `/adopciones/{id}/estado` | Aceptar/rechazar | VOLUNTARIO+ |
| PATCH | `/adopciones/{id}/animal` | Reubicar en otro animal | VOLUNTARIO+ |
| DELETE | `/adopciones/{id}` | Eliminar solicitud | VOLUNTARIO+ |
| GET/POST | `/formularios` | Listar / crear formularios | GET: VOLUNTARIO+ · POST: ADMIN |
| DELETE | `/formularios/{id}` | Eliminar formulario | ADMIN |

### Blog, contacto y colaboración

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/blog` (+ `?etiqueta=`) | Entradas generales del blog | público |
| GET | `/blog/{id}` | Entrada individual | público |
| POST/PUT/DELETE | `/blog(/{id})` | CRUD de entradas | VOLUNTARIO+ |
| POST | `/contacto` | Formulario de contacto → email (Resend) | público |
| POST | `/colaboracion` | Solicitud de colaboración → email (Resend) | público |

### Otros

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/enums` | Todos los enums (especies, estados, roles…) | público |
| GET | `/enums/protocolo/{especie}` | Protocolo veterinario base (`?fechaNacimiento=` o `?tipo=cachorro|adulto`) | público |
| GET/PUT/DELETE | `/configuracion/animal-del-mes` | Obtener / fijar / quitar el animal del mes | GET: público · PUT/DELETE: ENCARGADO+ |
| GET | `/administracion/animales` | Todos los animales en cualquier estado (dashboard) | VOLUNTARIO+ |

## Seguridad

- **JWT (HS256)** con `jjwt 0.11.5`: los claims llevan `sub` (id), `nombre`, `email`
  y `roles`. Caducidad: **1 hora**. Firmado con la variable `JWT_SECRET`
  (obligatoria en producción; en desarrollo usa una clave por defecto con aviso).
- **`JwtTokenFilter`**: valida `Authorization: Bearer …`, monta la autenticación con
  el rol como authority y rechaza tokens inválidos con `401`. Las rutas públicas
  y los `OPTIONS` (CORS) se saltan el filtro.
- **Contraseñas** con `BCryptPasswordEncoder`.
- **CORS** restringido a `ayudaanimalmurcia.org` (y subdominios), el frontend de
  Vercel y `localhost`.
- **Niveles de rol**: `VOLUNTARIO` < `ENCARGADO` < `ADMIN`.

## Emails (Resend HTTP API)

Render bloquea los puertos SMTP salientes en el plan gratuito, así que los correos
se envían con la **API HTTP de Resend** (`https://api.resend.com/emails`) y de forma
**asíncrona** (`@Async("emailExecutor")`, pool de 2–4 hilos).

- **Adopción**: `NotificacionSolicitudAdopcionService` avisa de cada nueva solicitud
  con enlace al panel.
- **Contacto y colaboración**: `ContactoService` / `ColaboracionService` reenvían el
  mensaje al correo de la asociación.
- Si falta configuración de email, se registra un `WARNING` y la petición **no falla**
  (fail-open).

## Persistencia

- **PostgreSQL** (Neon en producción, `postgres:16` en Docker) vía Spring Data JPA
  con `ddl-auto=update`.
- **`MigracionesEsquema`** se ejecuta al arrancar (`ApplicationReadyEvent`) y aplica
  cambios que Hibernate no hace: ampliar `descripcion` a `TEXT`, crear columnas
  booleanas con `DEFAULT false` y eliminar los `CHECK` obsoletos de los enums.
  Todo es **idempotente**. Los cambios estructurales mayores se aplican a mano con
  los scripts de `migraciones/`.
- Los adaptadores (`*PersistenciaAdapter`) traducen entre los puertos
  (`aplicacion/output/*Port`) y los repositorios JPA (`persistencia/*Repositorio`).

## Detalles de implementación

- **Manejo de errores**: `GlobalExceptionHandler` mapea `RecursoNoEncontradoException`
  → `404`, `RuntimeException` → `400` y el resto → `500`. El cuerpo siempre es
  `{ "codigo": …, "mensaje": … }`.
- **Formularios de adopción dinámicos**: `FormularioAdopcion` guarda las preguntas
  como **JSON en un `TEXT`**. Al solicitar la adopción de un animal se resuelve el
  formulario por **especie + cachorro**, luego por **especie** y, por último, el
  **genérico**. Las respuestas se guardan también como JSON.
- **AnimalFactory**: al crear un animal asigna automáticamente las citas base del
  protocolo veterinario correspondiente.
- **`estado` público**: `GET /animales` y `GET /animales/{id}` solo exponen animales
  en `EN_ADOPCION`; el dashboard usa `GET /administracion/animales` para verlos todos.
- **Alias REST**: `PUT /almacen/solicitudes/{id}` y `PUT /almacen/solicitudes/{id}/decision`
  son equivalentes (compatibilidad con el frontend).

---

# Frontend (`cliente/`)

SPA en **React 18 + TypeScript** con **Vite 6**, **Tailwind CSS 4** y
**React Router 7**.

## Estructura del código

```
cliente/
├── index.html
├── package.json / vite.config.ts
├── tsconfig.json
├── vercel.json              # rewrites SPA para Vercel
├── Dockerfile               # build node:18-alpine → serve nginx
├── nginx.conf               # try_files → index.html (SPA)
├── scripts/
│   └── generate-sitemap.mjs # genera sitemap.xml en postbuild
├── public/                  # favicons, robots.txt, etc.
└── src/
    ├── main.tsx
    └── app/
        ├── routes.tsx               # definición de rutas públicas + /dashboard
        ├── context/AppContext.tsx   # estado global (auth, enums, carrito…)
        ├── services/                # capa de acceso a la API
        │   ├── api.ts               # fetch con token JWT (base: VITE_API_URL)
        │   ├── blog.ts · colaboracion.ts · enums.ts · imgbb.ts
        ├── hooks/
        │   ├── usePageMeta.ts       # SEO: <title> + meta tags por página
        │   ├── useEnums.ts          # carga los enums desde /vidanimal/enums
        │   └── useInView.ts         # detección de scroll (animaciones)
        ├── utils/slug.ts            # slugs para rutas de animales/entradas
        ├── types.ts                 # tipos + enums compartidos
        ├── types/adoption.ts        # tipos del formulario de adopción dinámico
        ├── components/              # componentes reutilizables
        │   ├── PublicLayout · DashboardLayout · ScrollToTop
        │   ├── AnimalsForAdoption · StatusBadge · ProtocoloVeterinarioCard
        │   ├── JsonLd · TextoConEnlaces · WhatsAppIcon · TikTokIcon
        │   └── colaborar/           # formularios: Voluntariado, UMU, Acogida
        └── pages/
            ├── Home · Adoptar · AnimalDetail · AdoptionForm
            ├── Apadrinar · Colaborar · ColaborarOpcion · Donar · Contacto
            ├── Blog · EntradaBlogDetail · NovedadDetail · Login
            ├── AvisoLegal · PoliticaPrivacidad · PoliticaCookies · ErrorPagina
            └── dashboard/           # páginas del panel (ver abajo)
```

### Panel, páginas de `pages/dashboard/`

| Archivo | Función |
|---|---|
| `DashboardHome.tsx` | Métricas y avisos de stock |
| `AnimalsManagement.tsx` | Listado y gestión de animales |
| `AnimalForm.tsx` | Alta/edición de animal |
| `AnimalDetail.tsx` | Ficha + responsable y características |
| `AnimalAppointments.tsx` | Citas veterinarias (protocolo) |
| `Warehouse.tsx` / `ProductDetail.tsx` | Almacén y detalle de producto |
| `Requests.tsx` | Solicitudes de material y devoluciones |
| `AdoptionRequests.tsx` | Solicitudes de adopción |
| `UserManagement.tsx` | Gestión de usuarios (ADMIN) |
| `FormularioManagement.tsx` | Diseño de formularios de adopción (ENCARGADO+) |
| `BlogManagement.tsx` | Gestión del blog |

## Servicios y API

- `services/api.ts` centraliza las llamadas y añade el header `Authorization: Bearer`
  si hay token guardado. La base se lee de `VITE_API_URL`
  (por defecto `https://ayuda-animal-murcia-web.onrender.com/vidanimal`).
- `services/enums.ts` consume `/vidanimal/enums` (especies, estados, roles…).
- `services/imgbb.ts` sube las fotografías a **ImgBB** con `VITE_IMGBB_KEY` y devuelve
  la URL pública.

## Build de producción

```bash
cd cliente
npm run build        # vite build + postbuild → scripts/generate-sitemap.mjs
npm run preview
```

El `postbuild` genera el `sitemap.xml` automáticamente. Las variables
`VITE_API_URL` y `VITE_IMGBB_KEY` se inyectan **en el build** (se recompilan al
cambiar); en Vercel se configuran como variables de entorno del proyecto.

## Despliegue SPA

Como es una SPA con React Router, toda ruta desconocida debe servir `index.html`:

- **Vercel**: `vercel.json` con un rewrite hacia `/index.html` (excluye `assets/`
  y ficheros con extensión).
- **Nginx/Docker**: `nginx.conf` con `try_files $uri $uri/ /index.html;`.

## Estilo y utilidades

- **Tailwind CSS 4** vía `@tailwindcss/vite` (configuración en CSS, sin `tailwind.config`).
- Iconos con **lucide-react**; animaciones CSS con **tw-animate-css**.
- Slugs de URLs en `utils/slug.ts` para animales y entradas del blog.
- SEO por página con `usePageMeta` y datos estructurados con `JsonLd`.

---

## Despliegue en producción

El proyecto está actualmente desplegado con servicios gratuitos:

- **Frontend** → Vercel (SPA, con rewrites para React Router en `cliente/vercel.json`).
- **Backend** → Render, servido bajo `/vidanimal` (https://ayuda-animal-murcia-web.onrender.com).
- **Base de datos** → PostgreSQL gestionado en la nube (Neon).
- **Dominio** → www.ayudaanimalmurcia.org (con CORS restringido al dominio + local).

Los emails se envían con **Resend vía HTTP** (no SMTP) porque los planes gratuitos de
hosting bloquean los puertos SMTP salientes. El envío es **asíncrono**: una solicitud
de adopción se guarda siempre, aunque el correo falle.

---

## ¿Qué es Vidanimal?

Este repositorio es una **instancia de producción** de **Vidanimal**, mi plataforma
para protectoras de animales creada a partir de esta experiencia.

- El software genérico y reutilizable vive en el repositorio **vidanimal**.
- Esta web es el **caso aplicado real**: una asociación, su imagen, sus formularios
  y su panel, usando la misma base.

---

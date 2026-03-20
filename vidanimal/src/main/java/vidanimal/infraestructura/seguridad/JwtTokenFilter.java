package vidanimal.infraestructura.seguridad;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;

/**
 * FILTRO JWT - Se ejecuta ANTES de cada petición al controlador.
 *
 * Equivalente al ContainerRequestFilter de JAX-RS que visteis en clase:
 *
 *   @Provider
 *   @Priority(Priorities.AUTHENTICATION)
 *   public class JwtTokenFilter implements ContainerRequestFilter {
 *       public void filter(ContainerRequestContext requestContext) { ... }
 *   }
 *
 * Flujo:
 * 1. Llega una petición HTTP
 * 2. Este filtro la intercepta ANTES de llegar al controller
 * 3. Si la ruta es pública (login) → deja pasar
 * 4. Si no, busca la cabecera "Authorization: Bearer <token>"
 * 5. Si no hay token → 401 Unauthorized
 * 6. Si hay token → lo valida con JwtUtil
 * 7. Si es válido → extrae los claims y configura la autenticación
 * 8. Si es inválido/caducado → 401 Unauthorized
 */
@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // Rutas públicas
        boolean esPublicoAnimales =
                "GET".equalsIgnoreCase(method) &&
                ("/vidanimal/animales".equals(path) || path.matches("^/vidanimal/animales/\\d+$"));

        if (path.startsWith("/vidanimal/auth/") || esPublicoAnimales) {
            filterChain.doFilter(request, response);
            return;
        }

        // Permitir peticiones OPTIONS (preflight de CORS)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // ── Extraer token de la cabecera ──
        // En clase:
        //   String authorization = requestContext.getHeaderString("Authorization");
        //   if (authorization == null || !authorization.startsWith("Bearer ")) {
        //       requestContext.abortWith(Response.status(UNAUTHORIZED).build());
        //   }
        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"codigo\":401,\"mensaje\":\"Token no proporcionado\"}");
            return;
        }

        String token = authorization.substring("Bearer ".length()).trim();

        try {
            // ── Validar token ──
            // En clase:
            //   Claims claims = Jwts.parser().setSigningKey(SECRET_KEY)
            //                       .parseClaimsJws(token).getBody();
            Claims claims = JwtUtil.validarToken(token);

            // ── Guardar claims en la petición ──
            // Igual que en clase:
            //   this.servletRequest.setAttribute("claims", claims);
            request.setAttribute("claims", claims);

            // ── Configurar autenticación en Spring Security ──
            // Esto es lo que permite que @PreAuthorize funcione
            // Extrae el rol del token y lo convierte en "authority"
            String rol = claims.get("roles", String.class);
            List<SimpleGrantedAuthority> authorities =
                    List.of(new SimpleGrantedAuthority(rol));

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            claims.getSubject(),  // el id del usuario
                            null,                 // no necesitamos password
                            authorities           // los roles
                    );

            SecurityContextHolder.getContext().setAuthentication(auth);

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            // Token inválido o caducado
            // En clase:
            //   requestContext.abortWith(Response.status(UNAUTHORIZED).build());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"codigo\":401,\"mensaje\":\"Token inválido o caducado\"}");
        }
    }
}
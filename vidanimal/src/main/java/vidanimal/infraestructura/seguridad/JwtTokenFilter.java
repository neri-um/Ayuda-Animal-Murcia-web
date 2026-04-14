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

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // Permitir peticiones OPTIONS (preflight de CORS)
        if ("OPTIONS".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // ── Rutas públicas ──
        boolean esPublicoAnimales =
                "GET".equalsIgnoreCase(method) &&
                ("/vidanimal/animales".equals(path) || path.matches("^/vidanimal/animales/\\d+$"));

        boolean esPublico = path.startsWith("/vidanimal/auth/")
                || "/vidanimal/enums".equals(path)
                || esPublicoAnimales;

        if (esPublico) {
            filterChain.doFilter(request, response);
            return;
        }

        // ── Token obligatorio a partir de aquí ──
        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"codigo\":401,\"mensaje\":\"Token no proporcionado\"}");
            return;
        }

        String token = authorization.substring("Bearer ".length()).trim();

        try {
            Claims claims = JwtUtil.validarToken(token);
            request.setAttribute("claims", claims);

            String rol = claims.get("roles", String.class);
            List<SimpleGrantedAuthority> authorities =
                    List.of(new SimpleGrantedAuthority(rol));

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            claims.getSubject(),
                            null,
                            authorities
                    );

            SecurityContextHolder.getContext().setAuthentication(auth);
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"codigo\":401,\"mensaje\":\"Token inválido o caducado\"}");
        }
    }
}

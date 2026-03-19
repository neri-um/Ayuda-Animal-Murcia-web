package vidanimal.infraestructura.seguridad;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

/**
 * Configuración de Spring Security.
 *
 * - Desactiva CSRF (no necesario en APIs REST con JWT)
 * - Configura CORS (para que el frontend pueda conectarse)
 * - Modo STATELESS (no guarda sesiones, usa JWT en cada petición)
 * - Rutas públicas: /vidanimal/auth/**
 * - Resto de rutas: requieren token JWT
 * - @EnableMethodSecurity: habilita @PreAuthorize en controllers
 *   (equivalente a @RolesAllowed de JAX-RS)
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // Habilita @PreAuthorize (como @RolesAllowed en JAX-RS)
public class SecurityConfig {

    @Autowired
    private JwtTokenFilter jwtTokenFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CORS: permite que el frontend (React) se conecte al backend
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(List.of(
                        "http://localhost:3000",   // React
                        "http://localhost:4200"));  // Angular
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                return config;
            }))
            // CSRF desactivado (APIs REST con JWT no lo necesitan)
            .csrf(csrf -> csrf.disable())
            // Sin sesiones (STATELESS) → cada petición lleva su token
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Rutas públicas y protegidas
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/vidanimal/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            // Añade nuestro filtro JWT ANTES del filtro de Spring
            .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
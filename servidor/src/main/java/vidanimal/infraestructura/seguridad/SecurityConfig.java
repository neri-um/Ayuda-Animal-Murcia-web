package vidanimal.infraestructura.seguridad;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtTokenFilter jwtTokenFilter;

    /**
     * Bean de codificación de contraseñas con BCrypt.
     * Se inyecta en AuthService y UsuariosAdminService.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                // Orígenes permitidos: React (dev con Vite) y la URL de producción
                config.setAllowedOrigins(List.of(
                        "http://localhost:5173",
                        "http://localhost",
                        "https://ayuda-animal-murcia-web.vercel.app"));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                return config;
            }))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/vidanimal/auth/**").permitAll()
                .requestMatchers("/vidanimal/enums").permitAll()
                .requestMatchers("/vidanimal/enums/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/vidanimal/animales").permitAll()
                .requestMatchers(HttpMethod.GET, "/vidanimal/animales/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/vidanimal/adopciones/formulario/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/vidanimal/adopciones").permitAll()
                .requestMatchers(HttpMethod.GET, "/vidanimal/adopciones").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/vidanimal/adopciones/*/estado")
                    .hasAnyAuthority("VOLUNTARIO", "ENCARGADO", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/vidanimal/formularios")
                    .hasAnyAuthority("VOLUNTARIO", "ENCARGADO", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/vidanimal/formularios")
                    .hasAnyAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/vidanimal/formularios/*")
                    .hasAnyAuthority("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

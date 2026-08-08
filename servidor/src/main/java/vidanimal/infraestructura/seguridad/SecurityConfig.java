package vidanimal.infraestructura.seguridad;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtTokenFilter jwtTokenFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOriginPatterns(List.of(
                        "https://ayudaanimalmurcia.org",
                        "https://www.ayudaanimalmurcia.org",
                        "https://*.ayudaanimalmurcia.org",
                        "https://ayuda-animal-murcia-web.vercel.app",
                        "http://localhost",
                        "http://localhost:*"));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                config.setAllowCredentials(false);
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
                .requestMatchers(HttpMethod.GET, "/vidanimal/configuracion/animal-del-mes").permitAll()
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

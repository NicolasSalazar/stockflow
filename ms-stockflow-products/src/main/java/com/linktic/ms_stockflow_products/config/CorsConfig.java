package com.linktic.ms_stockflow_products.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Permitir credenciales
        config.setAllowCredentials(true);

        // Permitir peticiones desde el puerto 3000 (y otros puertos comunes)
        config.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:*",
                "http://127.0.0.1:*"
        ));

        // Permitir todos los headers
        config.setAllowedHeaders(List.of("*"));

        // Permitir todos los métodos HTTP
        config.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        // Exponer headers en la respuesta
        config.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Total-Count"
        ));

        // Configurar tiempo de cache para preflight requests
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}

package cashflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point aplikasi CashFlow Web.
 * Spring Boot otomatis men-serve frontend React dari classpath:/static/
 * (hasil build Vite) bersamaan dengan REST API di /api/**.
 */
@SpringBootApplication
public class CashflowApplication {
    public static void main(String[] args) {
        SpringApplication.run(CashflowApplication.class, args);
    }
}

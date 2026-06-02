package cashflow.controller;

import cashflow.model.User;
import cashflow.service.AuthService;
import cashflow.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {
        try {
            User user = authService.register(
                req.get("username"),
                req.get("email"),
                req.get("password")
            );
            String token = jwtUtil.generateToken(user);
            return ResponseEntity.ok(Map.of(
                "token", token,
                "username", user.getUsername()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        try {
            String usernameOrEmail = req.get("usernameOrEmail");
            User user = authService.login(usernameOrEmail, req.get("password"));
            String token = jwtUtil.generateToken(user);
            return ResponseEntity.ok(Map.of(
                "token", token,
                "username", user.getUsername()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
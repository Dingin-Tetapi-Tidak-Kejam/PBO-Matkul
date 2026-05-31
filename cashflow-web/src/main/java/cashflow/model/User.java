package cashflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entitas pengguna aplikasi.
 *
 * ── OOP ───────────────────────────────────────────────────────────────────────
 * - Encapsulation : semua field private, hanya bisa diakses via getter/setter.
 *                   Password disimpan sebagai SHA-256 hash (bukan plain-text).
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    /** Disimpan sebagai SHA-256 hex hash, bukan plain-text. */
    @Column(nullable = false, length = 64)
    private String password;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // ── Konstruktor ───────────────────────────────────────────────────────────

    public User() {}

    public User(String username, String email, String hashedPassword) {
        this.username  = username;
        this.email     = email;
        this.password  = hashedPassword;
    }

    // ── Getter & Setter (Encapsulation) ──────────────────────────────────────

    public int getId()                       { return id; }
    public String getUsername()              { return username; }
    public String getEmail()                 { return email; }
    public String getPassword()              { return password; }
    public LocalDateTime getCreatedAt()      { return createdAt; }

    public void setId(int id)                { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email)       { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setCreatedAt(LocalDateTime t){ this.createdAt = t; }
}

package cashflow.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Kelas abstrak dasar untuk semua transaksi keuangan.
 *
 * ── 4 Pilar OOP ──────────────────────────────────────────────────────────────
 * 1. Encapsulation  : semua field bersifat private, diakses hanya via getter/setter.
 * 2. Abstraction    : kelas ini tidak bisa di-instantiate langsung; subkelas wajib
 *                     mengimplementasikan getTransactionType() dan getDetail().
 * 3. Inheritance    : Income dan Expense mewarisi Transaction (extends).
 * 4. Polymorphism   : getTransactionType() dan getDetail() di-override oleh
 *                     masing-masing subkelas, sehingga satu tipe Transaction
 *                     dapat berperilaku berbeda.
 *
 * ── JPA Strategy ─────────────────────────────────────────────────────────────
 * SINGLE_TABLE: Income dan Expense disimpan dalam satu tabel "transactions"
 * dengan kolom discriminator "transaction_type".
 */
@Entity
@Table(name = "transactions")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "transaction_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private LocalDate date;

    @Column(length = 255)
    private String description;

    /** Relasi Many-to-One: setiap transaksi dimiliki tepat satu User. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ── Konstruktor ───────────────────────────────────────────────────────────

    protected Transaction() {}

    protected Transaction(double amount, LocalDate date, String description, User user) {
        this.amount      = amount;
        this.date        = date;
        this.description = description;
        this.user        = user;
    }

    // ── Abstract Methods (Abstraction + Polymorphism) ─────────────────────────

    /** Mengembalikan tipe transaksi: "INCOME" atau "EXPENSE". */
    public abstract String getTransactionType();

    /** Mengembalikan detail spesifik subkelas (sumber / kategori). */
    public abstract String getDetail();

    // ── Getter & Setter (Encapsulation) ──────────────────────────────────────

    public int getId()                       { return id; }
    public double getAmount()                { return amount; }
    public LocalDate getDate()               { return date; }
    public String getDescription()           { return description; }
    public User getUser()                    { return user; }

    public void setId(int id)                { this.id = id; }
    public void setAmount(double amount)     { this.amount = amount; }
    public void setDate(LocalDate date)      { this.date = date; }
    public void setDescription(String desc)  { this.description = desc; }
    public void setUser(User user)           { this.user = user; }
}

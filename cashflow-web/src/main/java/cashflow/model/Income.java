package cashflow.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Merepresentasikan transaksi pemasukan.
 *
 * ── OOP ───────────────────────────────────────────────────────────────────────
 * - Inheritance  : extends Transaction → mewarisi semua field & behaviour dasar.
 * - Polymorphism : meng-override getTransactionType() dan getDetail() sehingga
 *                  kode yang memegang referensi Transaction tetap bisa memanggil
 *                  kedua method tersebut tanpa tahu tipe konkretnya.
 * - Encapsulation: field "source" bersifat private dengan getter/setter.
 */
@Entity
@DiscriminatorValue("INCOME")
public class Income extends Transaction {

    @Enumerated(EnumType.STRING)
    @Column(name = "source")
    private IncomeSource source;

    // ── Konstruktor ───────────────────────────────────────────────────────────

    public Income() {}

    public Income(double amount, LocalDate date, String description,
                  User user, IncomeSource source) {
        super(amount, date, description, user);
        this.source = source;
    }

    // ── Polymorphism: override abstract methods ───────────────────────────────

    @Override
    public String getTransactionType() { return "INCOME"; }

    @Override
    public String getDetail() { return source != null ? source.toString() : ""; }

    // ── Getter & Setter ───────────────────────────────────────────────────────

    public IncomeSource getSource()        { return source; }
    public void setSource(IncomeSource s)  { this.source = s; }
}

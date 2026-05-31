package cashflow.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Merepresentasikan transaksi pengeluaran.
 *
 * ── OOP ───────────────────────────────────────────────────────────────────────
 * - Inheritance  : extends Transaction → mewarisi amount, date, description, user.
 * - Polymorphism : meng-override getTransactionType() ("EXPENSE") dan getDetail()
 *                  (mengembalikan "KATEGORI - SUB_KATEGORI").
 * - Encapsulation: field category dan subCategory bersifat private.
 */
@Entity
@DiscriminatorValue("EXPENSE")
public class Expense extends Transaction {

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private ExpenseCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "sub_category")
    private ExpenseSubCategory subCategory;

    // ── Konstruktor ───────────────────────────────────────────────────────────

    public Expense() {}

    public Expense(double amount, LocalDate date, String description,
                   User user, ExpenseCategory category, ExpenseSubCategory subCategory) {
        super(amount, date, description, user);
        this.category    = category;
        this.subCategory = subCategory;
    }

    // ── Polymorphism: override abstract methods ───────────────────────────────

    @Override
    public String getTransactionType() { return "EXPENSE"; }

    @Override
    public String getDetail() {
        return (category != null ? category.toString() : "") +
               " - " +
               (subCategory != null ? subCategory.toString() : "");
    }

    // ── Getter & Setter ───────────────────────────────────────────────────────

    public ExpenseCategory getCategory()             { return category; }
    public ExpenseSubCategory getSubCategory()       { return subCategory; }
    public void setCategory(ExpenseCategory c)       { this.category = c; }
    public void setSubCategory(ExpenseSubCategory s) { this.subCategory = s; }
}

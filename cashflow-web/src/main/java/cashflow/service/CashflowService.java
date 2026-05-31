package cashflow.service;

import cashflow.dao.TransactionRepository;
import cashflow.model.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

/**
 * Service layer untuk semua operasi transaksi keuangan.
 *
 * ── OOP ───────────────────────────────────────────────────────────────────────
 * - Polymorphism  : addIncome() dan addExpense() mengembalikan subkelas konkret
 *                   (Income / Expense) melalui tipe Transaction, sehingga controller
 *                   dapat memanggil getTransactionType() dan getDetail() secara
 *                   polimorfis tanpa tahu tipe pastinya.
 * - Encapsulation : semua dependensi private final, logic bisnis terisolasi dari
 *                   controller.
 */
@Service
public class CashflowService {

    private final TransactionRepository transactionRepo;

    public CashflowService(TransactionRepository transactionRepo) {
        this.transactionRepo = transactionRepo;
    }

    // ── Summary ───────────────────────────────────────────────────────────────

    public double getTotalIncome(User user) {
        return transactionRepo.getTotalIncome(user);
    }

    public double getTotalExpense(User user) {
        return transactionRepo.getTotalExpense(user);
    }

    public double getBalance(User user) {
        return getTotalIncome(user) - getTotalExpense(user);
    }

    /**
     * Memformat angka menjadi format rupiah Indonesia.
     * Contoh: 1500000 → "Rp 1.500.000"
     */
    public String formatRupiah(double amount) {
        NumberFormat fmt = NumberFormat.getNumberInstance(Locale.of("id", "ID"));
        return "Rp " + fmt.format(amount);
    }

    // ── Transactions CRUD ─────────────────────────────────────────────────────

    public List<Transaction> getAllTransactions(User user) {
        return transactionRepo.findByUserOrderByDateDescIdDesc(user);
    }

    public List<Transaction> searchTransactions(User user, String keyword) {
        return transactionRepo.searchByUser(user, keyword);
    }

    @Transactional
    public Income addIncome(User user, double amount, LocalDate date,
                            String description, IncomeSource source) {
        Income income = new Income(amount, date, description, user, source);
        return transactionRepo.save(income);
    }

    @Transactional
    public Expense addExpense(User user, double amount, LocalDate date,
                              String description, ExpenseCategory category,
                              ExpenseSubCategory subCategory) {
        Expense expense = new Expense(amount, date, description, user, category, subCategory);
        return transactionRepo.save(expense);
    }

    @Transactional
    public void deleteTransaction(int id, User owner) {
        Transaction t = transactionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaksi tidak ditemukan"));
        if (t.getUser().getId() != owner.getId()) {
            throw new SecurityException("Tidak diizinkan menghapus transaksi milik user lain");
        }
        transactionRepo.delete(t);
    }
}

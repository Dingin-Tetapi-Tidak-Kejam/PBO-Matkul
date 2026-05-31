package cashflow.dao;


import cashflow.model.Transaction;
import cashflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository untuk entitas Transaction (termasuk Income dan Expense).
 * Menggunakan JPQL untuk query kustom.
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    /** Semua transaksi milik user, diurutkan dari terbaru. */
    List<Transaction> findByUserOrderByDateDescIdDesc(User user);

    /** Cari transaksi berdasarkan keyword pada kolom description. */
    @Query("SELECT t FROM Transaction t WHERE t.user = :user " +
            "AND LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Transaction> searchByUser(@Param("user") User user,
                                   @Param("keyword") String keyword);

    /** Total pemasukan user (sum dari subkelas Income). */
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Income t WHERE t.user = :user")
    double getTotalIncome(@Param("user") User user);

    /** Total pengeluaran user (sum dari subkelas Expense). */
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Expense t WHERE t.user = :user")
    double getTotalExpense(@Param("user") User user);
}

package cashflow.controller;

import cashflow.model.*;
import cashflow.service.AuthService;
import cashflow.service.CashflowService;
import cashflow.util.JwtUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST Controller untuk semua operasi dashboard keuangan.
 *
 * Endpoint  :  GET    /api/cashflow/summary
 *              GET    /api/cashflow/transactions[?search=]
 *              POST   /api/cashflow/income
 *              POST   /api/cashflow/expense
 *              DELETE /api/cashflow/transactions/{id}
 *
 * ── OOP ───────────────────────────────────────────────────────────────────────
 * - Polymorphism : toDto(Transaction t) menerima Transaction (tipe abstrak),
 *                  lalu memanggil getTransactionType() dan getDetail() —
 *                  method yang berperilaku berbeda tergantung apakah t adalah
 *                  Income atau Expense (runtime polymorphism).
 */
@RestController
@RequestMapping("/api/cashflow")
public class DashboardController {

    private final CashflowService cashflowService;
    private final AuthService     authService;
    private final JwtUtil         jwtUtil;

    public DashboardController(CashflowService cashflowService,
                               AuthService authService,
                               JwtUtil jwtUtil) {
        this.cashflowService = cashflowService;
        this.authService     = authService;
        this.jwtUtil         = jwtUtil;
    }

    // ── GET /api/cashflow/summary ─────────────────────────────────────────────

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(
            @RequestHeader("Authorization") String authHeader) {
        User user = extractUser(authHeader);
        double income  = cashflowService.getTotalIncome(user);
        double expense = cashflowService.getTotalExpense(user);
        return ResponseEntity.ok(Map.of(
                "totalIncome",  income,
                "totalExpense", expense,
                "balance",      income - expense
        ));
    }

    // ── GET /api/cashflow/transactions ────────────────────────────────────────

    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) String search) {
        User user = extractUser(authHeader);
        List<Transaction> list = (search == null || search.isBlank())
                ? cashflowService.getAllTransactions(user)
                : cashflowService.searchTransactions(user, search);
        return ResponseEntity.ok(list.stream().map(this::toDto).toList());
    }

    // ── POST /api/cashflow/income ─────────────────────────────────────────────

    @PostMapping("/income")
    public ResponseEntity<?> addIncome(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody AddIncomeRequest req) {
        User user = extractUser(authHeader);
        Income income = cashflowService.addIncome(
                user, req.amount(), req.date(), req.description(),
                IncomeSource.valueOf(req.source())
        );
        return ResponseEntity.ok(toDto(income));
    }

    // ── POST /api/cashflow/expense ────────────────────────────────────────────

    @PostMapping("/expense")
    public ResponseEntity<?> addExpense(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody AddExpenseRequest req) {
        User user = extractUser(authHeader);
        Expense expense = cashflowService.addExpense(
                user, req.amount(), req.date(), req.description(),
                ExpenseCategory.valueOf(req.category()),
                ExpenseSubCategory.valueOf(req.subCategory())
        );
        return ResponseEntity.ok(toDto(expense));
    }

    // ── DELETE /api/cashflow/transactions/{id} ────────────────────────────────

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<?> deleteTransaction(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable int id) {
        User user = extractUser(authHeader);
        try {
            cashflowService.deleteTransaction(id, user);
            return ResponseEntity.ok(Map.of("message", "Transaksi berhasil dihapus"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── Private Helpers ───────────────────────────────────────────────────────

    /**
     * Mengekstrak User dari header Authorization Bearer.
     * Memanfaatkan Polymorphism: token divalidasi tanpa perlu tahu
     * isi business-logic di lapisan bawah.
     */
    private User extractUser(String authHeader) {
        String token = authHeader.replace("Bearer ", "").trim();
        if (!jwtUtil.isValid(token)) {
            throw new SecurityException("Token tidak valid atau kadaluarsa");
        }
        return authService.findById(jwtUtil.extractUserId(token));
    }

    /**
     * Mengonversi Transaction ke Map DTO untuk response JSON.
     * Memanfaatkan Polymorphism: getTransactionType() dan getDetail()
     * dipanggil tanpa cast, behaviour ditentukan runtime oleh subkelas.
     */
    private Map<String, Object> toDto(Transaction t) {
        return Map.of(
                "id",          t.getId(),
                "type",        t.getTransactionType(),   // Polymorphism
                "amount",      t.getAmount(),
                "date",        t.getDate().toString(),
                "description", t.getDescription() != null ? t.getDescription() : "",
                "detail",      t.getDetail()              // Polymorphism
        );
    }

    // ── Request DTOs (Java Record) ────────────────────────────────────────────

    public record AddIncomeRequest(
            @Positive double amount,
            @NotNull LocalDate date,
            String description,
            @NotBlank String source
    ) {}

    public record AddExpenseRequest(
            @Positive double amount,
            @NotNull LocalDate date,
            String description,
            @NotBlank String category,
            @NotBlank String subCategory
    ) {}
}

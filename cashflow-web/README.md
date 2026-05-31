# CashFlow Web — Monorepo

Aplikasi manajemen keuangan pribadi berbasis web, dengan backend **Spring Boot (Java)** dan frontend **React + Vite**, tersimpan dalam satu repositori.

---

## Struktur Proyek

```
cashflow-web/
├── pom.xml                          ← Maven build (backend + integrasi frontend)
│
├── src/main/
│   ├── java/cashflow/
│   │   ├── CashflowApplication.java       ← Entry point Spring Boot
│   │   ├── model/                         ← Entitas JPA (OOP)
│   │   │   ├── Transaction.java           ← Abstract class (Abstraction)
│   │   │   ├── Income.java                ← Extends Transaction (Inheritance + Polymorphism)
│   │   │   ├── Expense.java               ← Extends Transaction (Inheritance + Polymorphism)
│   │   │   ├── User.java                  ← Entitas user (Encapsulation)
│   │   │   ├── IncomeSource.java          ← Enum sumber pemasukan
│   │   │   ├── ExpenseCategory.java       ← Enum kategori pengeluaran
│   │   │   └── ExpenseSubCategory.java    ← Enum sub-kategori pengeluaran
│   │   ├── dao/
│   │   │   ├── UserRepository.java        ← Spring Data JPA repository
│   │   │   └── TransactionRepository.java ← Termasuk JPQL custom queries
│   │   ├── service/
│   │   │   ├── AuthService.java           ← Logika register & login
│   │   │   └── CashflowService.java       ← Logika CRUD transaksi
│   │   ├── controller/
│   │   │   ├── AuthController.java        ← POST /api/auth/**
│   │   │   └── DashboardController.java   ← GET/POST/DELETE /api/cashflow/**
│   │   ├── config/
│   │   │   ├── SecurityConfig.java        ← Spring Security + CORS
│   │   │   └── SpaController.java         ← Fallback ke index.html (React Router)
│   │   └── util/
│   │       ├── JwtUtil.java               ← Generate & validasi JWT
│   │       └── PasswordUtil.java          ← SHA-256 hash password
│   └── resources/
│       ├── application.properties         ← Konfigurasi server, DB, JWT
│       └── static/                        ← (Diisi otomatis saat mvn package)
│
└── frontend/                        ← Kode sumber React
    ├── package.json
    ├── vite.config.js               ← Dev proxy /api → :8080; build → dist/
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── context/
        │   └── AuthContext.jsx      ← State autentikasi global
        ├── services/
        │   └── api.js               ← Axios client + konstanta enum
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── SignUpPage.jsx
        │   └── DashboardPage.jsx
        └── components/
            ├── AddIncome.jsx
            ├── AddExpense.jsx
            └── TransactionTable.jsx
```

---

## 4 Pilar OOP (Java)

| Pilar | Implementasi |
|---|---|
| **Encapsulation** | Semua field di `Transaction`, `User`, `Income`, `Expense` bersifat `private`, hanya bisa diakses via getter/setter. Logika bisnis terisolasi dalam `Service` layer. |
| **Abstraction** | `Transaction` adalah `abstract class` yang tidak bisa di-instantiate langsung. Mendefinisikan kontrak `getTransactionType()` dan `getDetail()` yang wajib diimplementasikan subkelas. |
| **Inheritance** | `Income` dan `Expense` masing-masing `extends Transaction`, mewarisi `id`, `amount`, `date`, `description`, dan `user`. |
| **Polymorphism** | `DashboardController.toDto(Transaction t)` memanggil `t.getTransactionType()` dan `t.getDetail()` tanpa casting — runtime JVM memutuskan implementasi mana yang dijalankan sesuai tipe aktual objek. |

---

## Teknologi

- **Backend**: Java 21 · Spring Boot 3.3 · Spring Security · Spring Data JPA
- **Database**: PostgreSQL
- **Auth**: JWT (jjwt 0.12.x) + SHA-256 password hash
- **HTTP**: HTTP/2 via Tomcat (`server.http2.enabled=true`)
- **Frontend**: React 18 · React Router 6 · Axios · Recharts · Tailwind CSS · Vite 5

---

## Cara Menjalankan

### Prasyarat
- Java 21+
- Maven 3.9+
- Node.js 20+ (hanya diperlukan untuk development frontend, tidak perlu install manual — Maven Plugin akan mengunduhnya)
- PostgreSQL (buat database `cashflow_db`)

### Development (frontend + backend terpisah)

```bash
# Terminal 1 — Spring Boot
mvn spring-boot:run

# Terminal 2 — Vite dev server (hot-reload)
cd frontend
npm install
npm run dev
# Buka http://localhost:5173
```

### Production (satu JAR, satu port)

```bash
# Build semuanya: Maven akan menjalankan npm install + npm run build
# lalu menyalin dist/ ke resources/static/ secara otomatis
mvn clean package

# Jalankan
java -jar target/cashflow-web-1.0.0.jar
# Buka http://localhost:8080
```

### Konfigurasi Database

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cashflow_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

---

## API Endpoints

| Method | Path | Deskripsi |
|---|---|---|
| `POST` | `/api/auth/register` | Daftar akun baru |
| `POST` | `/api/auth/login` | Login, mendapat JWT |
| `GET` | `/api/cashflow/summary` | Total income, expense, saldo |
| `GET` | `/api/cashflow/transactions` | Semua transaksi (opsional: `?search=`) |
| `POST` | `/api/cashflow/income` | Tambah pemasukan |
| `POST` | `/api/cashflow/expense` | Tambah pengeluaran |
| `DELETE` | `/api/cashflow/transactions/{id}` | Hapus transaksi |

Semua endpoint selain `/api/auth/**` memerlukan header `Authorization: Bearer <token>`.

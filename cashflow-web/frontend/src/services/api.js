/**
 * services/api.js
 *
 * Layer komunikasi dengan Spring Boot REST API.
 * Di production, BASE_URL kosong karena frontend & backend
 * dilayani oleh server yang sama (port 8080).
 * Di development (Vite proxy), /api diteruskan ke localhost:8080.
 */

import axios from 'axios'

// Vite proxy otomatis meneruskan /api → http://localhost:8080
// Saat production, path relatif sudah cukup (same origin)
const api = axios.create({ baseURL: '/api' })

// Suntikkan JWT di setiap request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  login:    (usernameOrEmail, password) =>
    api.post('/auth/login', { usernameOrEmail, password }),

  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
}

// ── Cashflow ─────────────────────────────────────────────────────────────────

export const cashflowApi = {
  getSummary: () =>
    api.get('/cashflow/summary'),

  getTransactions: (search = '') =>
    api.get('/cashflow/transactions', { params: search ? { search } : {} }),

  addIncome: (amount, date, description, source) =>
    api.post('/cashflow/income', { amount, date, description, source }),

  addExpense: (amount, date, description, category, subCategory) =>
    api.post('/cashflow/expense', { amount, date, description, category, subCategory }),

  deleteTransaction: (id) =>
    api.delete(`/cashflow/transactions/${id}`),
}

// ── Enums (sama persis dengan Java backend) ───────────────────────────────────

export const INCOME_SOURCES = [
  'GAJI', 'BONUS', 'UANG_SAKU', 'FREELANCE', 'INVESTASI', 'LAINNYA',
]

export const EXPENSE_CATEGORIES = [
  'MAKANAN', 'TRANSPORT', 'BELANJA', 'HIBURAN', 'LAINNYA',
]

export const EXPENSE_SUB_CATEGORIES = {
  MAKANAN:   ['SARAPAN', 'MAKAN_SIANG', 'MAKAN_MALAM', 'SNACK', 'KOPI'],
  TRANSPORT: ['BENSIN', 'PARKIR', 'OJEK_ONLINE', 'BUS', 'KERETA'],
  BELANJA:   ['PAKAIAN', 'ELEKTRONIK', 'PERABOT', 'GROCERY', 'KOSMETIK'],
  HIBURAN:   ['FILM', 'GAME', 'MUSIK', 'OLAHRAGA', 'TRAVELLING'],
  LAINNYA:   ['LAINNYA'],
}

// ── Helper ────────────────────────────────────────────────────────────────────

export const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style:                'currency',
    currency:             'IDR',
    minimumFractionDigits: 0,
  }).format(amount)

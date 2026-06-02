import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { cashflowApi, formatRupiah } from '../services/api'
import { useAuth } from '../context/AuthContext'
import AddIncome  from '../components/AddIncome'
import AddExpense from '../components/AddExpense'
import TransactionTable from '../components/TransactionTable'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl px-4 py-3" style={{ background: '#1a1a2a', border: '1px solid #2a2a3a' }}>
        <p className="text-dark-200 text-xs mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: {formatRupiah(p.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [summary, setSummary]       = useState({ totalIncome: 0, totalExpense: 0, balance: 0 })
  const [transactions, setTxns]     = useState([])
  const [showIncome, setShowIncome] = useState(false)
  const [showExpense, setShowExpense] = useState(false)
  const [loading, setLoading]       = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeTab, setActiveTab]   = useState('overview') 

  const refresh = useCallback(async () => {
    try {
      const [sumRes, txRes] = await Promise.all([
        cashflowApi.getSummary(),
        cashflowApi.getTransactions(),
      ])
      setSummary(sumRes.data)
      setTxns(txRes.data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh, refreshKey])

  const handleLogout = () => { logout(); navigate('/login') }

  const chartData = (() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      const label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })
      const income  = transactions.filter(t => t.date === key && t.type === 'INCOME').reduce((s, t) => s + t.amount, 0)
      const expense = transactions.filter(t => t.date === key && t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0)
      days.push({ label, income, expense })
    }
    return days
  })()

  const categoryData = (() => {
    const map = {}
    transactions.filter(t => t.type === 'EXPENSE').forEach(t => {
      const cat = t.detail?.split(' - ')[0] || 'LAINNYA'
      map[cat] = (map[cat] || 0) + t.amount
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  })()
  const PIE_COLORS = ['#63cf8b','#5b9cf6','#f5c842','#ff6b7a','#a78bfa']

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, #63cf8b, #5b9cf6)' }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-dark-300 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  const balancePositive = summary.balance >= 0

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #1a1a2a' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #63cf8b, #5b9cf6)' }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-display font-bold text-white">CashFlow</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: '#111118', border: '1px solid #2a2a3a' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #63cf8b, #5b9cf6)', color: '#0a0a0f' }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span className="text-dark-100 text-sm">{user?.username}</span>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-dark-300 hover:text-white text-sm transition-all"
            style={{ border: '1px solid #2a2a3a' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <p className="text-dark-300 text-sm mb-1">Selamat datang kembali,</p>
          <h1 className="font-display text-3xl font-bold text-white">
            {user?.username} 👋
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Balance */}
          <div className="sm:col-span-1 p-5 rounded-2xl relative overflow-hidden animate-fade-in-up delay-100"
            style={{ background: balancePositive ? 'rgba(99,207,139,0.08)' : 'rgba(255,107,122,0.08)', border: `1px solid ${balancePositive ? 'rgba(99,207,139,0.2)' : 'rgba(255,107,122,0.2)'}` }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2"
              style={{ background: balancePositive ? '#63cf8b' : '#ff6b7a' }} />
            <p className="text-dark-300 text-xs font-medium mb-3 uppercase tracking-wider">Saldo</p>
            <p className="font-display text-2xl font-bold mb-1"
              style={{ color: balancePositive ? '#63cf8b' : '#ff6b7a' }}>
              {formatRupiah(summary.balance)}
            </p>
            <p className="text-dark-300 text-xs">
              {balancePositive ? '↑ Keuangan sehat' : '↓ Pengeluaran melebihi pemasukan'}
            </p>
          </div>

          {/* Income */}
          <div className="p-5 rounded-2xl animate-fade-in-up delay-200"
            style={{ background: '#0f0f1a', border: '1px solid #1a1a2a' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-dark-300 text-xs font-medium uppercase tracking-wider">Pemasukan</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(99,207,139,0.15)' }}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#63cf8b' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            <p className="font-display text-xl font-bold" style={{ color: '#63cf8b' }}>
              {formatRupiah(summary.totalIncome)}
            </p>
          </div>

          {/* Expense */}
          <div className="p-5 rounded-2xl animate-fade-in-up delay-300"
            style={{ background: '#0f0f1a', border: '1px solid #1a1a2a' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-dark-300 text-xs font-medium uppercase tracking-wider">Pengeluaran</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255,107,122,0.15)' }}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#ff6b7a' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
            </div>
            <p className="font-display text-xl font-bold" style={{ color: '#ff6b7a' }}>
              {formatRupiah(summary.totalExpense)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8 animate-fade-in-up delay-300">
          <button onClick={() => setShowIncome(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-display font-semibold text-sm text-dark-900 transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #63cf8b, #3ab06a)' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Pemasukan
          </button>
          <button onClick={() => setShowExpense(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-display font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #ff6b7a, #d94f5c)' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
            </svg>
            Tambah Pengeluaran
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
          style={{ background: '#0f0f1a', border: '1px solid #1a1a2a' }}>
          {[
            { id: 'overview',      label: 'Ringkasan' },
            { id: 'transactions',  label: 'Transaksi' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: activeTab === tab.id ? '#1a1a2e' : 'transparent',
                color: activeTab === tab.id ? '#f0f0f5' : '#7070a0',
                border: activeTab === tab.id ? '1px solid #2a2a3a' : '1px solid transparent',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Area Chart */}
            <div className="lg:col-span-2 p-6 rounded-2xl"
              style={{ background: '#0f0f1a', border: '1px solid #1a1a2a' }}>
              <h3 className="font-display font-semibold text-white mb-1">Aktivitas 7 Hari Terakhir</h3>
              <p className="text-dark-300 text-xs mb-6">Pemasukan vs pengeluaran harian</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#63cf8b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#63cf8b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff6b7a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ff6b7a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tick={{ fill: '#505080', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#505080', fontSize: 11 }} axisLine={false} tickLine={false} width={60}
                    tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(0)}jt` : v >= 1000 ? `${(v/1000).toFixed(0)}rb` : v} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" name="Pemasukan" stroke="#63cf8b" strokeWidth={2} fill="url(#incomeGrad)" dot={false} />
                  <Area type="monotone" dataKey="expense" name="Pengeluaran" stroke="#ff6b7a" strokeWidth={2} fill="url(#expenseGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#63cf8b' }} />
                  <span className="text-dark-300 text-xs">Pemasukan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#ff6b7a' }} />
                  <span className="text-dark-300 text-xs">Pengeluaran</span>
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="p-6 rounded-2xl"
              style={{ background: '#0f0f1a', border: '1px solid #1a1a2a' }}>
              <h3 className="font-display font-semibold text-white mb-1">Kategori Pengeluaran</h3>
              <p className="text-dark-300 text-xs mb-4">Distribusi semua waktu</p>
              {categoryData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <p className="text-dark-400 text-sm">Belum ada pengeluaran</p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                        dataKey="value" paddingAngle={3}>
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => formatRupiah(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {categoryData.map((d, i) => (
                      <div key={d.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span className="text-dark-200 text-xs">{d.name}</span>
                        </div>
                        <span className="text-dark-300 text-xs">{formatRupiah(d.value)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Recent transactions preview */}
            <div className="lg:col-span-3 p-6 rounded-2xl"
              style={{ background: '#0f0f1a', border: '1px solid #1a1a2a' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-white">Transaksi Terbaru</h3>
                <button onClick={() => setActiveTab('transactions')}
                  className="text-xs font-medium transition-colors"
                  style={{ color: '#5b9cf6' }}>
                  Lihat semua →
                </button>
              </div>
              {transactions.slice(0, 5).length === 0 ? (
                <p className="text-dark-300 text-sm text-center py-8">Belum ada transaksi</p>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map(t => (
                    <div key={t.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: t.type === 'INCOME' ? 'rgba(99,207,139,0.1)' : 'rgba(255,107,122,0.1)' }}>
                        <span className="text-xs">{t.type === 'INCOME' ? '↑' : '↓'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{t.description || t.detail}</p>
                        <p className="text-dark-300 text-xs">{t.date} · {t.detail}</p>
                      </div>
                      <p className="text-sm font-semibold flex-shrink-0"
                        style={{ color: t.type === 'INCOME' ? '#63cf8b' : '#ff6b7a' }}>
                        {t.type === 'INCOME' ? '+' : '-'}{formatRupiah(t.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="p-6 rounded-2xl animate-fade-in"
            style={{ background: '#0f0f1a', border: '1px solid #1a1a2a' }}>
            <h3 className="font-display font-semibold text-white mb-6">Semua Transaksi</h3>
            <TransactionTable refreshTrigger={refreshKey} />
          </div>
        )}
      </div>

      {/* Modals */}
      {showIncome && (
        <AddIncome
          onClose={() => setShowIncome(false)}
          onSuccess={() => setRefreshKey(k => k + 1)}
        />
      )}
      {showExpense && (
        <AddExpense
          onClose={() => setShowExpense(false)}
          onSuccess={() => setRefreshKey(k => k + 1)}
        />
      )}
    </div>
  )
}

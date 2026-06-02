import { useState, useEffect, useCallback } from 'react'
import { cashflowApi, formatRupiah } from '../services/api'

export default function TransactionTable({ refreshTrigger }) {
  const [transactions, setTransactions] = useState([])
  const [search, setSearch]             = useState('')
  const [loading, setLoading]           = useState(true)
  const [deleting, setDeleting]         = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await cashflowApi.getTransactions(search)
      setTransactions(res.data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { load() }, [load, refreshTrigger])

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await cashflowApi.deleteTransaction(id)
      setTransactions(prev => prev.filter(t => t.id !== id))
    } catch {
      // ignore
    } finally {
      setDeleting(null)
      setConfirmDelete(null)
    }
  }

  const typeColor = (type) => type === 'INCOME' ? '#63cf8b' : '#ff6b7a'
  const typeBg    = (type) => type === 'INCOME' ? 'rgba(99,207,139,0.1)' : 'rgba(255,107,122,0.1)'

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-4">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari transaksi..."
          className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder-dark-300 text-sm outline-none"
          style={{ background: '#111118', border: '1px solid #2a2a3a' }}
          onFocus={e => e.target.style.borderColor = '#5b9cf6'}
          onBlur={e => e.target.style.borderColor = '#2a2a3a'}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <svg className="w-8 h-8 animate-spin" style={{ color: '#5b9cf6' }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <p className="text-dark-300 text-sm">Memuat transaksi...</p>
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#111118', border: '1px solid #2a2a3a' }}>
            <svg className="w-8 h-8 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-white font-medium mb-1">Belum ada transaksi</p>
          <p className="text-dark-300 text-sm">{search ? 'Tidak ada hasil untuk pencarian ini' : 'Mulai catat pemasukan atau pengeluaran kamu'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((t, i) => (
            <div key={t.id}
              className="flex items-center gap-4 p-4 rounded-xl transition-all duration-150 group animate-fade-in-up"
              style={{
                background: '#0f0f1a',
                border: '1px solid #1a1a2a',
                animationDelay: `${i * 0.03}s`,
                opacity: 0,
              }}>

              {/* Type badge */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: typeBg(t.type) }}>
                {t.type === 'INCOME'
                  ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#63cf8b' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#ff6b7a' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white text-sm font-medium truncate">
                    {t.description || t.detail}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: typeBg(t.type), color: typeColor(t.type) }}>
                    {t.detail}
                  </span>
                </div>
                <p className="text-dark-300 text-xs">{t.date}</p>
              </div>

              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <p className="font-display font-semibold text-sm"
                  style={{ color: typeColor(t.type) }}>
                  {t.type === 'INCOME' ? '+' : '-'}{formatRupiah(t.amount)}
                </p>
              </div>

              {/* Delete */}
              {confirmDelete === t.id ? (
                <div className="flex gap-2 animate-fade-in">
                  <button onClick={() => handleDelete(t.id)}
                    disabled={deleting === t.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: '#ff6b7a', color: 'white' }}>
                    {deleting === t.id ? '...' : 'Hapus'}
                  </button>
                  <button onClick={() => setConfirmDelete(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-dark-300 transition-all"
                    style={{ border: '1px solid #2a2a3a' }}>
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(t.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all text-dark-300 hover:text-accent-red hover:bg-red-500/10"
                  style={{ color: '#505080' }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#ff6b7a' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

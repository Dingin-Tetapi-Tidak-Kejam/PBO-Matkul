import { useState } from 'react'
import { cashflowApi, INCOME_SOURCES } from '../services/api'

export default function AddIncome({ onClose, onSuccess }) {
  const [form, setForm]     = useState({
    amount: '', date: new Date().toISOString().split('T')[0],
    description: '', source: 'GAJI'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || parseFloat(form.amount) <= 0) {
      setError('Jumlah harus lebih dari 0'); return
    }
    setLoading(true)
    try {
      await cashflowApi.addIncome(parseFloat(form.amount), form.date, form.description, form.source)
      onSuccess?.()
      onClose()
    } catch {
      setError('Gagal menyimpan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 animate-fade-in-up"
        style={{ background: '#0f0f1a', border: '1px solid #1e2e1e' }}>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(99,207,139,0.15)' }}>
              <svg className="w-5 h-5 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#63cf8b' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="font-display font-bold text-white">Tambah Pemasukan</h2>
              <p className="text-dark-300 text-xs">Catat sumber penghasilan kamu</p>
            </div>
          </div>
          <button onClick={onClose} className="text-dark-300 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-accent-red text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-dark-100 text-sm font-medium mb-2">Jumlah (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300 text-sm font-medium">Rp</span>
              <input
                type="number" min="1"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl text-white placeholder-dark-300 text-sm outline-none"
                style={{ background: '#111118', border: '1px solid #2a2a3a' }}
                onFocus={e => e.target.style.borderColor = '#63cf8b'}
                onBlur={e => e.target.style.borderColor = '#2a2a3a'}
                required
              />
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="block text-dark-100 text-sm font-medium mb-2">Sumber</label>
            <div className="grid grid-cols-3 gap-2">
              {INCOME_SOURCES.map(src => (
                <button key={src} type="button"
                  onClick={() => setForm({ ...form, source: src })}
                  className="py-2 px-3 rounded-xl text-xs font-medium transition-all duration-150"
                  style={{
                    background: form.source === src ? 'rgba(99,207,139,0.2)' : '#111118',
                    border: `1px solid ${form.source === src ? '#63cf8b' : '#2a2a3a'}`,
                    color: form.source === src ? '#63cf8b' : '#a0a0c0',
                  }}>
                  {src.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-dark-100 text-sm font-medium mb-2">Tanggal</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none"
              style={{ background: '#111118', border: '1px solid #2a2a3a', colorScheme: 'dark' }}
              onFocus={e => e.target.style.borderColor = '#63cf8b'}
              onBlur={e => e.target.style.borderColor = '#2a2a3a'}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-dark-100 text-sm font-medium mb-2">Keterangan <span className="text-dark-300">(opsional)</span></label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="contoh: gaji bulan Mei"
              className="w-full px-4 py-3.5 rounded-xl text-white placeholder-dark-300 text-sm outline-none"
              style={{ background: '#111118', border: '1px solid #2a2a3a' }}
              onFocus={e => e.target.style.borderColor = '#63cf8b'}
              onBlur={e => e.target.style.borderColor = '#2a2a3a'}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-dark-200 text-sm font-medium transition-all hover:bg-dark-700"
              style={{ border: '1px solid #2a2a3a' }}>
              Batal
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl text-dark-900 text-sm font-semibold font-display transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #63cf8b, #3ab06a)' }}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

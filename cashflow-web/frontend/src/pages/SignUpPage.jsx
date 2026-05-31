import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../services/api'

export default function SignUpPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    if (form.username.trim().length < 3) return 'Username minimal 3 karakter'
    if (!form.email.includes('@'))       return 'Format email tidak valid'
    if (form.password.length < 6)        return 'Password minimal 6 karakter'
    if (form.password !== form.confirm)  return 'Password tidak cocok'
    return null
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    try {
      await authApi.register(form.username, form.email, form.password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Registrasi gagal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const strength = () => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 6)  s++
    if (p.length >= 10) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^a-zA-Z0-9]/.test(p)) s++
    return s
  }
  const strengthColor = ['#2a2a3a','#ff6b7a','#f5c842','#5b9cf6','#63cf8b','#63cf8b'][strength()]
  const strengthLabel = ['','Lemah','Cukup','Bagus','Kuat','Sangat Kuat'][strength()]

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
      {/* Background decorations */}
      <div className="fixed top-0 right-0 w-96 h-96 pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)' }} />
      <div className="fixed bottom-0 left-0 w-96 h-96 pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #63cf8b 0%, transparent 70%)' }} />

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #63cf8b, #5b9cf6)' }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-display font-bold text-xl text-white">CashFlow</span>
        </div>

        <div className="rounded-2xl p-8" style={{ background: '#0f0f1a', border: '1px solid #1e1e2e' }}>
          <h2 className="font-display text-2xl font-bold text-white mb-1">Buat Akun Baru</h2>
          <p className="text-dark-300 text-sm mb-8">Mulai perjalanan finansialmu hari ini</p>

          {success && (
            <div className="mb-6 px-4 py-3 rounded-xl border border-green-500/30 bg-green-500/10 text-accent-green text-sm flex items-center gap-2 animate-fade-in">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Registrasi berhasil! Mengarahkan ke login...
            </div>
          )}

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-accent-red text-sm flex items-center gap-2 animate-fade-in">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {[
              { label: 'Username', key: 'username', type: 'text', placeholder: 'min. 3 karakter' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'nama@email.com' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-dark-100 text-sm font-medium mb-2">{field.label}</label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3.5 rounded-xl text-white placeholder-dark-300 text-sm outline-none transition-all duration-200"
                  style={{ background: '#111118', border: '1px solid #2a2a3a' }}
                  onFocus={e => e.target.style.borderColor = '#63cf8b'}
                  onBlur={e => e.target.style.borderColor = '#2a2a3a'}
                  required
                />
              </div>
            ))}

            <div>
              <label className="block text-dark-100 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="min. 6 karakter"
                  className="w-full px-4 py-3.5 rounded-xl text-white placeholder-dark-300 text-sm outline-none pr-12 transition-all duration-200"
                  style={{ background: '#111118', border: '1px solid #2a2a3a' }}
                  onFocus={e => e.target.style.borderColor = '#63cf8b'}
                  onBlur={e => e.target.style.borderColor = '#2a2a3a'}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-300 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength() ? strengthColor : '#2a2a3a' }} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthColor }}>{strengthLabel}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-dark-100 text-sm font-medium mb-2">Konfirmasi Password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                placeholder="ulangi password"
                className="w-full px-4 py-3.5 rounded-xl text-white placeholder-dark-300 text-sm outline-none transition-all duration-200"
                style={{
                  background: '#111118',
                  border: `1px solid ${form.confirm && form.confirm !== form.password ? '#ff6b7a' : '#2a2a3a'}`
                }}
                onFocus={e => e.target.style.borderColor = '#63cf8b'}
                onBlur={e => e.target.style.borderColor = form.confirm && form.confirm !== form.password ? '#ff6b7a' : '#2a2a3a'}
                required
              />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-accent-red mt-1">Password tidak cocok</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 rounded-xl font-display font-semibold text-dark-900 text-sm transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{ background: 'linear-gradient(135deg, #63cf8b, #5b9cf6)' }}
            >
              {loading ? 'Mendaftarkan...' : 'Buat Akun'}
            </button>
          </form>

          <p className="text-center text-dark-300 text-sm mt-6">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-accent-green hover:underline font-medium">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

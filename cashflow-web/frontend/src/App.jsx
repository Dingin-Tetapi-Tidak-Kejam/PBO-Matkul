import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage    from './pages/LoginPage'
import SignUpPage   from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return !isLoggedIn ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login"     element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup"    element={<PublicRoute><SignUpPage /></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

'use client'

import { useState } from 'react'

export default function TestLogin() {
  const [email, setEmail] = useState('test@clipper.com')
  const [password, setPassword] = useState('test123')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<any>(null)

  const handleLogin = async () => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/clipper-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Login erfolgreich!')
        setUser(data.user)
        // Refresh the page to update auth state
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setMessage(`Fehler: ${data.error}`)
      }
    } catch (error) {
      setMessage('Login fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setMessage('Logout erfolgreich')
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      setMessage('Logout fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 border rounded-lg shadow-lg max-w-sm">
      <h3 className="font-bold mb-2">Test Login</h3>
      
      {!user ? (
        <div className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-2 py-1 border rounded text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-2 py-1 border rounded text-sm"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Login als Clipper'}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm">Eingeloggt als: <strong>{user.name}</strong></p>
          <p className="text-xs text-gray-600">{user.email}</p>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full bg-red-500 text-white py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
          >
            Logout
          </button>
        </div>
      )}
      
      {message && (
        <p className={`mt-2 text-xs ${message.includes('erfolgreich') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
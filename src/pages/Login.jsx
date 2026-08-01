
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config/api'
import './Login.css'


function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: '',
      form: '',
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    try {
      setIsLoggingIn(true)

      const response = await fetch(`${API_BASE_URL}/users`)
      if (!response.ok) {
        throw new Error('Failed to load users')
      }

      const users = await response.json()

      const matchedUser = users.find(
        (user) =>
          user.email.trim().toLowerCase() ===
            formData.email.trim().toLowerCase() &&
          user.password === formData.password,
      )

      if (!matchedUser) {
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('currentUser')

        setErrors({
          form: 'Incorrect email or password',
        })

        return
      }

      localStorage.setItem('isAuthenticated', 'true')

      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role,
        }),
      )

      navigate('/dashboard', { replace: true })
    } catch {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('currentUser')

      setErrors({
        form: 'Unable to sign in. Make sure JSON Server is running.',
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="login-page">
      <section className="login-info">
        <h1 className="login-logo">TalentFlow</h1>

        <h2>Manage recruitment from one organized dashboard</h2>

        <p>
          Track applicants, manage job openings, and follow every stage of the
          recruitment process in one place.
        </p>
      </section>

      <section className="login-form-area">
        <div className="login-card">
          <h1>Welcome back</h1>

          <p className="login-subtitle">
            Sign in to access the TalentFlow admin dashboard.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@talentflow.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
                autoComplete="email"
              />

              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'input-error' : ''}
                autoComplete="current-password"
              />

              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            {errors.form && (
 <div className="login-form-error">
    {errors.form}
  </div>            )}

            <button
              className="login-button"
              type="submit"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="login-demo">
            Use an account stored in the local API.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Login
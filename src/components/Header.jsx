import { useNavigate } from 'react-router-dom'

function Header({ onMenuClick, theme, onToggleTheme }) {
  const navigate = useNavigate()

  const storedUser = localStorage.getItem('currentUser')

  let currentUser = {
    name: 'User',
    role: 'User',
  }

  try {
    if (storedUser) {
      currentUser = JSON.parse(storedUser)
    }
  } catch {
    currentUser = {
      name: 'User',
      role: 'User',
    }
  }

  const userInitials = currentUser.name
    .split(' ')
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('currentUser')

    navigate('/login', { replace: true })
  }

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <button
          className="menu-button"
          type="button"
          aria-label="Open sidebar"
          onClick={onMenuClick}
        >
          ☰
        </button>

        <div>
          <h2>TalentFlow</h2>
          <p>Recruitment Management System</p>
        </div>
      </div>

      <div className="header-user-section">
        <button
          className="theme-button"
          type="button"
          onClick={onToggleTheme}
          aria-label="Toggle color theme"
          aria-pressed={theme === 'dark'}
        >
          <span aria-hidden="true">
            {theme === 'dark' ? '☀️' : '🌙'}
          </span>

          <span className="theme-button-text">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </span>
        </button>

        <div className="user-info">
          <div className="user-avatar">
            {userInitials}
          </div>

          <div className="user-details">
            <strong>{currentUser.name}</strong>
            <small>{currentUser.role}</small>
          </div>
        </div>

        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Header
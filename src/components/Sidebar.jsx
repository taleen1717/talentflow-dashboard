import { NavLink } from 'react-router-dom'

function Sidebar({ isOpen, onClose }) {
  const getLinkClass = ({ isActive }) => {
    return isActive
      ? 'sidebar-link active'
      : 'sidebar-link'
  }

  return (
    <aside
      className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
    >
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <h1>TalentFlow</h1>
          <p>Recruitment Dashboard</p>
        </div>

        <button
          className="close-sidebar-button"
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={getLinkClass}
          onClick={onClose}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/applicants"
          className={getLinkClass}
          onClick={onClose}
        >
          Applicants
        </NavLink>

        <NavLink
          to="/jobs"
          className={getLinkClass}
          onClick={onClose}
        >
          Jobs
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
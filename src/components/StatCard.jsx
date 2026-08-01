function StatCard({ title, value, description }) {
  return (
    <article className="stat-card">
      <p className="stat-card-title">{title}</p>
      <h2>{value}</h2>
      <p className="stat-card-description">{description}</p>
    </article>
  )
}

export default StatCard
import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import { API_BASE_URL } from '../config/api'
import './Dashboard.css'

function Dashboard() {
  const [applicants, setApplicants] = useState([])
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError('')

        const [applicantsResponse, jobsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/applicants`),
          fetch(`${API_BASE_URL}/jobs`),
        ])

        if (!applicantsResponse.ok || !jobsResponse.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const [applicantsData, jobsData] = await Promise.all([
          applicantsResponse.json(),
          jobsResponse.json(),
        ])

        setApplicants(applicantsData)
        setJobs(jobsData)
      } catch {
        setError(
          'Unable to load dashboard data. Make sure JSON Server is running.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const totalApplicants = applicants.length

  const activeApplicants = applicants.filter(
    (applicant) =>
      applicant.status !== 'Accepted' &&
      applicant.status !== 'Rejected',
  ).length

  const interviewApplicants = applicants.filter(
    (applicant) => applicant.status === 'Interview',
  ).length

  const acceptedApplicants = applicants.filter(
    (applicant) => applicant.status === 'Accepted',
  ).length

  const openJobs = jobs.filter(
    (job) => job.status === 'Open',
  ).length

  const statistics = [
    {
      id: 1,
      title: 'Total Applicants',
      value: totalApplicants,
      description: 'All submitted applications',
    },
    {
      id: 2,
      title: 'Active Pipeline',
      value: activeApplicants,
      description: 'Applicants still in progress',
    },
    {
      id: 3,
      title: 'Interviews',
      value: interviewApplicants,
      description: 'Candidates in interview stage',
    },
    {
      id: 4,
      title: 'Accepted',
      value: acceptedApplicants,
      description: 'Successful candidates',
    },
    {
      id: 5,
      title: 'Open Jobs',
      value: openJobs,
      description: 'Available job opportunities',
    },
  ]

  const statusData = [
    {
      status: 'Applied',
      value: applicants.filter(
        (applicant) => applicant.status === 'Applied',
      ).length,
    },
    {
      status: 'Screening',
      value: applicants.filter(
        (applicant) => applicant.status === 'Screening',
      ).length,
    },
    {
      status: 'Interview',
      value: applicants.filter(
        (applicant) => applicant.status === 'Interview',
      ).length,
    },
    {
      status: 'Accepted',
      value: applicants.filter(
        (applicant) => applicant.status === 'Accepted',
      ).length,
    },
    {
      status: 'Rejected',
      value: applicants.filter(
        (applicant) => applicant.status === 'Rejected',
      ).length,
    },
  ]

  const highestStatusValue = Math.max(
    ...statusData.map((item) => item.value),
    1,
  )

  if (isLoading) {
    return (
      <section className="dashboard-page">
        <div className="loading-message">
          Loading dashboard data...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="dashboard-page">
        <div className="error-message-box">
          {error}
        </div>
      </section>
    )
  }

  return (
    <section className="dashboard-page">
      <div className="page-heading">
        <h1>Dashboard</h1>
        <p>Overview of applicants and recruitment activity</p>
      </div>

      <div className="stats-grid">
        {statistics.map((statistic) => (
          <StatCard
            key={statistic.id}
            title={statistic.title}
            value={statistic.value}
            description={statistic.description}
          />
        ))}
      </div>

      <div className="status-chart-card">
        <div className="chart-heading">
          <div>
            <h2>Applicants by Status</h2>
            <p>Distribution across the recruitment pipeline</p>
          </div>

          <span>{totalApplicants} applicants</span>
        </div>

        {totalApplicants === 0 ? (
          <div className="empty-chart">
            Add applicants to display recruitment statistics.
          </div>
        ) : (
          <div className="status-chart">
            {statusData.map((item) => (
              <div className="chart-row" key={item.status}>
                <div className="chart-label">
                  <span>{item.status}</span>
                  <strong>{item.value}</strong>
                </div>

                <div className="chart-track">
                  <div
                    className={`chart-bar chart-bar-${item.status.toLowerCase()}`}
                    style={{
                      width: `${
                        (item.value / highestStatusValue) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Dashboard
import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config/api'
import './Jobs.css'

const emptyJobForm = {
  title: '',
  department: '',
  type: 'Full-time',
  location: '',
  status: 'Open',
}

function Jobs() {
  const [jobs, setJobs] = useState([])
  const [formData, setFormData] = useState(emptyJobForm)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true)
        setError('')

        const response = await fetch(`${API_BASE_URL}/jobs`)

        if (!response.ok) {
          throw new Error('Failed to load jobs')
        }

        const data = await response.json()
        setJobs(data)
      } catch {
        setError(
          'Unable to load jobs. Make sure JSON Server is running.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: '',
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required'
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setFormData(emptyJobForm)
    setErrors({})
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSaving(true)
      setError('')

      const requestUrl = editingId
  ? `${API_BASE_URL}/jobs/${editingId}`
  : `${API_BASE_URL}/jobs`

      const requestMethod = editingId ? 'PATCH' : 'POST'

      const response = await fetch(requestUrl, {
        method: requestMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save job')
      }

      const savedJob = await response.json()

      if (editingId) {
        setJobs((previousJobs) =>
          previousJobs.map((job) =>
            String(job.id) === String(editingId)
              ? savedJob
              : job,
          ),
        )
      } else {
        setJobs((previousJobs) => [
          ...previousJobs,
          savedJob,
        ])
      }

      resetForm()
    } catch {
      setError(
        'Unable to save job. Make sure JSON Server is running.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (job) => {
    setEditingId(job.id)

    setFormData({
      title: job.title,
      department: job.department,
      type: job.type,
      location: job.location,
      status: job.status,
    })

    setErrors({})
    setError('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleDelete = async (jobId) => {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this job?',
    )

    if (!shouldDelete) {
      return
    }

    try {
      setError('')

     const response = await fetch(
  `${API_BASE_URL}/jobs/${jobId}`,
  {
    method: 'DELETE',
  },
)

      if (!response.ok) {
        throw new Error('Failed to delete job')
      }

      setJobs((previousJobs) =>
        previousJobs.filter(
          (job) => String(job.id) !== String(jobId),
        ),
      )

      if (String(editingId) === String(jobId)) {
        resetForm()
      }
    } catch {
      setError(
        'Unable to delete job. Make sure JSON Server is running.',
      )
    }
  }

  return (
    <section className="jobs-page">
      <div className="jobs-heading">
        <h1>Jobs</h1>
        <p>Manage available jobs and internship opportunities</p>
      </div>

      {error && (
        <div className="jobs-error-message">
          {error}
        </div>
      )}

      <div className="job-form-card">
        <h2>
          {editingId ? 'Edit Job' : 'Add New Job'}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="job-form-grid">
            <div className="job-form-group">
              <label htmlFor="title">Job title</label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="Frontend Developer"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'input-error' : ''}
              />

              {errors.title && (
                <span className="job-field-error">
                  {errors.title}
                </span>
              )}
            </div>

            <div className="job-form-group">
              <label htmlFor="department">Department</label>

              <input
                id="department"
                name="department"
                type="text"
                placeholder="Engineering"
                value={formData.department}
                onChange={handleChange}
                className={
                  errors.department ? 'input-error' : ''
                }
              />

              {errors.department && (
                <span className="job-field-error">
                  {errors.department}
                </span>
              )}
            </div>

            <div className="job-form-group">
              <label htmlFor="type">Employment type</label>

              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="job-form-group">
              <label htmlFor="location">Location</label>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="Jeddah"
                value={formData.location}
                onChange={handleChange}
                className={
                  errors.location ? 'input-error' : ''
                }
              />

              {errors.location && (
                <span className="job-field-error">
                  {errors.location}
                </span>
              )}
            </div>

            <div className="job-form-group">
              <label htmlFor="status">Job status</label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="job-form-actions">
            <button
              className="save-job-button"
              type="submit"
              disabled={isSaving}
            >
              {isSaving
                ? 'Saving...'
                : editingId
                  ? 'Update Job'
                  : 'Add Job'}
            </button>

            {editingId && (
              <button
                className="cancel-job-button"
                type="button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="jobs-table-card">
        <h2>Jobs List</h2>

        {isLoading ? (
          <div className="jobs-loading">
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="jobs-empty">
            No jobs yet.
          </div>
        ) : (
          <div className="jobs-table-wrapper">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="job-title">
                      {job.title}
                    </td>

                    <td>{job.department}</td>
                    <td>{job.type}</td>
                    <td>{job.location}</td>

                    <td>
                      <span
                        className={`job-status job-status-${job.status.toLowerCase()}`}
                      >
                        {job.status}
                      </span>
                    </td>

                    <td>
                      <div className="job-table-actions">
                        <button
                          className="job-edit-button"
                          type="button"
                          onClick={() => handleEdit(job)}
                        >
                          Edit
                        </button>

                        <button
                          className="job-delete-button"
                          type="button"
                          onClick={() =>
                            handleDelete(job.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default Jobs
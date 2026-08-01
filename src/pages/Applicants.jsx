import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config/api'
import './Applicants.css'

const emptyForm = {
  name: '',
  email: '',
  jobId: '',
  position: '',
  status: 'Applied',
}

const APPLICANTS_PER_PAGE = 5

function Applicants() {
  const [applicants, setApplicants] = useState([])
  const [jobs, setJobs] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true)
        setError('')

        const [applicantsResponse, jobsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/applicants`),
          fetch(`${API_BASE_URL}/jobs`),
        ])

        if (!applicantsResponse.ok || !jobsResponse.ok) {
          throw new Error('Failed to load data')
        }

        const [applicantsData, jobsData] = await Promise.all([
          applicantsResponse.json(),
          jobsResponse.json(),
        ])

        setApplicants(applicantsData)
        setJobs(jobsData)
      } catch {
        setError(
          'Unable to load data. Make sure JSON Server is running.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchPageData()
  }, [])

  const openJobs = jobs.filter((job) => job.status === 'Open')

  const filteredApplicants = applicants.filter((applicant) => {
    const searchValue = searchTerm.toLowerCase().trim()

    const applicantName = String(
      applicant.name || '',
    ).toLowerCase()

    const applicantEmail = String(
      applicant.email || '',
    ).toLowerCase()

    const applicantPosition = String(
      applicant.position || '',
    ).toLowerCase()

    const matchesSearch =
      applicantName.includes(searchValue) ||
      applicantEmail.includes(searchValue) ||
      applicantPosition.includes(searchValue)

    const matchesStatus =
      statusFilter === 'All' ||
      applicant.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(
    filteredApplicants.length / APPLICANTS_PER_PAGE,
  )

  const safeCurrentPage = Math.min(
    currentPage,
    Math.max(totalPages, 1),
  )

  const firstApplicantIndex =
    (safeCurrentPage - 1) * APPLICANTS_PER_PAGE

  const paginatedApplicants = filteredApplicants.slice(
    firstApplicantIndex,
    firstApplicantIndex + APPLICANTS_PER_PAGE,
  )

  const selectedJobIsOpen = openJobs.some(
    (job) => String(job.id) === String(formData.jobId),
  )

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'jobId') {
      const selectedJob = jobs.find(
        (job) => String(job.id) === String(value),
      )

      setFormData((previousData) => ({
        ...previousData,
        jobId: value,
        position: selectedJob ? selectedJob.title : '',
      }))

      setErrors((previousErrors) => ({
        ...previousErrors,
        jobId: '',
      }))

      return
    }

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

    const trimmedName = formData.name.trim()
    const trimmedEmail = formData.email.trim()

    const namePattern = /^[\p{L}\s'-]+$/u
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!trimmedName) {
      newErrors.name = 'Applicant name is required'
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    } else if (!namePattern.test(trimmedName)) {
      newErrors.name = 'Name must contain letters only'
    }

    if (!trimmedEmail) {
      newErrors.email = 'Email is required'
    } else if (!emailPattern.test(trimmedEmail)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!formData.jobId) {
      newErrors.jobId = 'Please select a job'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setFormData(emptyForm)
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
        ? `${API_BASE_URL}/applicants/${editingId}`
        : `${API_BASE_URL}/applicants`

      const requestMethod = editingId ? 'PATCH' : 'POST'

      const response = await fetch(requestUrl, {
        method: requestMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save applicant')
      }

      const savedApplicant = await response.json()

      if (editingId) {
        setApplicants((previousApplicants) =>
          previousApplicants.map((applicant) =>
            String(applicant.id) === String(editingId)
              ? savedApplicant
              : applicant,
          ),
        )
      } else {
        setApplicants((previousApplicants) => [
          ...previousApplicants,
          savedApplicant,
        ])
      }

      resetForm()
    } catch {
      setError(
        'Unable to save applicant. Make sure JSON Server is running.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (applicant) => {
    setEditingId(applicant.id)

    setFormData({
      name: applicant.name || '',
      email: applicant.email || '',
      jobId: applicant.jobId
        ? String(applicant.jobId)
        : '',
      position: applicant.position || '',
      status: applicant.status || 'Applied',
    })

    setErrors({})
    setError('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleDelete = async (applicantId) => {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this applicant?',
    )

    if (!shouldDelete) {
      return
    }

    try {
      setError('')

      const response = await fetch(
        `${API_BASE_URL}/applicants/${applicantId}`,
        {
          method: 'DELETE',
        },
      )

      if (!response.ok) {
        throw new Error('Failed to delete applicant')
      }

      setApplicants((previousApplicants) =>
        previousApplicants.filter(
          (applicant) =>
            String(applicant.id) !== String(applicantId),
        ),
      )

      if (String(editingId) === String(applicantId)) {
        resetForm()
      }
    } catch {
      setError(
        'Unable to delete applicant. Make sure JSON Server is running.',
      )
    }
  }

  return (
    <section className="applicants-page">
      <div className="applicants-heading">
        <h1>Applicants</h1>
        <p>Manage job and internship applicants</p>
      </div>

      {error && (
        <div className="applicants-error-message">
          {error}
        </div>
      )}

      <div className="applicant-form-card">
        <h2>
          {editingId
            ? 'Edit Applicant'
            : 'Add New Applicant'}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="applicant-form-grid">
            <div className="applicant-form-group">
              <label htmlFor="name">Full name</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter applicant name"
                value={formData.name}
                onChange={handleChange}
                className={
                  errors.name ? 'input-error' : ''
                }
              />

              {errors.name && (
                <span className="field-error">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="applicant-form-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className={
                  errors.email ? 'input-error' : ''
                }
              />

              {errors.email && (
                <span className="field-error">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="applicant-form-group">
              <label htmlFor="jobId">Position</label>

              <select
                id="jobId"
                name="jobId"
                value={formData.jobId}
                onChange={handleChange}
                className={
                  errors.jobId ? 'input-error' : ''
                }
                disabled={
                  openJobs.length === 0 && !editingId
                }
              >
                <option value="">
                  Select an open job
                </option>

                {editingId &&
                  formData.jobId &&
                  !selectedJobIsOpen && (
                    <option value={formData.jobId}>
                      {formData.position} — Closed
                    </option>
                  )}

                {openJobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} — {job.department}
                  </option>
                ))}
              </select>

              {errors.jobId && (
                <span className="field-error">
                  {errors.jobId}
                </span>
              )}

              {openJobs.length === 0 && !editingId && (
                <span className="field-help">
                  Add an open job from the Jobs page first.
                </span>
              )}
            </div>

            <div className="applicant-form-group">
              <label htmlFor="status">
                Application status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Applied">Applied</option>
                <option value="Screening">
                  Screening
                </option>
                <option value="Interview">
                  Interview
                </option>
                <option value="Accepted">
                  Accepted
                </option>
                <option value="Rejected">
                  Rejected
                </option>
              </select>
            </div>
          </div>

          <div className="applicant-form-actions">
            <button
              className="add-applicant-button"
              type="submit"
              disabled={
                isSaving ||
                (openJobs.length === 0 && !editingId)
              }
            >
              {isSaving
                ? 'Saving...'
                : editingId
                  ? 'Update Applicant'
                  : 'Add Applicant'}
            </button>

            {editingId && (
              <button
                className="cancel-edit-button"
                type="button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="applicants-tools">
        <div className="applicants-search">
          <label htmlFor="applicantSearch">
            Search applicants
          </label>

          <input
            id="applicantSearch"
            type="search"
            placeholder="Search by name, email, or position"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value)
              setCurrentPage(1)
            }}
          />
        </div>

        <div className="applicants-filter">
          <label htmlFor="statusFilter">
            Filter by status
          </label>

          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="All">All statuses</option>
            <option value="Applied">Applied</option>
            <option value="Screening">Screening</option>
            <option value="Interview">Interview</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="applicants-card">
        <h2>Applicants List</h2>

        {isLoading ? (
          <div className="loading-box">
            Loading applicants...
          </div>
        ) : applicants.length === 0 ? (
          <div className="empty-box">
            No applicants yet.
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="empty-box">
            No applicants match your search or filter.
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="applicants-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedApplicants.map((applicant) => (
                  <tr key={applicant.id}>
                    <td>{applicant.name}</td>
                    <td>{applicant.email}</td>
                    <td>{applicant.position}</td>
                    <td>{applicant.status}</td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="edit-button"
                          type="button"
                          onClick={() =>
                            handleEdit(applicant)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          type="button"
                          onClick={() =>
                            handleDelete(applicant.id)
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

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  type="button"
                  className="pagination-button"
                  disabled={safeCurrentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      safeCurrentPage - 1,
                    )
                  }
                >
                  Previous
                </button>

                <div className="pagination-pages">
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={
                        safeCurrentPage === pageNumber
                          ? 'pagination-number active'
                          : 'pagination-number'
                      }
                      onClick={() =>
                        setCurrentPage(pageNumber)
                      }
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="pagination-button"
                  disabled={
                    safeCurrentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      safeCurrentPage + 1,
                    )
                  }
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default Applicants
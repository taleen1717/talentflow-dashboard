# TalentFlow

TalentFlow is a responsive recruitment management dashboard built with React.

It helps HR teams manage job openings, track applicants through different recruitment stages, and view recruitment statistics from one organized interface.

## Features

### Authentication

- Login form with validation
- Authentication using a local Mock API
- Protected dashboard routes
- Logout functionality
- Dynamic user information
- Login state stored in Local Storage

### Dashboard

- Dynamic recruitment statistics
- Total applicants
- Active pipeline applicants
- Interview candidates
- Accepted candidates
- Open job opportunities
- Applicant status visualization chart

### Applicant Management

- View applicants in a responsive table
- Add new applicants
- Edit existing applicants
- Delete applicants
- Link applicants to available jobs
- Search by name, email, or position
- Filter applicants by status
- Pagination
- Form validation
- Loading, empty, and error states

### Job Management

- View available jobs
- Add new jobs
- Edit job information
- Delete jobs
- Open or close job opportunities
- Link open jobs to applicant forms

### User Interface

- Responsive dashboard layout
- Header and sidebar navigation
- Mobile sidebar menu
- Dark and light modes
- Theme preference stored in Local Storage
- Responsive tables and forms
- Accessible form labels and buttons

## Technologies Used

- React
- JavaScript ES6+
- JSX
- CSS
- React Router
- React Hooks
  - `useState`
  - `useEffect`
- Fetch API
- JSON Server
- Local Storage
- Vite
- ESLint

## Project Structure

```text
talentflow-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── DashboardLayout.jsx
│   │   ├── Header.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   └── layout.css
│   │
│   ├── config/
│   │   └── api.js
│   │
│   ├── pages/
│   │   ├── Applicants.jsx
│   │   ├── Applicants.css
│   │   ├── Dashboard.jsx
│   │   ├── Dashboard.css
│   │   ├── Jobs.jsx
│   │   ├── Jobs.css
│   │   ├── Login.jsx
│   │   └── Login.css
│   │
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── theme.css
│
├── db.json
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

Make sure Node.js and npm are installed on your device.

### Installation

Clone the repository:

```bash
git clone https://github.com/taleen1717/talentflow-dashboard.git```

Open the project directory:

```bash
cd talentflow-dashboard
```

Install the dependencies:

```bash
npm install
```

## Running the Project

TalentFlow requires two terminals.

### Terminal 1 — Start the React Application

```bash
npm run dev
```

The application will usually run at:

```text
http://localhost:5173
```

### Terminal 2 — Start the Mock API

```bash
npx json-server db.json --port 3001
```

The API will run at:

```text
http://localhost:3001
```

## API Endpoints

```text
GET /users
GET /applicants
POST /applicants
PATCH /applicants/:id
DELETE /applicants/:id

GET /jobs
POST /jobs
PATCH /jobs/:id
DELETE /jobs/:id
```

Full local endpoints:

```text
http://localhost:3001/users
http://localhost:3001/applicants
http://localhost:3001/jobs
```

## Demo Account

```text
Email: admin@talentflow.com
Password: 123456
```

## Available Routes

```text
/login
/dashboard
/applicants
/jobs
```

## Production Build

Check the project code:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Validation Rules

The applicant form validates:

- Required applicant name
- Minimum name length
- Names containing letters only
- Valid email format
- Required job selection

The login form validates:

- Required email
- Valid email format
- Required password
- Correct account credentials

## Important Note

This project uses JSON Server as a local Mock API for educational and demonstration purposes.

In a real production system:

- Authentication should be handled by a secure backend.
- Passwords should be encrypted.
- Authorization should be verified on the server.
- A production database should replace `db.json`.

## Author

**Taleen Hani**

Computer Science Student  
Interested in Software Engineering and Front-End Development
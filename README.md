# HireFlow - Recruitment Platform

A full-stack recruitment portal built with **Angular + ASP.NET Core + MongoDB**.

## Team
- Student: 2502097 (2502097@students.au.edu.pk)

## Tech Stack
- **Frontend**: Angular 17 + TypeScript + HTML + CSS
- **Backend**: ASP.NET Core 8 Web API (C#)
- **Database**: MongoDB

## Feature
- JWT Authentication (Login/Signup with roles: Candidate, Employer, Admin)
- 6+ dynamic pages with Angular Routing
- Reactive Forms with validation
- CRUD for Jobs, Applications, Companies, Users
- Candidate Dashboard (track applications)
- Employer Dashboard (post jobs, manage applicants)
- Admin Panel (manage all users and jobs)
- Seeded demo data on first run

## Setup Instructions

### Prerequisites
- [Node.js 18+](https://nodejs.org)
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running on port 27017
- Angular CLI: `npm install -g @angular/cli`

### 1. Start MongoDB
Make sure MongoDB is running locally on `mongodb://localhost:27017`

On Windows, MongoDB usually runs as a service. Check via:
```
services.msc  → look for "MongoDB"
```
Or start manually:
```
mongod --dbpath C:\data\db
```

### 2. Start the Backend
```bash
cd backend
dotnet restore
dotnet run
```
Backend runs at: **http://localhost:5000**
Swagger UI: **http://localhost:5000/swagger**

The backend will automatically seed demo data on first run.

### 3. Start the Frontend
```bash
cd frontend
npm install
ng serve
```
Frontend runs at: **http://localhost:4200**

## Demo Accounts (auto-seeded)

| Role      | Email                        | Password        |
|-----------|------------------------------|-----------------|
| Candidate | candidate@example.com        | Candidate@123   |
| Employer  | employer@techcorp.com        | Employer@123    |
| Employer2 | employer@finance.com         | Employer@123    |
| Admin     | admin@recruitment.com        | Admin@123       |

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login (returns JWT)
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - List all open jobs (public)
- `GET /api/jobs/{id}` - Get job detail
- `POST /api/jobs` - Create job (employer)
- `PUT /api/jobs/{id}` - Update job
- `DELETE /api/jobs/{id}` - Delete job
- `GET /api/jobs/employer/my-jobs` - Employer's jobs


- `POST /api/applications/jobs/{jobId}/apply` - Apply to job
- `GET /api/applications/my` - My applications
- `GET /api/applications/jobs/{jobId}` - Job applicants
- `PUT /api/applications/{id}/status` - Update status
- `DELETE /api/applications/{id}` - Withdraw

### Companies / Candidates
- `GET /api/companies` - List companies
- `GET /api/companies/me` - My company (employer)
- `PUT /api/companies/me` - Update company
- `GET /api/companies/me/dashboard` - Employer dashboard stats
- `GET /api/candidates/me` - My profile (candidate)
- `PUT /api/candidates/me` - Update profile

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - All users
- `PUT /api/admin/users/{id}/status` - Activate/deactivate user
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/jobs` - All jobs
- `DELETE /api/admin/jobs/{id}` - Delete job

## Project Structure
```
db proj/
├── backend/                    # ASP.NET Core Web API
│   ├── Controllers/            # API Controllers
│   ├── Models/                 # MongoDB document models
│   ├── DTOs/                   # Data Transfer Objects
│   ├── Services/               # MongoDB service, Auth, Seeder
│   ├── Program.cs              # App configuration
│   └── appsettings.json        # Config (MongoDB, JWT)
├── frontend/                   # Angular 17 app
│   └── src/app/
│       ├── pages/              # Home, Auth, Jobs, Dashboards, Admin
│       ├── components/         # Navbar
│       ├── services/           # API services
│       ├── guards/             # Auth & role guards
│       ├── interceptors/       # JWT interceptor
│       └── models/             # TypeScript interfaces
└── README.md
```

# SecureAccess — Enterprise Visitor Management System

> A secure, role-based visitor management platform for organizations to manage visitor registration, approvals, check-ins, check-outs, employees, users, reports, and activity logs from a centralized web application.

## Overview

**SecureAccess — Enterprise Visitor Management System** is a full-stack MERN application designed to simplify and digitize visitor management within an organization.

The system provides role-based access for:

- Administrator
- Receptionist
- Employee

### Visitor Lifecycle

```text
Visitor Registration
        ↓
      Pending
        ↓
 Employee Approval
    ↙          ↘
Approved      Rejected
    ↓
Checked-In
    ↓
Checked-Out
```

## Objectives

- Digitize visitor registration.
- Reduce manual visitor management.
- Provide role-based access control.
- Allow employees to approve or reject visitor requests.
- Allow receptionists to manage visitor check-in/check-out.
- Provide administrators with complete system visibility.
- Maintain visitor history.
- Track important system activities.
- Provide reports and analytics.
- Provide responsive desktop, tablet, and mobile UI.

## Features

### Authentication & Authorization

- Secure login
- JWT authentication
- bcrypt password hashing
- Protected frontend routes
- Protected backend APIs
- Role-based access control
- Logout

### Administrator

Can:

- Access administrator dashboard
- View all visitors
- Register visitors
- View visitor details
- Manage employees
- Manage users
- View reports
- View activity logs
- Approve/reject visitors when applicable
- Check visitors in/out when applicable
- Activate/deactivate users
- Manage system access

### Receptionist

Can:

- Access receptionist dashboard
- Register visitors
- View/search/filter visitors
- View visitor details
- Check visitors in
- Check visitors out
- View visitor history

Cannot:

- Manage users
- Manage employees
- Access administrator-only reports
- Access activity logs
- Change system-level settings

### Employee

Can:

- Access employee dashboard
- View visitor requests
- View assigned visitors
- View visitor details
- Approve visitor requests
- Reject visitor requests
- View visitor history

Cannot:

- Register/check-in/check-out visitors as a receptionist
- Manage users
- Manage employees
- Access administrator reports
- Access activity logs
- Manage system settings

## Main Modules

### 1. Authentication

```text
User
  ↓
Login
  ↓
POST /api/auth/login
  ↓
Validate Credentials
  ↓
Generate JWT
  ↓
Return User + Token
  ↓
Frontend Auth Context
  ↓
Protected Routes
  ↓
Role-Based Dashboard
```

### 2. Dashboard

Role-specific dashboards provide relevant information such as:

- Total visitors
- Pending requests
- Currently checked-in visitors
- Completed visits
- Recent visitors
- Visitor activity
- Recent system activity

### 3. Visitor Management

Visitor information can include:

- Visitor Name
- Phone
- Email
- Company
- Purpose of Visit
- Host Employee
- Visit Date
- Expected Arrival
- Check-In Time
- Check-Out Time
- Status
- Remarks

### Visitor Statuses

```text
Pending
Approved
Rejected
Checked-In
Checked-Out
Cancelled
```

### 4. Visitor Registration

```text
Register Visitor
      ↓
Visitor Created
      ↓
Status = Pending
      ↓
Employee Reviews Request
```

### 5. Visitor Approval

```text
Pending
 ├── Approve
 │      ↓
 │   Approved
 │
 └── Reject
        ↓
     Rejected
```

### 6. Visitor Check-In

```text
Approved
    ↓
Check-In
    ↓
Checked-In
```

### 7. Visitor Check-Out

```text
Checked-In
    ↓
Check-Out
    ↓
Checked-Out
```

### 8. Employee Management

Administrators can:

- Create employees
- View employees
- View employee details
- Update employees
- Activate employees
- Deactivate employees

Employee information includes:

- Employee ID
- Name
- Email
- Phone
- Department
- Designation
- Status

### 9. User Management

Administrators can:

- Create users
- View users
- Update users
- Activate users
- Deactivate users
- Reset passwords
- Delete users

Supported roles:

```text
Administrator
Receptionist
Employee
```

### 10. Reports

Reports can contain:

- Total visits
- Approved visits
- Rejected visits
- Checked-in visitors
- Checked-out visitors
- Visitor trends
- Employee-wise visitor activity
- Status-wise visitor activity

### 11. Activity Logs

Important actions can include:

```text
CREATE_VISITOR
UPDATE_VISITOR
APPROVE_VISITOR
REJECT_VISITOR
CHECK_IN
CHECK_OUT
CANCEL_VISITOR

CREATE_USER
UPDATE_USER
ACTIVATE_USER
DEACTIVATE_USER

CREATE_EMPLOYEE
UPDATE_EMPLOYEE
ACTIVATE_EMPLOYEE
DEACTIVATE_EMPLOYEE
```

## Architecture

```text
┌───────────────────────────────┐
│          React Frontend       │
│                               │
│ Pages / Components / Context  │
│ Hooks / Routes / Services     │
│ Utils                         │
└───────────────┬───────────────┘
                │
              Axios
                │
                ↓
┌───────────────────────────────┐
│       Express REST API        │
│                               │
│ Routes / Middleware           │
│ Controllers                   │
└───────────────┬───────────────┘
                │
             Mongoose
                │
                ↓
┌───────────────────────────────┐
│           MongoDB             │
│                               │
│ Users / Employees             │
│ Visitors / Activity Logs      │
└───────────────────────────────┘
```

## Technology Stack

### Frontend

- React
- Vite
- React Router DOM
- Axios
- Lucide React
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcrypt

### Development & Deployment

- Git
- GitHub
- Nodemon
- npm
- Vercel / Netlify
- MongoDB / MongoDB Atlas

## Project Structure

```text
secureaccess-visitor-management/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── visitor/
│   │   │   ├── employee/
│   │   │   ├── dashboard/
│   │   │   ├── report/
│   │   │   └── activityLog/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useFetch.js
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── admin/
│   │   │   ├── receptionist/
│   │   │   └── employee/
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.api.js
│   │   │   ├── employee.api.js
│   │   │   ├── visitor.api.js
│   │   │   ├── dashboard.api.js
│   │   │   ├── report.api.js
│   │   │   └── activityLog.api.js
│   │   ├── utils/
│   │   │   ├── auth.js
│   │   │   ├── role.js
│   │   │   ├── formatDate.js
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── employee.controller.js
│   │   │   ├── visitor.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   ├── report.controller.js
│   │   │   └── activityLog.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── role.middleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Employee.js
│   │   │   ├── Visitor.js
│   │   │   └── ActivityLog.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── employee.routes.js
│   │   │   ├── visitor.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   ├── report.routes.js
│   │   │   └── activityLog.routes.js
│   │   ├── seed/
│   │   │   └── admin.seed.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
└── LICENSE
```

## Getting Started

### Prerequisites

Install:

- Node.js
- npm
- MongoDB
- Git

Verify:

```bash
node --version
npm --version
git --version
```

### Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd secureaccess-visitor-management
```

## Backend Setup

```bash
cd backend
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Windows:

```bash
copy .env.example .env
```

### Backend Environment

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/visitor_management

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=admin@company.com
ADMIN_PASSWORD=your_admin_password_here

CLIENT_URL=http://localhost:5173
```

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `NODE_ENV` | Application environment |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `JWT_EXPIRES_IN` | JWT expiration time |
| `ADMIN_EMAIL` | Initial administrator email |
| `ADMIN_PASSWORD` | Initial administrator password |
| `CLIENT_URL` | Frontend URL allowed by backend |

### Create Initial Administrator

```bash
npm run seed:admin
```

### Run Backend

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Backend:

```text
http://localhost:5000
```

API:

```text
http://localhost:5000/api
```

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Windows:

```bash
copy .env.example .env
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Run Frontend

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Run Complete Application

### Terminal 1

```bash
cd backend
npm run dev
```

### Terminal 2

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

## Role-Based Access

| Feature | Administrator | Receptionist | Employee |
|---|:---:|:---:|:---:|
| Dashboard | ✅ | ✅ | ✅ |
| View Visitors | ✅ | ✅ | ✅* |
| Register Visitor | ✅ | ✅ | ❌ |
| Approve Visitor | ✅ | ❌ | ✅ |
| Reject Visitor | ✅ | ❌ | ✅ |
| Check-In | ✅ | ✅ | ❌ |
| Check-Out | ✅ | ✅ | ❌ |
| Employees | ✅ | ❌ | ❌ |
| Users | ✅ | ❌ | ❌ |
| Reports | ✅ | ❌ | ❌ |
| Activity Logs | ✅ | ❌ | ❌ |
| System Management | ✅ | ❌ | ❌ |

`*` Employee access is limited to visitors/requests relevant to that employee.

Backend authorization is the actual security layer. Frontend navigation visibility does not replace backend authorization.

## API Documentation

### Base URL

Development:

```text
http://localhost:5000/api
```

Production:

```text
https://YOUR_BACKEND_DOMAIN/api
```

### Authentication

#### Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "admin@company.com",
  "password": "your_password"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "email": "admin@company.com",
    "role": "admin"
  }
}
```

Authenticated requests use:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Employee APIs

| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/api/employees` | Admin |
| `GET` | `/api/employees/:id` | Admin |
| `POST` | `/api/employees` | Admin |
| `PUT` | `/api/employees/:id` | Admin |
| `DELETE` | `/api/employees/:id` | Admin |

Example create request:

```json
{
  "employeeId": "EMP001",
  "name": "John Doe",
  "email": "john@company.com",
  "phone": "9876543210",
  "department": "Engineering",
  "designation": "Software Engineer"
}
```

### Visitor APIs

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/visitors` | List visitors |
| `GET` | `/api/visitors/:id` | Get visitor |
| `POST` | `/api/visitors` | Register visitor |
| `PUT` | `/api/visitors/:id` | Update visitor |
| `DELETE` | `/api/visitors/:id` | Delete visitor |
| `PATCH` | `/api/visitors/:id/approve` | Approve visitor |
| `PATCH` | `/api/visitors/:id/reject` | Reject visitor |
| `PATCH` | `/api/visitors/:id/check-in` | Check in |
| `PATCH` | `/api/visitors/:id/check-out` | Check out |

Example:

```json
{
  "visitorName": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "company": "Example Company",
  "employee": "EMPLOYEE_ID",
  "purpose": "Business Meeting",
  "visitDate": "2026-08-20",
  "expectedArrival": "10:30",
  "remarks": "Meeting with engineering team"
}
```

### Dashboard API

```http
GET /api/dashboard
```

Returns dashboard statistics for the authenticated user's role.

### Reports

```http
GET /api/reports/visitors
```

Examples:

```text
GET /api/reports/visitors?status=Approved
GET /api/reports/visitors?from=2026-08-01&to=2026-08-31
```

**Access:** Administrator

### Activity Logs

```http
GET /api/activity-logs
```

Examples:

```text
GET /api/activity-logs?page=1&limit=20
GET /api/activity-logs?action=CHECK_IN
GET /api/activity-logs?module=Visitor
```

**Access:** Administrator

### Response Convention

Success:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

## Testing Checklist

### Authentication

- [ ] Login works
- [ ] Invalid credentials are rejected
- [ ] JWT is generated
- [ ] Protected routes require authentication
- [ ] Logout works
- [ ] Unauthorized users cannot access restricted routes

### Administrator

- [ ] Dashboard works
- [ ] Visitors work
- [ ] Employees work
- [ ] Users work
- [ ] Reports work
- [ ] Activity logs work

### Receptionist

- [ ] Dashboard works
- [ ] Visitor registration works
- [ ] Visitor search works
- [ ] Visitor filtering works
- [ ] Check-in works
- [ ] Check-out works

### Employee

- [ ] Dashboard works
- [ ] Visitor requests work
- [ ] Approve works
- [ ] Reject works
- [ ] Visitor details work

### Visitor Lifecycle

- [ ] Visitor can be registered
- [ ] Visitor starts as Pending
- [ ] Employee can approve
- [ ] Employee can reject
- [ ] Approved visitor can check in
- [ ] Checked-in visitor can check out
- [ ] Activity is logged

### Responsive UI

- [ ] Desktop
- [ ] Laptop
- [ ] Tablet
- [ ] Mobile

## Deployment

### Frontend

The React frontend can be deployed using Vercel or Netlify.

Build:

```bash
npm run build
```

Production environment:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Backend

Deploy the Express backend to a Node.js-compatible hosting platform.

Production environment:

```env
NODE_ENV=production

PORT=5000

MONGO_URI=YOUR_PRODUCTION_MONGODB_URI

JWT_SECRET=YOUR_PRODUCTION_JWT_SECRET

JWT_EXPIRES_IN=7d

ADMIN_EMAIL=YOUR_ADMIN_EMAIL

ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD

CLIENT_URL=https://your-frontend-domain.com
```

### MongoDB

Local development:

```text
mongodb://127.0.0.1:27017/visitor_management
```

For production, use a hosted MongoDB database and configure:

```env
MONGO_URI=YOUR_PRODUCTION_MONGODB_URI
```

Never commit production database credentials.

## Security

- Passwords are hashed using bcrypt.
- Authentication uses JWT.
- Protected APIs require authentication.
- Role-based authorization is enforced on the backend.
- Sensitive configuration is stored in environment variables.
- `.env` files are excluded from Git.
- Important operations can be tracked through activity logs.
- Frontend role-based navigation does not replace backend authorization.

## Responsive Design

The application supports:

- Desktop
- Laptop
- Tablet
- Mobile

Tables, forms, cards, filters, modals, and dashboards adapt to smaller screen sizes.

## UI / Design System

The application follows a professional enterprise SaaS design with:

- Indigo / purple primary accent
- White cards
- Light blue-gray backgrounds
- Subtle grid background
- Soft shadows
- Thin borders
- Rounded cards
- Clean typography
- Responsive tables
- Status badges
- Consistent iconography
- Role-based navigation

## Visitor Status Reference

| Status | Meaning |
|---|---|
| `Pending` | Waiting for employee approval |
| `Approved` | Employee approved the visit |
| `Rejected` | Employee rejected the visit |
| `Checked-In` | Visitor has entered the facility |
| `Checked-Out` | Visitor has completed the visit |
| `Cancelled` | Visit was cancelled |

## Activity Log Reference

| Action | Description |
|---|---|
| `CREATE_VISITOR` | Visitor registered |
| `UPDATE_VISITOR` | Visitor details updated |
| `APPROVE_VISITOR` | Visitor approved |
| `REJECT_VISITOR` | Visitor rejected |
| `CHECK_IN` | Visitor checked in |
| `CHECK_OUT` | Visitor checked out |
| `CANCEL_VISITOR` | Visitor cancelled |
| `CREATE_USER` | User created |
| `UPDATE_USER` | User updated |
| `ACTIVATE_USER` | User activated |
| `DEACTIVATE_USER` | User deactivated |
| `CREATE_EMPLOYEE` | Employee created |
| `UPDATE_EMPLOYEE` | Employee updated |

## NPM Scripts

### Backend

```bash
npm run dev
npm start
npm run seed:admin
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

## Troubleshooting

### MongoDB connection error

Check:

```env
MONGO_URI=mongodb://127.0.0.1:27017/visitor_management
```

Make sure MongoDB is running.

### Frontend cannot connect to backend

Check:

```env
VITE_API_URL=http://localhost:5000/api
```

Verify that the backend is running.

### CORS error

Check:

```env
CLIENT_URL=http://localhost:5173
```

For production, use the deployed frontend URL.

### Login does not work

Check:

1. MongoDB is running.
2. Backend is running.
3. Admin account has been seeded.
4. `MONGO_URI` is correct.
5. `JWT_SECRET` exists.
6. Frontend `VITE_API_URL` is correct.

Run:

```bash
npm run seed:admin
```

if the administrator account has not been created.

## Environment Security

Never commit:

```text
.env
.env.local
.env.development
.env.production
```

Commit only:

```text
.env.example
```

Recommended `.gitignore`:

```gitignore
node_modules/
.env
.env.local
.env.development
.env.production
dist/
build/
coverage/
*.log
.DS_Store
```

Never expose:

- MongoDB credentials
- JWT secrets
- Admin passwords
- Production API keys
- Other private credentials

## Production Checklist

```text
[ ] Frontend production build succeeds
[ ] Backend production server starts
[ ] Production MongoDB is connected
[ ] Production environment variables configured
[ ] CORS configured correctly
[ ] JWT secret changed from development value
[ ] Admin account created
[ ] Admin login tested
[ ] Receptionist flow tested
[ ] Employee flow tested
[ ] Visitor registration tested
[ ] Approval/rejection tested
[ ] Check-in tested
[ ] Check-out tested
[ ] Reports tested
[ ] Activity logs tested
[ ] Responsive UI tested
[ ] No .env files committed
[ ] README updated
[ ] GitHub repository updated
[ ] Production application tested
```

## Project Submission

The completed project should be submitted with:

1. GitHub repository
2. Deployed frontend application
3. README documentation
4. Environment configuration documentation
5. API documentation

### Submission Information

```text
Name: YOUR_NAME

Phone: YOUR_PHONE_NUMBER

GitHub:
YOUR_GITHUB_REPOSITORY_URL

Live Application:
YOUR_DEPLOYED_FRONTEND_URL
```

## Author

**Name:** YOUR_NAME

**Phone:** YOUR_PHONE_NUMBER

**Project:** SecureAccess — Enterprise Visitor Management System

## License

This project was developed as part of a project/interview submission.

All rights reserved.

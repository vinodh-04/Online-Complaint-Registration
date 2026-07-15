# Online Complaint Registration and Management System (MERN)

A full-stack MERN application (MongoDB, Express.js, React.js, Node.js) for
submitting, tracking, and resolving complaints, with role-based access for
Users, Agents, and Admins.

## Features

- JWT authentication with bcrypt password hashing
- Role-based access control: **USER**, **AGENT**, **ADMIN**
- Complaint submission, tracking, and status workflow (Open → In Progress → Resolved/Closed/Rejected)
- Automatic "intelligent routing" — new complaints are assigned to the agent with the lightest active workload
- Admin can manually reassign complaints to a different agent
- In-app messaging thread on each complaint (User ↔ Agent), polled every few seconds
- Feedback & star ratings after a complaint is resolved/closed
- Admin analytics dashboard: totals, breakdown by status/category, average resolution time
- User management: Admin can create agent accounts and activate/deactivate users
- Input validation (express-validator) and centralized error handling
- MongoDB indexes on frequently queried fields (status, user, agent)

## Tech Stack

- **Frontend:** React 18, React Router, Axios, Bootstrap 5, React-Toastify
- **Backend:** Node.js, Express.js, Mongoose, JWT, bcryptjs, Helmet, CORS, Morgan
- **Database:** MongoDB

## Project Structure

```
complaint-management-system/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers
│   ├── middleware/      # auth, role checks, validation, error handler
│   ├── models/          # User, Complaint, Feedback (Mongoose schemas)
│   ├── routes/          # Express routers
│   ├── utils/           # JWT helper
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/          # Axios instance with auth interceptor
    │   ├── components/   # Navbar, PrivateRoute, StatusBadge
    │   ├── context/       # AuthContext (login/register/logout)
    │   ├── pages/         # Home, Login, Register, Dashboard, NewComplaint,
    │   │                  # ComplaintDetails, AgentDashboard, AdminDashboard
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── .env.example
```

## Getting Started

### Prerequisites

- Node.js v18+ and npm
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# edit .env and set MONGO_URI / JWT_SECRET
npm install
npm run dev        # starts on http://localhost:5000 (nodemon)
# or: npm start
```

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
# REACT_APP_API_URL defaults to http://localhost:5000/api
npm install
npm start           # starts on http://localhost:3000
```

### 3. Create your first Admin account

Public registration always creates a `USER` account. To get an Admin:

1. Register a normal account through the UI.
2. In MongoDB (e.g. via `mongosh` or MongoDB Compass), update that user's role:
   ```js
   db.users.updateOne({ email: "you@example.com" }, { $set: { role: "ADMIN" } })
   ```
3. Log out and log back in — you'll land on the Admin dashboard.

From the Admin dashboard's **"Agents & Users"** tab you can then create Agent
accounts directly (no separate signup flow for agents).

## API Overview

| Method | Endpoint                          | Access          | Description                     |
|--------|------------------------------------|-----------------|----------------------------------|
| POST   | /api/auth/register                | Public          | Register as USER                 |
| POST   | /api/auth/login                   | Public          | Login, returns JWT               |
| GET    | /api/auth/me                      | Authenticated   | Current user profile             |
| POST   | /api/complaints                   | USER            | Create complaint                 |
| GET    | /api/complaints                   | Authenticated   | List complaints (role-scoped)    |
| GET    | /api/complaints/:id                | Authenticated   | Complaint detail                 |
| PUT    | /api/complaints/:id/status         | AGENT, ADMIN    | Update status / resolution note  |
| PUT    | /api/complaints/:id/assign         | ADMIN           | Assign/reassign an agent         |
| POST   | /api/complaints/:id/comments       | Authenticated   | Add a chat message                |
| DELETE | /api/complaints/:id                | ADMIN           | Delete complaint                 |
| POST   | /api/feedback                      | USER            | Submit feedback (post-resolution)|
| GET    | /api/feedback                      | ADMIN           | List all feedback                |
| GET    | /api/users                         | ADMIN           | List users (filter by ?role=)    |
| POST   | /api/users                         | ADMIN           | Create AGENT/ADMIN account       |
| PUT    | /api/users/:id                     | ADMIN           | Update role / activate / deactivate |
| DELETE | /api/users/:id                     | ADMIN           | Delete a user                    |
| GET    | /api/users/stats                   | ADMIN           | Analytics dashboard data          |

## Notes

- Chat is implemented via short-interval polling (every 8s) rather than
  WebSockets to keep the stack dependency-light; swap in Socket.IO later if
  you want true push-based real-time updates.
- Email notifications (nodemailer) are stubbed via `.env` variables but not
  wired into controllers yet — hook `nodemailer` into `complaintController.js`
  wherever you want to send status-change emails.
- File attachments: the `Complaint` model has an `attachments` string array
  ready to store uploaded file URLs; wire in `multer` + cloud storage (or
  local disk) if you need file uploads.

# CRM System Backend

Express backend for a role-based CRM system. It manages users, leads, lead assignment, dashboard stats, CSV imports, email notifications, and audit logs.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT authentication
- Bcrypt
- Nodemailer
- Multer
- CSV Parser

## Features

- Login with JWT
- Protected API routes
- Role-based authorization
- Admin/Manager user creation
- Lead CRUD
- Lead assignment to Sales users
- Email notification when a lead is assigned
- Dashboard statistics
- CSV lead import
- Audit logging for lead actions
- Audit log search

## Role Permissions

### Admin

- Create Admin, Manager, and Sales users
- Delete users
- Create, view, update, assign, and delete leads
- Upload CSV leads
- Send test email
- View dashboard
- View audit logs

### Manager

- Create Sales users only
- Create, view, update, and assign leads
- Upload CSV leads
- Send test email
- View dashboard
- Cannot delete users
- Cannot delete leads
- Cannot view audit logs

### Sales

- Login
- View assigned leads only
- Update assigned lead status only
- Cannot create users
- Cannot create leads
- Cannot assign leads
- Cannot delete leads
- Cannot upload CSV
- Cannot view audit logs

## Database Models

Main Prisma models:

- `User`
- `Lead`
- `AuditLog`

## Environment Variables

Create `server/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
PORT=5000
```

`PORT` is optional. The server defaults to `5000`.

## Installation

```bash
cd server
npm install
```

## Prisma Setup

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Open Prisma Studio:

```bash
npx prisma studio
```

## Run Server

```bash
npm run dev
```

Default API URL:

```text
http://localhost:5000
```

## API Routes

### Auth and Users

```text
POST   /api/users/login
GET    /api/users
POST   /api/users
DELETE /api/users/:id
```

Notes:

- There is no public registration route.
- Admin and Manager create users from the protected user API.
- Manager can create Sales users only.
- Admin can delete users.

### Leads

```text
POST   /api/leads
GET    /api/leads
GET    /api/leads/:id
PUT    /api/leads/:id
DELETE /api/leads/:id
PATCH  /api/leads/:leadId/assign
```

Notes:

- Admin and Manager can create and assign leads.
- Admin can delete leads.
- Sales users see assigned leads only.
- Sales users can update lead status only.

### Dashboard

```text
GET /api/dashboard/stats
```

Sales dashboard stats are scoped to assigned leads.

### CSV

```text
POST /api/csv/upload
```

Requires `multipart/form-data` with field name:

```text
file
```

Expected CSV columns:

```text
name,email,phone,company
```

Admin and Manager only.

### Email

```text
POST /api/email/test
```

Request body:

```json
{
  "to": "user@example.com"
}
```

Admin and Manager only.

### Audit Logs

```text
GET /api/audit-logs
```

Admin only.

Supports query params:

```text
page=1
limit=10
search=lead
```

Search can match action, entity, entity ID, user ID, username, email, or role.

## Lead Assignment Email Flow

```text
Admin/Manager assigns lead
        |
PATCH /api/leads/:leadId/assign
        |
Lead assigned to Sales user
        |
Email notification sent
        |
Audit log created
```

If email sending fails, the lead assignment still succeeds.

## Audit Logged Actions

- `CREATE` lead
- `UPDATE` lead
- `DELETE` lead
- `ASSIGN` lead

## Project Flow

```text
Admin creates users
        |
User logs in
        |
JWT token generated
        |
Protected API access
        |
Lead management
        |
Lead assignment
        |
Email notification
        |
Audit log
        |
Dashboard stats
```

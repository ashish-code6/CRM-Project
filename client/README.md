# CRM System Frontend

React frontend for the CRM system. It connects to the Express backend and provides role-based screens for Admin, Manager, and Sales users.

## Tech Stack

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- React Hot Toast
- Lucide React icons

## Features

- JWT login
- Protected routes
- Role-based navigation
- Dashboard cards
- Lead list, create, edit, assign, and delete actions
- Sales users can view assigned leads and update status
- User management for Admin and Manager
- CSV lead upload
- Test email tool
- Audit log table for Admin
- Pagination component
- Client-side form validation

## Role Access

### Admin

- Create Admin, Manager, and Sales users
- Delete users
- Create, update, assign, and delete leads
- View dashboard
- Upload CSV leads
- Send test email
- View audit logs

### Manager

- Create Sales users
- Create leads
- Assign leads to Sales users
- Update leads
- View dashboard
- Upload CSV leads
- Send test email

### Sales

- Login
- View assigned leads
- Update assigned lead status
- Cannot create users
- Cannot assign leads
- Cannot delete leads


## Environment Variables

Create `client/.env` when the backend URL is different from the default.

```env
VITE_API_URL=http://localhost:5000/api
```

If this value is not set, the frontend uses:

```text
http://localhost:5000/api
```

## Installation

```bash
cd client
npm install
```

## Run Development Server

```bash
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Backend Requirement

Start the backend server before using the frontend:

```bash
cd server
npm run dev
```

The frontend expects a valid JWT from the backend login API.

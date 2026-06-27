# CRM System Backend

This is a simple CRM (Customer Relationship Management) backend built with **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**.

The main goal of this project is to manage customer leads, assign them to sales team members, track activities, and provide useful dashboard statistics.

---

# Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Bcrypt
- Nodemailer
- Multer
- CSV Parser

---

# Features

### 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes

Only authenticated users can access the CRM APIs.

---

### 👥 User Roles

The system supports three roles:

- Admin
- Manager
- Sales

These roles can be extended later for role-based permissions.

---

### 📋 Lead Management

Implemented complete CRUD operations for leads.

- Create Lead
- View All Leads
- View Lead Details
- Update Lead
- Delete Lead

This allows users to manage customer information easily.

---

### 🎯 Lead Assignment

Managers can assign leads to sales team members.

Whenever a lead is assigned:

- The lead is updated in the database.
- A notification email is sent to the assigned user.
- The activity is stored in the audit logs.

---

### 📊 Dashboard

A dashboard API provides quick insights such as:

- Total Leads
- New Leads
- Assigned Leads
- Converted Leads

This data can be used to build dashboard cards and charts on the frontend.

---

### 📧 Email Notifications

Nodemailer is used to send emails.

When a lead is assigned to a sales user, an email notification is automatically sent.

---

### 📂 CSV Upload

Users can upload a CSV file containing lead data.

The application reads the file and imports all valid records into the PostgreSQL database.

This makes bulk lead import quick and easy.

---

### 📝 Audit Logs

Every important action is recorded.

Currently logged actions include:

- Create Lead
- Update Lead
- Delete Lead
- Assign Lead

This helps track user activities inside the CRM.

---

# Database

The project uses **PostgreSQL** as the database and **Prisma ORM** for database operations.

Main models:

- User
- Lead
- AuditLog

---

# Project Flow

```text
User Register
      ↓
User Login
      ↓
JWT Token Generated
      ↓
Access Protected APIs
      ↓
Create / Update / Delete Leads
      ↓
Assign Lead
      ↓
Email Notification Sent
      ↓
Audit Log Created
      ↓
Dashboard Statistics Updated
```

---

# Installation

```bash
git clone <repository-url>

cd crm-system/server

npm install
```

---

# Environment Variables

Create a `.env` file and add:

```env
DATABASE_URL=

JWT_SECRET=

EMAIL_USER=

EMAIL_PASS=
```

---

# Run the Project

```bash
npm run dev
```

---



# 🚀 CRM System

A full-stack Customer Relationship Management (CRM) application built using **React**, **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**.

The application helps organizations manage customer leads, assign them to sales representatives, track user activities, and monitor business performance through a secure role-based system.

---

## 📌 Features

### 🔐 Authentication
- JWT Authentication
- Password hashing using Bcrypt
- Protected Routes
- Secure Login

### 👥 Role-Based Authorization

The application supports three different user roles.

#### Admin
- Create Admin, Manager, and Sales users
- Delete users
- Create, update, assign, and delete leads
- Upload CSV files
- Send test emails
- View dashboard
- View audit logs

#### Manager
- Create Sales users
- Create, update, and assign leads
- Upload CSV files
- Send test emails
- View dashboard

#### Sales
- View assigned leads
- Update assigned lead status
- Cannot create users
- Cannot assign leads
- Cannot delete leads

---

## 📋 Lead Management

The CRM provides complete Lead Management functionality.

- Create Lead
- View All Leads
- View Lead Details
- Update Lead
- Delete Lead
- Assign Lead to Sales Users

---

## 📊 Dashboard

The dashboard provides real-time statistics including:

- Total Leads
- New Leads
- Assigned Leads
- Converted Leads

---

## 📧 Email Notifications

Whenever a Manager or Admin assigns a lead to a Sales user, the system automatically sends an email notification using **Nodemailer**.

---

## 📂 CSV Import

Bulk lead import is supported using CSV files.

The uploaded CSV is parsed and all valid records are stored in PostgreSQL.

Expected CSV format:

```text
name,email,phone,company
```

---

## 📝 Audit Logs

Every important action performed in the system is stored in the Audit Log.

Logged activities include:

- CREATE Lead
- UPDATE Lead
- DELETE Lead
- ASSIGN Lead

Only Admin users can access Audit Logs.

---

# 🏗 Tech Stack

## Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- React Hot Toast
- Lucide React

## Backend

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT
- Bcrypt
- Nodemailer
- Multer
- CSV Parser

---

# 🗄 Database Models

The application uses three main database models.

### User

- id
- name
- email
- password
- role

### Lead

- id
- name
- email
- phone
- company
- status
- assignedToId

### AuditLog

- id
- action
- entity
- entityId
- userId
- createdAt

---

# 🔄 Project Workflow

```text
Admin creates users
        │
        ▼
User Login
        │
        ▼
JWT Authentication
        │
        ▼
Protected API Access
        │
        ▼
Lead Management
        │
        ▼
Lead Assignment
        │
        ▼
Email Notification
        │
        ▼
Audit Log Created
        │
        ▼
Dashboard Updated
```

---

# 📂 Folder Structure

```text
crm-system

├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── prisma
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   ├── utils
│   │   └── app.js
│   └── package.json
│
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/crm-system.git
```

---

## Backend

```bash
cd server

npm install

npx prisma generate

npx prisma migrate dev

npm run dev
```

---

## Frontend

```bash
cd client

npm install

npm run dev
```

---

# 🔑 Environment Variables

### Backend (.env)

```env
DATABASE_URL=

JWT_SECRET=

EMAIL_USER=

EMAIL_PASS=

PORT=5000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 📡 API Modules

- Authentication
- User Management
- Lead Management
- Dashboard
- CSV Upload
- Email
- Audit Logs

---

# 🚀 Future Improvements

- Socket.IO Real-time Notifications
- Docker Support
- Refresh Token Authentication
- Advanced Search & Filtering
- Analytics Dashboard
- Deployment

---

# 👨‍💻 Author

**Ashish Kumar**

MERN Stack Developer

- GitHub: https://github.com/ashish-code6
- Email: ashishk810222@gmail.com

---

⭐ If you found this project useful, consider giving it a star on GitHub!
for Teting API use POsTMAN
<img width="956" height="470" alt="image" src="https://github.com/user-attachments/assets/b9990659-f08d-4e42-9c1a-375b2aaf3bc7" />
Login 
<img width="941" height="470" alt="image" src="https://github.com/user-attachments/assets/82aabd36-0398-4c3d-8e2d-72653bdeab57" />
Dashboard
<img width="958" height="469" alt="image" src="https://github.com/user-attachments/assets/0c025aff-0098-4ae6-b014-8de713d400f7" />
Leads deatils
<img width="953" height="434" alt="image" src="https://github.com/user-attachments/assets/b02ee2c1-7744-4d84-8a96-a90d6d2d30e4" />
csv file and sending mail
<img width="950" height="418" alt="image" src="https://github.com/user-attachments/assets/28f97cb9-6867-40f2-a211-265a5053d0fd" />
create a user and deatils of user
<img width="944" height="437" alt="image" src="https://github.com/user-attachments/assets/3304a012-aa67-45c9-9c22-caccb1429250" />
Audit logs 
<img width="935" height="437" alt="image" src="https://github.com/user-attachments/assets/757720e7-dc1e-48a1-ab89-f96c42f93ee2" />
profile
<img width="948" height="437" alt="image" src="https://github.com/user-attachments/assets/012003a7-bf83-45fa-b0ec-e4a47c5a0f99" />














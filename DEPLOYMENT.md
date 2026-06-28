# Deployment Guide

Use this setup:

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

## 1. Neon Database

Create a Neon PostgreSQL database and copy the connection string.

Important: the connection string must end with:

```env
?sslmode=require
```

If your URL ends with `sslmode=req`, change it to `sslmode=require`.

## 2. Render Backend

Create a new Render Web Service from this repository.

Settings:

```text
Root Directory: server
Build Command: npm install && npm run build && npm run migrate:deploy
Start Command: npm start
```

Environment variables:

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_long_random_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
CLIENT_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

After deploy, your backend API URL will look like:

```text
https://your-render-service.onrender.com/api
```

## 3. Vercel Frontend

Import this repository into Vercel.

Settings:

```text
Root Directory: client
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Environment variable:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

After Vercel deploys, copy your Vercel domain into Render as `CLIENT_URL`, then redeploy the Render service.

## 4. Security Checklist

- Do not commit real `.env` files.
- Rotate any database or email passwords that were shared publicly or in chat.
- Use a long random `JWT_SECRET` in Render.
- Keep `CLIENT_URL` set to the Vercel frontend URL in production.

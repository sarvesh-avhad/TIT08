# Notification Priority System

A real-time smart notification dashboard that prioritizes notifications dynamically and updates the UI instantly using Socket.IO.

---

# Project Overview

This project is a Full Stack Notification Priority System built using modern web technologies.

The system fetches notifications from the backend API, calculates priority scores, and displays important notifications in a clean and responsive dashboard.

The application also supports real-time updates using Socket.IO, allowing notification priority values to update dynamically without refreshing the page.

---

# Features

- Real-time notification updates using Socket.IO
- Priority-based notification ranking
- Dynamic priority score updates
- Filter notifications by category
- Responsive dashboard UI
- REST API integration
- Material UI based design
- Dark themed interface
- Notification categorization
- Backend logging middleware

---

# Tech Stack

## Frontend
- Next.js
- React
- TypeScript
- Material UI
- Axios
- Socket.IO Client

## Backend
- Node.js
- Express.js
- Socket.IO

---

# Folder Structure

```text
TIT08/
│
├── logging middleware/
├── notification_app_be/
├── notification_app_fe/
├── notification_system_design.md
├── screenshots/
└── README.md

---

# API Endpoint

```http
GET /api/notifications/priority
```

---

# How To Run Backend

```bash
cd notification_app_be
npm install
npm run dev
```

# Backend API
  - http://localhost:5000/api/notifications/priority

---

# How To Run Frontend

```bash
cd notification_app_fe
npm install
npm run dev
```

## Main Dashboard

http://localhost:3000


Displays:
- Real-time priority notifications
- Dynamic notification updates
- Notification ranking system

---

## Priority Inbox

http://localhost:3000/priority


Displays:
- Filtered notifications
- Category-based notification view
- Responsive notification dashboard

---

# Screenshots
  - Check the Screenshots folder in main repo

## Dashboard
- Priority notifications
- Responsive cards
- Material UI design

## Priority Inbox
- Filtering support
- Notification categorization

---

# Author

  - Sarvesh Avhad
  - Email:- sarveshavhad4@gmail.com
  - GitHub: https://github.com/sarvesh-avhad

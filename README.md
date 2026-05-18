# Notification Priority System

## Project Overview

This project is a Full Stack Notification Priority System built using:

- Next.js
- React
- Material UI
- Express.js
- Node.js

The system fetches notifications, calculates priority scores, and displays important notifications in a responsive dashboard.

---

## Features

- Priority-based notification ranking
- Real-time notification updates using Socket.IO
- Filter notifications by category
- Responsive UI using Material UI
- REST API integration with Express.js
- Dark themed dashboard
- Dynamic priority score updates

## Backend

- REST API
- Logging middleware
- Priority calculation algorithm
- Notification filtering
- Mock notification service

## Frontend

- Responsive UI
- Priority Inbox page
- Notification cards
- Filter by notification type
- Material UI design

---

# Tech Stack

## Frontend
- Next.js
- React
- Material UI
- Axios

## Backend
- Node.js
- Express.js
- Axios

---

# Folder Structure

```text
TIT08/
│
├── logging_middleware/
├── notification_app_be/
├── notification_app_fe/
├── notification_system_design.md
└── README.md
```

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

# Then test
  - http://localhost:5000/api/notifications/priority

---

# How To Run Frontend

```bash
cd notification_app_fe
npm install
npm run dev
```

# Then open
  - http://localhost:3000/priority

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
  - sarveshavhad4@gmail.com
  - 9307790671

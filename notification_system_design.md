# Stage 1

# Notification System REST API Design

## Base URL

```http
http://localhost:5000/api
```

---

# Authentication

For this evaluation, users are assumed to be pre-authorized.

Common Headers:

```json
{
  "Content-Type": "application/json"
}
```

---

# Core Features

The notification platform should support:

1. Fetch all notifications
2. Fetch unread notifications
3. Fetch priority notifications
4. Mark notification as read
5. Send notification
6. Filter notifications by type
7. Pagination support
8. Real-time notifications

---

# 1. Get All Notifications

## Endpoint

```http
GET /notifications
```

## Query Parameters

| Parameter | Type | Description |
| ---------- | ------ | ------------- |
| page | number | Current page |
| limit | number | Notifications per page |
| notification_type | string | Event / Result / Placement |

## Example Request

```http
GET /notifications?page=1&limit=10&notification_type=Placement
```

## Success Response

```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "total": 120,
  "notifications": [
    {
      "id": "101",
      "studentId": "1042",
      "type": "Placement",
      "message": "Google hiring drive",
      "isRead": false,
      "createdAt": "2026-05-18T10:30:00Z"
    }
  ]
}
```

---

# 2. Get Unread Notifications

## Endpoint

```http
GET /notifications/unread
```

## Example Response

```json
{
  "success": true,
  "notifications": [
    {
      "id": "201",
      "type": "Result",
      "message": "Mid sem result published",
      "isRead": false
    }
  ]
}
```

---

# 3. Mark Notification as Read

## Endpoint

```http
PATCH /notifications/:id/read
```

## Success Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

# 4. Send Notification

## Endpoint

```http
POST /notifications/send
```

## Request Body

```json
{
  "studentIds": ["1042", "1043"],
  "type": "Placement",
  "message": "Microsoft hiring drive"
}
```

## Success Response

```json
{
  "success": true,
  "message": "Notifications sent successfully"
}
```

---

# 5. Get Priority Notifications

## Endpoint

```http
GET /notifications/priority
```

## Success Response

```json
{
  "success": true,
  "notifications": [
    {
      "id": "501",
      "type": "Placement",
      "message": "Amazon hiring",
      "priorityScore": 95
    }
  ]
}
```

---

# Notification Types

1. Event
2. Result
3. Placement

---

# Real-Time Notification Design

Use WebSockets (Socket.IO) for real-time communication.

## Flow

1. Client connects to WebSocket server
2. Backend emits notification event
3. Frontend receives notification instantly
4. UI updates without refresh

## Example Event

```json
{
  "event": "new_notification",
  "data": {
    "id": "901",
    "type": "Placement",
    "message": "Adobe hiring drive"
  }
}
```

---

# Error Response Format

```json
{
  "success": false,
  "error": "Invalid request"
}
```


---

# Stage 2

# Database Design and Storage Strategy

## Suggested Database

I would use PostgreSQL as the primary relational database.

## Why PostgreSQL?

1. ACID compliance ensures reliable transactions
2. Strong support for indexing and query optimization
3. Efficient handling of relational data
4. Supports large-scale notification systems
5. Better performance for filtering and pagination
6. JSON support for flexible metadata storage
7. Highly scalable with partitioning support

---

# Database Schema

## Students Table

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary Key |
| name | VARCHAR(100) | Student Name |
| email | VARCHAR(255) | Student Email |
| created_at | TIMESTAMP | Account creation time |

---

## Notifications Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| student_id | BIGINT | Foreign Key |
| notification_type | VARCHAR(20) | Event / Result / Placement |
| message | TEXT | Notification message |
| is_read | BOOLEAN | Read status |
| created_at | TIMESTAMP | Notification timestamp |

---

# SQL Table Creation Queries

## Create Students Table

```sql
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Create Notifications Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    student_id BIGINT REFERENCES students(id),
    notification_type VARCHAR(20),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# Indexing Strategy

```sql
CREATE INDEX idx_student_notifications
ON notifications(student_id, is_read, created_at);
```

Purpose:
- Faster unread notification retrieval
- Faster sorting by timestamp
- Better filtering performance

---

# API Queries

## Fetch All Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;
```

---

## Fetch Unread Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
AND is_read = FALSE
ORDER BY created_at DESC;
```

---

## Mark Notification as Read

```sql
UPDATE notifications
SET is_read = TRUE
WHERE id = 'notification-id';
```

---

## Filter Notifications by Type

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
AND notification_type = 'Placement'
ORDER BY created_at DESC;
```

---

# Scalability Problems as Data Grows

As the number of students and notifications increases, the following issues may occur:

1. Slow query performance
2. Increased database load
3. Higher storage consumption
4. Longer response times
5. Increased indexing overhead

---

# Solutions for Scaling

## 1. Database Indexing

Indexes improve search and filtering speed.

Benefits:
- Faster queries
- Better sorting performance

Tradeoff:
- Slightly slower inserts

---

## 2. Pagination

Fetch limited notifications per request.

Benefits:
- Reduces payload size
- Improves frontend performance

---

## 3. Caching

Use Redis caching for frequently accessed notifications.

Benefits:
- Reduced DB load
- Faster response times

---

## 4. Database Partitioning

Partition notifications table by date or student ID.

Benefits:
- Faster large-scale queries
- Better storage management

---

## 5. Asynchronous Processing

Use message queues like RabbitMQ or Kafka for bulk notifications.

Benefits:
- Improved scalability
- Non-blocking processing

---

# Recommended Architecture

Frontend → Backend API → PostgreSQL Database

For real-time notifications:

Frontend ↔ WebSocket Server ↔ Backend




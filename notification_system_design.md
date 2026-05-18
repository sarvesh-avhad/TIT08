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
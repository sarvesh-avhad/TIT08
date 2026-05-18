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



---

# Stage 3

# Query Optimization and Performance Analysis

## Existing Query

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

---

# Is This Query Accurate?

Yes, the query is logically correct because it fetches unread notifications of a specific student sorted by creation time.

However, the query becomes slow when the database grows significantly.

Current Scale:
- 50,000 students
- 5,000,000 notifications

---

# Why Is The Query Slow?

The query is slow mainly because of:

1. Full Table Scan
   - Without proper indexes, the database scans millions of rows.

2. Sorting Cost
   - ORDER BY createdAt requires sorting large datasets.

3. Multiple Conditions
   - Filtering by studentID and isRead together increases lookup complexity.

4. Large Dataset Size
   - 5 million rows significantly increase query execution time.

---

# Optimized Solution

## Add Composite Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```

---

# Why Composite Index?

This index helps because:
- studentID is filtered first
- isRead is filtered second
- createdAt supports sorting

The database can directly locate unread notifications for a student without scanning the full table.

---

# Optimized Query

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = FALSE
ORDER BY createdAt ASC;
```

---

# Likely Computational Cost

## Without Index

Time Complexity:

```text
O(n)
```

The database scans nearly all rows.

---

## With Composite Index

Time Complexity:

```text
O(log n)
```

The database performs indexed lookup instead of full scan.

Performance improves significantly.

---

# Should We Add Indexes On Every Column?

No, adding indexes on every column is not effective.

---

# Why Adding Too Many Indexes Is Bad

## 1. Increased Storage Usage

Indexes consume additional disk space.

---

## 2. Slower INSERT and UPDATE Operations

Whenever data changes:
- all indexes must also update

This increases write latency.

---

## 3. Unused Indexes Waste Resources

Some columns are rarely queried.

Indexes on such columns provide no benefit.

---

# Best Practice

Create indexes only on:
- Frequently searched columns
- Filtering columns
- Sorting columns
- JOIN columns

---

# Query To Find Students Who Received Placement Notifications In Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

---

# Additional Optimizations

## 1. Pagination

```sql
LIMIT 20 OFFSET 0
```

Reduces response payload.

---

## 2. Redis Caching

Store frequently accessed unread notifications.

Benefits:
- Reduced DB load
- Faster responses

---

## 3. Table Partitioning

Partition notifications table by:
- month
- year
- studentID range

Improves large-scale query performance.

---

# Final Recommendation

Best production strategy:

1. Composite indexing
2. Pagination
3. Redis caching
4. Partitioning
5. Async notification processing


---

# Stage 4

# Improving Notification Fetch Performance

Currently, notifications are fetched from the database on every page load for every student.

As the number of users increases, this creates heavy database load and poor user experience.

---

# Problems In Current System

1. Excessive database queries
2. Increased response time
3. High server load
4. Poor scalability
5. Slow frontend rendering
6. Repeated fetching of unchanged data

---

# Proposed Solutions

## 1. Redis Caching

Store frequently accessed notifications in Redis cache.

## Flow

1. User requests notifications
2. Backend checks Redis cache
3. If cache exists:
   - return cached data
4. Otherwise:
   - fetch from database
   - store in Redis
   - return response

---

# Benefits

- Reduces database load
- Faster response time
- Better scalability
- Improved user experience

---

# Tradeoffs

- Additional infrastructure required
- Cache invalidation complexity
- Increased memory usage

---

# Example Architecture

Frontend → Backend → Redis Cache → PostgreSQL

---

# 2. Pagination

Instead of fetching all notifications, fetch limited records.

## Example

```http
GET /notifications?page=1&limit=10
```

---

# Benefits

- Smaller response payload
- Faster API response
- Reduced frontend rendering load

---

# Tradeoffs

- Multiple API calls required
- Complex frontend pagination handling

---

# 3. Lazy Loading / Infinite Scroll

Load notifications only when needed.

## Flow

1. Initially load first 10 notifications
2. Fetch more while scrolling

---

# Benefits

- Faster initial page load
- Better user experience
- Reduced unnecessary data transfer

---

# Tradeoffs

- More frontend complexity
- Scroll state management required

---

# 4. Real-Time Notifications Using WebSockets

Use Socket.IO or WebSockets to push new notifications instantly.

Instead of repeatedly polling APIs:
- backend pushes updates automatically

---

# Benefits

- Instant notification delivery
- Reduced repeated API requests
- Better real-time experience

---

# Tradeoffs

- Persistent connections required
- More backend memory usage
- Scaling WebSocket servers is harder

---

# 5. Database Indexing

Indexes improve filtering and sorting performance.

Recommended Index:

```sql
CREATE INDEX idx_notifications_student_created
ON notifications(studentID, createdAt);
```

---

# Benefits

- Faster query execution
- Reduced database scan time

---

# Tradeoffs

- Slightly slower inserts/updates
- Additional storage usage

---

# 6. Notification Read Status Synchronization

Store viewed notifications locally on frontend.

Approach:
- Use localStorage/sessionStorage
- Mark already viewed notifications without extra DB calls

---

# Benefits

- Reduced backend requests
- Faster UI updates

---

# Tradeoffs

- Browser storage dependency
- Data may reset after clearing cache

---

# Recommended Production Architecture

## Notification Fetching Flow

Frontend
↓
Backend API
↓
Redis Cache
↓
PostgreSQL

---

## Real-Time Flow

Backend
↓
WebSocket Server
↓
Frontend Client

---

# Final Recommendation

For large-scale systems:

1. Redis caching
2. Pagination
3. WebSockets
4. Infinite scrolling
5. Optimized indexing
6. Lazy loading

Together these significantly improve:
- scalability
- performance
- user experience
- database efficiency


---

# Stage 5

# Reliable and Scalable Bulk Notification System

## Existing Implementation

```python
function notify_all(student_ids: array, message: string):
    for student_id in student_ids:

        send_email(student_id, message)
        save_to_db(student_id, message)
        push_to_app(student_id, message)
```

---

# Problems In Existing Implementation

## 1. Sequential Processing

Notifications are sent one by one.

Problem:
- Very slow for 50,000 students

---

## 2. No Failure Recovery

If email sending fails midway:
- remaining students may not receive notifications

---

## 3. No Retry Mechanism

Temporary email API failures are not retried.

---

## 4. Blocking Architecture

Email sending blocks database operations.

---

## 5. Poor Scalability

Large notification campaigns overload the server.

---

## 6. No Queue Management

Everything executes immediately.

No asynchronous handling exists.

---

# Example Failure Scenario

Logs indicate:
- send_email failed for 200 students

Problem:
- System does not track failed users
- Notifications become inconsistent

Some students:
- receive in-app notification
- but do not receive email

---

# Recommended Solution

Use:

1. Message Queue
2. Worker Services
3. Retry Mechanism
4. Asynchronous Processing

Suggested Technologies:
- RabbitMQ
- Kafka
- BullMQ
- Redis Queue

---

# Improved Architecture

HR Request
↓
Backend API
↓
Message Queue
↓
Worker Services
↓
Email Service / DB / WebSocket

---

# Why Queue-Based Processing?

Benefits:
- Faster response
- Better scalability
- Failure recovery
- Retry support
- Parallel processing

---

# Should DB Save And Email Sending Happen Together?

No.

They should be decoupled.

---

# Why Decoupling Is Better

## Database Save

Critical operation:
- notification must always persist

---

## Email Sending

External dependency:
- may fail temporarily

If coupled together:
- one email failure may rollback entire process

---

# Recommended Flow

1. Save notification to database
2. Push task into queue
3. Worker processes email asynchronously
4. Retry failed emails automatically

---

# Retry Strategy

If email sending fails:
- retry 3 times
- apply exponential backoff

Example:
- Retry after 1 second
- Retry after 5 seconds
- Retry after 15 seconds

---

# Revised Scalable Pseudocode

```python
function notify_all(student_ids, message):

    for student_id in student_ids:

        notification = {
            student_id,
            message,
            status: "pending"
        }

        save_to_db(notification)

        queue.push(notification)
```

---

# Worker Service

```python
worker_process():

    while queue not empty:

        notification = queue.pop()

        try:

            send_email(
                notification.student_id,
                notification.message
            )

            push_to_app(
                notification.student_id,
                notification.message
            )

            update_status(notification, "success")

        except Exception:

            retry(notification)
```

---

# Advantages Of Improved System

## 1. High Scalability

Can handle lakhs of notifications.

---

## 2. Faster API Response

Backend immediately returns success.

---

## 3. Reliable Delivery

Failed notifications are retried.

---

## 4. Fault Tolerance

Temporary failures do not crash system.

---

## 5. Parallel Processing

Multiple workers process notifications simultaneously.

---

# Additional Optimizations

## Batch Processing

Send notifications in batches.

Example:
- 1000 notifications per batch

Benefits:
- Reduced memory usage
- Better throughput

---

## Dead Letter Queue (DLQ)

Store permanently failed notifications separately.

Benefits:
- Easy debugging
- Manual retry possible

---

## Monitoring

Use:
- Prometheus
- Grafana
- ELK Stack

Track:
- queue size
- failures
- retries
- latency

---

# Final Recommendation

Production-ready architecture should include:

1. Queue-based asynchronous processing
2. Retry mechanism
3. Worker services
4. Database persistence
5. Dead letter queue
6. Real-time WebSocket notifications
7. Monitoring and logging
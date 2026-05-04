# LawTicha Admin API — Endpoint Reference

> **Base URL:** `GET/POST/PATCH/DELETE /api/v1/admin/...`  
> **Auth:** All endpoints require `Authorization: Bearer <admin_jwt>` (httpOnly cookie or header)  
> **Admin roles:** `super_admin`, `admin`

---

## Table of Contents

1. [Dashboard Overview](#1-dashboard-overview)
2. [Citizens](#2-citizens)
3. [Lawyers](#3-lawyers)
4. [Verifications](#4-verifications)
5. [Modules](#5-modules)
6. [Topics](#6-topics)
7. [Sub-Topics](#7-sub-topics)
8. [Community Posts](#8-community-posts)
9. [Legal Library — Books](#9-legal-library--books)
10. [Legal Library — Orders](#10-legal-library--orders)
11. [Consultations](#11-consultations)
12. [Reviews](#12-reviews)
13. [Reports](#13-reports)
14. [Analytics](#14-analytics)
15. [Settings](#15-settings)
16. [Uploads](#16-uploads)
17. [Auth](#17-auth)

---

## 1. Dashboard Overview

### `GET /admin/dashboard`

Returns all key metrics for the admin overview page.

**Response:**
```json
{
  "stats": {
    "totalCitizens": 10,
    "activeCitizens": 7,
    "inactiveCitizens": 1,
    "flaggedCitizens": 2,
    "totalLawyers": 7,
    "activeLawyers": 5,
    "pendingVerifications": 4,
    "totalModules": 7,
    "totalTopics": 57,
    "totalEnrolled": 11886,
    "avgModuleCompletion": 53,
    "totalCommunityPosts": 7,
    "pendingPosts": 1,
    "flaggedContent": 3,
    "totalBooks": 6,
    "totalBookDownloads": 6895,
    "totalOrders": 5,
    "pendingOrders": 2,
    "totalRevenue": 24500
  },
  "recentActivity": [
    {
      "type": "new_citizen",
      "message": "Mustapha Ibrahim joined from Sokoto",
      "createdAt": "2025-04-20T10:30:00Z"
    },
    {
      "type": "verification_submitted",
      "message": "Obiageli Nwachukwu submitted verification",
      "createdAt": "2025-04-21T09:14:00Z"
    }
  ]
}
```

---

## 2. Citizens

### `GET /admin/citizens`

List all citizens with optional filters.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `status` | `active \| inactive \| warning \| all` | `all` | Filter by status |
| `search` | `string` | — | Search by name, email, or state |
| `page` | `number` | `1` | Page number |
| `pageSize` | `number` | `20` | Items per page |
| `sortBy` | `string` | `joinedAt` | `joinedAt \| name \| topicsRead \| lastActive` |
| `sortOrder` | `asc \| desc` | `desc` | Sort direction |

**Response:**
```json
{
  "data": [
    {
      "id": "u001",
      "name": "Chidinma Okafor",
      "initials": "CO",
      "color": "#3B82F6",
      "email": "chidinma@gmail.com",
      "phone": "08012345678",
      "state": "Enugu",
      "joinedAt": "2025-01-12T00:00:00Z",
      "status": "active",
      "topicsRead": 14,
      "consultations": 2,
      "lastActive": "2025-04-21T08:00:00Z",
      "reportCount": 0
    }
  ],
  "total": 10,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

### `GET /admin/citizens/:id`

Get full profile of a single citizen.

**Response:**
```json
{
  "data": {
    "id": "u001",
    "name": "Chidinma Okafor",
    "initials": "CO",
    "color": "#3B82F6",
    "email": "chidinma@gmail.com",
    "phone": "08012345678",
    "state": "Enugu",
    "joinedAt": "2025-01-12T00:00:00Z",
    "status": "active",
    "topicsRead": 14,
    "consultations": 2,
    "lastActive": "2025-04-21T08:00:00Z",
    "reportCount": 0,
    "modulesEnrolled": ["m001", "m002"],
    "bookmarkedTopics": 3,
    "communityPosts": 1
  }
}
```

### `PATCH /admin/citizens/:id/status`

Suspend or reactivate a citizen account.

**Request Body:**
```json
{
  "status": "inactive",
  "reason": "Suspicious activity reported by 2 users"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Citizen status updated",
  "data": { "id": "u001", "status": "inactive" }
}
```

### `POST /admin/citizens/:id/email`

Send an email to a citizen.

**Request Body:**
```json
{
  "subject": "Important Notice",
  "body": "Your account has been flagged..."
}
```

**Response:**
```json
{ "success": true, "message": "Email sent successfully" }
```

---

## 3. Lawyers

### `GET /admin/lawyers`

List all lawyers with optional filters.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `status` | `active \| inactive \| pending \| all` | `all` | Filter by status |
| `search` | `string` | — | Search by name, NBA number, or state |
| `page` | `number` | `1` | Page number |
| `pageSize` | `number` | `20` | Items per page |

**Response:**
```json
{
  "data": [
    {
      "id": "l001",
      "name": "Adaeze Okonkwo",
      "initials": "AO",
      "color": "#1E3A5F",
      "email": "adaeze@lawticha.ng",
      "phone": "08012345678",
      "state": "Lagos",
      "specialisms": ["Criminal", "Employment"],
      "nbaNumber": "NBA/LAG/2014/01847",
      "yearsCall": 10,
      "joinedAt": "2025-01-05T00:00:00Z",
      "status": "active",
      "rating": 4.9,
      "reviewCount": 84,
      "consultations": 312,
      "responseTime": "< 1 hr",
      "badges": ["Verified", "Top Rated", "Responsive"],
      "lastActive": "2025-04-21T08:00:00Z",
      "available": true
    }
  ],
  "total": 7,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

### `GET /admin/lawyers/:id`

Get full profile of a single lawyer.

**Response:**
```json
{
  "data": {
    "id": "l001",
    "name": "Adaeze Okonkwo",
    "initials": "AO",
    "color": "#1E3A5F",
    "email": "adaeze@lawticha.ng",
    "phone": "08012345678",
    "state": "Lagos",
    "specialisms": ["Criminal", "Employment"],
    "nbaNumber": "NBA/LAG/2014/01847",
    "yearsCall": 10,
    "joinedAt": "2025-01-05T00:00:00Z",
    "status": "active",
    "rating": 4.9,
    "reviewCount": 84,
    "consultations": 312,
    "responseTime": "< 1 hr",
    "badges": ["Verified", "Top Rated", "Responsive"],
    "lastActive": "2025-04-21T08:00:00Z",
    "available": true,
    "bio": "Called to the Nigerian Bar in 2014...",
    "languages": ["English", "Igbo"],
    "fee": { "message": 5000, "call": 12000, "video": 18000 }
  }
}
```

### `PATCH /admin/lawyers/:id/status`

Suspend or reactivate a lawyer account.

**Request Body:**
```json
{
  "status": "inactive",
  "reason": "NBA verification expired"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lawyer status updated",
  "data": { "id": "l001", "status": "inactive" }
}
```

### `POST /admin/lawyers/:id/email`

Send an email to a lawyer.

**Request Body:**
```json
{
  "subject": "Action Required",
  "body": "Please update your practicing license..."
}
```

**Response:**
```json
{ "success": true, "message": "Email sent successfully" }
```

---

## 4. Verifications

### `GET /admin/verifications`

List all lawyer verification requests.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `status` | `pending \| approved \| rejected \| info_requested \| all` | `pending` | Filter by status |
| `search` | `string` | — | Search by name, NBA number, or state |
| `page` | `number` | `1` | Page number |
| `pageSize` | `number` | `20` | Items per page |

**Response:**
```json
{
  "data": [
    {
      "id": "v001",
      "name": "Obiageli Nwachukwu",
      "initials": "ON",
      "color": "#1E4040",
      "email": "obi.n@email.com",
      "phone": "07077665544",
      "state": "Anambra",
      "nbaNumber": "NBA/AWK/2019/00456",
      "yearsCall": 5,
      "calledAt": "2019",
      "specialisms": ["Family Law", "Employment"],
      "submittedAt": "2025-04-21T09:14:00Z",
      "status": "pending",
      "adminNote": null,
      "reviewedBy": null,
      "reviewedAt": null,
      "documents": [
        {
          "id": "d1",
          "label": "Call to Bar Certificate",
          "filename": "call_to_bar_nwachukwu.pdf",
          "fileUrl": "https://cdn.lawticha.ng/docs/d1.pdf",
          "uploadedAt": "2025-04-21T09:10:00Z",
          "sizeBytes": 1258291,
          "verified": null
        },
        {
          "id": "d2",
          "label": "Law School Certificate",
          "filename": "law_school_cert.pdf",
          "fileUrl": "https://cdn.lawticha.ng/docs/d2.pdf",
          "uploadedAt": "2025-04-21T09:10:00Z",
          "sizeBytes": 1003520,
          "verified": null
        },
        {
          "id": "d3",
          "label": "Practicing License 2025",
          "filename": "practicing_license_2025.pdf",
          "fileUrl": "https://cdn.lawticha.ng/docs/d3.pdf",
          "uploadedAt": "2025-04-21T09:10:00Z",
          "sizeBytes": 2202009,
          "verified": null
        },
        {
          "id": "d4",
          "label": "Government-Issued ID",
          "filename": "national_id_on.jpg",
          "fileUrl": "https://cdn.lawticha.ng/docs/d4.jpg",
          "uploadedAt": "2025-04-21T09:10:00Z",
          "sizeBytes": 655360,
          "verified": null
        }
      ]
    }
  ],
  "total": 5,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

### `GET /admin/verifications/stats`

Get summary counts for the stats bar.

**Response:**
```json
{
  "data": {
    "totalRequests": 5,
    "pending": 2,
    "approved": 1,
    "rejected": 1,
    "infoRequested": 1
  }
}
```

### `PATCH /admin/verifications/:id/approve`

Approve a verification request. Creates the lawyer profile and sends approval email.

**Request Body:**
```json
{
  "note": "All documents verified successfully. Welcome to LawTicha."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification approved. Lawyer profile activated.",
  "data": {
    "id": "v001",
    "status": "approved",
    "reviewedBy": "Super Admin",
    "reviewedAt": "2025-04-22T10:15:00Z",
    "lawyerId": "l008"
  }
}
```

### `PATCH /admin/verifications/:id/reject`

Reject a verification request. Sends rejection email with reason.

**Request Body:**
```json
{
  "reason": "NBA registration number could not be verified with the Nigerian Bar Association records."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application rejected. Applicant has been notified.",
  "data": {
    "id": "v005",
    "status": "rejected",
    "reviewedBy": "Super Admin",
    "reviewedAt": "2025-04-22T14:30:00Z"
  }
}
```

### `PATCH /admin/verifications/:id/request-info`

Mark as info requested and notify applicant.

**Request Body:**
```json
{
  "message": "The practicing license uploaded appears to be for 2024. Please resubmit the 2025 Supreme Court practicing license."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Information request sent to applicant.",
  "data": {
    "id": "v003",
    "status": "info_requested",
    "adminNote": "The practicing license uploaded appears to be for 2024. Please resubmit the 2025 Supreme Court practicing license."
  }
}
```

### `PATCH /admin/verifications/:id/documents/:documentId/verify`

Mark a single document as verified or flagged.

**Request Body:**
```json
{
  "verified": true
}
```

**Response:**
```json
{
  "success": true,
  "data": { "documentId": "d1", "verified": true }
}
```

---

## 5. Modules

### `GET /admin/modules`

List all learning modules with filters.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `status` | `active \| inactive \| pending \| all` | `all` | Filter by status |
| `category` | `criminal \| tenancy \| employment \| contracts \| business \| family \| consumer \| road \| all` | `all` | Filter by category |
| `search` | `string` | — | Search by title or instructor |
| `page` | `number` | `1` | Page number |
| `pageSize` | `number` | `20` | Items per page |
| `sortBy` | `string` | `createdAt` | `enrolledCount \| completionRate \| avgRating \| createdAt` |
| `sortOrder` | `asc \| desc` | `desc` | Sort direction |

**Response:**
```json
{
  "data": [
    {
      "id": "m001",
      "title": "Rights During Arrest & Detention",
      "category": "criminal",
      "status": "active",
      "thumbnail": "/images/police_law.jpg",
      "description": "Know exactly what police can and cannot do...",
      "topicCount": 14,
      "enrolledCount": 3842,
      "completionRate": 62,
      "avgRating": 4.3,
      "reviewCount": 284,
      "totalWatchTimeHours": 2104,
      "instructor": "Adaeze Okonkwo",
      "instructorId": "l001",
      "instructorInitials": "AO",
      "instructorColor": "#3B82F6",
      "trending": true,
      "createdAt": "2025-01-12T00:00:00Z",
      "updatedAt": "2025-04-20T00:00:00Z"
    }
  ],
  "total": 7,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

### `GET /admin/modules/stats`

Aggregate stats for the stats bar.

**Response:**
```json
{
  "data": {
    "totalModules": 7,
    "totalTopics": 57,
    "totalEnrolled": 11886,
    "avgCompletion": 53
  }
}
```

### `GET /admin/modules/daily-stats`

Today's activity strip.

**Response:**
```json
{
  "data": {
    "lessonsWatchedToday": 1247,
    "lessonsWatchedChange": 12,
    "newEnrolmentsToday": 84,
    "newEnrolmentsChange": 8,
    "completionsToday": 31,
    "completionsChange": -3,
    "avgSessionDurationMinutes": 18,
    "avgSessionDurationChange": 5
  }
}
```

### `GET /admin/modules/:id`

Get a single module's full detail.

**Response:**
```json
{
  "data": {
    "id": "m001",
    "title": "Rights During Arrest & Detention",
    "category": "criminal",
    "categoryLabel": "Police & Criminal Rights",
    "categoryColor": "#3B82F6",
    "status": "active",
    "thumbnail": "/images/police_law.jpg",
    "description": "Know exactly what police officers can and cannot do...",
    "topicCount": 5,
    "enrolledCount": 3842,
    "completionRate": 62,
    "avgRating": 4.3,
    "reviewCount": 284,
    "totalWatchTime": "2,104 hrs",
    "instructor": "Adaeze Okonkwo",
    "instructorId": "l001",
    "instructorInitials": "AO",
    "instructorColor": "#3B82F6",
    "instructorEmail": "adaeze@lawticha.ng",
    "trending": true,
    "createdAt": "2025-01-12T00:00:00Z",
    "updatedAt": "2025-04-20T00:00:00Z"
  }
}
```

### `POST /admin/modules`

Create a new module.

**Request Body:**
```json
{
  "title": "Rights During Arrest & Detention",
  "category": "criminal",
  "description": "Know exactly what police can and cannot do...",
  "instructorId": "l001",
  "thumbnailUrl": "https://cdn.lawticha.ng/images/police_law.jpg",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Module created successfully",
  "data": {
    "id": "m008",
    "title": "Rights During Arrest & Detention",
    "category": "criminal",
    "status": "active",
    "topicCount": 0,
    "enrolledCount": 0,
    "createdAt": "2025-04-22T10:00:00Z"
  }
}
```

### `PATCH /admin/modules/:id`

Update module details.

**Request Body (all fields optional):**
```json
{
  "title": "Updated Title",
  "category": "criminal",
  "description": "Updated description",
  "instructorId": "l001",
  "thumbnailUrl": "https://cdn.lawticha.ng/images/new.jpg",
  "status": "active",
  "trending": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Module updated",
  "data": { "id": "m001", "updatedAt": "2025-04-22T10:00:00Z" }
}
```

### `DELETE /admin/modules/:id`

Delete a module and all its topics/subtopics.

**Response:**
```json
{
  "success": true,
  "message": "Module and all associated content deleted"
}
```

### `GET /admin/modules/:id/analytics`

Full analytics for a module.

**Response:**
```json
{
  "data": {
    "moduleId": "m001",
    "enrolledCount": 3842,
    "completionRate": 62,
    "avgRating": 4.3,
    "totalWatchTimeHours": 2104,
    "progressDistribution": [
      { "label": "Completed all topics", "count": 1141, "percentage": 30, "color": "#10B981" },
      { "label": "More than half done",  "count": 1226, "percentage": 32, "color": "#3B82F6" },
      { "label": "Less than half done",  "count": 958,  "percentage": 25, "color": "#F59E0B" },
      { "label": "Just enrolled",        "count": 517,  "percentage": 13, "color": "#9CA3AF" }
    ],
    "topicPerformance": [
      {
        "topicId": "t001",
        "title": "Understanding the Basics of Arrest",
        "classification": "Foundational",
        "order": 1,
        "watchCount": 3421,
        "completionRate": 88,
        "likes": 247,
        "comments": 34,
        "status": "published",
        "duration": "4:32"
      }
    ],
    "updatedAt": "2025-04-22T00:00:00Z"
  }
}
```

### `GET /admin/modules/:id/activity`

Recent activity feed for a module.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | `number` | `20` | Number of items |
| `before` | `string` | — | ISO timestamp cursor for pagination |

**Response:**
```json
{
  "data": [
    {
      "id": "act001",
      "userId": "u001",
      "userName": "Chidinma O.",
      "userInitials": "CO",
      "userColor": "#3B82F6",
      "action": "completed",
      "targetTitle": "Understanding Basics of Arrest",
      "targetType": "topic",
      "targetId": "t001",
      "moduleId": "m001",
      "createdAt": "2025-04-21T10:25:00Z"
    }
  ]
}
```

### `GET /admin/modules/:id/learners`

Paginated list of enrolled learners.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | `number` | `1` | Page number |
| `pageSize` | `number` | `20` | Items per page |
| `search` | `string` | — | Search by name |
| `sortBy` | `string` | `enrolledAt` | `enrolledAt \| progress \| lastActiveAt` |
| `sortOrder` | `asc \| desc` | `desc` | Sort direction |

**Response:**
```json
{
  "data": [
    {
      "id": "u001",
      "name": "Chidinma Okafor",
      "initials": "CO",
      "color": "#3B82F6",
      "email": "chidinma@gmail.com",
      "state": "Enugu",
      "enrolledAt": "2025-04-01T00:00:00Z",
      "progressPercentage": 100,
      "topicsCompleted": 14,
      "totalTopics": 14,
      "lastActiveAt": "2025-04-21T08:00:00Z"
    }
  ],
  "total": 3842,
  "page": 1,
  "pageSize": 20,
  "totalPages": 193
}
```

### `GET /admin/modules/:id/learners/top`

Top N learners by progress. Used in the activity sidebar.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | `number` | `5` | Number of learners |

**Response:**
```json
{
  "data": [
    {
      "id": "u009",
      "name": "Adaeze Onyekachi",
      "initials": "AO",
      "color": "#6366F1",
      "progressPercentage": 100,
      "topicsCompleted": 14,
      "certificateEarned": true
    }
  ]
}
```

---

## 6. Topics

### `GET /admin/modules/:moduleId/topics`

List all topics for a module, ordered by `order` ASC.

**Response:**
```json
{
  "data": [
    {
      "id": "t001",
      "moduleId": "m001",
      "title": "Understanding the Basics of Arrest",
      "classification": "Foundational",
      "overview": "What constitutes a lawful arrest in Nigeria...",
      "status": "published",
      "order": 1,
      "videoType": "youtube",
      "videoUrl": "https://youtube.com/watch?v=example1",
      "thumbnailUrl": "",
      "duration": "4:32",
      "durationSeconds": 272,
      "watchCount": 3421,
      "completionRate": 88,
      "likes": 247,
      "comments": 34,
      "tags": [],
      "subtopicCount": 3,
      "createdAt": "2025-01-15T00:00:00Z",
      "updatedAt": "2025-04-20T00:00:00Z"
    }
  ]
}
```

### `GET /admin/modules/:moduleId/topics/:topicId`

Get a single topic including its embedded subtopics.

**Response:**
```json
{
  "data": {
    "id": "t003",
    "moduleId": "m001",
    "title": "Your Right to Remain Silent",
    "classification": "Rights",
    "overview": "How to invoke your right to silence...",
    "status": "published",
    "order": 3,
    "videoType": "youtube",
    "videoUrl": "https://youtube.com/watch?v=example3",
    "thumbnailUrl": "/images/police_law.jpg",
    "duration": "5:01",
    "durationSeconds": 301,
    "watchCount": 2876,
    "completionRate": 74,
    "likes": 312,
    "comments": 48,
    "tags": ["silence", "arrest", "Section 35"],
    "subtopicCount": 3,
    "createdAt": "2025-01-22T00:00:00Z",
    "updatedAt": "2025-04-20T00:00:00Z",
    "subtopics": [
      {
        "id": "st007",
        "topicId": "t003",
        "moduleId": "m001",
        "title": "What the Right Covers",
        "notes": "The right to silence is not absolute...",
        "duration": "1:30",
        "durationSeconds": 90,
        "order": 1,
        "viewCount": 2700,
        "completedBy": 2500,
        "createdAt": "2025-01-22T00:00:00Z",
        "updatedAt": "2025-04-20T00:00:00Z"
      }
    ]
  }
}
```

### `POST /admin/modules/:moduleId/topics`

Create a new topic within a module.

**Request Body:**
```json
{
  "title": "New Topic",
  "classification": "Foundational",
  "overview": "Description of this topic",
  "status": "draft",
  "order": 6,
  "videoType": "youtube",
  "videoUrl": "https://youtube.com/watch?v=xxx",
  "thumbnailUrl": "",
  "tags": ["arrest", "rights"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Topic created",
  "data": {
    "id": "t006",
    "moduleId": "m001",
    "title": "New Topic",
    "status": "draft",
    "order": 6,
    "subtopicCount": 0,
    "createdAt": "2025-04-22T10:00:00Z"
  }
}
```

### `PATCH /admin/modules/:moduleId/topics/:topicId`

Update topic fields.

**Request Body (all fields optional):**
```json
{
  "title": "Updated Title",
  "classification": "Rights",
  "overview": "Updated overview",
  "status": "published",
  "order": 2,
  "videoType": "youtube",
  "videoUrl": "https://youtube.com/watch?v=new",
  "thumbnailUrl": "https://cdn.lawticha.ng/thumb.jpg",
  "tags": ["tag1", "tag2"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Topic updated",
  "data": { "id": "t001", "updatedAt": "2025-04-22T10:00:00Z" }
}
```

### `DELETE /admin/modules/:moduleId/topics/:topicId`

Delete a topic and all its subtopics.

**Response:**
```json
{
  "success": true,
  "message": "Topic and subtopics deleted"
}
```

### `PATCH /admin/modules/:moduleId/topics/reorder`

Reorder all topics within a module.

**Request Body:**
```json
{
  "orderedIds": ["t003", "t001", "t002", "t004", "t005"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Topics reordered"
}
```

### `GET /admin/modules/:moduleId/topics/:topicId/analytics`

Full analytics for a topic.

**Response:**
```json
{
  "data": {
    "topicId": "t003",
    "watchCount": 2876,
    "completionRate": 74,
    "likes": 312,
    "comments": 48,
    "avgWatchDurationSeconds": 222,
    "likeRate": 10.8,
    "commentRate": 1.7,
    "dailyViews": [
      { "day": "Mon", "date": "2025-04-15", "views": 340 },
      { "day": "Tue", "date": "2025-04-16", "views": 420 },
      { "day": "Wed", "date": "2025-04-17", "views": 385 },
      { "day": "Thu", "date": "2025-04-18", "views": 510 },
      { "day": "Fri", "date": "2025-04-19", "views": 480 },
      { "day": "Sat", "date": "2025-04-20", "views": 290 },
      { "day": "Sun", "date": "2025-04-21", "views": 220 }
    ],
    "subtopicCompletion": [
      {
        "subtopicId": "st007",
        "title": "What the Right Covers",
        "order": 1,
        "viewCount": 2700,
        "completedBy": 2500,
        "dropOffPercentage": 0
      },
      {
        "subtopicId": "st008",
        "title": "How to Invoke the Right — The Exact Script",
        "order": 2,
        "viewCount": 2500,
        "completedBy": 2300,
        "dropOffPercentage": 8
      },
      {
        "subtopicId": "st009",
        "title": "Silence in Court — What Nigerian Law Says",
        "order": 3,
        "viewCount": 2300,
        "completedBy": 2100,
        "dropOffPercentage": 9
      }
    ],
    "topStates": [
      { "state": "Lagos",   "count": 920, "percentage": 32 },
      { "state": "Abuja",   "count": 518, "percentage": 18 },
      { "state": "Rivers",  "count": 316, "percentage": 11 },
      { "state": "Kano",    "count": 230, "percentage": 8  },
      { "state": "Others",  "count": 892, "percentage": 31 }
    ],
    "weeklyEngagement": [
      { "label": "Watch-through rate", "value": "74%",    "trend": "+6% this week",   "up": true  },
      { "label": "Avg watch duration", "value": "3m 42s", "trend": "+12% this week",  "up": true  },
      { "label": "Like rate",          "value": "10.8%",  "trend": "+2% this week",   "up": true  },
      { "label": "Comment rate",       "value": "1.7%",   "trend": "-0.3% this week", "up": false }
    ],
    "updatedAt": "2025-04-22T00:00:00Z"
  }
}
```

---

## 7. Sub-Topics

### `GET /admin/modules/:moduleId/topics/:topicId/subtopics`

List all subtopics for a topic, ordered by `order` ASC.

**Response:**
```json
{
  "data": [
    {
      "id": "st007",
      "topicId": "t003",
      "moduleId": "m001",
      "title": "What the Right Covers",
      "notes": "The right to silence is not absolute — explain exceptions under Nigerian law...",
      "duration": "1:30",
      "durationSeconds": 90,
      "order": 1,
      "viewCount": 2700,
      "completedBy": 2500,
      "createdAt": "2025-01-22T00:00:00Z",
      "updatedAt": "2025-04-20T00:00:00Z"
    }
  ]
}
```

### `POST /admin/modules/:moduleId/topics/:topicId/subtopics`

Create a new subtopic.

**Request Body:**
```json
{
  "title": "New Sub-Topic",
  "notes": "",
  "duration": "—",
  "order": 4
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sub-topic created",
  "data": {
    "id": "st010",
    "topicId": "t003",
    "title": "New Sub-Topic",
    "notes": "",
    "order": 4,
    "viewCount": 0,
    "completedBy": 0,
    "createdAt": "2025-04-22T10:00:00Z"
  }
}
```

### `PATCH /admin/modules/:moduleId/topics/:topicId/subtopics/:subtopicId`

Update any subtopic fields.

**Request Body (all fields optional):**
```json
{
  "title": "Updated Sub-Topic Title",
  "notes": "Updated instructor notes and script...",
  "duration": "1:45",
  "order": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sub-topic updated",
  "data": { "id": "st007", "updatedAt": "2025-04-22T10:00:00Z" }
}
```

### `PATCH /admin/modules/:moduleId/topics/:topicId/subtopics/:subtopicId/notes`

Notes-only update (lighter payload, no status side-effects).

**Request Body:**
```json
{
  "notes": "Updated instructor notes and full script for this sub-topic..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "st007",
    "notes": "Updated instructor notes and full script...",
    "updatedAt": "2025-04-22T10:00:00Z"
  }
}
```

### `DELETE /admin/modules/:moduleId/topics/:topicId/subtopics/:subtopicId`

Delete a subtopic.

**Response:**
```json
{
  "success": true,
  "message": "Sub-topic deleted"
}
```

### `PATCH /admin/modules/:moduleId/topics/:topicId/subtopics/reorder`

Reorder all subtopics within a topic.

**Request Body:**
```json
{
  "orderedIds": ["st009", "st007", "st008"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sub-topics reordered"
}
```

---

## 8. Community Posts

### `GET /admin/community/posts`

List all community posts with filters.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `status` | `active \| promoted \| pending \| removed \| all` | `all` | Filter by status |
| `type` | `discussion \| argument \| poll \| announcement \| case_study \| all` | `all` | Filter by post type |
| `search` | `string` | — | Search by title, author, or tags |
| `page` | `number` | `1` | Page number |
| `pageSize` | `number` | `20` | Items per page |

**Response:**
```json
{
  "data": [
    {
      "id": "p001",
      "type": "discussion",
      "status": "promoted",
      "title": "What exactly happens if police detain you beyond 24 hours without charge?",
      "content": "I was detained for almost 36 hours...",
      "author": {
        "id": "u001",
        "name": "Chidinma Okafor",
        "initials": "CO",
        "color": "#3B82F6",
        "role": "citizen",
        "verified": false,
        "state": "Enugu"
      },
      "category": "Police Rights",
      "tags": ["Section 35", "Detention", "Arrest Rights", "Police"],
      "likes": 47,
      "views": 1243,
      "commentCount": 18,
      "shares": 12,
      "bookmarks": 29,
      "reportCount": 0,
      "promoted": true,
      "promotedAt": "2025-04-20T12:00:00Z",
      "promotedBy": "Super Admin",
      "pinned": false,
      "removed": false,
      "createdAt": "2025-04-20T09:00:00Z",
      "updatedAt": "2025-04-20T11:05:00Z",
      "pollOptions": null,
      "adminNote": null
    }
  ],
  "total": 7,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

### `GET /admin/community/posts/stats`

Summary counts for the community stats bar.

**Response:**
```json
{
  "data": {
    "totalPosts": 7,
    "promoted": 3,
    "pendingReview": 1,
    "removed": 1
  }
}
```

### `GET /admin/community/posts/:id`

Get full post with comments and reports.

**Response:**
```json
{
  "data": {
    "id": "p001",
    "type": "discussion",
    "status": "promoted",
    "title": "What exactly happens...",
    "content": "I was detained for almost 36 hours...",
    "author": {
      "id": "u001",
      "name": "Chidinma Okafor",
      "initials": "CO",
      "color": "#3B82F6",
      "role": "citizen",
      "verified": false,
      "state": "Enugu"
    },
    "category": "Police Rights",
    "tags": ["Section 35", "Detention"],
    "likes": 47,
    "views": 1243,
    "commentCount": 18,
    "shares": 12,
    "bookmarks": 29,
    "reportCount": 0,
    "promoted": true,
    "promotedAt": "2025-04-20T12:00:00Z",
    "promotedBy": "Super Admin",
    "pinned": false,
    "removed": false,
    "createdAt": "2025-04-20T09:00:00Z",
    "updatedAt": "2025-04-20T11:05:00Z",
    "pollOptions": null,
    "adminNote": null,
    "comments": [
      {
        "id": "c001",
        "postId": "p001",
        "author": {
          "id": "l001",
          "name": "Adaeze Okonkwo",
          "initials": "AO",
          "color": "#1E3A5F",
          "role": "lawyer",
          "verified": true
        },
        "content": "You are absolutely right. Section 35(4)...",
        "likes": 34,
        "createdAt": "2025-04-20T10:30:00Z",
        "flagged": false,
        "removed": false
      }
    ],
    "reports": []
  }
}
```

### `POST /admin/community/posts`

Create a new admin post (published immediately).

**Request Body:**
```json
{
  "type": "announcement",
  "title": "New Module Live: 24-Hour Detention Rule",
  "content": "We've just published a comprehensive new module...",
  "category": "Platform Update",
  "tags": ["New Module", "Detention", "Learning"],
  "pinned": true,
  "promoted": true,
  "pollOptions": null
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post published successfully",
  "data": {
    "id": "p008",
    "type": "announcement",
    "status": "promoted",
    "title": "New Module Live: 24-Hour Detention Rule",
    "promoted": true,
    "pinned": true,
    "createdAt": "2025-04-22T10:00:00Z"
  }
}
```

### `PATCH /admin/community/posts/:id/approve`

Approve a pending post (publishes it).

**Request Body:**
```json
{
  "note": "Approved — relevant and well-written."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post approved and published",
  "data": { "id": "p006", "status": "active" }
}
```

### `PATCH /admin/community/posts/:id/remove`

Remove a post (soft-delete).

**Request Body:**
```json
{
  "reason": "Facilitating document fraud — directly violates platform community standards."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post removed",
  "data": {
    "id": "p007",
    "status": "removed",
    "removedAt": "2025-04-22T10:00:00Z",
    "removedBy": "Super Admin"
  }
}
```

### `PATCH /admin/community/posts/:id/restore`

Restore a removed post.

**Request Body:**
```json
{
  "note": "Restored — removal was in error."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post restored",
  "data": { "id": "p007", "status": "active" }
}
```

### `PATCH /admin/community/posts/:id/promote`

Promote a post (adds star badge).

**Response:**
```json
{
  "success": true,
  "message": "Post promoted",
  "data": {
    "id": "p001",
    "promoted": true,
    "status": "promoted",
    "promotedAt": "2025-04-22T10:00:00Z",
    "promotedBy": "Super Admin"
  }
}
```

### `PATCH /admin/community/posts/:id/demote`

Remove promotion from a post.

**Response:**
```json
{
  "success": true,
  "message": "Promotion removed",
  "data": { "id": "p001", "promoted": false, "status": "active" }
}
```

### `PATCH /admin/community/posts/:id/pin`

Pin a post to the top of the feed.

**Response:**
```json
{
  "success": true,
  "message": "Post pinned",
  "data": {
    "id": "p003",
    "pinned": true,
    "pinnedAt": "2025-04-22T10:00:00Z",
    "pinnedBy": "Super Admin"
  }
}
```

### `PATCH /admin/community/posts/:id/unpin`

Unpin a post.

**Response:**
```json
{
  "success": true,
  "message": "Post unpinned",
  "data": { "id": "p003", "pinned": false }
}
```

### `PATCH /admin/community/posts/:id/comments/:commentId/remove`

Remove a specific comment.

**Request Body:**
```json
{
  "reason": "Spam — unrelated to legal topic"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Comment removed",
  "data": { "id": "c001", "removed": true, "removedReason": "Spam — unrelated to legal topic" }
}
```

### `PATCH /admin/community/posts/:id/comments/:commentId/restore`

Restore a removed comment.

**Response:**
```json
{
  "success": true,
  "message": "Comment restored",
  "data": { "id": "c001", "removed": false }
}
```

### `PATCH /admin/community/posts/:id/reports/:reportId/resolve`

Mark a report as resolved.

**Response:**
```json
{
  "success": true,
  "message": "Report resolved",
  "data": { "id": "r001", "resolved": true }
}
```

---

## 9. Legal Library — Books

### `GET /admin/library/books`

List all books with filters.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `format` | `pdf \| physical \| both \| all` | `all` | Filter by format |
| `status` | `active \| inactive \| draft \| all` | `all` | Filter by status |
| `category` | `criminal \| tenancy \| employment \| contracts \| business \| family \| consumer \| road \| constitutional \| all` | `all` | Filter by category |
| `search` | `string` | — | Search by title, author, or tags |
| `page` | `number` | `1` | Page number |
| `pageSize` | `number` | `20` | Items per page |

**Response:**
```json
{
  "data": [
    {
      "id": "b001",
      "title": "Know Your Rights: Arrest & Detention in Nigeria",
      "author": "Adaeze Okonkwo",
      "description": "A plain-English guide to Section 35...",
      "category": "criminal",
      "coverUrl": "/images/police_law.jpg",
      "pdfUrl": "/books/arrest-rights.pdf",
      "format": "both",
      "status": "active",
      "pricePhysical": 3500,
      "totalPages": 142,
      "isbn": "978-978-XXX-001",
      "publishedYear": 2024,
      "tags": ["arrest", "police", "Section 35"],
      "downloadCount": 1847,
      "orderCount": 234,
      "createdAt": "2025-01-10",
      "updatedAt": "2025-04-20",
      "featured": true,
      "stockCount": 80
    }
  ],
  "total": 6,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

### `GET /admin/library/books/stats`

Summary stats for the library stats bar.

**Response:**
```json
{
  "data": {
    "totalBooks": 6,
    "totalDownloads": 6895,
    "totalOrders": 5,
    "pendingOrders": 2,
    "totalRevenue": 24500,
    "featuredBooks": 2
  }
}
```

### `GET /admin/library/books/:id`

Get a single book by ID.

**Response:**
```json
{
  "data": {
    "id": "b001",
    "title": "Know Your Rights: Arrest & Detention in Nigeria",
    "author": "Adaeze Okonkwo",
    "description": "A plain-English guide to Section 35...",
    "category": "criminal",
    "coverUrl": "/images/police_law.jpg",
    "pdfUrl": "/books/arrest-rights.pdf",
    "format": "both",
    "status": "active",
    "pricePhysical": 3500,
    "totalPages": 142,
    "isbn": "978-978-XXX-001",
    "publishedYear": 2024,
    "tags": ["arrest", "police", "Section 35", "detention", "bail"],
    "downloadCount": 1847,
    "orderCount": 234,
    "createdAt": "2025-01-10",
    "updatedAt": "2025-04-20",
    "featured": true,
    "stockCount": 80
  }
}
```

### `POST /admin/library/books`

Upload / create a new book. Saved as `draft` by default.

**Request Body:**
```json
{
  "title": "Know Your Rights: Arrest & Detention in Nigeria",
  "author": "Adaeze Okonkwo",
  "description": "A plain-English guide...",
  "category": "criminal",
  "format": "both",
  "coverUrl": "https://cdn.lawticha.ng/covers/b001.jpg",
  "pdfUrl": "https://cdn.lawticha.ng/books/arrest-rights.pdf",
  "pricePhysical": 3500,
  "totalPages": 142,
  "isbn": "978-978-XXX-001",
  "publishedYear": 2024,
  "tags": ["arrest", "police", "Section 35"],
  "stockCount": 100
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book uploaded and saved as draft",
  "data": {
    "id": "b007",
    "title": "Know Your Rights: Arrest & Detention in Nigeria",
    "status": "draft",
    "createdAt": "2025-04-22T10:00:00Z"
  }
}
```

### `PATCH /admin/library/books/:id`

Update book details.

**Request Body (all fields optional):**
```json
{
  "title": "Updated Title",
  "status": "active",
  "featured": true,
  "pricePhysical": 4000,
  "stockCount": 150,
  "tags": ["arrest", "rights"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book updated",
  "data": { "id": "b001", "updatedAt": "2025-04-22T10:00:00Z" }
}
```

### `PATCH /admin/library/books/:id/status`

Toggle book status (active ↔ inactive).

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Response:**
```json
{
  "success": true,
  "data": { "id": "b001", "status": "inactive" }
}
```

### `PATCH /admin/library/books/:id/featured`

Toggle featured flag.

**Request Body:**
```json
{
  "featured": true
}
```

**Response:**
```json
{
  "success": true,
  "data": { "id": "b001", "featured": true }
}
```

### `DELETE /admin/library/books/:id`

Delete a book record.

**Response:**
```json
{
  "success": true,
  "message": "Book deleted"
}
```

---

## 10. Legal Library — Orders

### `GET /admin/library/orders`

List all book orders with filters.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `status` | `pending \| processing \| shipped \| delivered \| cancelled \| all` | `all` | Filter by status |
| `search` | `string` | — | Search by customer name, book title, or payment ref |
| `page` | `number` | `1` | Page number |
| `pageSize` | `number` | `20` | Items per page |

**Response:**
```json
{
  "data": [
    {
      "id": "o001",
      "bookId": "b001",
      "bookTitle": "Know Your Rights: Arrest & Detention in Nigeria",
      "coverUrl": "/images/police_law.jpg",
      "userId": "u001",
      "userName": "Chidinma Okafor",
      "userEmail": "chidinma@gmail.com",
      "deliveryAddress": "12 Udi Road, GRA",
      "phone": "08012345678",
      "state": "Enugu",
      "quantity": 2,
      "unitPrice": 3500,
      "totalAmount": 7000,
      "status": "delivered",
      "paymentRef": "PAY-20250415-001",
      "orderedAt": "2025-04-15T09:22:00Z",
      "updatedAt": "2025-04-18T14:30:00Z",
      "trackingNumber": "GIG-4521887",
      "notes": ""
    }
  ],
  "total": 5,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

### `GET /admin/library/orders/:id`

Get a single order by ID.

**Response:** Same shape as a single item in the list above.

### `PATCH /admin/library/orders/:id/status`

Update order status (move through fulfilment pipeline).

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "GIG-4521999"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated to shipped",
  "data": {
    "id": "o002",
    "status": "shipped",
    "trackingNumber": "GIG-4521999",
    "updatedAt": "2025-04-22T10:00:00Z"
  }
}
```

---

## 11. Consultations

### `GET /admin/consultations`

List all consultation requests across all lawyers and citizens.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `status` | `pending \| accepted \| completed \| declined \| cancelled \| all` | `all` | Filter by status |
| `mode` | `message \| call \| video \| all` | `all` | Filter by consultation mode |
| `search` | `string` | — | Search by citizen name, lawyer name, or topic |
| `page` | `number` | `1` | Page number |
| `pageSize` | `number` | `20` | Items per page |

**Response:**
```json
{
  "data": [
    {
      "id": "c001",
      "kind": "consultation",
      "citizenId": "u001",
      "citizenName": "Chidinma Okafor",
      "lawyerId": "l001",
      "lawyerName": "Adaeze Okonkwo",
      "lawyerInitials": "AO",
      "lawyerColorA": "#1E3A5F",
      "lawyerColorB": "#2D5A8E",
      "lawyerTitle": "Criminal & Civil Rights Lawyer",
      "mode": "video",
      "topic": "My landlord locked me out without a court order",
      "status": "completed",
      "fee": 18000,
      "createdAt": "2025-04-14T09:22:00Z",
      "scheduledAt": "2025-04-15T14:00:00Z",
      "completedAt": "2025-04-15T14:48:00Z",
      "rating": 5,
      "receiptId": "RCP-2025-04140098"
    }
  ],
  "total": 12,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

---

## 12. Reviews

### `GET /admin/reviews`

List all lawyer reviews.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `lawyerId` | `string` | — | Filter by specific lawyer |
| `rating` | `1 \| 2 \| 3 \| 4 \| 5` | — | Filter by star rating |
| `page` | `number` | `1` | Page number |
| `pageSize` | `number` | `20` | Items per page |

**Response:**
```json
{
  "data": [
    {
      "id": "r001",
      "consultationId": "c001",
      "lawyerId": "l001",
      "lawyerName": "Adaeze Okonkwo",
      "citizenId": "u001",
      "citizenName": "Chidinma Okafor",
      "citizenInitials": "CO",
      "citizenColor": "#3B82F6",
      "rating": 5,
      "text": "Extremely clear and direct. Gave me exactly the advice I needed.",
      "createdAt": "2025-04-15T15:02:00Z",
      "flagged": false,
      "removed": false
    }
  ],
  "total": 84,
  "page": 1,
  "pageSize": 20,
  "totalPages": 5
}
```

### `DELETE /admin/reviews/:id`

Remove a fraudulent or policy-violating review.

**Request Body:**
```json
{
  "reason": "Review contains personal information of third party"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review removed"
}
```

---

## 13. Reports

### `GET /admin/reports`

List all user-submitted content reports.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `resolved` | `boolean` | `false` | Filter by resolution status |
| `type` | `post \| comment \| lawyer \| citizen` | — | Filter by report target type |
| `page` | `number` | `1` | Page number |
| `pageSize` | `number` | `20` | Items per page |

**Response:**
```json
{
  "data": [
    {
      "id": "rep001",
      "targetType": "post",
      "targetId": "p006",
      "targetTitle": "Are there any loopholes to avoid paying taxes as a freelancer?",
      "reporterId": "u002",
      "reporterName": "Babatunde Lawal",
      "reason": "Asking for tax evasion advice, not legal education",
      "createdAt": "2025-04-21T15:30:00Z",
      "resolved": false
    }
  ],
  "total": 3,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

### `PATCH /admin/reports/:id/resolve`

Mark a report as resolved.

**Request Body:**
```json
{
  "note": "Post reviewed and removed. Correct action taken."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Report resolved",
  "data": { "id": "rep001", "resolved": true }
}
```

---

## 14. Analytics

### `GET /admin/analytics/overview`

Platform-wide analytics summary.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `period` | `7d \| 30d \| 90d \| all` | `30d` | Date range |

**Response:**
```json
{
  "data": {
    "totalUsers": 10,
    "newUsersThisPeriod": 4,
    "totalLessonsWatched": 84203,
    "totalConsultations": 1560,
    "totalRevenue": 24500,
    "avgSessionDurationMinutes": 18,
    "topModules": [
      { "id": "m001", "title": "Rights During Arrest & Detention", "enrolledCount": 3842 }
    ],
    "topLawyers": [
      { "id": "l002", "name": "Emeka Nwosu", "consultations": 487 }
    ],
    "userGrowth": [
      { "date": "2025-04-01", "newUsers": 12 },
      { "date": "2025-04-08", "newUsers": 18 }
    ],
    "revenueByPeriod": [
      { "date": "2025-04-01", "revenue": 4500 },
      { "date": "2025-04-08", "revenue": 7000 }
    ]
  }
}
```

---

## 15. Settings

### `GET /admin/settings`

Get current platform settings.

**Response:**
```json
{
  "data": {
    "platformName": "LawTicha",
    "supportEmail": "support@lawticha.ng",
    "maintenanceMode": false,
    "newRegistrationsEnabled": true,
    "communityEnabled": true,
    "marketplaceEnabled": true,
    "paymentMethods": {
      "paystack": true,
      "palmPay": false,
      "oPay": false,
      "cashOnDelivery": false
    },
    "verificationChecklist": [
      "Call to Bar Certificate",
      "Law School Certificate",
      "Practicing License (current year)",
      "Government-Issued ID"
    ]
  }
}
```

### `PATCH /admin/settings`

Update platform settings.

**Request Body (all fields optional):**
```json
{
  "maintenanceMode": false,
  "newRegistrationsEnabled": true,
  "communityEnabled": true,
  "paymentMethods": {
    "paystack": true,
    "palmPay": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings updated",
  "data": { "updatedAt": "2025-04-22T10:00:00Z" }
}
```

---

## 16. Uploads

### `POST /admin/uploads/thumbnail`

Upload a module or topic thumbnail image.

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | `File` | Yes | Image file (JPG or PNG, max 5MB) |
| `moduleId` | `string` | No | Module to associate with |
| `topicId` | `string` | No | Topic to associate with |

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.lawticha.ng/thumbnails/m001-thumb.jpg",
    "key": "thumbnails/m001-thumb.jpg",
    "filename": "police_law.jpg",
    "sizeBytes": 245760,
    "mimeType": "image/jpeg"
  }
}
```

### `POST /admin/uploads/video`

Upload a topic video.

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | `File` | Yes | Video file (MP4, MOV, WebM — max 500MB) |
| `moduleId` | `string` | Yes | Module ID |
| `topicId` | `string` | Yes | Topic ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.lawticha.ng/videos/t001-video.mp4",
    "key": "videos/t001-video.mp4",
    "filename": "topic1.mp4",
    "sizeBytes": 52428800,
    "mimeType": "video/mp4",
    "duration": "4:32",
    "durationSeconds": 272,
    "thumbnailUrl": "https://cdn.lawticha.ng/thumbnails/t001-auto.jpg"
  }
}
```

### `POST /admin/uploads/presign`

Get a presigned S3 URL for direct large-file uploads.

**Request Body:**
```json
{
  "filename": "topic-video.mp4",
  "mimeType": "video/mp4",
  "sizeBytes": 104857600
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://lawticha-uploads.s3.amazonaws.com/videos/abc123?X-Amz-Signature=...",
    "fileKey": "videos/abc123-topic-video.mp4",
    "expiresAt": "2025-04-22T11:00:00Z"
  }
}
```

### `POST /admin/uploads/book-pdf`

Upload a book PDF file.

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | `File` | Yes | PDF file (max 50MB) |
| `bookId` | `string` | No | Book to associate with |

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.lawticha.ng/books/arrest-rights.pdf",
    "key": "books/arrest-rights.pdf",
    "filename": "arrest-rights.pdf",
    "sizeBytes": 2097152,
    "mimeType": "application/pdf"
  }
}
```

### `POST /admin/uploads/book-cover`

Upload a book cover image.

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | `File` | Yes | Image file (JPG or PNG, 600×900px recommended) |
| `bookId` | `string` | No | Book to associate with |

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.lawticha.ng/covers/b001-cover.jpg",
    "key": "covers/b001-cover.jpg",
    "filename": "cover.jpg",
    "sizeBytes": 98304,
    "mimeType": "image/jpeg"
  }
}
```

---

## 17. Auth

### `POST /api/v1/auth/admin/login`

Authenticate an admin user.

**Request Body:**
```json
{
  "email": "admin@lawticha.ng",
  "password": "YourSecurePassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "id": "admin001",
      "name": "Super Admin",
      "email": "admin@lawticha.ng",
      "role": "super_admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

> Token is also delivered as a `Set-Cookie: admin_token=...; HttpOnly; Secure; SameSite=Strict` header.

### `POST /api/v1/auth/admin/logout`

Invalidate the current admin session.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### `GET /api/v1/auth/admin/me`

Get the authenticated admin's profile.

**Response:**
```json
{
  "data": {
    "id": "admin001",
    "name": "Super Admin",
    "email": "admin@lawticha.ng",
    "role": "super_admin",
    "lastLogin": "2025-04-22T09:00:00Z"
  }
}
```

---

## Common Error Responses

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "code": "MACHINE_READABLE_CODE",
  "errors": {
    "fieldName": ["Validation error message"]
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request — validation failed |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient role |
| `404` | Not Found |
| `409` | Conflict — e.g. duplicate NBA number |
| `422` | Unprocessable Entity |
| `500` | Internal Server Error |

---

## Notes for Backend Implementation

1. **All list endpoints must return pagination** — `total`, `page`, `pageSize`, `totalPages`.
2. **Soft deletes** — `removePost`, `removeComment`, `deleteCitizen` should all be soft-deleted (set `removedAt` + `removedBy`), never hard-deleted.
3. **Audit logging** — Every admin action (approve/reject/remove/promote) should write an audit log entry with `adminId`, `action`, `targetType`, `targetId`, and `timestamp`.
4. **File upload flow** — For large files, use the presigned URL endpoint; for small files (thumbnails, covers), use the direct multipart upload endpoints.
5. **Token delivery** — Deliver JWT as both a JSON body field AND an `HttpOnly` cookie. The cookie should be used for browser auth; the JSON field for Postman/API clients.
6. **Verification flow** — Approving a verification (`PATCH /verifications/:id/approve`) should atomically create a lawyer profile with status `active` and send an approval email.
7. **Stats endpoints** — These should be cached (e.g. 60s TTL) as they're called on every page load.
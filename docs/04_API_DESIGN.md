# API Design Document
## THE BIG FAMILY LEGACY Platform

---

## 1. API Overview

### 1.1 API Specifications
- **Protocol**: REST over HTTPS
- **Format**: JSON
- **Authentication**: JWT (Bearer tokens)
- **Versioning**: URL path versioning (`/api/v1/...`)
- **Base URL**: `https://api.bigfamilylegacy.com/api/v1`

### 1.2 Global Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
X-API-Version: 1.0
X-Request-ID: <uuid>  # For tracing
```

---

## 2. Authentication API

### 2.1 Register User

**Endpoint**: `POST /api/v1/auth/register`

**Request**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "full_name": "John Smith",
  "family_code": "SMITH2026"  // Optional: join existing family
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "full_name": "John Smith",
      "created_at": "2026-02-16T10:00:00Z"
    },
    "token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "expires_in": 3600
  }
}
```

**Error** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "This email is already registered",
    "details": {}
  }
}
```

---

### 2.2 Login

**Endpoint**: `POST /api/v1/auth/login`

**Request**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "full_name": "John Smith",
      "families": [
        {
          "id": "family-uuid",
          "name": "The Smith Family",
          "role": "admin"
        }
      ]
    },
    "token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "expires_in": 3600
  }
}
```

---

### 2.3 Logout

**Endpoint**: `POST /api/v1/auth/logout`

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

---

## 3. Family API

### 3.1 Create Family

**Endpoint**: `POST /api/v1/families`

**Request**:
```json
{
  "name": "The Smith Family",
  "description": "Our family legacy from 1945 to present",
  "cover_image_url": "https://...",
  "settings": {
    "privacy": "private",
    "allow_contributions": true,
    "require_approval": false
  }
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "family-uuid",
    "name": "The Smith Family",
    "description": "Our family legacy from 1945 to present",
    "family_code": "SMITH2026",  // For inviting others
    "created_by": "user-uuid",
    "created_at": "2026-02-16T10:00:00Z"
  }
}
```

---

### 3.2 Get Family Details

**Endpoint**: `GET /api/v1/families/:familyId`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "family-uuid",
    "name": "The Smith Family",
    "description": "Our family legacy from 1945 to present",
    "cover_image_url": "https://...",
    "created_by": "user-uuid",
    "created_at": "2026-02-16T10:00:00Z",
    "stats": {
      "total_members": 45,
      "total_memories": 123,
      "total_stories": 5,
      "active_users": 8
    },
    "members": [
      {
        "user_id": "uuid",
        "full_name": "John Smith",
        "role": "admin",
        "joined_at": "2026-02-16T10:00:00Z"
      }
    ]
  }
}
```

---

## 4. Family Member API

### 4.1 Add Family Member

**Endpoint**: `POST /api/v1/families/:familyId/members`

**Request**:
```json
{
  "first_name": "Robert",
  "middle_name": "James",
  "last_name": "Smith",
  "nickname": "Bobby",
  "gender": "male",
  "birth_date": "1975-05-15",
  "birth_place": "New York, USA",
  "profile_photo_url": "https://...",
  "biography": "Bobby is a loving father and software engineer...",
  "metadata": {
    "occupation": "Software Engineer",
    "hobbies": ["photography", "hiking"]
  }
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "member-uuid",
    "full_name": "Robert James Smith",
    "nickname": "Bobby",
    "birth_date": "1975-05-15",
    "created_at": "2026-02-16T10:00:00Z"
  }
}
```

---

### 4.2 Get Family Tree

**Endpoint**: `GET /api/v1/families/:familyId/tree`

**Query Parameters**:
- `generations`: Number of generations (default: 3, max: 5)
- `focus_person`: UUID of person to center the tree on
- `format`: `json` | `gedcom` (default: `json`)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "tree": {
      "root_person": {
        "id": "member-uuid",
        "full_name": "John Smith",
        "birth_date": "1945-03-15",
        "profile_photo_url": "https://...",
        "is_deceased": false
      },
      "relationships": [
        {
          "person": {
            "id": "member-uuid-2",
            "full_name": "Mary Smith",
            "birth_date": "1948-07-22"
          },
          "relationship_type": "spouse",
          "start_date": "1970-06-15"
        },
        {
          "person": {
            "id": "member-uuid-3",
            "full_name": "Robert Smith",
            "birth_date": "1975-05-15"
          },
          "relationship_type": "child"
        }
      ],
      "children": [
        // Recursive structure for descendants
      ]
    },
    "statistics": {
      "total_people": 45,
      "generations": 4,
      "living_members": 38,
      "deceased_members": 7
    }
  }
}
```

---

## 5. Memory API

### 5.1 Upload Memory

**Endpoint**: `POST /api/v1/memories/upload`

**Request** (multipart/form-data):
```
POST /api/v1/memories/upload
Content-Type: multipart/form-data

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="photo.jpg"
Content-Type: image/jpeg

<binary data>
------WebKitFormBoundary
Content-Disposition: form-data; name="data"

{
  "family_id": "family-uuid",
  "title": "Grandpa's 80th Birthday",
  "description": "Family gathering at the lake house",
  "memory_date": "2025-08-15",
  "location_name": "Lake Tahoe, CA",
  "people": ["member-uuid-1", "member-uuid-2"],
  "tags": ["birthday", "celebration", "lake"]
}
------WebKitFormBoundary--
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "memory-uuid",
    "title": "Grandpa's 80th Birthday",
    "file_url": "https://r2.../original.jpg",
    "thumbnail_url": "https://r2.../thumb_512.jpg",
    "status": "processing",  // AI analysis in progress
    "uploaded_by": "user-uuid",
    "created_at": "2026-02-16T10:00:00Z"
  }
}
```

---

### 5.2 Get Memory Details

**Endpoint**: `GET /api/v1/memories/:memoryId`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "memory-uuid",
    "family_id": "family-uuid",
    "title": "Grandpa's 80th Birthday",
    "description": "Family gathering at the lake house",
    "memory_type": "photo",
    "file_url": "https://r2.../original.jpg",
    "thumbnail_url": "https://r2.../thumb_512.jpg",
    "memory_date": "2025-08-15",
    "location_name": "Lake Tahoe, CA",
    "ai_caption": "A joyful family gathering outdoors with elderly man blowing candles on a cake",
    "ai_analysis": {
      "scene": "outdoor_celebration",
      "dominant_colors": ["blue", "green", "white"],
      "estimated_time_period": "2020s",
      "detected_objects": ["cake", "candles", "people", "lake"]
    },
    "detected_faces": [
      {
        "person_id": "member-uuid-1",
        "person_name": "John Smith",
        "confidence": 0.95,
        "is_confirmed": true,
        "bbox": {"x": 100, "y": 150, "width": 120, "height": 150}
      }
    ],
    "people": [
      {
        "id": "member-uuid-1",
        "full_name": "John Smith",
        "profile_photo_url": "https://..."
      }
    ],
    "uploaded_by": {
      "id": "user-uuid",
      "full_name": "Mary Smith"
    },
    "view_count": 45,
    "created_at": "2026-02-16T10:00:00Z",
    "updated_at": "2026-02-16T10:05:00Z"
  }
}
```

---

### 5.3 List Memories

**Endpoint**: `GET /api/v1/families/:familyId/memories`

**Query Parameters**:
- `type`: `photo` | `video` | `story` | `document` | `audio`
- `person_id`: Filter by person
- `year`: Filter by year
- `limit`: Number of results (default: 20, max: 100)
- `offset`: Pagination offset
- `sort`: `date_desc` | `date_asc` | `views_desc` | `recent`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "memories": [
      {
        "id": "memory-uuid",
        "title": "Grandpa's 80th Birthday",
        "memory_type": "photo",
        "thumbnail_url": "https://...",
        "memory_date": "2025-08-15",
        "people_count": 12,
        "view_count": 45,
        "created_at": "2026-02-16T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 123,
      "limit": 20,
      "offset": 0,
      "has_more": true
    }
  }
}
```

---

### 5.4 Trigger AI Analysis

**Endpoint**: `POST /api/v1/memories/:memoryId/analyze`

**Request**:
```json
{
  "force_reanalysis": false  // Re-analyze even if already done
}
```

**Response** (202 Accepted):
```json
{
  "success": true,
  "data": {
    "job_id": "job-uuid",
    "status": "queued",
    "estimated_completion_seconds": 30
  }
}
```

**Check Status**: `GET /api/v1/jobs/:jobId`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "job_id": "job-uuid",
    "status": "completed",  // queued | processing | completed | failed
    "result": {
      "ai_caption": "A joyful family gathering...",
      "detected_faces": [...],
      "ai_analysis": {...}
    },
    "started_at": "2026-02-16T10:00:00Z",
    "completed_at": "2026-02-16T10:00:25Z"
  }
}
```

---

## 6. Story Generation API

### 6.1 Generate Story

**Endpoint**: `POST /api/v1/stories/generate`

**Request**:
```json
{
  "family_id": "family-uuid",
  "focus_person_id": "member-uuid",  // Optional: focus on one person
  "included_memories": ["memory-uuid-1", "memory-uuid-2"],  // Optional
  "tone": "formal",  // formal | casual | emotional
  "length": "medium",  // short | medium | long
  "include_historical_context": true,
  "custom_prompt": "Focus on his career journey and family values"  // Optional
}
```

**Response** (202 Accepted):
```json
{
  "success": true,
  "data": {
    "story_id": "story-uuid",
    "status": "generating",
    "estimated_completion_seconds": 45
  }
}
```

---

### 6.2 Get Story

**Endpoint**: `GET /api/v1/stories/:storyId`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "story-uuid",
    "title": "The Legacy of John Smith: A Life Well Lived",
    "content": "John Smith was born on a crisp spring morning in 1945...",
    "summary": "A narrative of John Smith's journey from...",
    "focus_person": {
      "id": "member-uuid",
      "full_name": "John Smith",
      "profile_photo_url": "https://..."
    },
    "included_people": [
      {"id": "uuid", "full_name": "Mary Smith"}
    ],
    "included_memories": [
      {"id": "uuid", "title": "Wedding Day", "thumbnail_url": "https://..."}
    ],
    "status": "ready",
    "model_used": "gpt-4",
    "generation_time_ms": 45000,
    "view_count": 12,
    "is_favorite": false,
    "generated_by": "user-uuid",
    "created_at": "2026-02-16T10:00:00Z"
  }
}
```

---

### 6.3 Export Story as PDF

**Endpoint**: `POST /api/v1/stories/:storyId/export`

**Request**:
```json
{
  "format": "pdf",  // pdf | docx | epub
  "include_photos": true,
  "include_timeline": true,
  "custom_cover": "https://..."  // Optional custom cover image
}
```

**Response** (202 Accepted):
```json
{
  "success": true,
  "data": {
    "export_id": "export-uuid",
    "status": "generating",
    "estimated_completion_seconds": 20
  }
}
```

**Download**: `GET /api/v1/exports/:exportId/download`

---

## 7. Chat API (Digital Ancestor)

### 7.1 Start Conversation

**Endpoint**: `POST /api/v1/chat/start`

**Request**:
```json
{
  "family_id": "family-uuid",
  "ancestor_id": "member-uuid",
  "initial_message": "Grandpa, tell me about your childhood"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "conversation_id": "conv-uuid",
    "ancestor": {
      "id": "member-uuid",
      "full_name": "John Smith",
      "profile_photo_url": "https://...",
      "birth_date": "1945-03-15"
    },
    "first_message": {
      "id": "msg-uuid",
      "role": "assistant",
      "content": "Ah, my childhood... I grew up in Bandung during the 1950s. Those were simpler times...",
      "sources": [
        {
          "memory_id": "uuid",
          "snippet": "Bandung 1952 - Playing with friends"
        }
      ],
      "created_at": "2026-02-16T10:00:00Z"
    }
  }
}
```

---

### 7.2 Send Message

**Endpoint**: `POST /api/v1/chat/:conversationId/message`

**Request**:
```json
{
  "message": "What was your favorite memory from that time?"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user_message": {
      "id": "msg-uuid-1",
      "role": "user",
      "content": "What was your favorite memory from that time?",
      "created_at": "2026-02-16T10:01:00Z"
    },
    "assistant_message": {
      "id": "msg-uuid-2",
      "role": "assistant",
      "content": "My favorite memory was playing soccer with my brother...",
      "sources": [
        {
          "memory_id": "uuid",
          "snippet": "Photo: Brothers playing soccer, 1957"
        }
      ],
      "model_used": "gpt-4",
      "latency_ms": 1250,
      "created_at": "2026-02-16T10:01:02Z"
    }
  }
}
```

---

### 7.3 Get Conversation History

**Endpoint**: `GET /api/v1/chat/:conversationId/history`

**Query Parameters**:
- `limit`: Number of messages (default: 50)
- `before`: Message ID for pagination

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "conv-uuid",
      "ancestor": {...},
      "started_at": "2026-02-16T10:00:00Z",
      "total_messages": 12
    },
    "messages": [
      {
        "id": "msg-uuid",
        "role": "user",
        "content": "Tell me about your childhood",
        "created_at": "2026-02-16T10:00:00Z"
      },
      {
        "id": "msg-uuid-2",
        "role": "assistant",
        "content": "Ah, my childhood...",
        "sources": [...],
        "created_at": "2026-02-16T10:00:02Z"
      }
    ],
    "has_more": false
  }
}
```

---

## 8. Search API

### 8.1 Global Search

**Endpoint**: `GET /api/v1/search`

**Query Parameters**:
- `q`: Search query (required)
- `family_id`: Filter by family (required)
- `types`: Comma-separated types (`person,memory,story`)
- `limit`: Results per type (default: 10)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "query": "john birthday",
    "results": {
      "people": [
        {
          "type": "person",
          "id": "member-uuid",
          "full_name": "John Smith",
          "birth_date": "1945-03-15",
          "profile_photo_url": "https://...",
          "relevance_score": 0.95
        }
      ],
      "memories": [
        {
          "type": "memory",
          "id": "memory-uuid",
          "title": "John's 80th Birthday",
          "thumbnail_url": "https://...",
          "memory_date": "2025-03-15",
          "relevance_score": 0.92
        }
      ],
      "stories": [
        {
          "type": "story",
          "id": "story-uuid",
          "title": "The Legacy of John Smith",
          "summary": "A narrative of John Smith's journey...",
          "relevance_score": 0.88
        }
      ]
    },
    "total_results": 15
  }
}
```

---

## 9. Relationship API

### 9.1 Add Relationship

**Endpoint**: `POST /api/v1/relationships`

**Request**:
```json
{
  "family_id": "family-uuid",
  "person1_id": "member-uuid-1",
  "person2_id": "member-uuid-2",
  "relationship_type": "parent",  // parent | child | spouse | sibling
  "start_date": "1970-06-15",  // For spouse relationships (marriage date)
  "notes": "Married at St. Mary's Church"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "rel-uuid",
    "person1": {...},
    "person2": {...},
    "relationship_type": "parent",
    "inverse_relationship_created": true,  // Auto-created inverse
    "created_at": "2026-02-16T10:00:00Z"
  }
}
```

---

## 10. Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context",
      "validation_errors": [...]
    },
    "request_id": "req-uuid"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication token |
| `FORBIDDEN` | 403 | User doesn't have permission |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `AI_SERVICE_UNAVAILABLE` | 503 | AI service temporarily unavailable |

---

## 11. Rate Limiting

### Limits by Plan

| Plan | Requests/Min | AI Requests/Day | Storage |
|------|--------------|-----------------|---------|
| **Free** | 60 | 100 | 1 GB |
| **Premium** | 300 | 1000 | 50 GB |
| **Enterprise** | 1000 | Unlimited | Unlimited |

### Rate Limit Headers

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1708084800
```

---

## 12. Webhooks (Future)

### Supported Events

- `memory.uploaded`
- `memory.analyzed`
- `story.generated`
- `family.member_added`
- `conversation.message_received`

### Webhook Payload

```json
{
  "event": "memory.analyzed",
  "timestamp": "2026-02-16T10:00:00Z",
  "data": {
    "memory_id": "uuid",
    "family_id": "uuid",
    "ai_caption": "...",
    "detected_faces": [...]
  }
}
```

---

## 13. Postman Collection

```json
{
  "info": {
    "name": "The Big Family Legacy API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/v1/auth/register",
            "body": {...}
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "https://api.bigfamilylegacy.com"
    }
  ]
}
```

---

**Status**: ✅ APPROVED - Ready for Agent Configuration

**Next Document**: [05_AGENT_MANIFEST.md](./05_AGENT_MANIFEST.md)

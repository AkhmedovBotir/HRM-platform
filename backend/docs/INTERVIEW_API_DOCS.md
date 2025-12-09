# Interview API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Barcha Interview API'lari uchun Company JWT token talab qilinadi:
```
Authorization: Bearer <company_token>
```

---

## Ish Ketma-ketligi (Workflow)

### Oddiy Jarayon (1 bosqichli):
```
1. Intervyu yaratish → 2. Yakunlash → 3. Yakuniy qaror → 4. Javob berish → 5. Hodim rasmiylashtirish
```

### Ko'p Bosqichli Jarayon:
```
1. Intervyu yaratish (1-bosqich) → 2. Yakunlash (passed) → 
3. Keyingi bosqich qo'shish → 4. Yakunlash → ... → 
N. Yakuniy qaror (hired) → Javob berish → Hodim rasmiylashtirish
```

### Misol:
```bash
# 1. Intervyu jarayonini boshlash
POST /api/company/interview
{ "applicationSubmissionId": "...", "stageName": "HR suhbati", "interviewDate": "2024-01-15", "interviewTime": "14:30", "location": "Ofis" }

# 2. Bosqichni yakunlash (passed)
PATCH /api/company/interview/:id/complete
{ "result": "passed" }

# 3. Keyingi bosqich qo'shish
POST /api/company/interview/:id/stage
{ "stageName": "Texnik intervyu", "interviewDate": "2024-01-20", "interviewTime": "10:00", "location": "Online" }

# 4. Keyingi bosqichni yakunlash
PATCH /api/company/interview/:id/complete
{ "result": "passed" }

# 5. Yakuniy qaror
PATCH /api/company/interview/:id/decision
{ "result": "hired", "reason": "Barcha bosqichlardan o'tdi" }

# 6. Javob berildi
PATCH /api/company/interview/:id/response
{ "responseStatus": "responded" }

# 7. Hodim sifatida rasmiylashtirish (agar hired bo'lsa)
POST /api/company/interview/:id/hire
{
  "firstName": "Alisher",
  "lastName": "Karimov",
  "middleName": "Sardorovich",
  "birthDate": "1995-05-15",
  "gender": "male",
  "phone": "+998901234567",
  "passport": "AB1234567",
  "address": "Toshkent shahri",
  "departmentId": "...",
  "positionId": "..."
}
```

---

## 1. Interview APIs

### 1.1. Create Interview (Jarayonni boshlash)
**POST** `/company/interview`

Tasdiqlangan nomzod uchun intervyu jarayonini boshlash.

**Request Body:**
```json
{
  "applicationSubmissionId": "65d1e2f3a4b5c6d7e8f9a0b1",
  "stageName": "HR suhbati",
  "interviewDate": "2024-01-15",
  "interviewTime": "14:30",
  "location": "Ofis, Toshkent",
  "interviewer": "Ahmad Karimov",
  "notes": "Birinchi tanishuv"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Intervyu jarayoni boshlandi",
  "interview": {
    "_id": "...",
    "currentStage": 1,
    "stages": [{
      "_id": "...",
      "stageName": "HR suhbati",
      "stageOrder": 1,
      "interviewDate": "2024-01-15T00:00:00.000Z",
      "interviewTime": "14:30",
      "location": "Ofis, Toshkent",
      "status": "scheduled",
      "result": "pending"
    }],
    "status": "in_process",
    "finalDecision": { "result": "pending", "responseStatus": "waiting" }
  }
}
```

---

### 1.2. Add Stage (Keyingi bosqich qo'shish)
**POST** `/company/interview/:id/stage`

Keyingi intervyu bosqichini qo'shish. **Joriy bosqich yakunlangan bo'lishi kerak.**

**Request Body:**
```json
{
  "stageName": "Texnik intervyu",
  "interviewDate": "2024-01-20",
  "interviewTime": "10:00",
  "location": "Online - Zoom",
  "interviewer": "Sardor Aliyev"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "2-bosqich qo'shildi",
  "interview": { ... }
}
```

---

### 1.3. Start Stage (Bosqichni boshlash)
**PATCH** `/company/interview/:id/start`

Joriy bosqichni boshlash. **Ixtiyoriy qadam.**

**Response (200):**
```json
{
  "success": true,
  "message": "HR suhbati boshlandi",
  "interview": { ... }
}
```

---

### 1.4. Complete Stage (Bosqichni yakunlash)
**PATCH** `/company/interview/:id/complete`

Joriy bosqichni natija bilan yakunlash.

**Request Body:**
```json
{
  "result": "passed",
  "evaluation": {
    "technicalSkills": { "score": 8, "comment": "Yaxshi" },
    "communicationSkills": { "score": 9, "comment": "Ajoyib" },
    "overallImpression": { "score": 8, "comment": "Yaxshi nomzod" }
  },
  "evaluatedBy": "Ahmad Karimov"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `result` | string | **Required.** `passed` yoki `failed` |
| `evaluation` | object | Ixtiyoriy. Baholash |
| `evaluatedBy` | string | Ixtiyoriy. Baholagan shaxs |

**Response (200) - O'tdi:**
```json
{
  "success": true,
  "message": "HR suhbati muvaffaqiyatli o'tildi",
  "interview": { ... }
}
```

**Response (200) - O'tmadi:**
```json
{
  "success": true,
  "message": "HR suhbatida o'tmadi",
  "interview": {
    "status": "completed",
    "finalDecision": { "result": "rejected", "reason": "HR suhbatida o'tmadi" }
  }
}
```

> **Eslatma:** Agar `result: "failed"` bo'lsa, intervyu avtomatik yakunlanadi va `finalDecision.result: "rejected"` bo'ladi.

---

### 1.5. Make Final Decision (Yakuniy qaror)
**PATCH** `/company/interview/:id/decision`

Yakuniy qaror qabul qilish - ishga olish yoki rad etish.

**Request Body:**
```json
{
  "result": "hired",
  "reason": "Barcha bosqichlardan muvaffaqiyatli o'tdi",
  "decidedBy": "HR Manager"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `result` | string | **Required.** `hired` yoki `rejected` |
| `reason` | string | Ixtiyoriy. Qaror sababi |
| `decidedBy` | string | Ixtiyoriy. Qaror qabul qilgan shaxs |

---

### 1.6. Update Response Status (Javob berildi)
**PATCH** `/company/interview/:id/response`

Nomzodga javob berilganligini belgilash.

**Request Body:**
```json
{
  "responseStatus": "responded"
}
```

---

### 1.7. Cancel Interview (Bekor qilish)
**PATCH** `/company/interview/:id/cancel`

Intervyu jarayonini bekor qilish.

**Request Body (ixtiyoriy):**
```json
{
  "reason": "Nomzod boshqa ishga joylashdi"
}
```

---

### 1.8. Hire as Employee (Hodim sifatida rasmiylashtirish)
**POST** `/company/interview/:id/hire`

Ishga olingan nomzodni hodim sifatida rasmiylashtirish. **Faqat `hired` qaror qabul qilingan intervyular uchun.**

**Request Body:**
```json
{
  "firstName": "Alisher",
  "lastName": "Karimov",
  "middleName": "Sardorovich",
  "birthDate": "1995-05-15",
  "gender": "male",
  "phone": "+998901234567",
  "passport": "AB1234567",
  "address": "Toshkent shahri, Chilonzor tumani",
  "departmentId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "positionId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "hireDate": "2024-02-01"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `firstName` | string | Yes | Ism |
| `lastName` | string | Yes | Familiya |
| `middleName` | string | Yes | Otasining ismi |
| `birthDate` | date | Yes | Tug'ilgan sana |
| `gender` | string | Yes | `male` yoki `female` |
| `phone` | string | Yes | Telefon (`+998XXXXXXXXX`) |
| `passport` | string | Yes | Passport (`AB1234567`) |
| `address` | string | Yes | Manzil |
| `departmentId` | string | Yes | Bo'lim ID |
| `positionId` | string | Yes | Lavozim ID |
| `hireDate` | date | No | Ishga kirish sanasi (default: bugun) |

**Response (201):**
```json
{
  "success": true,
  "message": "Nomzod hodim sifatida rasmiylashtirildi",
  "employee": {
    "_id": "...",
    "firstName": "Alisher",
    "lastName": "Karimov",
    "departmentId": { "_id": "...", "name": "IT bo'limi" },
    "positionId": { "_id": "...", "name": "Backend Developer" },
    ...
  }
}
```

**Error Responses:**
- `400` - Faqat ishga olingan nomzodlarni rasmiylashtirish mumkin
- `400` - Bu nomzod allaqachon hodim sifatida rasmiylashtirilgan
- `400` - Bu passport raqami bilan hodim allaqachon mavjud

---

### 1.9. Update Stage (Bosqichni yangilash)
**PATCH** `/company/interview/:id/stage/:stageId`

Bosqich ma'lumotlarini yangilash. **Yakunlanmagan bosqichlar uchun.**

**Request Body:**
```json
{
  "interviewDate": "2024-01-22",
  "interviewTime": "15:00",
  "location": "Yangi manzil"
}
```

---

### 1.9. Get All Interviews
**GET** `/company/interview`

**Query Params:**
| Param | Description |
|-------|-------------|
| `vacancyId` | Vakansiya bo'yicha filter |
| `status` | `in_process`, `completed`, `cancelled` |
| `finalResult` | `pending`, `hired`, `rejected` |
| `responseStatus` | `waiting`, `responded` |

**Misollar:**
```
GET /company/interview?finalResult=hired
GET /company/interview?status=in_process
GET /company/interview?finalResult=hired&responseStatus=waiting
```

---

### 1.10. Get Single Interview
**GET** `/company/interview/:id`

### 1.11. Get Interview by Application
**GET** `/company/interview/application/:applicationSubmissionId`

### 1.12. Delete Interview
**DELETE** `/company/interview/:id`

---

## 2. Data Models

### Interview Model
```javascript
{
  companyId: ObjectId,
  vacancyId: ObjectId,
  applicationSubmissionId: ObjectId,
  currentStage: Number,
  stages: [{
    stageName: String,      // "HR suhbati", "Texnik intervyu", etc.
    stageOrder: Number,
    interviewDate: Date,
    interviewTime: String,  // "HH:mm"
    location: String,
    interviewer: String,
    notes: String,
    status: "scheduled" | "in_progress" | "completed" | "cancelled",
    result: "pending" | "passed" | "failed",
    evaluation: { ... },
    completedAt: Date
  }],
  status: "in_process" | "completed" | "cancelled",
  finalDecision: {
    result: "pending" | "hired" | "rejected",
    reason: String,
    responseStatus: "waiting" | "responded",
    respondedAt: Date,
    decidedAt: Date,
    decidedBy: String
  },
  employeeId: ObjectId  // Hodim sifatida rasmiylashtirilganda
}
```

---

## 3. Status Values

### Interview Status
| Status | Description |
|--------|-------------|
| `in_process` | Jarayonda |
| `completed` | Yakunlangan |
| `cancelled` | Bekor qilingan |

### Stage Status
| Status | Description |
|--------|-------------|
| `scheduled` | Belgilangan |
| `in_progress` | Jarayonda |
| `completed` | Yakunlangan |
| `cancelled` | Bekor qilingan |

### Stage Result
| Result | Description |
|--------|-------------|
| `pending` | Kutilmoqda |
| `passed` | O'tdi |
| `failed` | O'tmadi |

### Final Decision Result
| Result | Description |
|--------|-------------|
| `pending` | Kutilmoqda |
| `hired` | Ishga olindi |
| `rejected` | Rad etildi |

---

## 4. Muhim Qoidalar

- Faqat **`accepted`** statusdagi arizalar uchun intervyu belgilanishi mumkin
- Har bir ariza uchun faqat **bitta intervyu jarayoni** bo'lishi mumkin
- Keyingi bosqich qo'shish uchun **joriy bosqich yakunlangan** bo'lishi kerak
- Agar bosqichda **`failed`** bo'lsa, jarayon avtomatik yakunlanadi
- **Yakuniy qaror** faqat joriy bosqich yakunlangandan keyin qabul qilinadi
- **Javob berish** faqat yakuniy qaror qabul qilingandan keyin mumkin
- Baholash ballari **1 dan 10 gacha** (ixtiyoriy)

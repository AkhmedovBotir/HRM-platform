# Referral API Documentation

Xodim orqali taklif qilingan nomzodlar (Referal) API hujjatlari.

**Eslatma:** Barcha referal operatsiyalari kompaniya admin tomonidan amalga oshiriladi.

## Base URL
```
/api/referral
```

## Authentication

Barcha routelar uchun:
- `Authorization: Bearer <company_token>` - Kompaniya JWT tokeni

---

## Endpoints

### 1. Referal ariza yuborish

Kompaniya admin xodim nomidan nomzod taklif qiladi.

**POST** `/api/referral`

**Headers:**
```
Authorization: Bearer <company_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "vacancyId": "64abc123def456789012345",
  "referralEmployeeId": "64abc123def456789012342",
  "referralNote": "Bu nomzod xodimning universitetdagi do'sti, juda malakali dasturchi",
  "answers": [
    {
      "questionId": "64abc123def456789012346",
      "answer": "Aliyev Ali Alijon o'g'li"
    },
    {
      "questionId": "64abc123def456789012347",
      "answer": "+998901234567"
    },
    {
      "questionId": "64abc123def456789012348",
      "answer": "ali@email.com"
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| vacancyId | string | Yes | Vakansiya ID |
| referralEmployeeId | string | Yes | Taklif qilgan xodim ID |
| referralNote | string | No | Xodim/admin izohi |
| answers | array | Yes | Ariza formasiga javoblar |

**Response (201):**
```json
{
  "success": true,
  "message": "Referal ariza muvaffaqiyatli yuborildi",
  "submission": {
    "_id": "64abc123def456789012349",
    "companyId": "64abc123def456789012340",
    "vacancyId": {
      "_id": "64abc123def456789012345",
      "nom": "Senior Developer"
    },
    "applicationFormId": {
      "_id": "64abc123def456789012341",
      "nom": "Developer Application Form"
    },
    "answers": [...],
    "status": "pending",
    "source": "referral",
    "referralEmployeeId": {
      "_id": "64abc123def456789012342",
      "firstName": "Sardor",
      "lastName": "Karimov"
    },
    "referralNote": "Bu nomzod xodimning universitetdagi do'sti",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 2. Referal uchun xodimlar ro'yxati

Referal qilish uchun mavjud xodimlar ro'yxatini olish.

**GET** `/api/referral/employees`

**Headers:**
```
Authorization: Bearer <company_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 25,
  "employees": [
    {
      "_id": "64abc123def456789012342",
      "firstName": "Sardor",
      "lastName": "Karimov",
      "middleName": "Alisher o'g'li",
      "phone": "+998901234567",
      "departmentId": {
        "_id": "64abc123def456789012350",
        "nom": "IT Bo'limi"
      },
      "positionId": {
        "_id": "64abc123def456789012351",
        "nom": "Dasturchi"
      }
    }
  ]
}
```

---

### 3. Barcha referallar

Kompaniyaning barcha referal arizalarini olish.

**GET** `/api/referral`

**Headers:**
```
Authorization: Bearer <company_token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter: pending, reviewed, accepted, rejected |
| vacancyId | string | Vakansiya bo'yicha filter |
| referralEmployeeId | string | Taklif qilgan xodim bo'yicha filter |

**Example:** `/api/referral?status=pending&referralEmployeeId=64abc123def456789012342`

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "referrals": [
    {
      "_id": "64abc123def456789012349",
      "vacancyId": {
        "_id": "64abc123def456789012345",
        "nom": "Senior Developer"
      },
      "applicationFormId": {
        "_id": "64abc123def456789012341",
        "nom": "Developer Application Form"
      },
      "referralEmployeeId": {
        "_id": "64abc123def456789012342",
        "firstName": "Sardor",
        "lastName": "Karimov"
      },
      "answers": [...],
      "status": "pending",
      "source": "referral",
      "referralNote": "...",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 4. Bitta referal

Bitta referal arizaning to'liq ma'lumotlarini olish.

**GET** `/api/referral/:id`

**Headers:**
```
Authorization: Bearer <company_token>
```

**Response (200):**
```json
{
  "success": true,
  "referral": {
    "_id": "64abc123def456789012349",
    "companyId": "64abc123def456789012340",
    "vacancyId": {
      "_id": "64abc123def456789012345",
      "nom": "Senior Developer"
    },
    "applicationFormId": {
      "_id": "64abc123def456789012341",
      "nom": "Developer Application Form"
    },
    "referralEmployeeId": {
      "_id": "64abc123def456789012342",
      "firstName": "Sardor",
      "lastName": "Karimov",
      "phone": "+998901234567"
    },
    "answers": [
      {
        "questionId": "64abc123def456789012346",
        "question": "F.I.O",
        "answer": "Aliyev Ali Alijon o'g'li"
      },
      {
        "questionId": "64abc123def456789012347",
        "question": "Telefon raqam",
        "answer": "+998901234567"
      }
    ],
    "status": "pending",
    "source": "referral",
    "referralNote": "Bu nomzod xodimning universitetdagi do'sti",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Referal jarayoni

```
1. Admin referal uchun xodimlarni ko'radi
   GET /api/referral/employees

2. Admin vakansiya uchun ariza formasini oladi
   GET /api/company/application-forms?vacancyId=...

3. Admin xodim nomidan referal yuboradi
   POST /api/referral
   Body: { vacancyId, referralEmployeeId, answers, referralNote }

4. Admin referal arizalarni ko'radi
   GET /api/referral

5. Admin arizani ko'rib chiqadi va statusni yangilaydi
   PATCH /api/company/applications/:id/status
   Body: { "status": "accepted" }

6. Admin interview boshlaydi
   POST /api/company/interviews
   Body: { "applicationSubmissionId": "...", ... }

7. Interview bosqichlari o'tkaziladi
   (mavjud Interview API orqali)

8. Yakuniy qaror qabul qilinadi
   PATCH /api/company/interviews/:id/decision

9. Hodim sifatida rasmiylashtiriladi
   POST /api/company/interviews/:id/hire
```

---

## Error Responses

**401 - Unauthorized:**
```json
{
  "success": false,
  "message": "No token provided, authorization denied"
}
```

**400 - Bad Request:**
```json
{
  "success": false,
  "message": "Referal qiluvchi xodim ID si taqdim etilmagan"
}
```

**404 - Not Found:**
```json
{
  "success": false,
  "message": "Xodim topilmadi yoki ishdan bo'shatilgan"
}
```

```json
{
  "success": false,
  "message": "Vakansiya topilmadi yoki sizning kompaniyangizga tegishli emas"
}
```

```json
{
  "success": false,
  "message": "Bu vakansiya yopilgan"
}
```

---

## ApplicationSubmission Model (Yangilangan)

```javascript
{
  companyId: ObjectId,
  vacancyId: ObjectId,
  applicationFormId: ObjectId,
  answers: [{
    questionId: ObjectId,
    question: String,
    answer: Mixed
  }],
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected',
  notes: String,
  // Referal maydonlari
  source: 'public' | 'referral',        // Ariza manbasi
  referralEmployeeId: ObjectId,          // Taklif qilgan xodim
  referralNote: String                   // Izoh
}
```

# Work Schedule API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Work Schedule API'lari uchun Company JWT token kerak. Token `Authorization` header'da quyidagicha yuboriladi:
```
Authorization: Bearer <company_token>
```

**Eslatma:** Barcha Work Schedule API'lari faqat Company authentication talab qiladi. Har bir kompaniya faqat o'z shablonlari va xodimlarining grafiklarini boshqarishi mumkin.

---

## 1. Work Schedule Template APIs

### 1.1. Create Template
**POST** `/company/schedule-template`

Yangi ish grafik shablon yaratish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**Request Body:**
```json
{
  "nom": "Standart ish grafigi",
  "monday": {
    "startTime": "09:00",
    "endTime": "18:00",
    "isWorking": true
  },
  "tuesday": {
    "startTime": "09:00",
    "endTime": "18:00",
    "isWorking": true
  },
  "wednesday": {
    "startTime": "09:00",
    "endTime": "18:00",
    "isWorking": true
  },
  "thursday": {
    "startTime": "09:00",
    "endTime": "18:00",
    "isWorking": true
  },
  "friday": {
    "startTime": "09:00",
    "endTime": "18:00",
    "isWorking": true
  },
  "saturday": {
    "startTime": null,
    "endTime": null,
    "isWorking": false
  },
  "sunday": {
    "startTime": null,
    "endTime": null,
    "isWorking": false
  },
  "status": "active"
}
```

**Note:** 
- Har bir kun uchun `startTime` va `endTime` `HH:mm` formatida (masalan: "09:00", "18:30")
- `isWorking` - bu kunda ish bormi yoki yo'qmi
- `status` ixtiyoriy (default: `active`)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Ish grafik shablon muvaffaqiyatli yaratildi",
  "template": {
    "id": "65a1b2c3d4e5f6g7h8i9j0kf",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nom": "Standart ish grafigi",
    "monday": {
      "startTime": "09:00",
      "endTime": "18:00",
      "isWorking": true
    },
    "tuesday": {
      "startTime": "09:00",
      "endTime": "18:00",
      "isWorking": true
    },
    "wednesday": {
      "startTime": "09:00",
      "endTime": "18:00",
      "isWorking": true
    },
    "thursday": {
      "startTime": "09:00",
      "endTime": "18:00",
      "isWorking": true
    },
    "friday": {
      "startTime": "09:00",
      "endTime": "18:00",
      "isWorking": true
    },
    "saturday": {
      "startTime": null,
      "endTime": null,
      "isWorking": false
    },
    "sunday": {
      "startTime": null,
      "endTime": null,
      "isWorking": false
    },
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Bu nom bilan shablon allaqachon mavjud"
}
```

---

### 1.2. Get All Templates
**GET** `/company/schedule-template`

Kompaniyaning barcha ish grafik shablonlarini olish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "templates": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0kf",
      "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "nom": "Standart ish grafigi",
      "monday": {
        "startTime": "09:00",
        "endTime": "18:00",
        "isWorking": true
      },
      "tuesday": {
        "startTime": "09:00",
        "endTime": "18:00",
        "isWorking": true
      },
      "wednesday": {
        "startTime": "09:00",
        "endTime": "18:00",
        "isWorking": true
      },
      "thursday": {
        "startTime": "09:00",
        "endTime": "18:00",
        "isWorking": true
      },
      "friday": {
        "startTime": "09:00",
        "endTime": "18:00",
        "isWorking": true
      },
      "saturday": {
        "startTime": null,
        "endTime": null,
        "isWorking": false
      },
      "sunday": {
        "startTime": null,
        "endTime": null,
        "isWorking": false
      },
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 1.3. Get Single Template
**GET** `/company/schedule-template/:id`

Bitta shablon ma'lumotlarini olish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Template ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "success": true,
  "template": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0kf",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nom": "Standart ish grafigi",
    "monday": {
      "startTime": "09:00",
      "endTime": "18:00",
      "isWorking": true
    },
    "tuesday": {
      "startTime": "09:00",
      "endTime": "18:00",
      "isWorking": true
    },
    "wednesday": {
      "startTime": "09:00",
      "endTime": "18:00",
      "isWorking": true
    },
    "thursday": {
      "startTime": "09:00",
      "endTime": "18:00",
      "isWorking": true
    },
    "friday": {
      "startTime": "09:00",
      "endTime": "18:00",
      "isWorking": true
    },
    "saturday": {
      "startTime": null,
      "endTime": null,
      "isWorking": false
    },
    "sunday": {
      "startTime": null,
      "endTime": null,
      "isWorking": false
    },
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Shablon topilmadi"
}
```

---

### 1.4. Update Template
**PUT** `/company/schedule-template/:id`

Shablon ma'lumotlarini yangilash.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Template ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "nom": "Yangi ish grafigi",
  "monday": {
    "startTime": "08:00",
    "endTime": "17:00",
    "isWorking": true
  }
}
```

**Note:** Barcha maydonlar ixtiyoriy. Faqat yangilanishi kerak bo'lgan maydonlarni yuborish kifoya.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Shablon muvaffaqiyatli yangilandi",
  "template": {
    "id": "65a1b2c3d4e5f6g7h8i9j0kf",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nom": "Yangi ish grafigi",
    "monday": {
      "startTime": "08:00",
      "endTime": "17:00",
      "isWorking": true
    },
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-03T00:00:00.000Z"
  }
}
```

---

### 1.5. Update Template Status
**PATCH** `/company/schedule-template/:id/status`

Shablon statusini yangilash (active/inactive).

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Template ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Shablon status muvaffaqiyatli yangilandi",
  "template": {
    "id": "65a1b2c3d4e5f6g7h8i9j0kf",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nom": "Standart ish grafigi",
    "status": "inactive",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-03T00:00:00.000Z"
  }
}
```

---

### 1.6. Delete Template
**DELETE** `/company/schedule-template/:id`

Shablonni o'chirish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Template ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Shablon muvaffaqiyatli o'chirildi"
}
```

---

## 2. Employee Schedule APIs

### 2.1. Create Employee Schedule
**POST** `/company/employee-schedule`

Xodim uchun shablon asosida grafik belgilash.

**Headers:**
```
Authorization: Bearer <company_token>
```

**Request Body:**
```json
{
  "employeeId": "65a1b2c3d4e5f6g7h8i9j0kb",
  "templateId": "65a1b2c3d4e5f6g7h8i9j0kf",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "status": "active"
}
```

**Note:** 
- `endDate` ixtiyoriy (agar ko'rsatilmasa, cheksiz)
- `status` ixtiyoriy (default: `active`)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Xodim grafigi muvaffaqiyatli yaratildi",
  "schedule": {
    "id": "65a1b2c3d4e5f6g7h8i9j0kg",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "employeeId": "65a1b2c3d4e5f6g7h8i9j0kb",
    "employeeName": "Ali Valiyev O'g'li",
    "templateId": "65a1b2c3d4e5f6g7h8i9j0kf",
    "templateName": "Standart ish grafigi",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T00:00:00.000Z",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400) - Invalid Employee:**
```json
{
  "success": false,
  "message": "Xodim topilmadi yoki bu kompaniyaga tegishli emas"
}
```

**Error Response (400) - Invalid Template:**
```json
{
  "success": false,
  "message": "Shablon topilmadi yoki bu kompaniyaga tegishli emas"
}
```

---

### 2.2. Get All Employee Schedules
**GET** `/company/employee-schedule`

Kompaniyaning barcha xodimlarining grafiklarini olish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**Query Parameters:**
- `employeeId` (optional) - Xodim ID bo'yicha filter
- `templateId` (optional) - Shablon ID bo'yicha filter
- `startDate` (optional) - Boshlanish sanasi (YYYY-MM-DD)
- `endDate` (optional) - Tugash sanasi (YYYY-MM-DD)
- `status` (optional) - Status bo'yicha filter (`active`, `inactive`)

**Examples:**
```
GET /api/company/employee-schedule?employeeId=65a1b2c3d4e5f6g7h8i9j0kb
GET /api/company/employee-schedule?templateId=65a1b2c3d4e5f6g7h8i9j0kf
GET /api/company/employee-schedule?startDate=2024-01-01&endDate=2024-12-31
GET /api/company/employee-schedule?status=active
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "schedules": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0kg",
      "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "employeeId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0kb",
        "firstName": "Ali",
        "lastName": "Valiyev",
        "middleName": "O'g'li"
      },
      "templateId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0kf",
        "nom": "Standart ish grafigi"
      },
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T00:00:00.000Z",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2.3. Get Single Employee Schedule
**GET** `/company/employee-schedule/:id`

Bitta xodim grafigi ma'lumotlarini olish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Employee Schedule ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "success": true,
  "schedule": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0kg",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "employeeId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0kb",
      "firstName": "Ali",
      "lastName": "Valiyev",
      "middleName": "O'g'li"
    },
    "templateId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0kf",
      "nom": "Standart ish grafigi",
      "monday": {
        "startTime": "09:00",
        "endTime": "18:00",
        "isWorking": true
      },
      "tuesday": {
        "startTime": "09:00",
        "endTime": "18:00",
        "isWorking": true
      },
      "wednesday": {
        "startTime": "09:00",
        "endTime": "18:00",
        "isWorking": true
      },
      "thursday": {
        "startTime": "09:00",
        "endTime": "18:00",
        "isWorking": true
      },
      "friday": {
        "startTime": "09:00",
        "endTime": "18:00",
        "isWorking": true
      },
      "saturday": {
        "startTime": null,
        "endTime": null,
        "isWorking": false
      },
      "sunday": {
        "startTime": null,
        "endTime": null,
        "isWorking": false
      }
    },
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T00:00:00.000Z",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Xodim grafigi topilmadi"
}
```

---

### 2.4. Update Employee Schedule
**PUT** `/company/employee-schedule/:id`

Xodim grafigi ma'lumotlarini yangilash.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Employee Schedule ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "templateId": "65a1b2c3d4e5f6g7h8i9j0kf",
  "startDate": "2024-02-01",
  "endDate": "2024-12-31"
}
```

**Note:** Barcha maydonlar ixtiyoriy. Faqat yangilanishi kerak bo'lgan maydonlarni yuborish kifoya.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Xodim grafigi muvaffaqiyatli yangilandi",
  "schedule": {
    "id": "65a1b2c3d4e5f6g7h8i9j0kg",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "employeeId": "65a1b2c3d4e5f6g7h8i9j0kb",
    "employeeName": "Ali Valiyev O'g'li",
    "templateId": "65a1b2c3d4e5f6g7h8i9j0kf",
    "templateName": "Standart ish grafigi",
    "startDate": "2024-02-01T00:00:00.000Z",
    "endDate": "2024-12-31T00:00:00.000Z",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-03T00:00:00.000Z"
  }
}
```

---

### 2.5. Update Employee Schedule Status
**PATCH** `/company/employee-schedule/:id/status`

Xodim grafigi statusini yangilash (active/inactive).

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Employee Schedule ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Xodim grafigi status muvaffaqiyatli yangilandi",
  "schedule": {
    "id": "65a1b2c3d4e5f6g7h8i9j0kg",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "employeeId": "65a1b2c3d4e5f6g7h8i9j0kb",
    "employeeName": "Ali Valiyev O'g'li",
    "templateId": "65a1b2c3d4e5f6g7h8i9j0kf",
    "templateName": "Standart ish grafigi",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T00:00:00.000Z",
    "status": "inactive",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-03T00:00:00.000Z"
  }
}
```

---

### 2.6. Delete Employee Schedule
**DELETE** `/company/employee-schedule/:id`

Xodim grafigini o'chirish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Employee Schedule ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Xodim grafigi muvaffaqiyatli o'chirildi"
}
```

---

## Error Responses

### 400 Bad Request
Validation xatolari yoki noto'g'ri so'rovlar:
```json
{
  "success": false,
  "message": "Error message here"
}
```

### 401 Unauthorized
Token yo'q yoki noto'g'ri:
```json
{
  "success": false,
  "message": "No token provided, authorization denied"
}
```

### 404 Not Found
Ma'lumot topilmadi:
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
Server xatosi:
```json
{
  "success": false,
  "message": "Server error"
}
```

---

## Model Fields

### WorkScheduleTemplate Model

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| companyId | ObjectId | Yes | No | Kompaniya ID (reference) |
| nom | String | Yes | Yes* | Shablon nomi (*unique per company) |
| monday | Object | No | No | Dushanba grafigi (startTime, endTime, isWorking) |
| tuesday | Object | No | No | Seshanba grafigi |
| wednesday | Object | No | No | Chorshanba grafigi |
| thursday | Object | No | No | Payshanba grafigi |
| friday | Object | No | No | Juma grafigi |
| saturday | Object | No | No | Shanba grafigi |
| sunday | Object | No | No | Yakshanba grafigi |
| status | String | No | No | Status (active/inactive, default: active) |
| createdAt | Date | Auto | No | Yaratilgan vaqt |
| updatedAt | Date | Auto | No | Yangilangan vaqt |

**Day Object Structure:**
- `startTime`: String (HH:mm format, masalan: "09:00")
- `endTime`: String (HH:mm format, masalan: "18:00")
- `isWorking`: Boolean (true/false)

### EmployeeSchedule Model

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| companyId | ObjectId | Yes | No | Kompaniya ID (reference) |
| employeeId | ObjectId | Yes | No | Xodim ID (reference) |
| templateId | ObjectId | Yes | No | Shablon ID (reference) |
| startDate | Date | Yes | No | Boshlanish sanasi |
| endDate | Date | No | No | Tugash sanasi (null bo'lishi mumkin) |
| status | String | No | No | Status (active/inactive, default: active) |
| createdAt | Date | Auto | No | Yaratilgan vaqt |
| updatedAt | Date | Auto | No | Yangilangan vaqt |

---

## Notes

1. Barcha Work Schedule API'lari faqat Company authentication talab qiladi
2. Har bir kompaniya faqat o'z shablonlari va xodimlarining grafiklarini boshqarishi mumkin
3. Shablon nomi har bir kompaniya ichida unique bo'lishi kerak
4. Vaqtlar `HH:mm` formatida bo'lishi kerak (masalan: "09:00", "18:30")
5. Xodim va shablon kompaniyaga tegishli bo'lishi kerak
6. JWT token 30 kun muddatga amal qiladi

---

## Workflow Example

1. **Company login qiladi:**
   ```bash
   POST /api/company/login
   {
     "username": "techsolutions",
     "password": "password123"
   }
   ```

2. **Company ish grafik shablon yaratadi:**
   ```bash
   POST /api/company/schedule-template
   Headers: Authorization: Bearer <company_token>
   {
     "nom": "Standart ish grafigi",
     "monday": {
       "startTime": "09:00",
       "endTime": "18:00",
       "isWorking": true
     },
     "tuesday": {
       "startTime": "09:00",
       "endTime": "18:00",
       "isWorking": true
     },
     "wednesday": {
       "startTime": "09:00",
       "endTime": "18:00",
       "isWorking": true
     },
     "thursday": {
       "startTime": "09:00",
       "endTime": "18:00",
       "isWorking": true
     },
     "friday": {
       "startTime": "09:00",
       "endTime": "18:00",
       "isWorking": true
     },
     "saturday": {
       "startTime": null,
       "endTime": null,
       "isWorking": false
     },
     "sunday": {
       "startTime": null,
       "endTime": null,
       "isWorking": false
     }
   }
   ```

3. **Company xodim uchun grafik belgilaydi:**
   ```bash
   POST /api/company/employee-schedule
   Headers: Authorization: Bearer <company_token>
   {
     "employeeId": "65a1b2c3d4e5f6g7h8i9j0kb",
     "templateId": "65a1b2c3d4e5f6g7h8i9j0kf",
     "startDate": "2024-01-01",
     "endDate": "2024-12-31"
   }
   ```

4. **Company barcha xodimlarining grafiklarini ko'radi:**
   ```bash
   GET /api/company/employee-schedule
   Headers: Authorization: Bearer <company_token>
   ```

5. **Company ma'lum xodimning grafigini ko'radi:**
   ```bash
   GET /api/company/employee-schedule?employeeId=65a1b2c3d4e5f6g7h8i9j0kb
   Headers: Authorization: Bearer <company_token>
   ```



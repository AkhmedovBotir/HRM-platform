# Department API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Department API'lari uchun Company JWT token kerak. Token `Authorization` header'da quyidagicha yuboriladi:
```
Authorization: Bearer <company_token>
```

**Eslatma:** Barcha Department API'lari faqat Company authentication talab qiladi. Har bir kompaniya faqat o'z bo'limlarini boshqarishi mumkin.

---

## Department Management APIs

### 1. Create Department
**POST** `/company/department`

Yangi bo'lim yaratish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**Request Body:**
```json
{
  "nom": "IT Bo'limi",
  "status": "active"
}
```

**Note:** `status` ixtiyoriy. Agar ko'rsatilmasa, default `active` bo'ladi.

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Bo'lim muvaffaqiyatli yaratildi",
  "department": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k5",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nom": "IT Bo'limi",
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
  "message": "Bu nom bilan bo'lim allaqachon mavjud"
}
```

**Validation Errors:**
- Status faqat `active` yoki `inactive` bo'lishi mumkin
- Nom to'ldirilishi shart

---

### 2. Get All Departments
**GET** `/company/department`

Kompaniyaning barcha bo'limlarini olish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "departments": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k5",
      "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "nom": "IT Bo'limi",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k6",
      "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "nom": "HR Bo'limi",
      "status": "active",
      "createdAt": "2024-01-02T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    },
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k7",
      "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "nom": "Moliya Bo'limi",
      "status": "inactive",
      "createdAt": "2024-01-03T00:00:00.000Z",
      "updatedAt": "2024-01-03T00:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Department
**GET** `/company/department/:id`

Bitta bo'lim ma'lumotlarini olish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Department ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "success": true,
  "department": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k5",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nom": "IT Bo'limi",
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
  "message": "Bo'lim topilmadi"
}
```

---

### 4. Update Department
**PUT** `/company/department/:id`

Bo'lim ma'lumotlarini yangilash.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Department ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "nom": "Axborot Texnologiyalari Bo'limi"
}
```

**Note:** Faqat `nom` maydoni yangilanishi mumkin. Status maydoni qabul qilinmaydi. Statusni o'zgartirish uchun `/company/department/:id/status` endpoint'idan foydalaning.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Bo'lim muvaffaqiyatli yangilandi",
  "department": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k5",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nom": "Axborot Texnologiyalari Bo'limi",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-03T00:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Bo'lim topilmadi"
}
```

**Error Response (400) - Duplicate Name:**
```json
{
  "success": false,
  "message": "Bu nom bilan bo'lim mavjud"
}
```

**Error Response (400) - Invalid Field:**
Agar `status` yoki boshqa ruxsat etilmagan maydon yuborilsa:
```json
{
  "success": false,
  "message": "\"status\" is not allowed"
}
```

---

### 5. Update Department Status
**PATCH** `/company/department/:id/status`

Bo'lim statusini yangilash (active/inactive).

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Department ID (MongoDB ObjectId)

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
  "message": "Bo'lim status muvaffaqiyatli yangilandi",
  "department": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k5",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nom": "IT Bo'limi",
    "status": "inactive",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-03T00:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Status \"active\" yoki \"inactive\" bo'lishi kerak"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Bo'lim topilmadi"
}
```

---

### 6. Delete Department
**DELETE** `/company/department/:id`

Bo'limni o'chirish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Department ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Bo'lim muvaffaqiyatli o'chirildi"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Bo'lim topilmadi"
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
yoki
```json
{
  "success": false,
  "message": "Token is not valid"
}
```

### 404 Not Found
Ma'lumot topilmadi:
```json
{
  "success": false,
  "message": "Bo'lim topilmadi"
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

## Department Model Fields

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| companyId | ObjectId | Yes | No | Kompaniya ID (reference) |
| nom | String | Yes | Yes* | Bo'lim nomi (*unique per company) |
| status | String | No | No | Status (active/inactive, default: active) |
| createdAt | Date | Auto | No | Yaratilgan vaqt |
| updatedAt | Date | Auto | No | Yangilangan vaqt |

---

## Notes

1. Barcha Department API'lari faqat Company authentication talab qiladi
2. Har bir kompaniya faqat o'z bo'limlarini ko'rish va boshqarishi mumkin
3. Nom har bir kompaniya ichida unique bo'lishi kerak
4. Status `active` yoki `inactive` bo'lishi mumkin
5. JWT token 30 kun muddatga amal qiladi

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
   Response: `type: "company"` va company token

2. **Company yangi bo'lim yaratadi:**
   ```bash
   POST /api/company/department
   Headers: Authorization: Bearer <company_token>
   {
     "nom": "IT Bo'limi",
     "status": "active"
   }
   ```

3. **Company barcha bo'limlarni ko'radi:**
   ```bash
   GET /api/company/department
   Headers: Authorization: Bearer <company_token>
   ```

4. **Company bo'lim nomini yangilaydi:**
   ```bash
   PUT /api/company/department/:id
   Headers: Authorization: Bearer <company_token>
   {
     "nom": "Axborot Texnologiyalari Bo'limi"
   }
   ```

5. **Company bo'lim statusini o'zgartiradi:**
   ```bash
   PATCH /api/company/department/:id/status
   Headers: Authorization: Bearer <company_token>
   {
     "status": "inactive"
   }
   ```

6. **Company bo'limni o'chiradi:**
   ```bash
   DELETE /api/company/department/:id
   Headers: Authorization: Bearer <company_token>
   ```


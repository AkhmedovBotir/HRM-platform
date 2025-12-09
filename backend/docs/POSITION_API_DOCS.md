# Position API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Position API'lari uchun Company JWT token kerak. Token `Authorization` header'da quyidagicha yuboriladi:
```
Authorization: Bearer <company_token>
```

**Eslatma:** Barcha Position API'lari faqat Company authentication talab qiladi. Har bir kompaniya faqat o'z lavozimlarini boshqarishi mumkin.

---

## Position Management APIs

### 1. Create Position
**POST** `/company/position`

Yangi lavozim yaratish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**Request Body:**
```json
{
  "nom": "Senior Developer",
  "status": "active"
}
```

**Note:** `status` ixtiyoriy. Agar ko'rsatilmasa, default `active` bo'ladi.

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Lavozim muvaffaqiyatli yaratildi",
  "position": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k8",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nom": "Senior Developer",
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
  "message": "Bu nom bilan lavozim allaqachon mavjud"
}
```

**Validation Errors:**
- Status faqat `active` yoki `inactive` bo'lishi mumkin
- Nom to'ldirilishi shart

---

### 2. Get All Positions
**GET** `/company/position`

Kompaniyaning barcha lavozimlarini olish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "positions": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k8",
      "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "nom": "Senior Developer",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k9",
      "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "nom": "Junior Developer",
      "status": "active",
      "createdAt": "2024-01-02T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    },
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0ka",
      "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "nom": "Project Manager",
      "status": "inactive",
      "createdAt": "2024-01-03T00:00:00.000Z",
      "updatedAt": "2024-01-03T00:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Position
**GET** `/company/position/:id`

Bitta lavozim ma'lumotlarini olish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Position ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "success": true,
  "position": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k8",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nom": "Senior Developer",
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
  "message": "Lavozim topilmadi"
}
```

---

### 4. Update Position
**PUT** `/company/position/:id`

Lavozim ma'lumotlarini yangilash.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Position ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "nom": "Senior Software Engineer"
}
```

**Note:** Faqat `nom` maydoni yangilanishi mumkin. Status maydoni qabul qilinmaydi. Statusni o'zgartirish uchun `/company/position/:id/status` endpoint'idan foydalaning.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Lavozim muvaffaqiyatli yangilandi",
  "position": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k8",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nom": "Senior Software Engineer",
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
  "message": "Lavozim topilmadi"
}
```

**Error Response (400) - Duplicate Name:**
```json
{
  "success": false,
  "message": "Bu nom bilan lavozim mavjud"
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

### 5. Update Position Status
**PATCH** `/company/position/:id/status`

Lavozim statusini yangilash (active/inactive).

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Position ID (MongoDB ObjectId)

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
  "message": "Lavozim status muvaffaqiyatli yangilandi",
  "position": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k8",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nom": "Senior Developer",
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
  "message": "Lavozim topilmadi"
}
```

---

### 6. Delete Position
**DELETE** `/company/position/:id`

Lavozimni o'chirish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Position ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Lavozim muvaffaqiyatli o'chirildi"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Lavozim topilmadi"
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
  "message": "Lavozim topilmadi"
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

## Position Model Fields

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| companyId | ObjectId | Yes | No | Kompaniya ID (reference) |
| nom | String | Yes | Yes* | Lavozim nomi (*unique per company) |
| status | String | No | No | Status (active/inactive, default: active) |
| createdAt | Date | Auto | No | Yaratilgan vaqt |
| updatedAt | Date | Auto | No | Yangilangan vaqt |

---

## Notes

1. Barcha Position API'lari faqat Company authentication talab qiladi
2. Har bir kompaniya faqat o'z lavozimlarini ko'rish va boshqarishi mumkin
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

2. **Company yangi lavozim yaratadi:**
   ```bash
   POST /api/company/position
   Headers: Authorization: Bearer <company_token>
   {
     "nom": "Senior Developer",
     "status": "active"
   }
   ```

3. **Company barcha lavozimlarni ko'radi:**
   ```bash
   GET /api/company/position
   Headers: Authorization: Bearer <company_token>
   ```

4. **Company lavozim nomini yangilaydi:**
   ```bash
   PUT /api/company/position/:id
   Headers: Authorization: Bearer <company_token>
   {
     "nom": "Senior Software Engineer"
   }
   ```

5. **Company lavozim statusini o'zgartiradi:**
   ```bash
   PATCH /api/company/position/:id/status
   Headers: Authorization: Bearer <company_token>
   {
     "status": "inactive"
   }
   ```

6. **Company lavozimni o'chiradi:**
   ```bash
   DELETE /api/company/position/:id
   Headers: Authorization: Bearer <company_token>
   ```


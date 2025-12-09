# Attendance API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Attendance API'lari uchun Company JWT token kerak. Token `Authorization` header'da quyidagicha yuboriladi:
```
Authorization: Bearer <company_token>
```

**Eslatma:** Barcha Attendance API'lari faqat Company authentication talab qiladi. Har bir kompaniya faqat o'z xodimlarining davomatini boshqarishi mumkin.

---

## Attendance Management APIs

### 1. Create or Update Attendance
**POST** `/company/attendance`

Yangi davomat yaratish yoki mavjud davomatni yangilash.

**Headers:**
```
Authorization: Bearer <company_token>
```

**Request Body:**
```json
{
  "employeeId": "65a1b2c3d4e5f6g7h8i9j0kb",
  "date": "2024-01-15",
  "checkIn": "2024-01-15T09:00:00.000Z",
  "checkOut": "2024-01-15T18:00:00.000Z",
  "status": "present",
  "notes": "Vaqtida keldi"
}
```

**Note:** 
- Agar bu sana uchun davomat mavjud bo'lsa, u yangilanadi
- `checkIn` va `checkOut` ixtiyoriy
- `status` ixtiyoriy (default: `absent`)
- `notes` ixtiyoriy

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Davomat muvaffaqiyatli yaratildi",
  "attendance": {
    "id": "65a1b2c3d4e5f6g7h8i9j0kd",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "employeeId": "65a1b2c3d4e5f6g7h8i9j0kb",
    "employeeName": "Ali Valiyev O'g'li",
    "date": "2024-01-15T00:00:00.000Z",
    "checkIn": "2024-01-15T09:00:00.000Z",
    "checkOut": "2024-01-15T18:00:00.000Z",
    "status": "present",
    "notes": "Vaqtida keldi",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response (200 OK) - Updated:**
```json
{
  "success": true,
  "message": "Davomat muvaffaqiyatli yangilandi",
  "attendance": {
    "id": "65a1b2c3d4e5f6g7h8i9j0kd",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "employeeId": "65a1b2c3d4e5f6g7h8i9j0kb",
    "employeeName": "Ali Valiyev O'g'li",
    "date": "2024-01-15T00:00:00.000Z",
    "checkIn": "2024-01-15T09:00:00.000Z",
    "checkOut": "2024-01-15T18:00:00.000Z",
    "status": "present",
    "notes": "Vaqtida keldi",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T01:00:00.000Z"
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

**Validation Errors:**
- `employeeId` va `date` majburiy
- `status` faqat quyidagilardan biri bo'lishi mumkin: `present`, `absent`, `late`, `half_day`, `leave`

---

### 2. Get All Attendances
**GET** `/company/attendance`

Kompaniyaning barcha davomatlarini olish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**Query Parameters:**
- `employeeId` (optional) - Xodim ID bo'yicha filter
- `startDate` (optional) - Boshlanish sanasi (YYYY-MM-DD)
- `endDate` (optional) - Tugash sanasi (YYYY-MM-DD)
- `status` (optional) - Status bo'yicha filter (`present`, `absent`, `late`, `half_day`, `leave`)

**Examples:**
```
GET /api/company/attendance?employeeId=65a1b2c3d4e5f6g7h8i9j0kb
GET /api/company/attendance?startDate=2024-01-01&endDate=2024-01-31
GET /api/company/attendance?status=present
GET /api/company/attendance?employeeId=65a1b2c3d4e5f6g7h8i9j0kb&startDate=2024-01-01&endDate=2024-01-31&status=present
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "attendances": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0kd",
      "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "employeeId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0kb",
        "firstName": "Ali",
        "lastName": "Valiyev",
        "middleName": "O'g'li"
      },
      "date": "2024-01-15T00:00:00.000Z",
      "checkIn": "2024-01-15T09:00:00.000Z",
      "checkOut": "2024-01-15T18:00:00.000Z",
      "status": "present",
      "notes": "Vaqtida keldi",
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0ke",
      "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "employeeId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0kb",
        "firstName": "Ali",
        "lastName": "Valiyev",
        "middleName": "O'g'li"
      },
      "date": "2024-01-16T00:00:00.000Z",
      "checkIn": null,
      "checkOut": null,
      "status": "absent",
      "notes": "",
      "createdAt": "2024-01-16T00:00:00.000Z",
      "updatedAt": "2024-01-16T00:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Attendance
**GET** `/company/attendance/:id`

Bitta davomat ma'lumotlarini olish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Attendance ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "success": true,
  "attendance": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0kd",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "employeeId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0kb",
      "firstName": "Ali",
      "lastName": "Valiyev",
      "middleName": "O'g'li"
    },
    "date": "2024-01-15T00:00:00.000Z",
    "checkIn": "2024-01-15T09:00:00.000Z",
    "checkOut": "2024-01-15T18:00:00.000Z",
    "status": "present",
    "notes": "Vaqtida keldi",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Davomat topilmadi"
}
```

---

### 4. Update Attendance
**PUT** `/company/attendance/:id`

Davomat ma'lumotlarini yangilash.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Attendance ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "checkIn": "2024-01-15T09:30:00.000Z",
  "checkOut": "2024-01-15T18:30:00.000Z",
  "status": "late",
  "notes": "30 daqiqa kechikdi"
}
```

**Note:** Barcha maydonlar ixtiyoriy. Faqat yangilanishi kerak bo'lgan maydonlarni yuborish kifoya.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Davomat muvaffaqiyatli yangilandi",
  "attendance": {
    "id": "65a1b2c3d4e5f6g7h8i9j0kd",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "employeeId": "65a1b2c3d4e5f6g7h8i9j0kb",
    "employeeName": "Ali Valiyev O'g'li",
    "date": "2024-01-15T00:00:00.000Z",
    "checkIn": "2024-01-15T09:30:00.000Z",
    "checkOut": "2024-01-15T18:30:00.000Z",
    "status": "late",
    "notes": "30 daqiqa kechikdi",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T02:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Davomat topilmadi"
}
```

---

### 5. Delete Attendance
**DELETE** `/company/attendance/:id`

Davomatni o'chirish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Attendance ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Davomat muvaffaqiyatli o'chirildi"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Davomat topilmadi"
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
  "message": "Davomat topilmadi"
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

## Attendance Model Fields

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| companyId | ObjectId | Yes | No | Kompaniya ID (reference) |
| employeeId | ObjectId | Yes | No | Xodim ID (reference) |
| date | Date | Yes | Yes* | Sana (*unique per employee per day) |
| checkIn | Date | No | No | Keldi vaqti |
| checkOut | Date | No | No | Ketdi vaqti |
| status | String | No | No | Status (present/absent/late/half_day/leave, default: absent) |
| notes | String | No | No | Izoh |
| createdAt | Date | Auto | No | Yaratilgan vaqt |
| updatedAt | Date | Auto | No | Yangilangan vaqt |

---

## Status Values

- **present** - Keldi
- **absent** - Kelmadi
- **late** - Kechikdi
- **half_day** - Yarim kun
- **leave** - Ta'til

---

## Notes

1. Barcha Attendance API'lari faqat Company authentication talab qiladi
2. Har bir kompaniya faqat o'z xodimlarining davomatini ko'rish va boshqarishi mumkin
3. Har bir xodim uchun bir kunda faqat bitta davomat yozuvi bo'lishi mumkin
4. Agar bir xil sana va xodim uchun davomat yuborilsa, mavjud davomat yangilanadi
5. `checkIn` va `checkOut` ixtiyoriy va null bo'lishi mumkin
6. Status default qiymati `absent`
7. JWT token 30 kun muddatga amal qiladi

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

2. **Company xodim davomatini yaratadi:**
   ```bash
   POST /api/company/attendance
   Headers: Authorization: Bearer <company_token>
   {
     "employeeId": "65a1b2c3d4e5f6g7h8i9j0kb",
     "date": "2024-01-15",
     "checkIn": "2024-01-15T09:00:00.000Z",
     "checkOut": "2024-01-15T18:00:00.000Z",
     "status": "present",
     "notes": "Vaqtida keldi"
   }
   ```

3. **Company barcha davomatlarni ko'radi:**
   ```bash
   GET /api/company/attendance
   Headers: Authorization: Bearer <company_token>
   ```

4. **Company ma'lum xodimning davomatini ko'radi:**
   ```bash
   GET /api/company/attendance?employeeId=65a1b2c3d4e5f6g7h8i9j0kb
   Headers: Authorization: Bearer <company_token>
   ```

5. **Company ma'lum davr uchun davomatlarni ko'radi:**
   ```bash
   GET /api/company/attendance?startDate=2024-01-01&endDate=2024-01-31
   Headers: Authorization: Bearer <company_token>
   ```

6. **Company davomatni yangilaydi:**
   ```bash
   PUT /api/company/attendance/:id
   Headers: Authorization: Bearer <company_token>
   {
     "checkOut": "2024-01-15T19:00:00.000Z",
     "status": "late",
     "notes": "Qo'shimcha ish qildi"
   }
   ```

7. **Company davomatni o'chiradi:**
   ```bash
   DELETE /api/company/attendance/:id
   Headers: Authorization: Bearer <company_token>
   ```








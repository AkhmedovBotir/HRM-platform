# Company Admin API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Company Admin API'lari uchun JWT token kerak. Token `Authorization` header'da quyidagicha yuboriladi:
```
Authorization: Bearer <token>
```

**Eslatma:** Company Admin login `/company/login` endpoint orqali amalga oshiriladi. Login qilganda `type: "companyAdmin"` qaytariladi.

---

## Company Admin Login

Company Admin'lar ham `/company/login` endpoint orqali tizimga kirishadi. Login qilganda avval Company, keyin CompanyAdmin tekshiriladi.

### POST `/company/login`

**Request Body:**
```json
{
  "username": "admin1",
  "password": "password123"
}
```

**Response (200 OK) - Company Admin:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "companyAdmin",
  "admin": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "name": "Ali Valiyev",
    "phone": "+998901234567",
    "username": "admin1",
    "status": "active",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "companyName": "Tech Solutions MChJ",
    "companyINN": "123456789"
  }
}
```

**Error Response (401) - Inactive Admin:**
```json
{
  "success": false,
  "message": "Admin account is inactive"
}
```

**Error Response (401) - Invalid Credentials:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## Company Admin Management APIs

Barcha Company Admin Management API'lari faqat Company authentication talab qiladi. Ya'ni, faqat kompaniya o'z ichki adminlarini boshqarishi mumkin.

### 1. Create Company Admin
**POST** `/company/admin`

Yangi company admin yaratish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**Request Body:**
```json
{
  "name": "Ali Valiyev",
  "phone": "+998901234567",
  "username": "admin1",
  "password": "password123",
  "status": "active"
}
```

**Note:** `status` ixtiyoriy. Agar ko'rsatilmasa, default `active` bo'ladi.

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Company admin muvaffaqiyatli yaratildi",
  "admin": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "name": "Ali Valiyev",
    "phone": "+998901234567",
    "username": "admin1",
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
  "message": "Bu username bilan admin allaqachon mavjud"
}
```

**Validation Errors:**
- Telefon raqami `+998XXXXXXXXX` formatida bo'lishi kerak (9 ta raqam)
- Password kamida 6 ta belgi bo'lishi kerak
- Status faqat `active` yoki `inactive` bo'lishi mumkin
- Barcha maydonlar to'ldirilishi shart (statusdan tashqari)

---

### 2. Get All Company Admins
**GET** `/company/admin`

Kompaniyaning barcha adminlarini olish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "admins": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Ali Valiyev",
      "phone": "+998901234567",
      "username": "admin1",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k4",
      "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Vali Aliyev",
      "phone": "+998901234568",
      "username": "admin2",
      "status": "inactive",
      "createdAt": "2024-01-02T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Company Admin
**GET** `/company/admin/:id`

Bitta company admin ma'lumotlarini olish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Company Admin ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "success": true,
  "admin": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "name": "Ali Valiyev",
    "phone": "+998901234567",
    "username": "admin1",
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
  "message": "Admin topilmadi"
}
```

---

### 4. Update Company Admin
**PUT** `/company/admin/:id`

Company admin ma'lumotlarini yangilash.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Company Admin ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "name": "Ali Valiyev O'g'li",
  "phone": "+998901234571",
  "username": "admin1_updated"
}
```

**Note:** Barcha maydonlar ixtiyoriy. Faqat yangilanishi kerak bo'lgan maydonlarni yuborish kifoya.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Admin muvaffaqiyatli yangilandi",
  "admin": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "name": "Ali Valiyev O'g'li",
    "phone": "+998901234571",
    "username": "admin1_updated",
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
  "message": "Admin topilmadi"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Bu username bilan admin mavjud"
}
```

---

### 5. Update Company Admin Status
**PATCH** `/company/admin/:id/status`

Company admin statusini yangilash (active/inactive).

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Company Admin ID (MongoDB ObjectId)

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
  "message": "Admin status muvaffaqiyatli yangilandi",
  "admin": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "name": "Ali Valiyev",
    "phone": "+998901234567",
    "username": "admin1",
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
  "message": "Admin topilmadi"
}
```

---

### 6. Delete Company Admin
**DELETE** `/company/admin/:id`

Company adminni o'chirish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Company Admin ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Admin muvaffaqiyatli o'chirildi"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Admin topilmadi"
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
  "message": "Admin topilmadi"
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

## Company Admin Model Fields

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| companyId | ObjectId | Yes | No | Kompaniya ID (reference) |
| name | String | Yes | No | Admin ismi |
| phone | String | Yes | No | Telefon raqami (+998XXXXXXXXX) |
| username | String | Yes | Yes* | Login username (*unique per company) |
| password | String | Yes | No | Parol (min 6 belgi, hash qilinadi) |
| status | String | No | No | Status (active/inactive, default: active) |
| createdAt | Date | Auto | No | Yaratilgan vaqt |
| updatedAt | Date | Auto | No | Yangilangan vaqt |

---

## Notes

1. Barcha Company Admin Management API'lari faqat Company authentication talab qiladi
2. Har bir kompaniya faqat o'z ichki adminlarini ko'rish va boshqarishi mumkin
3. Username har bir kompaniya ichida unique bo'lishi kerak
4. Password avtomatik ravishda bcrypt bilan hash qilinadi
5. Telefon raqamlari `+998XXXXXXXXX` formatida bo'lishi kerak (9 ta raqam)
6. Status `active` bo'lmagan adminlar login qila olmaydi
7. JWT token 30 kun muddatga amal qiladi
8. Login endpoint `/company/login` ham Company, ham CompanyAdmin uchun ishlaydi

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

2. **Company o'z ichki adminini yaratadi:**
   ```bash
   POST /api/company/admin
   Headers: Authorization: Bearer <company_token>
   {
     "name": "Ali Valiyev",
     "phone": "+998901234567",
     "username": "admin1",
     "password": "password123"
   }
   ```

3. **Company Admin login qiladi:**
   ```bash
   POST /api/company/login
   {
     "username": "admin1",
     "password": "password123"
   }
   ```
   Response: `type: "companyAdmin"` va companyAdmin token

4. **Company Admin statusini o'zgartirish:**
   ```bash
   PATCH /api/company/admin/:id/status
   Headers: Authorization: Bearer <company_token>
   {
     "status": "inactive"
   }
   ```

5. **Inactive admin login qilishga harakat qiladi:**
   ```bash
   POST /api/company/login
   {
     "username": "admin1",
     "password": "password123"
   }
   ```
   Response: `"Admin account is inactive"` xatosi








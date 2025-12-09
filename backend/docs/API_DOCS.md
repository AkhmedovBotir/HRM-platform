# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
API'lari uchun JWT token kerak. Token `Authorization` header'da quyidagicha yuboriladi:
```
Authorization: Bearer <token>
```

**Eslatma:** Admin va Company uchun alohida tokenlar ishlatiladi. Har bir foydalanuvchi turi o'z tokenini o'z API'larida ishlatadi.

---

## Admin APIs

### 1. Admin Login
**POST** `/admin/login`

Admin tizimga kirish.

**Request Body:**
```json
{
  "username": "general",
  "password": "general123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "username": "general"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 2. Get Current Admin
**GET** `/admin/me`

Joriy admin ma'lumotlarini olish.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "admin": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "username": "general",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Company APIs

### 1. Company Login
**POST** `/company/login`

Kompaniya tizimga kirish.

**Request Body:**
```json
{
  "username": "techsolutions",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "company": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nom": "Tech Solutions MChJ",
    "INN": "123456789",
    "username": "techsolutions"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 2. Get Current Company
**GET** `/company/me`

Joriy kompaniya ma'lumotlarini olish.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "company": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nom": "Tech Solutions MChJ",
    "INN": "123456789",
    "kompaniyaEgasi": "Ali Valiyev",
    "kompaniyaEgasiTelefon": "+998901234567",
    "kompaniyaTelefon": "+998901234568",
    "username": "techsolutions",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Company Management APIs (Admin Only)

Barcha Company Management API'lari faqat admin tomonidan boshqariladi va admin authentication talab qiladi.

### 1. Create Company
**POST** `/company`

Yangi kompaniya yaratish.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "nom": "Tech Solutions MChJ",
  "INN": "123456789",
  "kompaniyaEgasi": "Ali Valiyev",
  "kompaniyaEgasiTelefon": "+998901234567",
  "kompaniyaTelefon": "+998901234568",
  "username": "techsolutions",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Kompaniya muvaffaqiyatli yaratildi",
  "company": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nom": "Tech Solutions MChJ",
    "INN": "123456789",
    "kompaniyaEgasi": "Ali Valiyev",
    "kompaniyaEgasiTelefon": "+998901234567",
    "kompaniyaTelefon": "+998901234568",
    "username": "techsolutions",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Bu INN yoki username allaqachon mavjud"
}
```

**Validation Errors:**
- Telefon raqamlari `+998XXXXXXXXX` formatida bo'lishi kerak (9 ta raqam)
- Password kamida 6 ta belgi bo'lishi kerak
- Barcha maydonlar to'ldirilishi shart

---

### 2. Get All Companies (Admin Only)
**GET** `/company`

Barcha kompaniyalarni olish.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "companies": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "nom": "Tech Solutions MChJ",
      "INN": "123456789",
      "kompaniyaEgasi": "Ali Valiyev",
      "kompaniyaEgasiTelefon": "+998901234567",
      "kompaniyaTelefon": "+998901234568",
      "username": "techsolutions",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "nom": "Digital Services LLC",
      "INN": "987654321",
      "kompaniyaEgasi": "Vali Aliyev",
      "kompaniyaEgasiTelefon": "+998901234569",
      "kompaniyaTelefon": "+998901234570",
      "username": "digitalservices",
      "createdAt": "2024-01-02T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Company (Admin Only)
**GET** `/company/:id`

Bitta kompaniya ma'lumotlarini olish.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Kompaniya ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "success": true,
  "company": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nom": "Tech Solutions MChJ",
    "INN": "123456789",
    "kompaniyaEgasi": "Ali Valiyev",
    "kompaniyaEgasiTelefon": "+998901234567",
    "kompaniyaTelefon": "+998901234568",
    "username": "techsolutions",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Kompaniya topilmadi"
}
```

---

### 4. Update Company (Admin Only)
**PUT** `/company/:id`

Kompaniya ma'lumotlarini yangilash.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Kompaniya ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "nom": "Tech Solutions Plus MChJ",
  "kompaniyaEgasi": "Ali Valiyev O'g'li",
  "kompaniyaTelefon": "+998901234571"
}
```

**Note:** Barcha maydonlar ixtiyoriy. Faqat yangilanishi kerak bo'lgan maydonlarni yuborish kifoya.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Kompaniya muvaffaqiyatli yangilandi",
  "company": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nom": "Tech Solutions Plus MChJ",
    "INN": "123456789",
    "kompaniyaEgasi": "Ali Valiyev O'g'li",
    "kompaniyaEgasiTelefon": "+998901234567",
    "kompaniyaTelefon": "+998901234571",
    "username": "techsolutions",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-03T00:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Kompaniya topilmadi"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Bu INN yoki username allaqachon mavjud"
}
```

---

### 5. Delete Company (Admin Only)
**DELETE** `/company/:id`

Kompaniyani o'chirish.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Kompaniya ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Kompaniya muvaffaqiyatli o'chirildi"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Kompaniya topilmadi"
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

## Company Model Fields

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| nom | String | Yes | No | Kompaniya nomi |
| INN | String | Yes | Yes | Kompaniya INN raqami |
| kompaniyaEgasi | String | Yes | No | Kompaniya egasi FIO |
| kompaniyaEgasiTelefon | String | Yes | No | Ega telefon raqami (+998XXXXXXXXX) |
| kompaniyaTelefon | String | Yes | No | Kompaniya telefon raqami (+998XXXXXXXXX) |
| username | String | Yes | Yes | Login username |
| password | String | Yes | No | Parol (min 6 belgi, hash qilinadi) |
| createdAt | Date | Auto | No | Yaratilgan vaqt |
| updatedAt | Date | Auto | No | Yangilangan vaqt |

---

## Notes

1. Barcha Company API'lari faqat admin tomonidan boshqariladi
2. Password avtomatik ravishda bcrypt bilan hash qilinadi
3. Telefon raqamlari `+998XXXXXXXXX` formatida bo'lishi kerak (9 ta raqam)
4. INN va username unique bo'lishi kerak
5. JWT token 30 kun muddatga amal qiladi


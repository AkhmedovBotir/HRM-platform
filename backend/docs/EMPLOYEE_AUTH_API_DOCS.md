# Employee Auth API Documentation

Xodimlar uchun autentifikatsiya API hujjatlari.

## Base URL
```
/api/employee-auth
```

---

## Endpoints

### 1. Xodim uchun login yaratish (Company Admin)

**POST** `/api/employee-auth/create-credentials`

**Headers:**
```
Authorization: Bearer <company_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "employeeId": "64abc123def456789012342",
  "username": "sardor.karimov",  // Optional - avtomatik yaratiladi
  "password": "MyPassword123"     // Optional - avtomatik yaratiladi
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| employeeId | string | Yes | Xodim ID |
| username | string | No | Username (berilmasa avtomatik yaratiladi) |
| password | string | No | Parol (berilmasa avtomatik yaratiladi) |

**Response (201):**
```json
{
  "success": true,
  "message": "Xodim uchun login ma'lumotlari yaratildi",
  "credentials": {
    "employeeId": "64abc123def456789012342",
    "firstName": "Sardor",
    "lastName": "Karimov",
    "username": "sardor.karimov1234",
    "password": "AbCd1234"
  }
}
```

---

### 2. Xodim login

**POST** `/api/employee-auth/login`

**Request Body:**
```json
{
  "username": "sardor.karimov1234",
  "password": "AbCd1234"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Muvaffaqiyatli kirish",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "employee": {
    "id": "64abc123def456789012342",
    "firstName": "Sardor",
    "lastName": "Karimov",
    "middleName": "Alisher o'g'li",
    "username": "sardor.karimov1234",
    "phone": "+998901234567",
    "company": {
      "_id": "64abc123def456789012340",
      "nom": "Tech Company"
    },
    "department": {
      "_id": "64abc123def456789012350",
      "nom": "IT Bo'limi"
    },
    "position": {
      "_id": "64abc123def456789012351",
      "nom": "Dasturchi"
    }
  }
}
```

---

### 3. Xodim profili

**GET** `/api/employee-auth/profile`

**Headers:**
```
Authorization: Bearer <employee_token>
```

**Response (200):**
```json
{
  "success": true,
  "employee": {
    "id": "64abc123def456789012342",
    "firstName": "Sardor",
    "lastName": "Karimov",
    "middleName": "Alisher o'g'li",
    "username": "sardor.karimov1234",
    "phone": "+998901234567",
    "birthDate": "1990-05-15",
    "gender": "male",
    "address": "Toshkent sh.",
    "hireDate": "2023-01-15",
    "department": {
      "_id": "64abc123def456789012350",
      "nom": "IT Bo'limi"
    },
    "position": {
      "_id": "64abc123def456789012351",
      "nom": "Dasturchi"
    }
  }
}
```

---

### 4. Parolni o'zgartirish (Xodim)

**POST** `/api/employee-auth/change-password`

**Headers:**
```
Authorization: Bearer <employee_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "AbCd1234",
  "newPassword": "NewPassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Parol muvaffaqiyatli o'zgartirildi"
}
```

---

### 5. Xodim parolini qayta tiklash (Company Admin)

**POST** `/api/employee-auth/reset-password`

**Headers:**
```
Authorization: Bearer <company_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "employeeId": "64abc123def456789012342",
  "newPassword": "NewPassword789"  // Optional - avtomatik yaratiladi
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Parol muvaffaqiyatli yangilandi",
  "credentials": {
    "employeeId": "64abc123def456789012342",
    "firstName": "Sardor",
    "lastName": "Karimov",
    "username": "sardor.karimov1234",
    "password": "NewPassword789"
  }
}
```

---

### 6. Xodim login ma'lumotlarini yangilash (Company Admin)

**PUT** `/api/employee-auth/update-credentials`

**Headers:**
```
Authorization: Bearer <company_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "employeeId": "64abc123def456789012342",
  "username": "new.username",      // Optional
  "password": "NewPassword123"     // Optional
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| employeeId | string | Yes | Xodim ID |
| username | string | No | Yangi username |
| password | string | No | Yangi parol (min 6 ta belgi) |

**Response (200):**
```json
{
  "success": true,
  "message": "Xodim login ma'lumotlari yangilandi",
  "credentials": {
    "employeeId": "64abc123def456789012342",
    "firstName": "Sardor",
    "lastName": "Karimov",
    "username": "new.username",
    "password": "NewPassword123"
  }
}
```

---

## Error Responses

**401 - Unauthorized:**
```json
{
  "success": false,
  "message": "Noto'g'ri username yoki parol"
}
```

**400 - Bad Request:**
```json
{
  "success": false,
  "message": "Bu xodim uchun login allaqachon yaratilgan"
}
```

**404 - Not Found:**
```json
{
  "success": false,
  "message": "Xodim topilmadi yoki ishdan bo'shatilgan"
}
```

---

## Jarayon

```
1. Company admin xodim yaratadi
   POST /api/company/employees

2. Company admin xodim uchun login yaratadi
   POST /api/employee-auth/create-credentials
   Body: { employeeId }
   → username va password qaytariladi

3. Xodim tizimga kiradi
   POST /api/employee-auth/login
   Body: { username, password }
   → employee_token qaytariladi

4. Xodim o'z profilini ko'radi
   GET /api/employee-auth/profile
   Headers: Authorization: Bearer <employee_token>

5. Xodim parolini o'zgartiradi
   POST /api/employee-auth/change-password
   Body: { currentPassword, newPassword }
```


# Employee API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Employee API'lari uchun Company JWT token kerak. Token `Authorization` header'da quyidagicha yuboriladi:
```
Authorization: Bearer <company_token>
```

**Eslatma:** Barcha Employee API'lari faqat Company authentication talab qiladi. Har bir kompaniya faqat o'z xodimlarini boshqarishi mumkin.

---

## Employee Management APIs

### 1. Create Employee
**POST** `/company/employee`

Yangi xodim yaratish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**Request Body:**
```json
{
  "firstName": "Ali",
  "lastName": "Valiyev",
  "middleName": "O'g'li",
  "birthDate": "1990-05-15",
  "gender": "male",
  "phone": "+998901234567",
  "hireDate": "2024-01-01",
  "passport": "AB1234567",
  "address": "Toshkent shahar, Yunusobod tumani",
  "departmentId": "65a1b2c3d4e5f6g7h8i9j0k5",
  "positionId": "65a1b2c3d4e5f6g7h8i9j0k8"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Xodim muvaffaqiyatli yaratildi",
  "employee": {
    "id": "65a1b2c3d4e5f6g7h8i9j0kb",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "firstName": "Ali",
    "lastName": "Valiyev",
    "middleName": "O'g'li",
    "birthDate": "1990-05-15T00:00:00.000Z",
    "gender": "male",
    "phone": "+998901234567",
    "hireDate": "2024-01-01T00:00:00.000Z",
    "passport": "AB1234567",
    "address": "Toshkent shahar, Yunusobod tumani",
    "departmentId": "65a1b2c3d4e5f6g7h8i9j0k5",
    "departmentName": "IT Bo'limi",
    "positionId": "65a1b2c3d4e5f6g7h8i9j0k8",
    "positionName": "Senior Developer",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400) - Duplicate Passport:**
```json
{
  "success": false,
  "message": "Bu pasport bilan xodim allaqachon mavjud"
}
```

**Error Response (400) - Invalid Department:**
```json
{
  "success": false,
  "message": "Bo'lim topilmadi yoki bu kompaniyaga tegishli emas"
}
```

**Error Response (400) - Invalid Position:**
```json
{
  "success": false,
  "message": "Lavozim topilmadi yoki bu kompaniyaga tegishli emas"
}
```

**Validation Errors:**
- Telefon raqami `+998XXXXXXXXX` formatida bo'lishi kerak (9 ta raqam)
- Pasport seriya va raqami `AA1234567` formatida bo'lishi kerak (2 ta harf + 7 ta raqam)
- Jinsi faqat `male` yoki `female` bo'lishi mumkin
- Barcha maydonlar to'ldirilishi shart

---

### 2. Get All Employees
**GET** `/company/employee`

Kompaniyaning barcha xodimlarini olish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**Query Parameters:**
- `terminated` (optional) - Ishdan bo'shatilgan xodimlarni filter qilish
  - `true` - Faqat ishdan bo'shatilgan xodimlar
  - `false` - Faqat ishda bo'lgan xodimlar
  - Ko'rsatilmasa - Barcha xodimlar

**Example:**
```
GET /api/company/employee?terminated=false
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "employees": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0kb",
      "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "firstName": "Ali",
      "lastName": "Valiyev",
      "middleName": "O'g'li",
      "birthDate": "1990-05-15T00:00:00.000Z",
      "gender": "male",
      "phone": "+998901234567",
      "hireDate": "2024-01-01T00:00:00.000Z",
      "passport": "AB1234567",
      "address": "Toshkent shahar, Yunusobod tumani",
      "departmentId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
        "nom": "IT Bo'limi"
      },
      "positionId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k8",
        "nom": "Senior Developer"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0kc",
      "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "firstName": "Vali",
      "lastName": "Aliyev",
      "middleName": "O'g'li",
      "birthDate": "1995-08-20T00:00:00.000Z",
      "gender": "male",
      "phone": "+998901234568",
      "hireDate": "2024-02-01T00:00:00.000Z",
      "passport": "CD2345678",
      "address": "Toshkent shahar, Chilonzor tumani",
      "departmentId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
        "nom": "IT Bo'limi"
      },
      "positionId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k9",
        "nom": "Junior Developer"
      },
      "createdAt": "2024-02-01T00:00:00.000Z",
      "updatedAt": "2024-02-01T00:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Employee
**GET** `/company/employee/:id`

Bitta xodim ma'lumotlarini olish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Employee ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "success": true,
  "employee": {
    "id": "65a1b2c3d4e5f6g7h8i9j0kb",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "firstName": "Ali",
    "lastName": "Valiyev",
    "middleName": "O'g'li",
    "birthDate": "1990-05-15T00:00:00.000Z",
    "gender": "male",
    "phone": "+998901234567",
    "hireDate": "2024-01-01T00:00:00.000Z",
    "passport": "AB1234567",
    "address": "Toshkent shahar, Yunusobod tumani",
    "departmentId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
      "nom": "IT Bo'limi"
    },
    "positionId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k8",
      "nom": "Senior Developer"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Xodim topilmadi"
}
```

---

### 4. Update Employee
**PUT** `/company/employee/:id`

Xodim ma'lumotlarini yangilash.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Employee ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "firstName": "Alisher",
  "phone": "+998901234571",
  "address": "Toshkent shahar, Mirzo Ulug'bek tumani"
}
```

**Note:** Barcha maydonlar ixtiyoriy. Faqat yangilanishi kerak bo'lgan maydonlarni yuborish kifoya.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Xodim muvaffaqiyatli yangilandi",
  "employee": {
    "id": "65a1b2c3d4e5f6g7h8i9j0kb",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "firstName": "Alisher",
    "lastName": "Valiyev",
    "middleName": "O'g'li",
    "birthDate": "1990-05-15T00:00:00.000Z",
    "gender": "male",
    "phone": "+998901234571",
    "hireDate": "2024-01-01T00:00:00.000Z",
    "passport": "AB1234567",
    "address": "Toshkent shahar, Mirzo Ulug'bek tumani",
    "departmentId": "65a1b2c3d4e5f6g7h8i9j0k5",
    "departmentName": "IT Bo'limi",
    "positionId": "65a1b2c3d4e5f6g7h8i9j0k8",
    "positionName": "Senior Developer",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-03T00:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Xodim topilmadi"
}
```

**Error Response (400) - Duplicate Passport:**
```json
{
  "success": false,
  "message": "Bu pasport bilan xodim mavjud"
}
```

**Error Response (400) - Invalid Department:**
```json
{
  "success": false,
  "message": "Bo'lim topilmadi yoki bu kompaniyaga tegishli emas"
}
```

**Error Response (400) - Invalid Position:**
```json
{
  "success": false,
  "message": "Lavozim topilmadi yoki bu kompaniyaga tegishli emas"
}
```

---

### 5. Terminate Employee
**POST** `/company/employee/:id/terminate`

Xodimni ishdan bo'shatish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Employee ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "terminationDate": "2024-03-15",
  "terminationReason": "Ish tartib-qoidalarini buzgani uchun"
}
```

**Note:** `terminationDate` ixtiyoriy. Agar ko'rsatilmasa, joriy sana avtomatik qo'yiladi. `terminationReason` majburiy.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Xodim muvaffaqiyatli ishdan bo'shatildi",
  "employee": {
    "id": "65a1b2c3d4e5f6g7h8i9j0kb",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "firstName": "Ali",
    "lastName": "Valiyev",
    "middleName": "O'g'li",
    "birthDate": "1990-05-15T00:00:00.000Z",
    "gender": "male",
    "phone": "+998901234567",
    "hireDate": "2024-01-01T00:00:00.000Z",
    "passport": "AB1234567",
    "address": "Toshkent shahar, Yunusobod tumani",
    "departmentId": "65a1b2c3d4e5f6g7h8i9j0k5",
    "departmentName": "IT Bo'limi",
    "positionId": "65a1b2c3d4e5f6g7h8i9j0k8",
    "positionName": "Senior Developer",
    "isTerminated": true,
    "terminationDate": "2024-03-15T00:00:00.000Z",
    "terminationReason": "Ish tartib-qoidalarini buzgani uchun",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-03-15T00:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Xodim topilmadi"
}
```

**Error Response (400) - Already Terminated:**
```json
{
  "success": false,
  "message": "Xodim allaqachon ishdan bo'shatilgan"
}
```

**Error Response (400) - Missing Reason:**
```json
{
  "success": false,
  "message": "\"terminationReason\" is required"
}
```

---

### 6. Delete Employee
**DELETE** `/company/employee/:id`

Xodimni o'chirish.

**Headers:**
```
Authorization: Bearer <company_token>
```

**URL Parameters:**
- `id` - Employee ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Xodim muvaffaqiyatli o'chirildi"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Xodim topilmadi"
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
  "message": "Xodim topilmadi"
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

## Employee Model Fields

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| companyId | ObjectId | Yes | No | Kompaniya ID (reference) |
| firstName | String | Yes | No | Ism |
| lastName | String | Yes | No | Familiya |
| middleName | String | Yes | No | Otasini ismi |
| birthDate | Date | Yes | No | Tug'ilgan sana |
| gender | String | Yes | No | Jinsi (male/female) |
| phone | String | Yes | No | Telefon raqami (+998XXXXXXXXX) |
| hireDate | Date | Yes | No | Ishga kirgan sana |
| passport | String | Yes | Yes* | Pasport seriya va raqami (AA1234567, *unique per company) |
| address | String | Yes | No | Yashash manzil |
| departmentId | ObjectId | Yes | No | Bo'lim ID (reference) |
| positionId | ObjectId | Yes | No | Lavozim ID (reference) |
| isTerminated | Boolean | No | No | Ishdan bo'shatilgan (default: false) |
| terminationDate | Date | No | No | Ishdan bo'shatilgan sana |
| terminationReason | String | No | No | Ishdan bo'shatish sababi |
| createdAt | Date | Auto | No | Yaratilgan vaqt |
| updatedAt | Date | Auto | No | Yangilangan vaqt |

---

## Notes

1. Barcha Employee API'lari faqat Company authentication talab qiladi
2. Har bir kompaniya faqat o'z xodimlarini ko'rish va boshqarishi mumkin
3. Pasport har bir kompaniya ichida unique bo'lishi kerak
4. Department va Position kompaniyaga tegishli bo'lishi kerak
5. Telefon raqamlari `+998XXXXXXXXX` formatida bo'lishi kerak (9 ta raqam)
6. Pasport seriya va raqami `AA1234567` formatida bo'lishi kerak (2 ta harf + 7 ta raqam)
7. Jinsi faqat `male` yoki `female` bo'lishi mumkin
8. JWT token 30 kun muddatga amal qiladi
9. Xodimni ishdan bo'shatish uchun sabab majburiy
10. Ishdan bo'shatilgan xodimni qayta ishdan bo'shatib bo'lmaydi
11. GetAllEmployees endpoint'ida `terminated` query parametri orqali filter qilish mumkin

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

2. **Company yangi xodim yaratadi:**
   ```bash
   POST /api/company/employee
   Headers: Authorization: Bearer <company_token>
   {
     "firstName": "Ali",
     "lastName": "Valiyev",
     "middleName": "O'g'li",
     "birthDate": "1990-05-15",
     "gender": "male",
     "phone": "+998901234567",
     "hireDate": "2024-01-01",
     "passport": "AB1234567",
     "address": "Toshkent shahar, Yunusobod tumani",
     "departmentId": "65a1b2c3d4e5f6g7h8i9j0k5",
     "positionId": "65a1b2c3d4e5f6g7h8i9j0k8"
   }
   ```

3. **Company barcha xodimlarni ko'radi:**
   ```bash
   GET /api/company/employee
   Headers: Authorization: Bearer <company_token>
   ```

4. **Company xodim ma'lumotlarini yangilaydi:**
   ```bash
   PUT /api/company/employee/:id
   Headers: Authorization: Bearer <company_token>
   {
     "phone": "+998901234571",
     "address": "Toshkent shahar, Mirzo Ulug'bek tumani"
   }
   ```

5. **Company xodimni ishdan bo'shatadi:**
   ```bash
   POST /api/company/employee/:id/terminate
   Headers: Authorization: Bearer <company_token>
   {
     "terminationDate": "2024-03-15",
     "terminationReason": "Ish tartib-qoidalarini buzgani uchun"
   }
   ```

6. **Company faqat ishda bo'lgan xodimlarni ko'radi:**
   ```bash
   GET /api/company/employee?terminated=false
   Headers: Authorization: Bearer <company_token>
   ```

7. **Company faqat ishdan bo'shatilgan xodimlarni ko'radi:**
   ```bash
   GET /api/company/employee?terminated=true
   Headers: Authorization: Bearer <company_token>
   ```

8. **Company xodimni o'chiradi:**
   ```bash
   DELETE /api/company/employee/:id
   Headers: Authorization: Bearer <company_token>
   ```


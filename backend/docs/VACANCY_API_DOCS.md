 # Vacancy API Documentation

 ## Base URL
 ```
 http://localhost:3000/api
 ```

 ## Authentication
 Vakansiya API'lari uchun Company JWT token talab qilinadi. Token `Authorization` header orqali yuboriladi:
 ```
 Authorization: Bearer <company_token>
 ```

 **Eslatma:** Barcha Vakansiya API'lari faqat Company authentication bilan ishlaydi. Kompaniya faqat o'ziga tegishli bo'lgan departments, positions, schedule templates va vacancies bilan ishlashi mumkin.

 ---

 ## 1. Vacancy APIs

 ### 1.1. Create Vacancy
 **POST** `/company/vacancy`

 Yangi vakansiya yaratish.

 **Headers:**
 ```
 Authorization: Bearer <company_token>
 Content-Type: application/json
 ```

 **Request Body:**
 ```json
 {
   "nom": "Middle Node.js Developer",
   "departmentId": "65a1b2c3d4e5f6g7h8i9j0d1",
   "positionId": "65a1b2c3d4e5f6g7h8i9j0p1",
   "daraja": "Middle", // Text format (masalan: "Junior", "Middle", "Senior")
   "type": "fulltime", // Faqat "fulltime" yoki "parttime"
   "workScheduleId": "65a1b2c3d4e5f6g7h8i9j0s1",
   "oylik": "$1500 - $2000",
   "description": "<p>Bizga tajribali Node.js developer kerak...</p>",
   "responsibilities": "<ul><li>Microservice yozish</li><li>Code review</li></ul>",
    "preferences": "<p>English B2 dan kam bo'lmasligi</p>",
    "skills": ["nodejs", "mongodb", "docker"],
    "status": "active",
    "minAge": 25,
    "maxAge": 40
  }
 ```

 **Response (201 Created):**
 ```json
 {
   "success": true,
   "message": "Vakansiya muvaffaqiyatli yaratildi",
   "vacancy": {
     "_id": "65b1c2d3e4f5a6b7c8d9e0f1",
     "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
     "nom": "Middle Node.js Developer",
     "departmentId": {
       "_id": "65a1b2c3d4e5f6g7h8i9j0d1",
       "nom": "IT"
     },
     "positionId": {
       "_id": "65a1b2c3d4e5f6g7h8i9j0p1",
       "nom": "Backend Developer"
     },
     "workScheduleId": {
       "_id": "65a1b2c3d4e5f6g7h8i9j0s1",
       "nom": "Standart 9/6"
     },
     "daraja": "Middle",
     "type": "fulltime",
     "oylik": "$1500 - $2000",
     "description": "<p>Bizga tajribali Node.js developer kerak...</p>",
     "responsibilities": "<ul><li>Microservice yozish</li><li>Code review</li></ul>",
     "preferences": "<p>English B2 dan kam bo'lmasligi</p>",
     "skills": [
       "nodejs",
       "mongodb",
       "docker"
     ],
      "status": "active",
      "applicationCount": 0,
      "minAge": 25,
      "maxAge": 40,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
 ```

 **Error Response (404):**
 ```json
 {
   "success": false,
   "message": "Bo'lim topilmadi yoki sizning kompaniyangizga tegishli emas"
 }
 ```

 ---

 ### 1.2. Get All Vacancies
 **GET** `/company/vacancy`

 Kompaniyaga tegishli barcha vakansiyalar ro'yxati.

 **Query Params (ixtiyoriy):**
 - `status`: `active` yoki `close`

 **Response (200 OK):**
 ```json
 {
   "success": true,
   "count": 2,
   "vacancies": [
     {
       "_id": "65b1c2d3e4f5a6b7c8d9e0f1",
       "nom": "Middle Node.js Developer",
       "departmentId": {
         "_id": "65a1b2c3d4e5f6g7h8i9j0d1",
         "nom": "IT"
       },
       "positionId": {
         "_id": "65a1b2c3d4e5f6g7h8i9j0p1",
         "nom": "Backend Developer"
       },
       "workScheduleId": {
         "_id": "65a1b2c3d4e5f6g7h8i9j0s1",
         "nom": "Standart 9/6"
       },
       "daraja": "Middle",
       "type": "fulltime",
       "oylik": "$1500 - $2000",
       "description": "<p>...</p>",
       "responsibilities": "<ul>...</ul>",
       "preferences": "<p>...</p>",
       "skills": [
         "nodejs",
         "mongodb",
         "docker"
       ],
       "status": "active",
       "applicationCount": 3,
       "createdAt": "2024-01-01T00:00:00.000Z",
       "updatedAt": "2024-01-02T00:00:00.000Z"
     }
   ]
 }
 ```

 ---

 ### 1.3. Get Single Vacancy
 **GET** `/company/vacancy/:id`

 ID bo'yicha bitta vakansiya ma'lumotini olish.

 **Response (200 OK):**
 ```json
 {
   "success": true,
   "vacancy": {
     "_id": "65b1c2d3e4f5a6b7c8d9e0f1",
     "nom": "Middle Node.js Developer",
     "departmentId": {
       "_id": "65a1b2c3d4e5f6g7h8i9j0d1",
       "nom": "IT"
     },
     "positionId": {
       "_id": "65a1b2c3d4e5f6g7h8i9j0p1",
       "nom": "Backend Developer"
     },
     "workScheduleId": {
       "_id": "65a1b2c3d4e5f6g7h8i9j0s1",
       "nom": "Standart 9/6"
     },
     "daraja": "Middle",
     "type": "fulltime",
     "oylik": "$1500 - $2000",
     "description": "<p>...</p>",
     "responsibilities": "<ul>...</ul>",
     "preferences": "<p>...</p>",
     "skills": [
       "nodejs",
       "mongodb",
       "docker"
     ],
     "status": "active",
     "applicationCount": 3,
     "createdAt": "2024-01-01T00:00:00.000Z",
     "updatedAt": "2024-01-02T00:00:00.000Z"
   }
 }
 ```

 **Error Response (404):**
 ```json
 {
   "success": false,
   "message": "Vakansiya topilmadi"
 }
 ```

 ---

 ### 1.4. Update Vacancy
 **PUT** `/company/vacancy/:id`

 Vakansiya ma'lumotlarini yangilash. `status` va `applicationCount` bu endpoint orqali yangilanmaydi.

 **Request Body (example):**
 ```json
  {
    "nom": "Senior Node.js Developer",
    "daraja": "Senior",
    "oylik": "$2000 - $2500",
    "skills": ["nodejs", "mongodb", "docker", "aws"],
    "minAge": 30,
    "maxAge": 45
  }
 ```

 **Response (200 OK):**
 ```json
 {
   "success": true,
   "message": "Vakansiya muvaffaqiyatli yangilandi",
   "vacancy": {
     "_id": "65b1c2d3e4f5a6b7c8d9e0f1",
     "nom": "Senior Node.js Developer",
     "daraja": "Senior",
     "oylik": "$2000 - $2500",
     "skills": [
       "nodejs",
       "mongodb",
       "docker",
       "aws"
     ],
     "status": "active",
     "applicationCount": 3,
     "updatedAt": "2024-01-03T00:00:00.000Z",
     "...": "boshqa maydonlar ham qaytariladi"
   }
 }
 ```

 ---

 ### 1.5. Update Vacancy Status
 **PATCH** `/company/vacancy/:id/status`

 Vakansiya statusini `active` yoki `close` ga o'zgartirish.

 **Request Body:**
 ```json
 {
   "status": "close"
 }
 ```

 **Response (200 OK):**
 ```json
 {
   "success": true,
   "message": "Vakansiya status muvaffaqiyatli yangilandi",
   "vacancy": {
     "_id": "65b1c2d3e4f5a6b7c8d9e0f1",
     "status": "close",
     "updatedAt": "2024-01-05T00:00:00.000Z",
     "...": "boshqa maydonlar"
   }
 }
 ```

 ---

 ### 1.6. Update Application Count
 **PATCH** `/company/vacancy/:id/application-count`

 Ushbu vakansiyaga topshirganlar sonini yangilash.

 **Request Body:**
 ```json
 {
   "applicationCount": 7
 }
 ```

 **Response (200 OK):**
 ```json
 {
   "success": true,
   "message": "Ariza soni muvaffaqiyatli yangilandi",
   "vacancy": {
     "_id": "65b1c2d3e4f5a6b7c8d9e0f1",
     "applicationCount": 7,
     "updatedAt": "2024-01-06T00:00:00.000Z",
     "...": "boshqa maydonlar"
   }
 }
 ```

 **Error Response (400):**
 ```json
 {
   "success": false,
   "message": "Application count 0 yoki undan katta son bo'lishi kerak"
 }
 ```

 ---

 ### 1.7. Delete Vacancy
 **DELETE** `/company/vacancy/:id`

 Vakansiyani o'chirish.

 **Response (200 OK):**
 ```json
 {
   "success": true,
   "message": "Vakansiya muvaffaqiyatli o'chirildi"
 }
 ```

 **Error Response (404):**
 ```json
 {
   "success": false,
   "message": "Vakansiya topilmadi"
 }
 ```

 ---

## Qo'shimcha Izohlar
- `daraja` - Text formatda bo'lishi kerak (masalan: "Junior", "Middle", "Senior", "Lead" va hokazo). Har qanday matn qabul qilinadi.
- `type` - Faqat ikkita qiymat qabul qilinadi: `"fulltime"` yoki `"parttime"`. Boshqa qiymatlar qabul qilinmaydi.
- `minAge` - Minimal yosh chegarasi (ixtiyoriy, 0-100 orasida butun son).
- `maxAge` - Maksimal yosh chegarasi (ixtiyoriy, 0-100 orasida butun son).
- `description`, `responsibilities`, `preferences` HTML formatdagi matnlarni qabul qiladi.
- `skills` massiv bo'lishi kerak (masalan: `["nodejs", "mongodb"]`).
- `applicationCount` default qiymati 0 va manfiy bo'lishi mumkin emas.
- Barcha ID'lar kompaniyaga tegishli bo'lishi shart, aks holda 404 qaytariladi.


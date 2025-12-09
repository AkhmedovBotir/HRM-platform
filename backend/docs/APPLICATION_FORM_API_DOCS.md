# Application Form API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Application Form API'lari uchun Company JWT token talab qilinadi (faqat company tomonidan boshqarish uchun). Public endpoint'lar authentication talab qilmaydi.

Token `Authorization` header orqali yuboriladi:
```
Authorization: Bearer <company_token>
```

**Eslatma:** 
- Company authenticated endpoint'lar: So'rovnoma yaratish, yangilash, o'chirish va boshqarish
- Public endpoint'lar: Vakansiya ID bo'yicha so'rovnomani olish (nomzodlar uchun)

---

## 1. Application Form APIs (Company Authenticated)

### 1.1. Create Application Form
**POST** `/company/application-form`

Vakansiya uchun yangi so'rovnoma yaratish. Har bir vakansiya uchun faqat bitta so'rovnoma bo'lishi mumkin.

**Headers:**
```
Authorization: Bearer <company_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "vacancyId": "65b1c2d3e4f5a6b7c8d9e0f1",
  "nom": "Node.js Developer uchun so'rovnoma",
  "questions": [
    {
      "question": "Ism va familiyangizni kiriting",
      "type": "text",
      "required": true,
      "placeholder": "Masalan: Alisher Karimov",
      "order": 0
    },
    {
      "question": "Telefon raqamingizni kiriting",
      "type": "phone",
      "required": true,
      "placeholder": "+998901234567",
      "order": 1
    },
    {
      "question": "Email manzilingizni kiriting",
      "type": "email",
      "required": true,
      "placeholder": "example@mail.com",
      "order": 2
    },
    {
      "question": "Jinsingizni tanlang",
      "type": "radio",
      "required": true,
      "options": ["Erkak", "Ayol"],
      "order": 3
    },
    {
      "question": "Yoshingizni kiriting",
      "type": "number",
      "required": true,
      "placeholder": "25",
      "order": 4
    },
    {
      "question": "Tug'ilgan sanangiz",
      "type": "date",
      "required": true,
      "order": 5
    },
    {
      "question": "Qaysi texnologiyalarni bilasiz?",
      "type": "checkbox",
      "required": false,
      "options": ["Node.js", "React", "MongoDB", "PostgreSQL", "Docker"],
      "order": 6
    },
    {
      "question": "Tajribangiz haqida batafsil yozing",
      "type": "textarea",
      "required": true,
      "placeholder": "Ish tajribangiz, loyihalar haqida...",
      "order": 7
    },
    {
      "question": "Resume faylingizni yuklang",
      "type": "file",
      "required": false,
      "order": 8
    },
    {
      "question": "Qaysi shaharda yashaysiz?",
      "type": "select",
      "required": true,
      "options": ["Toshkent", "Samarqand", "Buxoro", "Andijon", "Farg'ona", "Boshqa"],
      "order": 9
    }
  ],
  "status": "active"
}
```

**Question Types:**
- `text` - Oddiy matn kiritish
- `textarea` - Uzun matn kiritish
- `number` - Son kiritish
- `email` - Email manzil
- `phone` - Telefon raqam
- `select` - Dropdown tanlov (options majburiy)
- `radio` - Radio button tanlov (options majburiy)
- `checkbox` - Checkbox tanlov (options majburiy)
- `date` - Sana tanlash
- `file` - Fayl yuklash

**Response (201 Created):**
```json
{
  "success": true,
  "message": "So'rovnoma muvaffaqiyatli yaratildi",
  "applicationForm": {
    "_id": "65c1d2e3f4a5b6c7d8e9f0a1",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "vacancyId": {
      "_id": "65b1c2d3e4f5a6b7c8d9e0f1",
      "nom": "Middle Node.js Developer"
    },
    "nom": "Node.js Developer uchun so'rovnoma",
    "questions": [
      {
        "_id": "65c1d2e3f4a5b6c7d8e9f0a2",
        "question": "Ism va familiyangizni kiriting",
        "type": "text",
        "required": true,
        "placeholder": "Masalan: Alisher Karimov",
        "options": [],
        "order": 0
      },
      {
        "_id": "65c1d2e3f4a5b6c7d8e9f0a3",
        "question": "Telefon raqamingizni kiriting",
        "type": "phone",
        "required": true,
        "placeholder": "+998901234567",
        "options": [],
        "order": 1
      },
      {
        "_id": "65c1d2e3f4a5b6c7d8e9f0a4",
        "question": "Jinsingizni tanlang",
        "type": "radio",
        "required": true,
        "options": ["Erkak", "Ayol"],
        "order": 3
      }
    ],
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
  "message": "Bu vakansiya uchun so'rovnoma allaqachon mavjud"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Vakansiya topilmadi yoki sizning kompaniyangizga tegishli emas"
}
```

**Error Response (400) - Validation:**
```json
{
  "success": false,
  "message": "Savol 3: select turi uchun options majburiy va kamida bitta variant bo'lishi kerak"
}
```

---

### 1.2. Get All Application Forms
**GET** `/company/application-form`

Kompaniyaning barcha so'rovnomalarini olish.

**Query Params (ixtiyoriy):**
- `vacancyId` - Vakansiya ID bo'yicha filter
- `status` - `active` yoki `inactive`

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "forms": [
    {
      "_id": "65c1d2e3f4a5b6c7d8e9f0a1",
      "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "vacancyId": {
        "_id": "65b1c2d3e4f5a6b7c8d9e0f1",
        "nom": "Middle Node.js Developer"
      },
      "nom": "Node.js Developer uchun so'rovnoma",
      "questions": [
        {
          "_id": "65c1d2e3f4a5b6c7d8e9f0a2",
          "question": "Ism va familiyangizni kiriting",
          "type": "text",
          "required": true,
          "placeholder": "Masalan: Alisher Karimov",
          "options": [],
          "order": 0
        }
      ],
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 1.3. Get Single Application Form
**GET** `/company/application-form/:id`

ID bo'yicha bitta so'rovnoma ma'lumotini olish.

**Response (200 OK):**
```json
{
  "success": true,
  "form": {
    "_id": "65c1d2e3f4a5b6c7d8e9f0a1",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "vacancyId": {
      "_id": "65b1c2d3e4f5a6b7c8d9e0f1",
      "nom": "Middle Node.js Developer"
    },
    "nom": "Node.js Developer uchun so'rovnoma",
    "questions": [
      {
        "_id": "65c1d2e3f4a5b6c7d8e9f0a2",
        "question": "Ism va familiyangizni kiriting",
        "type": "text",
        "required": true,
        "placeholder": "Masalan: Alisher Karimov",
        "options": [],
        "order": 0
      }
    ],
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
  "message": "So'rovnoma topilmadi"
}
```

---

### 1.4. Update Application Form
**PUT** `/company/application-form/:id`

So'rovnoma ma'lumotlarini yangilash. `status` bu endpoint orqali yangilanmaydi.

**Request Body (example):**
```json
{
  "nom": "Yangilangan so'rovnoma nomi",
  "questions": [
    {
      "question": "Ism va familiyangizni kiriting",
      "type": "text",
      "required": true,
      "placeholder": "Masalan: Alisher Karimov",
      "order": 0
    },
    {
      "question": "Yangi savol",
      "type": "textarea",
      "required": false,
      "order": 1
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "So'rovnoma muvaffaqiyatli yangilandi",
  "form": {
    "_id": "65c1d2e3f4a5b6c7d8e9f0a1",
    "nom": "Yangilangan so'rovnoma nomi",
    "questions": [
      {
        "_id": "65c1d2e3f4a5b6c7d8e9f0a2",
        "question": "Ism va familiyangizni kiriting",
        "type": "text",
        "required": true,
        "placeholder": "Masalan: Alisher Karimov",
        "options": [],
        "order": 0
      }
    ],
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 1.5. Update Application Form Status
**PATCH** `/company/application-form/:id/status`

So'rovnoma statusini `active` yoki `inactive` ga o'zgartirish.

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
  "message": "So'rovnoma status muvaffaqiyatli yangilandi",
  "form": {
    "_id": "65c1d2e3f4a5b6c7d8e9f0a1",
    "status": "inactive",
    "updatedAt": "2024-01-03T00:00:00.000Z"
  }
}
```

---

### 1.6. Delete Application Form
**DELETE** `/company/application-form/:id`

So'rovnomani o'chirish.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "So'rovnoma muvaffaqiyatli o'chirildi"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "So'rovnoma topilmadi"
}
```

---

## 2. Public Application Form APIs (No Authentication)

### 2.1. Get Application Form by Vacancy ID
**GET** `/api/application-form/vacancy/:vacancyId`

Vakansiya ID bo'yicha so'rovnomani olish. Bu endpoint authentication talab qilmaydi va nomzodlar tomonidan ishlatiladi.

**Response (200 OK):**
```json
{
  "success": true,
  "form": {
    "_id": "65c1d2e3f4a5b6c7d8e9f0a1",
    "companyId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "vacancyId": {
      "_id": "65b1c2d3e4f5a6b7c8d9e0f1",
      "nom": "Middle Node.js Developer"
    },
    "nom": "Node.js Developer uchun so'rovnoma",
    "questions": [
      {
        "_id": "65c1d2e3f4a5b6c7d8e9f0a2",
        "question": "Ism va familiyangizni kiriting",
        "type": "text",
        "required": true,
        "placeholder": "Masalan: Alisher Karimov",
        "options": [],
        "order": 0
      },
      {
        "_id": "65c1d2e3f4a5b6c7d8e9f0a3",
        "question": "Telefon raqamingizni kiriting",
        "type": "phone",
        "required": true,
        "placeholder": "+998901234567",
        "options": [],
        "order": 1
      },
      {
        "_id": "65c1d2e3f4a5b6c7d8e9f0a4",
        "question": "Jinsingizni tanlang",
        "type": "radio",
        "required": true,
        "options": ["Erkak", "Ayol"],
        "order": 3
      }
    ],
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
  "message": "So'rovnoma topilmadi"
}
```

**Eslatma:** Faqat `status: 'active'` bo'lgan so'rovnomalar qaytariladi.

---

### 2.2. Submit Application
**POST** `/api/application`

So'rovnomaga javob berish va ariza yuborish. Bu endpoint authentication talab qilmaydi va nomzodlar tomonidan ishlatiladi.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "vacancyId": "65b1c2d3e4f5a6b7c8d9e0f1",
  "answers": [
    {
      "questionId": "65c1d2e3f4a5b6c7d8e9f0a2",
      "answer": "Alisher Karimov"
    },
    {
      "questionId": "65c1d2e3f4a5b6c7d8e9f0a3",
      "answer": "+998901234567"
    },
    {
      "questionId": "65c1d2e3f4a5b6c7d8e9f0a4",
      "answer": "example@mail.com"
    },
    {
      "questionId": "65c1d2e3f4a5b6c7d8e9f0a5",
      "answer": "Erkak"
    },
    {
      "questionId": "65c1d2e3f4a5b6c7d8e9f0a6",
      "answer": 25
    },
    {
      "questionId": "65c1d2e3f4a5b6c7d8e9f0a7",
      "answer": "1999-01-01"
    },
    {
      "questionId": "65c1d2e3f4a5b6c7d8e9f0a8",
      "answer": ["Node.js", "React", "MongoDB"]
    },
    {
      "questionId": "65c1d2e3f4a5b6c7d8e9f0a9",
      "answer": "5 yil Node.js bilan ishlash tajribam bor..."
    },
    {
      "questionId": "65c1d2e3f4a5b6c7d8e9f0aa",
      "answer": "https://example.com/resume.pdf"
    },
    {
      "questionId": "65c1d2e3f4a5b6c7d8e9f0ab",
      "answer": "Toshkent"
    }
  ]
}
```

**Javob Formatlari:**
- `text`, `textarea`, `email`, `phone` - String
- `number` - Number yoki String (raqam sifatida)
- `date` - String (ISO format) yoki Date
- `select`, `radio` - String (options ichidan tanlangan variant)
- `checkbox` - Array (bir nechta variant tanlash mumkin)
- `file` - String (fayl URL yoki base64)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Ariza muvaffaqiyatli yuborildi",
  "submission": {
    "_id": "65d1e2f3a4b5c6d7e8f9a0b1",
    "vacancyId": {
      "_id": "65b1c2d3e4f5a6b7c8d9e0f1",
      "nom": "Middle Node.js Developer"
    },
    "status": "pending",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Response (404) - So'rovnoma yo'q:**
```json
{
  "success": false,
  "message": "So'rovnoma yo'q"
}
```

**Error Response (404) - Vakansiya topilmadi:**
```json
{
  "success": false,
  "message": "Vakansiya topilmadi"
}
```

**Error Response (400) - Vakansiya yopilgan:**
```json
{
  "success": false,
  "message": "Bu vakansiya yopilgan"
}
```

**Error Response (400) - Majburiy savolga javob berilmagan:**
```json
{
  "success": false,
  "message": "\"Ism va familiyangizni kiriting\" savoli majburiy va javob berish kerak"
}
```

**Error Response (400) - Noto'g'ri javob formati:**
```json
{
  "success": false,
  "message": "\"Jinsingizni tanlang\" savoli uchun noto'g'ri javob formati"
}
```

**Error Response (400) - Tanlangan variant mavjud emas:**
```json
{
  "success": false,
  "message": "\"Qaysi shaharda yashaysiz?\" savoli uchun tanlangan variant mavjud emas"
}
```

**Eslatmalar:**
- Barcha majburiy (`required: true`) savollarga javob berilishi shart
- `select`, `radio` uchun javob faqat `options` ichidagi variantlardan bo'lishi kerak
- `checkbox` uchun javob array bo'lishi kerak va barcha variantlar `options` ichida bo'lishi kerak
- `number` turi uchun javob raqam yoki raqam sifatida parse qilinadigan string bo'lishi kerak
- Ariza yuborilgandan keyin vakansiyadagi `applicationCount` avtomatik ravishda oshiriladi

---

## Qo'shimcha Izohlar

### Question Types va Ularning Xususiyatlari:

1. **text** - Oddiy matn kiritish
   - `placeholder` - ixtiyoriy
   - `options` - kerak emas

2. **textarea** - Uzun matn kiritish
   - `placeholder` - ixtiyoriy
   - `options` - kerak emas

3. **number** - Son kiritish
   - `placeholder` - ixtiyoriy
   - `options` - kerak emas

4. **email** - Email manzil
   - `placeholder` - ixtiyoriy
   - `options` - kerak emas

5. **phone** - Telefon raqam
   - `placeholder` - ixtiyoriy
   - `options` - kerak emas

6. **select** - Dropdown tanlov
   - `options` - **MAJBURIY** (kamida 1 ta variant)
   - `placeholder` - ixtiyoriy

7. **radio** - Radio button tanlov
   - `options` - **MAJBURIY** (kamida 1 ta variant)
   - `placeholder` - kerak emas

8. **checkbox** - Checkbox tanlov (bir nechta tanlov mumkin)
   - `options` - **MAJBURIY** (kamida 1 ta variant)
   - `placeholder` - kerak emas

9. **date** - Sana tanlash
   - `placeholder` - kerak emas
   - `options` - kerak emas

10. **file** - Fayl yuklash
    - `placeholder` - ixtiyoriy
    - `options` - kerak emas

### Muhim Qoidalar:

- Har bir vakansiya uchun faqat **bitta so'rovnoma** bo'lishi mumkin
- So'rovnomada kamida **bitta savol** bo'lishi kerak
- `select`, `radio`, `checkbox` turlari uchun `options` majburiy va kamida bitta variant bo'lishi kerak
- `order` maydoni savollar tartibini belgilaydi (0 dan boshlanadi)
- `required` maydoni savolning majburiy yoki ixtiyoriy ekanligini belgilaydi (default: `false`)
- Public endpoint faqat `status: 'active'` bo'lgan so'rovnomalarni qaytaradi

### Misol So'rovnoma:

```json
{
  "vacancyId": "65b1c2d3e4f5a6b7c8d9e0f1",
  "nom": "Full Stack Developer uchun so'rovnoma",
  "questions": [
    {
      "question": "Ism va familiyangiz",
      "type": "text",
      "required": true,
      "order": 0
    },
    {
      "question": "Telefon raqam",
      "type": "phone",
      "required": true,
      "order": 1
    },
    {
      "question": "Jins",
      "type": "radio",
      "required": true,
      "options": ["Erkak", "Ayol"],
      "order": 2
    },
    {
      "question": "Tajriba (yil)",
      "type": "number",
      "required": true,
      "order": 3
    },
    {
      "question": "Texnologiyalar",
      "type": "checkbox",
      "required": false,
      "options": ["JavaScript", "TypeScript", "Node.js", "React", "Vue"],
      "order": 4
    },
    {
      "question": "Qo'shimcha ma'lumot",
      "type": "textarea",
      "required": false,
      "order": 5
    }
  ]
}
```


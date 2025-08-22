# API Documentation

**Base URL:** http://localhost:3000


## Brand Endpoints

### 1. Create Brand
**POST** /brands  
**Request Body:**
```json
{
  "brand": "Nike",
  "type": "Sepatu Sport",
  "price": 1200000,
  "description": "Sepatu lari nyaman",
  "coverUrl": "https://example.com/nike.jpg"
}

Response (201 Created):

{
  "id": 1,
  "brand": "Nike",
  "type": "Sepatu Sport",
  "price": 1200000,
  "description": "Sepatu lari nyaman",
  "coverUrl": "https://example.com/nike.jpg",
  "createdAt": "2025-08-22T04:00:00.000Z",
  "updatedAt": "2025-08-22T04:00:00.000Z"
}

2. GET /brands
Ambil semua brand.
Response (200 OK):

[
  {
    "id": 1,
    "brand": "Nike",
    "type": "Sepatu Sport",
    "price": 1200000,
    "description": "Sepatu lari nyaman",
    "coverUrl": "https://example.com/nike.jpg",
    "createdAt": "2025-08-22T04:00:00.000Z",
    "updatedAt": "2025-08-22T04:00:00.000Z"
  }
]

3. Get Brand by ID
GET /brands/:id
Response (200 OK):

{
  "id": 1,
  "brand": "Nike",
  "type": "Sepatu Sport",
  "price": 1200000,
  "description": "Sepatu lari nyaman",
  "coverUrl": "https://example.com/nike.jpg",
  "createdAt": "2025-08-22T04:00:00.000Z",
  "updatedAt": "2025-08-22T04:00:00.000Z"
}

Response (404 Not Found):

{ "error": "Brand not found" }

4. Update Brand
PUT /brands/:id
Request Body:

{
  "brand": "Nike Air",
  "type": "Sepatu Lari",
  "price": 1300000,
  "description": "Sepatu lari nyaman & ringan",
  "coverUrl": "https://example.com/nike-air.jpg"
}

Response (200 OK):

{
  "id": 1,
  "brand": "Nike Air",
  "type": "Sepatu Lari",
  "price": 1300000,
  "description": "Sepatu lari nyaman & ringan",
  "coverUrl": "https://example.com/nike-air.jpg",
  "createdAt": "2025-08-22T04:00:00.000Z",
  "updatedAt": "2025-08-22T05:00:00.000Z"
}

Response (404 Not Found):

{ "error": "Brand not found" }

5. Delete Brand
DELETE /brands/:id
Response (200 OK):

{ "message": "Brand deleted" }

Response (404 Not Found):

{ "error": "Brand not found" }

User Authentication
6. Register
POST /register
Request Body:

{
  "email": "user@example.com",
  "password": "password123"
}

Response (201 Created):

{
  "id": 1,
  "email": "user@example.com",
  "role": "staff"
}

Error Responses:

{ "message": "Email sudah terdaftar" }
{ "message": "Email wajib diisi" }
{ "message": "Password wajib diisi" }

7. Login
POST /login
Request Body:

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):

{
  "access_token": "jwt_token_here",
  "email": "user@example.com",
  "role": "staff"
}

Error Responses:

{ "message": "Email dan Password wajib diisi" }
{ "message": "Email atau Password salah" }

8. Google Login
POST /google-login
Request Body:

{
  "tokenId": "google_id_token_here"
}

Response (200 OK):

{
  "access_token": "jwt_token_here",
  "email": "user@gmail.com",
  "role": "staff"
}

Error Response (500):

{ "message": "Login dengan Google gagal" }

Checkout / Payment (Midtrans)
9. Checkout
POST /checkout
Request Body:

{
  "items": [
    { "id": 1, "name": "Nike Air", "price": 1300000, "quantity": 2 }
  ],
  "totalPrice": 2600000,
  "customer": { "name": "John Doe", "email": "john@example.com" }
}

Response (200 OK):

{
  "token": "midtrans_transaction_token",
  "redirect_url": "https://app.sandbox.midtrans.com/snap/v2/vtweb/..."
}

Error Responses:

{ "message": "Keranjang kosong!" }
{ "message": "Checkout gagal", "error": "Error message here" }

AI Routes
Base URL: /ai
Lihat /routes/ai.js untuk daftar endpoint AI.

Error Handling
Semua internal server error dikembalikan sebagai:

{ "message": "Internal Server Error" }

# 🚗 CAR RENTAL PLATFORM

A backend REST API for a **Car Rental Platform** built with **Node.js, Express.js, and MySQL**.

The platform allows customers to register and authenticate, browse and search cars, check availability, create and manage bookings, save favorite cars, and submit reviews and ratings.

> **Current Scope:** Customer-side backend
> **Payment Integration:** Not included in the current version

---

## 📌 Features

### 🔐 Authentication & Customer Management

* Customer registration
* Customer login
* JWT-based authentication
* Protected routes
* Get logged-in customer profile
* Update customer profile
* Password hashing using bcrypt

### 🚘 Car Management

Customers can:

* View available cars
* Search cars
* Filter cars
* Sort cars
* Use pagination
* View detailed car information
* View car images
* View car ratings and review count

### 📅 Booking System

Customers can:

* Create a car booking
* Check car availability
* Prevent overlapping bookings
* View their bookings
* View a specific booking
* Filter bookings by status
* Cancel pending/confirmed bookings

Supported booking statuses:

```text
PENDING
CONFIRMED
CANCELLED
COMPLETED
```

The system prevents two active bookings from overlapping for the same car.

### ❤️ Favorites

Customers can:

* Add a car to favorites
* View their favorite cars
* Remove a car from favorites
* Prevent duplicate favorites

### ⭐ Reviews & Ratings

Customers can:

* Add a review after completing a booking
* Give a rating from 1 to 5
* View reviews for a car
* View average car rating
* View total review count

A customer can submit only one review per car.

---

## 🛠️ Technologies Used

| Technology | Purpose                   |
| ---------- | ------------------------- |
| Node.js    | Backend runtime           |
| Express.js | REST API framework        |
| MySQL      | Relational database       |
| mysql2     | MySQL database connection |
| JWT        | Authentication            |
| bcryptjs   | Password hashing          |
| dotenv     | Environment variables     |
| CORS       | Cross-origin requests     |

---

## 📂 Project Structure

```text
CAR_RENTAL_PLATFORM/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── src/
│   │   │
│   │   ├── controllers/
│   │   │   ├── userController.js
│   │   │   ├── carController.js
│   │   │   ├── bookingController.js
│   │   │   └── favoriteController.js
│   │   │
│   │   ├── models/
│   │   │   ├── userModel.js
│   │   │   ├── carModel.js
│   │   │   ├── bookingModel.js
│   │   │   ├── favoriteModel.js
│   │   │   └── reviewModel.js
│   │   │
│   │   ├── routes/
│   │   │   ├── userRoutes.js
│   │   │   ├── carRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── favoriteRoutes.js
│   │   │   └── reviewRoutes.js
│   │   │
│   │   └── middleware/
│   │       └── authMiddleware.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── README.md
```

> Folder names may vary slightly depending on the final project organization.

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Move into the project:

```bash
cd CAR_RENTAL_PLATFORM
```

Then:

```bash
cd backend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Create MySQL Database

Open MySQL Workbench or MySQL CLI and create the database:

```sql
CREATE DATABASE car_rental;
```

Then select it:

```sql
USE car_rental;
```

Create the required tables for:

```text
users
car_brands
cars
car_images
bookings
favorites
reviews
```

Make sure the foreign-key relationships between these tables are configured correctly.

---

# 🔐 Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=car_rental
DB_PORT=3306

JWT_SECRET=your_jwt_secret
```

### Important

Never upload your real `.env` file to GitHub.

Your `.gitignore` should contain:

```gitignore
node_modules/
.env
```

For other developers, provide:

```text
.env.example
```

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=
DB_PASSWORD=
DB_NAME=car_rental
DB_PORT=3306

JWT_SECRET=
```

---

# ▶️ Running the Project

Start the development server:

```bash
npm run dev
```

Or, if your project uses the normal Node command:

```bash
npm start
```

The server will run on:

```text
http://localhost:5000
```

You should see a message similar to:

```text
Server running on port 5000
```

---

# 🧪 API Endpoints

## 🔐 Authentication

### Register

```http
POST /api/users/register
```

Example:

```json
{
    "full_name": "Akash Mali",
    "email": "akash@example.com",
    "password": "password123",
    "phone_number": "9876543210"
}
```

### Login

```http
POST /api/users/login
```

Example:

```json
{
    "email": "akash@example.com",
    "password": "password123"
}
```

The login response returns a JWT token.

Use this token for protected endpoints:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 👤 Customer Profile

### Get Profile

```http
GET /api/users/me
```

Authentication required.

### Update Profile

```http
PUT /api/users/me
```

Example:

```json
{
    "full_name": "Akash Mali",
    "phone_number": "9876543210"
}
```

Authentication required.

---

# 🚘 Cars

### Get All Cars

```http
GET /api/cars
```

### Search Cars

Example:

```http
GET /api/cars?search=swift
```

### Filter Cars

Example:

```http
GET /api/cars?fuel_type=PETROL
```

### Sort Cars

Example:

```http
GET /api/cars?sort=price_asc
```

### Pagination

Example:

```http
GET /api/cars?page=1&limit=10
```

### Get Car Details

```http
GET /api/cars/:id
```

The car details response can include:

```text
Car information
Brand
Images
Average rating
Review count
```

---

# 📅 Bookings

### Create Booking

```http
POST /api/bookings
```

Example:

```json
{
    "carId": 5,
    "pickupDate": "2026-10-01T10:00:00",
    "returnDate": "2026-10-05T10:00:00"
}
```

The backend calculates:

```text
Total Days
×
Price Per Day
=
Total Amount
```

The customer does not provide the final amount manually.

Authentication required.

---

### Get My Bookings

```http
GET /api/bookings
```

Authentication required.

### Filter Bookings

```http
GET /api/bookings?status=PENDING
```

Available statuses:

```text
PENDING
CONFIRMED
CANCELLED
COMPLETED
```

Examples:

```http
GET /api/bookings?status=CONFIRMED
```

```http
GET /api/bookings?status=COMPLETED
```

```http
GET /api/bookings?status=CANCELLED
```

---

### Get Booking Details

```http
GET /api/bookings/:id
```

Authentication required.

Customers can only access their own bookings.

---

### Cancel Booking

```http
PATCH /api/bookings/:id/cancel
```

Authentication required.

A booking can be cancelled when its status is:

```text
PENDING
CONFIRMED
```

A:

```text
CANCELLED
COMPLETED
```

booking cannot be cancelled.

---

# ❤️ Favorites

### Add Favorite

```http
POST /api/favorites/:carId
```

Authentication required.

### Get Favorites

```http
GET /api/favorites
```

Authentication required.

### Remove Favorite

```http
DELETE /api/favorites/:carId
```

Authentication required.

The database prevents duplicate favorites for the same customer and car.

---

# ⭐ Reviews

### Add Review

```http
POST /api/reviews/:carId
```

Authentication required.

Example:

```json
{
    "rating": 5,
    "comment": "Excellent car and smooth rental experience."
}
```

A customer can review a car only after completing a booking for that car.

Rating must be:

```text
1 - 5
```

### Get Car Reviews

```http
GET /api/reviews/:carId
```

Returns:

```text
Customer Name
Rating
Comment
Review Date
```

---

# 🔒 Security

The application uses several security measures:

* JWT authentication for protected routes
* Password hashing with bcrypt
* User identification through JWT
* Customers can only access their own bookings
* Customers can only manage their own favorites
* Customers cannot submit reviews without completing a booking
* Duplicate favorites are prevented at database level
* Duplicate reviews are prevented at database level
* Booking date overlap is checked before creating a booking
* Booking amount is calculated by the backend
* Environment variables are used for sensitive configuration

---

# 📊 Booking Availability Logic

The platform prevents overlapping bookings for the same car.

The system checks whether an existing active booking overlaps the requested dates:

```text
existing pickup < requested return
AND
existing return > requested pickup
```

Only these booking statuses block availability:

```text
PENDING
CONFIRMED
```

Cancelled bookings do not block the car.

---

# 🧩 Example Customer Flow

```text
Register
   ↓
Login
   ↓
Receive JWT
   ↓
Browse Cars
   ↓
Search / Filter / Sort
   ↓
View Car Details
   ↓
Check Availability
   ↓
Create Booking
   ↓
View My Bookings
   ↓
View Booking Details
   ↓
Cancel Booking (if allowed)
   ↓
Complete Rental
   ↓
Submit Review & Rating
```

Favorites can be used at any point:

```text
Browse Cars
   ↓
❤️ Add Favorite
   ↓
View Favorites
   ↓
💔 Remove Favorite
```

---

# 🧪 Testing

The APIs can be tested using:

* Postman
* Thunder Client
* Insomnia
* Any REST API client

Recommended testing flow:

```text
1. Register customer
2. Login
3. Copy JWT token
4. Test /me
5. Browse cars
6. Search/filter cars
7. View car details
8. Add favorite
9. Get favorites
10. Remove favorite
11. Create booking
12. Get bookings
13. Get booking details
14. Cancel booking
15. Complete a booking
16. Add review
17. Get car reviews
```

---

# 🚧 Current Limitations

The current version focuses on the **customer-side backend**.

The following features are intentionally not included yet:

* Admin dashboard/backend
* Online payment integration
* Payment gateway
* Refund processing
* Email notifications
* SMS notifications
* Advanced admin analytics

These can be added in future versions.

---

# 🔮 Future Improvements

Possible future development includes:

* Admin authentication and authorization
* Admin car management
* Admin booking management
* Customer payment integration
* Online payment verification
* Automated booking confirmation
* Email notifications
* SMS notifications
* Advanced search
* Location-based car search
* Booking invoices
* Customer dashboard
* Admin analytics dashboard
* Automated booking status updates

---

# 🎯 Project Objective

The main objective of this project is to develop a reliable RESTful backend for a car rental platform where customers can easily discover vehicles, check availability, make bookings, manage their reservations, save favorite cars, and share their rental experiences through reviews.

The project demonstrates practical implementation of:

```text
REST APIs
Database Design
Authentication
Authorization
SQL Relationships
CRUD Operations
Business Logic
Data Validation
Booking Management
API Security
```

---

# 👨‍💻 Author

**Akash Mali**

MERN Stack Developer

Interested in building:

* Full-stack web applications
* REST APIs
* React applications
* Node.js backends
* Database-driven applications

---

# 📄 License

This project is created for **learning, portfolio, and educational purposes**.

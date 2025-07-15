# 🎓 StudySphere – Backend API

**StudySphere** is the backend REST API for a modern EdTech platform. It supports secure user authentication, course and lesson management, progress tracking, instructor dashboards, search functionality, and Razorpay-based payment integration. Built using Node.js, Express, and MongoDB, this backend powers a scalable online learning experience.

---

## 🚀 Features

- 🔐 **User Authentication**  
  JWT-based secure authentication with role-based access (Student / Instructor).

- 📚 **Courses and Lessons**  
  Instructors can create, edit, and manage courses. Students can enroll and access course content.

- 📈 **Progress Tracking**  
  Students can track their lesson completion, quiz scores, and overall progress.

- 💳 **Payment Integration**  
  Razorpay is integrated for secure course purchase and payment processing.

- 🔍 **Search Functionality**  
  Search through courses, lessons, and resources by keyword.

- 📊 **Instructor Dashboard**  
  Visual insights on earnings, student enrollments, and course performance.

---

## 🛠️ Tech Stack

| Layer     | Technology                 |
|-----------|----------------------------|
| Server    | Node.js, Express.js        |
| Database  | MongoDB (with Mongoose)    |
| Auth      | JWT, bcrypt                |
| Payments  | Razorpay API               |
| Cloud     | Cloudinary (for file upload) |
| Others    | dotenv, nodemailer (optional), cors, cookie-parser |

---

## 📁 Folder Structure
StudySphere-Server/
├── config/ # DB & Razorpay configuration
├── controllers/ # Business logic
├── models/ # Mongoose schemas
├── routes/ # API routes
├── middlewares/ # Auth, error handlers, etc.
├── utils/ # Utility functions
├── .env.example # Sample environment variables
├── index.js # App entry point
└── README.md


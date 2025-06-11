# 🎮 MovieQuest

**MovieQuest** is a full-stack web application that allows users to search, browse, and manage movie information and profiles. The frontend is built with **React (Vite)** and the backend uses **Express + MySQL**, implementing **JWT-based HTTP-only Cookie authentication** for secure access.

---

## 🔧 Technologies Used

### 🌟 Frontend

* **React + Vite**: Fast SPA development
* **Chart.js + ag-Grid**: Data visualization (charts and tables)
* **Axios**: HTTP requests with custom instances and credentials (`withCredentials: true`)
* **react-router-dom**: Routing and navigation
* **React Context**: Global management of authentication state

### 🛠️ Backend

* **Node.js + Express**: REST API server with modular routing
* **MySQL (mysql2)**: Fast relational DB connection
* **Knex.js**: Query builder with SQL injection protection and simplified DB operations
* **JWT + HTTP-only Cookie**: Secure access and refresh token management
* **Cookie Parser + CORS**: Handles cookie transmission and origin control
* **HTTPS**: Local secure environment via OpenSSL-generated certificates
* **dotenv**: Environment configuration using `.env` files
* **Swagger (OpenAPI)**: Auto-generated GUI API documentation
* **bcrypt**: Secure password hashing and authentication
* **jsonwebtoken**: Access/Refresh token handling
* **morgan**: HTTP logging for development/debugging

---

## 📁 Directory Structure

```
MovieQuest/
├── my-movie-app/                # Frontend
├── ServerSide_Application/      # Backend
├── .env                         # Environment variables (not committed)
```

### 🔙 Backend

```
ServerSide_Application/
├── app.js              # Express settings
├── server.js           # HTTPS launch script
├── knexfile.js         # DB configuration
├── routes/             # API routes
├── middleware/         # Authentication middleware
├── docs/openapi.json   # Swagger definition
├── public/             # Static files
├── views/              # Error pages
```

### 🎠 Frontend

```
my-movie-app/src/components/
├── api.jsx
├── AuthContext.jsx
├── Home.jsx
├── Login.jsx
├── MovieDetail.jsx
├── Movies.jsx
├── PersonDetail.jsx
├── Profile.jsx
├── Register.jsx
├── setInterceptors.jsx
```

---

## 🚀 Local Development Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/MovieQuest.git
cd MovieQuest
```

### 2️⃣ Create the `.env` File

This project requires a `.env` file. For security, it is not included in the repository. A sample `.env.example` file is provided. Copy it:

```bash
cp ServerSide_Application/.env.example ServerSide_Application/.env
```

Edit `.env` as follows:

```env
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_jwt_secret
SSL_KEY_PATH=./ServerSide_Application/localhost-key.pem
SSL_CERT_PATH=./ServerSide_Application/localhost.pem
```

> ⛔ Do not upload `.env` to GitHub. It contains sensitive credentials.

### 3️⃣ Generate HTTPS Certificates

Using OpenSSL:

```bash
openssl req -nodes -new -x509 -keyout localhost-key.pem -out localhost.pem
```

Place the generated files in the `ServerSide_Application/` folder.

### 4️⃣ Prepare the MySQL Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE moviequest;
USE moviequest;
SOURCE path/to/dump.sql;
```

### 5️⃣ Install Dependencies

From the project root:

```bash
npm install
```

Or separately:

```bash
cd my-movie-app && npm install
cd ../ServerSide_Application && npm install
```

### 6️⃣ Start the Application

```bash
npm run dev
```

Access URLs:

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend: [https://localhost:3000](https://localhost:3000)

---

## 📘 API Documentation (Swagger UI)

* [https://localhost:3000/docs](https://localhost:3000/docs)

---

## 🔐 Authentication Flow

1. Client sends POST to `/login`
2. Server issues JWT stored in httpOnly Cookie
3. Axios sends Cookie automatically (`withCredentials: true`)
4. If token is expired, Axios interceptor refreshes it automatically

---

## 📄 License

MIT License © 2025 \Akira Hasuo

---

## 🌟 Technical Highlights

### ✅ Secure Auth System (JWT + HTTP-only Cookie)

* Prevents XSS by storing tokens in httpOnly cookies
* Middleware-protected routes
* Token refresh via Axios interceptor

### 📊 Data Visualization

* Movie stats displayed via Chart.js
* ag-Grid offers paging, filtering, sorting
* Responsive on desktop/mobile

### 📁 Modular Architecture

* Fully separated frontend (React) and backend (Express)
* API/auth logic modularized in `api.jsx` and `setInterceptors.jsx`
* Backend logic structured with `routes/` and `middleware/`

### 📃 API Docs with Swagger

* OpenAPI JSON supports Swagger UI at `/docs`
* Useful for external collaboration and team development

### 🔒 HTTPS Enabled Local Dev

* OpenSSL-generated certificates provide local HTTPS

### 🔀 Advanced Token Handling

* Custom interceptor refreshes token at `/user/refresh`
* Queues concurrent requests until token is valid
* Global auth state managed by `AuthContext.jsx`

### 🛩️ UI/UX Considerations

* Auto-redirect to `/login` for unauthenticated users
* Dynamic navbar based on auth state
* 404 fallback with redirect

### 🔐 Enhanced JWT Security

* Access and refresh tokens stored separately as httpOnly Cookies
* Refresh reuse detection logic
* Middleware `verifyUser.js` restricts access to protected routes

---

## 🙌 Special Thanks

This project was developed as part of the [QUT CAB230](https://www.qut.edu.au/) coursework.

---

## 🌐 Language

This README is available in multiple languages:

* [🇯🇵 Japanese](README.ja.md)
* [🇬🇧 English (You are here)](README.md)

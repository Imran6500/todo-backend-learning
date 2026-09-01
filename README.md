# Todo API

A production-oriented RESTful Todo API built with **Node.js, Express.js, MongoDB, and Mongoose**.

This project was built to practice backend development fundamentals and industry-used concepts such as REST APIs, authentication, authorization, validation, pagination, security middleware, refresh tokens, API documentation, and automated testing.

## 🚀 Features

* RESTful CRUD APIs for Todos
* User registration and login
* Password hashing with bcrypt
* JWT-based authentication
* Access tokens and refresh tokens
* Refresh token revocation on logout
* User-specific Todo ownership and authorization
* Joi request validation
* Pagination
* Search Todos by title
* Filter Todos by completion status
* MongoDB indexes
* Centralized error handling
* Consistent API responses
* CORS configuration
* Helmet security headers
* API rate limiting
* Request body size limiting
* Environment-based configuration
* Health check endpoint
* Swagger/OpenAPI documentation
* Automated API testing with Jest and Supertest
* Graceful server shutdown

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Token (JWT)
* bcryptjs
* Helmet
* CORS
* express-rate-limit

### Validation

* Joi

### Testing

* Jest
* Supertest

### Documentation

* Swagger / OpenAPI
* swagger-jsdoc
* swagger-ui-express

### Logging

* Morgan

## 📁 Project Structure

```text
todo-api/
│
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── swagger.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── todoController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── notFoundMiddleware.js
│   │   └── validateMiddleware.js
│   │
│   ├── models/
│   │   ├── userModel.js
│   │   └── todoModel.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── todoRoutes.js
│   │
│   ├── utils/
│   │   └── response.js
│   │
│   ├── validations/
│   │   ├── todoValidation.js
│   │   └── userValidation.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── auth.test.js
│   └── setup.js
│
├── .env
├── .env.test
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd todo-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/todo_api

JWT_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
```

Use strong random secrets for `JWT_SECRET` and `JWT_REFRESH_SECRET` in real deployments.

### 4. Start the development server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:5000
```

## 🧪 Running Tests

The project uses a separate test environment.

Create `.env.test`:

```env
NODE_ENV=test
MONGO_URI=mongodb://127.0.0.1:27017/todo_api_test
```

Run the test suite:

```bash
npm test
```

Tests use a separate MongoDB database so development data is not used by the test suite.

## 📚 API Documentation

Swagger UI is available at:

```text
http://localhost:5000/api-docs
```

The Swagger documentation provides an interactive interface for exploring and testing the API.

## 🔐 Authentication Flow

The authentication system uses short-lived access tokens and longer-lived refresh tokens.

```text
Register
   ↓
Login
   ↓
Access Token + Refresh Token
   ↓
Access Token used for protected APIs
   ↓
Access Token expires
   ↓
Refresh Token
   ↓
New Access Token
```

Passwords are hashed using bcrypt before being stored.

Refresh tokens are also stored as hashes in the database so they can be revoked during logout.

## 🔑 Authentication Header

Protected endpoints require:

```http
Authorization: Bearer <access-token>
```

## 📌 API Endpoints

### Health

| Method | Endpoint  | Description                   |
| ------ | --------- | ----------------------------- |
| GET    | `/health` | Check API and database health |

### Authentication

| Method | Endpoint                | Description                      |
| ------ | ----------------------- | -------------------------------- |
| POST   | `/api/v1/auth/register` | Register a new user              |
| POST   | `/api/v1/auth/login`    | Login user                       |
| POST   | `/api/v1/auth/refresh`  | Generate a new access token      |
| POST   | `/api/v1/auth/logout`   | Revoke refresh token             |
| GET    | `/api/v1/auth/me`       | Get authenticated user's profile |

### Todos

| Method | Endpoint            | Description                    |
| ------ | ------------------- | ------------------------------ |
| GET    | `/api/v1/todos`     | Get authenticated user's Todos |
| POST   | `/api/v1/todos`     | Create a Todo                  |
| GET    | `/api/v1/todos/:id` | Get a Todo by ID               |
| PUT    | `/api/v1/todos/:id` | Replace/update a Todo          |
| PATCH  | `/api/v1/todos/:id` | Partially update a Todo        |
| DELETE | `/api/v1/todos/:id` | Delete a Todo                  |

## 🔎 Todo Query Parameters

The Todo listing endpoint supports filtering, searching, and pagination.

### Filter by completion

```text
GET /api/v1/todos?completed=true
```

```text
GET /api/v1/todos?completed=false
```

### Search by title

```text
GET /api/v1/todos?search=mongo
```

Search is case-insensitive.

### Pagination

```text
GET /api/v1/todos?page=1&limit=10
```

### Combine parameters

```text
GET /api/v1/todos?completed=true&search=node&page=1&limit=5
```

## 📦 Example Request

### Register

```http
POST /api/v1/auth/register
Content-Type: application/json
```

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json
```

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Example response:

```json
{
  "success": true,
  "message": "Login successfully",
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "pagination": null
}
```

### Create Todo

```http
POST /api/v1/todos
Authorization: Bearer <access-token>
Content-Type: application/json
```

```json
{
  "title": "Learn backend development",
  "completed": false
}
```

## 🔒 Authorization & Ownership

Every Todo belongs to the authenticated user.

The server obtains the user ID from the verified JWT and uses it when querying Todo documents.

This prevents users from accessing, modifying, or deleting another user's Todos even if they know the Todo ID.

## 🛡️ Security

The API includes several basic security measures:

* JWT authentication
* bcrypt password hashing
* Hidden sensitive User fields
* User ownership checks
* Helmet security headers
* CORS
* Rate limiting
* JSON request size limits
* Joi input validation
* Centralized error handling
* Environment variables for secrets
* Refresh token revocation

## 🧪 Testing

The project includes automated API tests using:

```text
Jest
Supertest
```

Example test coverage includes successful registration and validation failures.

Run:

```bash
npm test
```

## 📊 Response Format

Successful responses follow a consistent structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "pagination": null
}
```

Paginated responses include metadata:

```json
{
  "success": true,
  "message": "Todos fetched successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalTodos": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## 🩺 Health Check

The `/health` endpoint checks whether the application and MongoDB connection are available.

```text
GET /health
```

Example:

```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "server": "up",
    "database": "up"
  }
}
```

## 📜 Available Scripts

```bash
npm run dev
```

Starts the development server using Nodemon.

```bash
npm start
```

Starts the application in normal mode.

```bash
npm test
```

Runs the Jest test suite.

## 🔐 Environment & Git Security

Sensitive files should not be committed to Git.

The project ignores:

```text
node_modules/
.env
.env.test
```

Never commit production secrets, JWT secrets, database credentials, or API keys to a public repository.

## 🚧 Future Improvements

Possible future enhancements include:

* Refresh token rotation
* More comprehensive test coverage
* Advanced logging
* Redis caching
* Docker support
* CI/CD pipeline
* Cloud deployment
* Role-based access control
* Email verification
* Password reset functionality

## 👨‍💻 Author

**Imran**

Backend development project built as part of my transition into backend development with Node.js and Express.

## 📄 License

This project is available for educational and personal use.

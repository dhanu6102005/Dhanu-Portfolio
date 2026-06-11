# Portfolio Backend — Node.js + Express + MySQL

## Quick Start

### 1. Set your MySQL credentials in `.env`
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=portfolio_db
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup the database (run once)
```bash
npm run setup-db
```
This creates the `portfolio_db` database and `contacts` table automatically.

### 4. Start the server
```bash
npm run dev      # development (auto-restart with nodemon)
npm start        # production
```

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `http://localhost:5000/` | Health check |
| POST | `http://localhost:5000/api/contact` | Submit contact form |
| GET | `http://localhost:5000/api/contacts` | View all messages |
| GET | `http://localhost:5000/api/contacts/:id` | Get single message |

### POST /api/contact — Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello Dhanusri!"
}
```

### POST /api/contact — Success Response
```json
{
  "success": true,
  "message": "Message received! Thank you for reaching out.",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello Dhanusri!",
    "created_at": "2026-06-11T07:00:00.000Z"
  }
}
```

---

## MySQL Table Schema

```sql
CREATE TABLE contacts (
  id         INT           NOT NULL AUTO_INCREMENT,
  name       VARCHAR(150)  NOT NULL,
  email      VARCHAR(255)  NOT NULL,
  message    TEXT          NOT NULL,
  created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

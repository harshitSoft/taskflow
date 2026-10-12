const fs = require('fs');
const path = require('path');

const files = {
    "frontend/src/main.jsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`,
    "README.md": `# TaskFlow - Simple Task Management System

TaskFlow is a complete, beginner-friendly Task Management System built with Spring Boot and React.

## Technology Stack
- **Frontend**: React.js (Vite), React Router, Axios, Lucide React, Plain CSS
- **Backend**: Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA, JWT
- **Database**: PostgreSQL (Neon Serverless)
- **Deployment**: AWS EC2 (Backend), S3 + CloudFront (Frontend)

## Features
- **Roles**: Admin and User
- **Admin**: Dashboard stats, User Management (Create, Activate/Deactivate)
- **User**: Manage Tasks (Create, Complete, Delete)
- **Security**: JWT Authentication, BCrypt Password Hashing, Role-based Access Control

## Architecture
\`\`\`mermaid
graph TD
    Client[Browser / React SPA] -->|HTTPS REST| API[Spring Boot REST API on EC2]
    API -->|JDBC/SSL| DB[(Neon PostgreSQL)]
    Client -->|HTTPS| CF[AWS CloudFront]
    CF -->|Fetch Static Assets| S3[AWS S3 Bucket]
\`\`\`

## Prerequisites
- Java 17
- Node.js 20+
- Maven 3.9+
- PostgreSQL database (e.g., Neon.tech)

## Local Setup

### 1. Database (Neon)
1. Go to [Neon.tech](https://neon.tech) and create a free PostgreSQL database.
2. Get the connection string.

### 2. Backend Setup
1. Navigate to the \`backend\` directory: \`cd taskflow/backend\`
2. Copy the environment file: \`cp .env.example .env\`
3. Edit \`.env\` with your Neon database credentials and a secure JWT secret.
4. The system will automatically create the initial admin user using the \`BOOTSTRAP_ADMIN_*\` variables on the first run.
5. Run the backend: \`mvn spring-boot:run\` (or build the JAR and run it).

### 3. Frontend Setup
1. Navigate to the \`frontend\` directory: \`cd taskflow/frontend\`
2. Install dependencies: \`npm install\`
3. Copy the environment file: \`cp .env.example .env\`
4. Ensure \`VITE_API_BASE_URL\` points to your local backend (e.g., \`http://localhost:8080/api\`).
5. Run the frontend: \`npm run dev\`

## Admin Bootstrap
When the backend starts, it will create an initial admin account if one doesn't exist.
Default credentials (change these in your \`.env\` file):
- **Email**: \`admin@taskflow.local\`
- **Password**: \`Admin123!\`

## Deployment to AWS

### Backend (AWS EC2)
1. Launch an EC2 instance (Amazon Linux 2023 or Ubuntu).
2. Install Java 17: \`sudo yum install java-17-amazon-corretto -y\` or \`sudo apt install openjdk-17-jdk -y\`.
3. Build the backend JAR: \`mvn clean package -DskipTests\` in the \`backend\` folder.
4. Upload \`target/backend-0.0.1-SNAPSHOT.jar\` to your EC2 instance.
5. Create an \`application-prod.properties\` file on the server with your production database credentials and a strong JWT secret.
6. Run the application (or set up a \`systemd\` service):
   \`\`\`bash
   java -jar backend-0.0.1-SNAPSHOT.jar --spring.config.location=file:./application-prod.properties
   \`\`\`
7. Configure EC2 Security Groups to allow inbound traffic on your application port (e.g., 8080) from your load balancer, or port 80/443 if setting up a reverse proxy like Nginx.

### Frontend (AWS S3 + CloudFront)
1. Build the production React bundle: \`npm run build\` in the \`frontend\` folder.
2. Ensure \`VITE_API_BASE_URL\` was correctly set to your production API URL before building.
3. Create an S3 Bucket and enable static website hosting (or keep private and use CloudFront OAC).
4. Upload the contents of the \`frontend/dist\` directory to your S3 bucket.
5. Create a CloudFront Distribution pointing to your S3 bucket.
6. Set up a custom domain and SSL certificate via AWS Certificate Manager (ACM).
7. Configure CloudFront error pages to return \`/index.html\` for 404 errors (required for React Router SPA).

## API Documentation
- \`POST /api/auth/login\`: Login and get JWT token
- \`GET /api/auth/me\`: Get current user info
- \`GET /api/tasks\`: Get all tasks for current user
- \`POST /api/tasks\`: Create a new task
- \`PATCH /api/tasks/{id}/complete\`: Mark task as complete
- \`DELETE /api/tasks/{id}\`: Delete a task
- \`GET /api/admin/dashboard\`: Get admin statistics (Admin only)
- \`GET /api/admin/users\`: Get all users (Admin only)
- \`POST /api/admin/users\`: Create a new user (Admin only)
- \`PATCH /api/admin/users/{id}/status\`: Toggle user status (Admin only)

## Security Best Practices
- Never commit \`.env\` files or plain-text passwords.
- Use a strong, random string for \`JWT_SECRET\` in production (at least 256 bits).
- Ensure CloudFront serves your frontend over HTTPS.
- Set up an API Gateway or Nginx with an SSL certificate to serve your backend over HTTPS.
- Do not expose your Neon PostgreSQL database directly to the internet; Neon handles its own secure connections, just keep the credentials safe.
- Configure proper CORS settings in production, restricting allowed origins to your frontend domain.
`
};

for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(process.cwd(), filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log("Created: " + fullPath);
}

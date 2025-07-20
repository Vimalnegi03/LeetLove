# 💖LeetLove -:
### LeetLove is an open-source, full-stack coding interview preparation platform inspired by LeetCode. It features a modern UI, curated coding challenges, code evaluation, activity tracking, profile management, and admin tools—designed to help users boost coding skills and ace interviews.
# 🚀 Features -:

### Rich Problem Library: 
Filterable by tags/difficulty, continually growing.

### Live Monaco Editor: 
Experience fast, theme-able code writing and execution.

### Submission & Solution History: 
View submissions, verdicts, and stats.

### Streak Calendar: 
LeetCode/GitHub-style heatmap to visualize problem-solving habits.

### User Playlists: 
Organize favorite/public problems for a targeted practice.

### Avatar/Profile Management: 
Upload an image, update details, and view stats.

### Admin Portal: 
Add/edit problems, moderate the platform (role-based access).

### Authentication: 
Secure JWT/HTTP-only cookies, session management.

### Community and Discussions: 
(Planned) for learning and growth.

### Beautiful UI/UX: 
Pastel gradients, glassmorphism, responsive on mobile and desktop.

# 🌐 Live Demo
Visit LeetLove (https://leetlove-1.onrender.com/)

### AdminCredentials-:
```
email:Vicky@gmail.com
password:Vicky@1234
```
### UserCredentials-:
```
email:vimalnegi2003@gmail.com
password:123456789
```
# 🛠️ Tech Stack
```

| Layer         | Technologies                          |
|---------------|----------------------------------------|
| Frontend      | React, Tailwind CSS, DaisyUI, Monaco Editor |
| Backend       | Node.js, Express.js                    |
| Database      | Postgress + Prisma                     |
| File Upload   | Multer + Cloudinary                    |
| Authentication| JWT + bcrypt                           |
| State Mgmt    | zustand Toolkit                        |
| form schema   | React Hook Form, Zod                   |
| Icons         |Lucide                                  |
```
## 📦 Getting Started
### 1. Clone the repository
```
git clone https://github.com/Vimalnegi03/LeetLove.git
cd LeetLove

```
### 2. Install dependencies
 ```
npm install
cd frontend && npm install

```
### 3. Setup Environment Variables

Create .env files as shown:
```
DATABASE_URL=your_postgres_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

```
### 4. Apply Database Migrations
```
npx prisma migrate dev
npx prisma generate

```
### 5. Start the servers
```
# Backend
npm run dev
# Frontend
cd frontend
npm start

```
### 📁 Project Structure
```
LeetLove/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── fileUpload/
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── store/
│   │   ├── pages/
│   │   └── ...
├── prisma/
│   └── schema.prisma
├── README.md
└── .env

```
### 🌟 Screenshots -:
### 🗺️ Roadmap -:
 Discussion and Q&A forum for each problem

  Leaderboard and contest mode

 Enhanced notifications/alerts

 Multi-language test runners

 Social login (OAuth) integration
 ### 🙌 Contributing -:
Contributions and feature requests are welcomed! Please fork the repo, create a branch, and submit a pull request.
Bug reports and feedback are highly appreciated.

### 👤 Author
Built with ❤️ by Vimalnegi03
 

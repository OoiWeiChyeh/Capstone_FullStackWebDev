
# TaskMaster4U

A full-stack task management web app that helps users efficiently create, track, and manage tasks.  
Built with the **MERN stack** (MongoDB, Express, React, Node.js) and deployed using **Render (backend)** and **Netlify (frontend)**.

---

## 🚀 Live Demo

- 🌐 **Frontend (React + Netlify):** [https://taskmaster4u.netlify.app](https://taskmaster4u.netlify.app)  
- 🖥️ **Backend API (Render):** [https://taskmaster4u.onrender.com/api/tasks](https://taskmaster4u.onrender.com/api/tasks)

---

## 🧱 Tech Stack

| Layer | Technology | Description |
|--------|-------------|-------------|
| **Frontend** | React.js, Axios, Bootstrap/Tailwind | Interactive UI for task management |
| **Backend** | Node.js, Express.js | REST API for CRUD operations |
| **Database** | MongoDB (Atlas) | Cloud-hosted NoSQL database |
| **Deployment** | Render, Netlify | Cloud hosting for backend and frontend |
| **Authentication** | JWT | Secure user sessions |
| **Environment** | dotenv | Secure configuration management |

---

## 📂 Folder Structure

**Capstone_FullStackWebDev/**
- **backend/** – Express + Node backend  
  - `server.js` – Main backend entry point  
  - `routes/` – Express route handlers  
  - `models/` – Mongoose schemas  
  - `controllers/` – Business logic  
  - `.env.example` – Example environment variables  
- **frontend/** – React app  
  - **src/**
    - `components/` – UI Components (TaskList, TaskForm, Navbar)  
    - `pages/` – Page-level views (Dashboard, Login)  
    - `App.js` – App router  
    - `index.js` – Entry point  
  - **public/**
    - `index.html` – Main HTML file  
    - `favicon.ico` – Site icon  
    - `manifest.json` – PWA config  
- **README.md** – Project documentation

---

## ⚙️ Installation & Setup (Local Development)

### 🖥️ Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/OoiWeiChyeh/Capstone_FullStackWebDev.git
   cd Capstone_FullStackWebDev/backend
````
````
''''
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:

   ```bash
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. Start the backend:

   ```bash
   npm start
   ```

   Runs on [http://localhost:5000](http://localhost:5000)

---

### 🌐 Frontend Setup

1. Open another terminal:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:

   ```bash
   REACT_APP_API_URL=https://your-render-backend-url.onrender.com
   ```

4. Start the frontend:

   ```bash
   npm start
   ```

   Runs on [http://localhost:3000](http://localhost:3000)

---

## 🌍 Deployment

### 🚀 Backend on Render

1. Push backend code to GitHub.
2. Go to [Render](https://render.com).
3. Create a **New Web Service** → Connect your GitHub repo.
4. Configure build & start commands:

   ```
   Build Command: npm install
   Start Command: npm start
   ```
5. Add your `.env` variables (PORT, MONGODB_URI, JWT_SECRET).
6. Deploy and copy the Render URL.

---

### 🚀 Frontend on Netlify

1. Push the frontend folder to GitHub.
2. Go to [Netlify](https://netlify.com).
3. Create a **New Site** → Connect GitHub.
4. Configure:

   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/build
   ```
5. Add environment variable:

   ```
   REACT_APP_API_URL=https://your-render-backend-url.onrender.com
   ```
6. Deploy and open your live site.

---

## 🧰 Features

✅ User authentication (JWT login/register)
✅ Create, edit, and delete tasks
✅ Responsive React UI
✅ RESTful API endpoints
✅ MongoDB Atlas cloud storage
✅ Deployed full-stack solution (Netlify + Render)

---

## 🧑‍💻 API Endpoints (Example)

| Method   | Endpoint              | Description          |
| -------- | --------------------- | -------------------- |
| `POST`   | `/api/users/register` | Register new user    |
| `POST`   | `/api/users/login`    | Authenticate user    |
| `GET`    | `/api/tasks`          | Get all tasks        |
| `POST`   | `/api/tasks`          | Create new task      |
| `PUT`    | `/api/tasks/:id`      | Update existing task |
| `DELETE` | `/api/tasks/:id`      | Delete task          |

---

## 🪪 Environment Variables Reference

| Variable            | Description                          |
| ------------------- | ------------------------------------ |
| `PORT`              | Server port (default: 5000)          |
| `MONGODB_URI`       | MongoDB Atlas connection string      |
| `JWT_SECRET`        | JWT encryption key                   |
| `REACT_APP_API_URL` | Frontend API base URL (Netlify only) |

---

## 👤 Author

**Wayden Ooi Wei Chyeh**
📧 Email: [real.wayden98@gmail.com](mailto:real.wayden98@gmail.com)
🌐 GitHub: [OoiWeiChyeh](https://github.com/OoiWeiChyeh)

---

## 🏁 License

This project is licensed under the **MIT License** — you are free to use and modify it with attribution.

---

## 🧭 Acknowledgements

* [React Documentation](https://react.dev)
* [MongoDB Atlas](https://www.mongodb.com/atlas)
* [Render](https://render.com)
* [Netlify](https://www.netlify.com)

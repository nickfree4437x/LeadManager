# 📁 CSV Upload and Agent Distribution System

This is a simple web application that allows admins to upload CSV/XLS/XLSX files and automatically distribute the entries evenly among 5 agents. Built using:

- ✅ **React** (frontend)
- ✅ **Node.js + Express** (backend)
- ✅ **MongoDB** (database)
- ✅ **Multer + XLSX + csv-parser** (file parsing)

---

## 🚀 Features

- Upload `.csv`, `.xls`, or `.xlsx` files
- Validate `FirstName`, `Phone`, `Notes` columns
- Distribute items equally among 5 agents
- Display agent-wise assigned entries
- Handle leftover entries smartly
- Prevents empty rows from being saved

---

## 🧪 Installation

### Backend

```bash
cd backend
npm install
npm start
Frontend
bash
Copy
Edit
cd frontend
npm install
npm start
🔐 Environment Variables (.env)
env
Copy
Edit
PORT=5000
MONGO_URI=mongodb://localhost:27017/yourdbname
📂 Folder Structure
cpp
Copy
Edit
csv-agent-distributor/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── .gitignore
├── frontend/
│   ├── src/
│   └── public/
└── README.md
✨ Future Improvements
Agent login and dashboard

Export distributed data

Real-time notifications

🧑‍💻 Author
Made by Vishal Saini
Copy
Edit

---

#### ✅ 4. Push `README.md` to GitHub

```bash
git add README.md
git commit -m "Added README file"
git push

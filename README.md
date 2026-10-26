# 🍲 FoodShare

**Share Food, Spread Kindness, Reduce Waste.**

FoodShare is a web-based food donation platform designed to help reduce food waste by connecting people who have surplus food with people who need it. The project aims to encourage food sharing, support communities, and make food donation more accessible through a simple and user-friendly interface.

## 🌟 Features

- **User Authentication:** Login and signup interface for users.
- **Food Donation:** Add food donation details to share surplus food.
- **Available Food:** Browse available food donations.
- **Donation Management:** View and manage donation details.
- **Edit Donations:** Update existing donation information.
- **Dashboard:** Access relevant information through a centralized interface.
- **Responsive Interface:** Designed to provide a user-friendly experience across screen sizes.

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

## 📁 Project Structure

```text
FoodShare/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── models/
│   │   ├── Donation.js
│   │   └── User.js
│   ├── uploads/
│   ├── package.json
│   └── server.js
│
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have installed:
- Node.js and npm
- MongoDB Community Server, or access to a MongoDB database

### 1. Clone the Repository

```bash
git clone https://github.com/NirvanaCode1002/FoodShare.git
cd FoodShare
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Configure your environment variables in a local `.env` file according to the configuration expected by the backend.

Start the backend server:

```bash
node server.js
```

### 3. Set Up the Frontend

Open a new terminal from the project root:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## 🔐 Environment Variables

Store sensitive configuration, such as database connection details, in the backend's local `.env` file.

**Important:** Never commit `.env` files, database passwords, API keys, or other secrets to GitHub.

## 🌱 Branches

This repository uses separate branches for frontend and backend development:

- **`client`** — Frontend application.
- **`server`** — Backend application and database integration.

## 🤝 Contributing

Contributions are welcome!

1. Clone the repository.
2. Switch to the relevant branch.
3. Create and test your changes.
4. Commit your changes and push them to your branch.
5. Collaborate with the project team to review and integrate changes.

For contributors with repository access, coordinate with the team before making changes to shared branches.

## 🎯 Project Objective

FoodShare aims to encourage responsible food consumption, reduce avoidable food waste, and make surplus food sharing easier through a technology-driven platform.

## 👩‍💻 Project

**FoodShare — Share Food, Spread Kindness, Reduce Waste.**

GitHub Repository: https://github.com/NirvanaCode1002/FoodShare

---

*Built with the goal of making food sharing easier and communities stronger.*

# 🎓 Bayit-digital - Spiritual Learning Platform

Welcome to the platform where technology meets personal growth! This project is a robust Single Page Application (SPA) designed to offer theology and spirituality courses with a fluid and modern user experience.

## 🚀 Deployment
The application is currently deployed and fully functional at:
https://bayit-frontend.vercel.app

---

## 🛠️ Technologies Used

### Frontend
* **React.js**: Main library for the user interface.
* **Tailwind CSS**: Modern and responsive styling.
* **Axios**: Synchronized backend communication using custom instances.
* **Context API**: Global state management for Authentication and Shopping Cart.

### Backend
* **Node.js & Express**: The engine processing requests and managing routes.
* **MongoDB & Mongoose**: NoSQL database for course and user storage.
* **Cloudinary**: Optimized management for images (thumbnails) and multimedia content.

---

## 🔧 Recent Technical Solutions (Development Log)

During the final stabilization phase, the following critical improvements were implemented:

1. **Carousel Synchronization**: Rebuilt the home page loading logic to ensure courses are fetched dynamically from the backend, including smart filtering for courses already purchased by the user.
2. **Server Stability**: Debugged user routes (`userRoutes.js`), removing references to undefined functions that were causing crashes in the production environment.
3. **Navigation Optimization**: Fixed export errors in key modules like `MyLearning.jsx`, ensuring seamless navigation between lessons.

---

## 🛠️ Future Improvements (Roadmap)
* Enable and connect the **Settings** section with the backend.
* Streamline the course upload interface by removing the "Adjust Time" button.

---

## 📦 Local Installation and Usage

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/DiegoAvila-yeyo/bayit-digital-.git](https://github.com/DiegoAvila-yeyo/bayit-digital-.git)

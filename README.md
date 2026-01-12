# StayTrack 🧭🥗🏃‍♀️  
**Habit & Wellness Tracker**

**Project:** StayTrack — Habit tracking (food, exercise, hydration, etc.)  
**Student:** Manuel García Ruiz  
**Email:** [manuelgruiz22@gmail.com](mailto:manuelgruiz22@gmail.com)  
**Course:** Cloud Computing: Fundamentals and Infrastructures — 2025/26 (COMMON)  
**Milestone:** Milestone 5  

---

## 🧩 Overview

**StayTrack** is a cloud-oriented application designed to **track and visualize healthy habits** such as meals, workouts, hydration, and other customizable activities.  
The goal of this project is to build a robust microservices architecture and deploy it to a PaaS provider with full observability.

## 🚀 Deployment & Documentation

- **Deployed App URL:** [https://staytrack-frontend-m4hf.onrender.com](https://staytrack-frontend-m4hf.onrender.com)
- **Milestone 5 (Deployment):** [docs/hitos/hito5.md](./docs/hitos/hito5.md)

---

## 🎯 MVP Goals

- 🥗 **Meals** — log meals, notes, and (optional) calories/macros.  
- 💧 **Water** — track daily intake in glasses/ml.  
- 🏃‍♀️ **Exercise** — record activity type, duration, and effort.  
- 📅 **Custom habits** — define name, frequency, and value.  
- 📊 **History & metrics** — view summaries by day, week, or month.  
- 🔐 **Authentication** *(future)* — user accounts and privacy.  

---

## 🛠️ Tech Stack

- **Backend:** FastAPI (Python 3.12), automatic OpenAPI/Swagger  
- **Database:** PostgreSQL (SQLAlchemy 2 + Alembic for migrations)  
- **Schemas/Validation:** Pydantic v2 / pydantic-settings  
- **Frontend:** React + Vite (TypeScript)
- **Containers:** Docker & docker-compose (API + DB services)
- **Testing:** Pytest (API), React Testing Library
- **Lint/Format:** Ruff, Black, mypy
- **CI/CD:** GitHub Actions  

> For **Milestone 5**, the application is fully deployed on Render with automated CI/CD and monitoring.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

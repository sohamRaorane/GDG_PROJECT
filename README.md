<p align="center">
  <img src="https://img.icons8.com/color/96/spa-flower.png" alt="AyurSutra Logo" width="80"/>
</p>

<h1 align="center">AyurSutra</h1>

<p align="center">
  <strong>Modern Ayurvedic Healthcare Booking Platform</strong>
</p>

<p align="center">
  <em>Ancient Wisdom, Modern Care — Seamlessly Connecting Patients with Holistic Wellness</em>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#documentation">Documentation</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Firebase-12.x-FFCA28?style=flat-square&logo=firebase" alt="Firebase"/>
  <img src="https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Vite-Latest-646CFF?style=flat-square&logo=vite" alt="Vite"/>
</p>

---

## 🌿 Overview

**AyurSutra** is a comprehensive, production-ready SaaS platform designed for Ayurvedic wellness clinics. It provides an end-to-end solution for managing patient bookings, therapy sessions, doctor schedules, and clinic operations — all wrapped in a beautiful, modern interface.

The platform serves three distinct user types:
- **Patients** — Book appointments, track health progress, and connect with practitioners
- **Doctors/Vaidyas** — Manage schedules, view patient records, and monitor active therapies
- **Administrators** — Oversee clinic operations, manage users, and analyze performance metrics

---

## ✨ Features

### 🏥 Patient Portal

| Feature | Description |
|---------|-------------|
| **Smart Booking Wizard** | Multi-step appointment booking with location selection, service browsing, doctor matching, time slot scheduling, intake form submission, and integrated payment |
| **Clinic Locator** | Interactive map-based clinic discovery using Leaflet with real-time availability |
| **Doctor Profiles** | Browse practitioners by specialization, view ratings, experience, and availability |
| **Health Progress Tracking** | Visual dashboards with charts to monitor wellness journey and therapy outcomes |
| **Community Hub** | Connect with other patients, join support groups, and share wellness experiences |
| **Prescription Access** | View and download prescriptions issued by practitioners |
| **Personalized Guidelines** | Access treatment guidelines and self-care recommendations |
| **Secure Authentication** | Email/password auth with verification and password recovery |

### 👨‍⚕️ Doctor Dashboard

| Feature | Description |
|---------|-------------|
| **Real-Time Appointments** | Live calendar view of scheduled sessions with patient details |
| **Active Therapy Management** | Monitor and update ongoing treatment plans |
| **Patient Vitals Tracking** | View health metrics with interactive charts (Recharts) |
| **SOS Alerts** | Receive and respond to urgent patient notifications |
| **Incoming Sessions** | Quick overview of upcoming appointments |
| **Status Management** | Toggle availability and manage on-call status |

### ⚙️ Admin Control Center

| Feature | Description |
|---------|-------------|
| **Analytics Dashboard** | Key metrics, trends, and revenue visualization |
| **User Management** | CRUD operations for patients, doctors, and staff with role assignments |
| **Appointment Oversight** | Full appointment lifecycle management |
| **Therapy Control** | Configure and monitor therapy offerings |
| **Community Moderation** | Manage channels, posts, and member activity |
| **Comprehensive Reports** | Generate insights on clinic performance |
| **Settings Module** | Configure booking rules, notifications, and clinic preferences |

### 🔒 Security & Access Control

- **Role-Based Access Control (RBAC)** — Granular permissions for patients, doctors, and admins
- **Firebase Security Rules** — Server-side enforcement of data access policies
- **Protected Routes** — Client-side route guards for authenticated areas
- **Session Management** — Secure token-based authentication

---

## 🛠 Tech Stack

### Frontend
```
React 19        → Modern UI with concurrent features
TypeScript      → Type-safe development
Vite            → Lightning-fast builds with HMR
Tailwind CSS 4  → Utility-first styling
Framer Motion   → Smooth animations and transitions
React Router 7  → Client-side routing with protected routes
Recharts        → Data visualization for analytics
Lucide React    → Beautiful, consistent iconography
```

### Backend & Infrastructure
```
Firebase Auth           → Authentication & user management
Cloud Firestore         → Real-time NoSQL database
Firebase Hosting        → Production deployment
Firebase Functions      → Serverless backend logic (optional)
```

### Additional Libraries
```
react-big-calendar      → Full-featured calendar component (Admin)
react-leaflet           → Interactive maps for clinic locator
date-fns                → Modern date manipulation
clsx + tailwind-merge   → Conditional class management
@google/generative-ai   → AI integration capabilities
emailjs                 → Client-side email functionality
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Firebase Project** with Firestore and Authentication enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/ayursutra.git
   cd ayursutra/GDG_PROJECT
   ```

2. **Install dependencies for both portals**
   ```bash
   # Patient Portal
   cd frontend/Patient
   npm install

   # Admin Portal
   cd ../Admin
   npm install
   ```

3. **Configure Firebase**
   
   Create `.env` files in both `frontend/Patient` and `frontend/Admin`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Deploy Firestore Security Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1: Patient Portal (default: localhost:5173)
   cd frontend/Patient
   npm run dev

   # Terminal 2: Admin Portal (default: localhost:5174)
   cd frontend/Admin
   npm run dev
   ```

---

## 🏗 Architecture

```
GDG_PROJECT/
├── frontend/
│   ├── Patient/                 # Patient-facing application
│   │   ├── src/
│   │   │   ├── components/      # Reusable UI components
│   │   │   ├── pages/           # Route-based page components
│   │   │   │   ├── Booking/     # Multi-step booking wizard
│   │   │   │   ├── ClinicLocator/
│   │   │   │   ├── Community/
│   │   │   │   ├── Doctors/
│   │   │   │   ├── Progress/
│   │   │   │   └── ...
│   │   │   ├── utils/           # Helpers and constants
│   │   │   └── firebase.ts      # Firebase configuration
│   │   └── ...
│   │
│   └── Admin/                   # Admin/Doctor portal
│       ├── src/
│       │   ├── components/      # Admin-specific components
│       │   ├── pages/
│       │   │   ├── DashboardHome.tsx
│       │   │   ├── Appointments.tsx
│       │   │   ├── DoctorDashboard.tsx
│       │   │   ├── UserManagement.tsx
│       │   │   ├── Reports.tsx
│       │   │   └── ...
│       │   └── firebase.ts
│       └── ...
│
├── functions/                   # Firebase Cloud Functions
├── firestore.rules              # Security rules
└── firebase.json                # Firebase configuration
```

---

## 📖 Documentation

### User Roles

| Role | Access Level |
|------|--------------|
| `patient` | Book appointments, view own records, access community |
| `doctor` | Manage own appointments, view assigned patients, update therapies |
| `admin` | Full platform access, user management, system configuration |

### Firestore Collections

| Collection | Purpose |
|------------|---------|
| `users` | User profiles with role assignments |
| `appointments` | Booking records with status tracking |
| `services` | Available treatments and therapies |
| `community_channels` | Discussion forums and support groups |
| `community_posts` | User-generated community content |
| `community_members` | Channel membership records |

---

## 🎨 Design Philosophy

AyurSutra embraces the essence of Ayurvedic principles in its design:

- **🍃 Earthy Tones** — Calming greens and warm accents reflecting nature
- **✨ Modern Minimalism** — Clean interfaces with purposeful whitespace
- **🌊 Smooth Transitions** — Framer Motion animations for delightful interactions
- **📱 Mobile-First** — Responsive design optimized for all devices
- **♿ Accessibility** — WCAG-compliant components and semantic HTML

---

## 📜 License

This project is proprietary software developed for AyurSutra.

---

<p align="center">
  <strong>Built with 💚 for holistic wellness</strong>
</p>

<p align="center">
  <sub>© 2026 AyurSutra. All rights reserved.</sub>
</p>

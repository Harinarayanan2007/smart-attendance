# System Requirements

## Project Overview

The Smart Attendance System is a BLE-based attendance management solution designed for educational institutions. The system enables staff to conduct attendance using Bluetooth Low Energy (BLE), while students mark attendance securely using a mobile application.

The project consists of:

- Mobile Application (React Native)
- Admin Portal (React + Vite)
- Backend API (Hono)
- PostgreSQL Database
- BLE Communication Layer

---

# User Roles

## Admin

Responsibilities:

- Manage departments
- Manage courses
- Manage classes
- Manage subjects
- Manage students
- Manage staff
- Generate reports
- Manage notifications
- View analytics

---

## Staff

Responsibilities:

- Login
- View assigned classes
- Start attendance sessions
- End attendance sessions
- Manual attendance
- View attendance reports

---

## Student

Responsibilities:

- Login
- Scan BLE
- Mark attendance
- View attendance history
- View attendance percentage
- Receive notifications

---

# Functional Requirements

## Authentication

- JWT Authentication
- Refresh Tokens
- Role-Based Access Control

## Attendance

- BLE-based attendance
- Manual attendance
- Attendance correction
- Attendance reports

## Notifications

- Announcements
- Attendance alerts

## Reports

- Student reports
- Staff reports
- Department reports
- Attendance analytics

---

# Non-Functional Requirements

- PostgreSQL Database
- Drizzle ORM
- TypeScript
- REST API
- Docker
- Kubernetes
- High Performance
- Scalable Architecture
- Production Ready

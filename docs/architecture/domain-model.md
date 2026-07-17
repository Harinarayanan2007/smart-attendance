# Domain Model

## Identity

- User
- Role
- Refresh Token
- Login History

---

## Academic

- Department
- Course
- Academic Year
- Semester
- Class
- Subject
- Staff Subject Assignment

---

## User Profiles

- Student
- Staff

---

## Attendance

- Attendance Session
- Attendance Record

---

## Notifications

- Notification
- Notification Receiver

---

## Administration

- Audit Log
- System Setting

---

# Relationships

```
User
├── Student
├── Staff
└── Admin

Department
    │
Course
    │
Academic Year
    │
Semester
    │
Class
    │
Student

Staff
    │
Staff Subject Assignment
    │
Subject

Attendance Session
    │
Attendance Record
```

---

# Design Principles

- Single User Authentication
- Normalized Database
- UUID Public Identifiers
- Internal Numeric Primary Keys
- Soft Deletes
- Audit Logging
- Role-Based Authorization

# Database Schema Design

## Identity

- roles
- users
- refresh_tokens
- login_history

---

## Academic

- departments
- courses
- academic_years
- semesters
- classes
- subjects
- staff_subjects

---

## User Profiles

- students
- staff

---

## Attendance

- attendance_sessions
- attendance_records

---

## Notifications

- notifications
- notification_receivers

---

## Administration

- audit_logs
- system_settings

---

# Database Design Principles

- Third Normal Form (3NF)
- UUID Public IDs
- BIGSERIAL Primary Keys
- Foreign Key Constraints
- Soft Delete Strategy
- Audit Columns
- Proper Indexing

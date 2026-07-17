# Database Index Strategy

## Primary Keys

Every table uses:

- BIGSERIAL Primary Key

---

## Unique Indexes

- users.email
- students.register_number
- staff.employee_id
- roles.name

---

## Foreign Key Indexes

- users.role_id
- students.user_id
- staff.user_id
- attendance_records.student_id
- attendance_sessions.staff_id

---

## Composite Indexes

Attendance:

(student_id, attendance_session_id)

Staff Assignment:

(staff_id, subject_id, class_id)

---

## UUID Indexes

Every table exposes:

public_id

This will be indexed uniquely.

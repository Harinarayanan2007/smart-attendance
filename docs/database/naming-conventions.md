# Naming Conventions

## Tables

Plural

Example:

- users
- students
- attendance_sessions

---

## Columns

Snake Case

Examples:

- created_at
- updated_at
- deleted_at

---

## Foreign Keys

<entity>_id

Examples:

- user_id
- class_id
- department_id

---

## Primary Keys

id

---

## Public Identifier

public_id

UUID

---

## Audit Columns

- created_at
- updated_at
- deleted_at

---

## Boolean Fields

Use positive names.

Examples:

- is_active
- is_verified

---

## Enum Names

Snake Case

Examples:

- account_status
- attendance_status

---

## Index Names

idx_<table>_<column>

Example:

idx_users_email

---

## Foreign Key Names

fk_<table>_<reference>

Example:

fk_students_users

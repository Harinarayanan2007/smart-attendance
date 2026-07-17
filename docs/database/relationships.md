# Database Relationships

## Identity

```
roles
    │ 1
    │
    ▼
users
```

```
users
    │1
    ▼
students
```

```
users
    │1
    ▼
staff
```

```
users
    │1
    ▼
refresh_tokens
```

```
users
    │1
    ▼
login_history
```

---

## Academic

```
departments
    │
courses
    │
academic_years
    │
semesters
    │
classes
```

```
subjects
        ▲
        │
staff_subjects
        │
staff
```

---

## Attendance

```
attendance_sessions
        │
attendance_records
        │
students
```

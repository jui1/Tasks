## Final task requirements

Project: Task Manager Application



Tech stack:

- Frontend: React
- Backend: Node.js + Express
- Database: Supabase PostgreSQL
- Deployment: Netlify (frontend) + Render (backend)

### Functional requirements

1. Create: User naya task add kar sake.
2. Read: User saare saved tasks dekh sake.
3. Update: User task ka title ya status change kar sake.
4. Delete: User task delete kar sake.
5. Persistence: Page refresh hone par tasks database se dobara load hon.
6. Validation: Empty title aur invalid status reject hon.
7. Error handling: API ya database fail hone par meaningful error message mile.

### API endpoints

| Method | Endpoint         | Expected result                                    |
| ------ | ---------------- | -------------------------------------------------- |
| GET    | `/api/tasks`     | `200 OK` — tasks ki list                           |
| POST   | `/api/tasks`     | `201 Created` — naya task                          |
| PUT    | `/api/tasks/:id` | `200 OK` — updated task                            |
| DELETE | `/api/tasks/:id` | `200 OK` or `204 No Content` — successful deletion |

### Database

Supabase mein `tasks` table banao, jisme `id`, `title`, `status` aur `created_at` columns hon.

Ek extra cheez: Invalid task ID ke liye `400 Bad Request`, nonexistent task ke liye `404 Not Found`, aur unexpected server/database errors ke liye `500 Internal Server Error` jaise appropriate responses bhi test karna.

Bas, is scope ko complete karna tumhari practice ke liye enough hai. Authentication, complex dashboards ya extra features abhi add karne ki zaroorat nahi hai.

Interview tip: Pehle khud implementation karo aur AI ko code generate karne ke bajaye debugging, code review aur explanations ke liye use karo. Interview mein tumhe apne decisions aur code explain karne aane chahiye.


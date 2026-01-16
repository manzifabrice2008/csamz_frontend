# Online Exam Management System – English Script

This script explains how the MCQ & True/False online exam flow works across the MySQL database, Express backend, and React frontend that now ship with this project.

---

## 1. Database Overview (MySQL)

| Table | Purpose | Key Columns |
| --- | --- | --- |
| `students` | Stores learners that can log in and take exams. | `id`, `username`, `password`, `full_name`, `email`, `trade`, `status` |
| `exams` | Defines each published exam. | `id`, `title`, `description`, `total_marks`, `teacher_id`, timestamps |
| `questions` | Holds MCQ and True/False questions per exam. | `id`, `exam_id`, `question_text`, `type`, `options` (JSON for MCQ), `correct_answer`, `marks` |
| `student_answers` | Keeps every submitted answer. One row per student/question. | `student_id`, `question_id`, `answer`, `is_correct`, timestamps |
| `results` | Aggregated score for each student/exam attempt. | `student_id`, `exam_id`, `score`, `submitted_at` |

Notes:

- `type` controls rendering and grading (`MCQ` vs `TF`).
- MCQ `options` are JSON arrays such as `["A","B","C","D"]`. True/False questions do not need extra options.
- Foreign-key constraints cascade deletes so orphan data is avoided.

---

## 2. Backend – Express API

Routes live under `/api` and use JWT protection via `backend/middleware/auth.js`.

### Public / Student-Facing

| Method & Route | Description |
| --- | --- |
| `GET /api/exams` | Lists published exams with title, description, total marks, and question counts. |
| `GET /api/exams/:id/questions` | Returns all questions for an exam (without correct answers) so the frontend can render MCQ or TF inputs. |
| `POST /api/exams/:id/submit` | Student submits answers. The backend compares answers with `correct_answer`, awards marks automatically, stores each response in `student_answers`, and upserts the final score in `results`. Response payload includes `score`, `total_marks`, and a per-question feedback array. Requires a student JWT. |
| `GET /api/results/:studentId/:examId` | Returns the stored score plus question-level feedback so students can revisit results any time. Students can only view their own records; staff tokens can view any result. |

### Teacher/Admin Management

| Method & Route | Description |
| --- | --- |
| `POST /api/exams` | Create a new exam (title, description, total marks). Requires admin/teacher token. |
| `POST /api/exams/:id/questions` | Add MCQ or True/False questions with marks + correct answers. |
| `PUT /api/exams/questions/:questionId` | Update question text, type, options, or marks. |
| `DELETE /api/exams/questions/:questionId` | Remove a question. |
| `GET /api/exams/:id/results` | Staff view of all student scores for the same exam. |

Grading logic in `backend/routes/exams.js`:

```exam-grading
let score = 0;
for each question:
  compare student answer (case-insensitive) to `correct_answer`
  add `marks` for every correct response
  record the answer + correctness in `student_answers`
Upsert final score into `results` with timestamp.
```

---

## 3. Frontend – React (Vite + TypeScript)

### Student Experience

1. **Dashboard CTA** – Students sign in and click **“Take online exam”**, which links to `/student/exams`.
2. **Exam List Page** (`StudentExams.tsx`) – Fetches `GET /api/exams`, shows description, question count, and total marks. “Start Exam” opens `/student/exams/:examId`.
3. **Exam Page** (`StudentExamTake.tsx`) – Loads questions via `GET /api/exams/:id/questions`.  
   - MCQ: renders radio buttons for each JSON option.  
   - True/False: renders `True` / `False` radios.  
   - Submit sends `POST /api/exams/:id/submit` with `{ answers: [{ questionId, answer }] }`.
4. **Result Page** (`StudentExamResult.tsx`) – Immediately fetches `GET /api/results/:studentId/:examId`, shows score, percentage, submission time, and detailed feedback for every question. Students can retry or go back to the exam catalog.

All student exam calls automatically attach the student JWT using the `studentApiRequest` helper in `src/services/api.ts`.

### Teacher/Admin Workflow

Teachers (or admins) authenticate via the existing admin auth and manage exams through the protected endpoints. A future React admin UI can call the same endpoints to create exams and questions.

---

## 4. End-to-End Workflow

1. **Teacher** creates an exam and uploads MCQ/TF questions.
2. **Student** logs in, opens the exam list, and starts a desired exam.
3. **React Exam Page** renders questions depending on `type`:  
   - MCQ → map over `options` for radio buttons.  
   - True/False → fixed True/False radios.
4. **Submission** posts answers; Express auto-grades using `correct_answer` and `marks`.
5. **Result Storage** – Every answer goes to `student_answers`; the total score goes to `results`.
6. **Immediate Feedback** – Student is redirected to the result page that shows their score and per-question feedback.

Optional enhancements: timers, randomizing questions per student, attempts history, or email/SMS notifications using the existing messaging services.

---

## 5. Key Files

- Database migration: `backend/migrations/2025-11-17-004-create-online-exams.sql`
- API routes: `backend/routes/exams.js`, `backend/routes/results.js`, registered in `backend/server.js`
- Frontend pages: `src/pages/StudentExams.tsx`, `src/pages/StudentExamTake.tsx`, `src/pages/StudentExamResult.tsx`
- Shared API helpers & types: `src/services/api.ts`

This script can be shared directly during demos or documentation reviews to explain how the online exam system operates end-to-end.


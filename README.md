# 📄 Resume Analyzer

A web-based platform for **resume submission, review, and scoring**, built using **Next.js 15**, **TypeScript**, and **Supabase**.  
It allows users to upload resumes, track their review status, and view feedback.  
Admins can log in to manage submissions, update statuses, and assign scores.

---

## 🚀 Features

### Candidate Dashboard:
- Secure sign-in using passwordless Magic Links  
- Drag-and-drop resume uploader with PDF preview and client-side validation (file type, size)
- View a list of all submitted resumes with their current status (Pending, Approved, Needs Revision, Rejected)
- Ability to manage their user profile and username
- Get automatic email notifications when your resume’s status changes (e.g., Approved, Needs Revision, or Rejected)

### Admin Panel:
- Protected route accessible only to users with admin privileges
- View a queue of all Pending resumes from all candidates
- Select a resume to view it in a new tab via a secure, time-limited URL
- Update a resume's status, assign a score (0-100), and write feedback notes for the candidate

### Backend Functionality
- Resume metadata storage in Supabase
- Secure file uploads and linking via Supabase Storage
- Automated email notifications via Resend on resume status updation

## 🗂️ Project Structure
  ```
  resume-analyzer/
   ├── app/
   │ ├── auth/           # route intermediate for login and signup
   │ ├── dashboard/      # Candidate dashboard protected by AuthGuard
   │ ├── admin/          # Admin panel protected by AdminAuthGuard
   │ └── api/            # Next.js API routes (e.g., for email updation)
   ├── components/       # Reusable React components (Icons, AuthGuard, ReviewPanel etc.)
   ├── lib/              # Supabase client, and type definitions
   ├── .env.local        # Environment variables like Resend Key, Supabase Anon Key (ignored by git)
   └── README.md         # Project documentation
```

## Supabase Tables

### 1. `users`
Stores information about platform users.

| Column       | Type        | Description                          |
|-------------|------------|--------------------------------------|
| id          | UUID       | Primary key, unique user identifier  |
| email       | TEXT       | User email for login                 |
| name        | TEXT       | Display name                          |
| is_admin    | BOOL       | User role (`user` or `admin`)        |

---

### 2. `resumes`
Stores uploaded resumes and their metadata.

| Column       | Type        | Description                          |
|-------------|------------|--------------------------------------|
| id          | INT8       | Primary key                           |
| user_id     | UUID       | References `users.id`                 |
| file_path   | TEXT       | file path of the uploaded PDF               |
| status      | VARCHAR    | Resume status (Pending, Approved, Needs Revision, Rejected)|
| score       | INT8       | Optional score assigned by admin      |
| notes       | TEXT       | A short review by admin                    |
| created_at  | TIMESTAMP  | Upload time                            |
| file_name   | VARCHAR    | Name of the uploaded PDF               |

---


## Live Demo

Check out the live version of the app here: [Live Demo](https://resume-analyzer-sooty-seven.vercel.app/)


## 🏗️ Tech Stack

| Layer | Technology | Description |
|-------|-------------|-------------|
| **Frontend** | [Next.js 15 (App Router)](https://nextjs.org/) | Modern React framework with server-side rendering |
| **UI Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| **Auth & DB** | [Supabase](https://supabase.com/) | Auth, PostgreSQL database, and file storage |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type-safe React components |

---

## 🌱 Future Improvements
- Implement a PDF parser to reject badly formatted resumes instantly reducing the burden on Admins
- Integrate AI/NLP to detect and prevent spam submissions by intruders
- Add RLS policies on Supabase tables to prevent data leaks
- Add automated tests and integrate with CI/CD pipelines for reliability and preventing future regressions
- Improve UI/UX for mobile devices and tablets


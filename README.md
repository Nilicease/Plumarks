# PluMarks

> Track your marks. Know your progress.

PluMarks is a student grade tracker that allows students to manage their subjects, record grades, and monitor their academic performance.

## Goal

Build a simple and reliable grade-tracking application for students.

The initial version will focus on the core functionality rather than advanced features.

## MVP Features

* User registration and login
* Subject management
* Grade management
* Final grade calculation
* Overall average calculation
* Dashboard
* Responsive interface

### Subject Management

* Create a subject
* View subjects
* Edit subjects
* Delete subjects

### Grade Management

* Add grades
* Edit grades
* Delete grades
* Calculate subject grades

### Dashboard

* Display subjects
* Display final grades
* Display overall average

## Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* Vite

### Backend

* Laravel
* PHP
* Laravel Sanctum

### Database

* MySQL

### Development Tools

* Git
* GitHub
* npm
* Composer

## Architecture

```text
                    PluMarks
                       |
             +---------+---------+
             |                   |
          Frontend             Backend
             |                   |
       React + TypeScript      Laravel
             |                   |
             +------ API --------+
                       |
                    MySQL
```

## Project Structure

```text
plumarks/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   └── ...
│
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── config/
│   └── ...
│
└── README.md
```

## Development Setup

### Requirements

* Node.js
* npm
* PHP
* Composer
* MySQL
* Git

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
composer install
php artisan serve
```

Configure the Laravel `.env` file with your database credentials before running migrations.

```bash
php artisan migrate
```

## Development Plan

### Phase 1 — Project Setup

* [ ] Create repository
* [ ] Set up React + TypeScript + Vite
* [ ] Set up Tailwind CSS
* [ ] Set up Laravel
* [ ] Configure MySQL
* [ ] Connect frontend and backend

### Phase 2 — Authentication

* [ ] User registration
* [ ] User login
* [ ] User logout
* [ ] Authentication middleware
* [ ] Protected API routes

### Phase 3 — Subjects

* [ ] Create subject
* [ ] View subjects
* [ ] Edit subject
* [ ] Delete subject

### Phase 4 — Grades

* [ ] Add grades
* [ ] Edit grades
* [ ] Delete grades
* [ ] Calculate final grades
* [ ] Validate grade input

### Phase 5 — Dashboard

* [ ] Display subjects
* [ ] Display final grades
* [ ] Calculate overall average
* [ ] Create responsive dashboard

### Phase 6 — Testing and Deployment

* [ ] Test frontend
* [ ] Test API
* [ ] Test authentication
* [ ] Fix bugs
* [ ] Deploy Laravel backend
* [ ] Deploy React frontend
* [ ] Configure production database
* [ ] Configure production environment variables

## Future Features

These features are outside the initial MVP and may be added later.

* Semester management
* GPA calculation
* Grade history
* Grade prediction
* Charts and statistics
* Academic performance insights
* Notifications
* PWA support

## Name

**PluMarks** is a combination of:

**Pluma** — representing feathers, peacocks, writing, and education.

**Marks** — representing academic grades.

The name represents a student-focused application for managing and monitoring academic performance.

## Status

Currently in development.

The initial goal is to complete the MVP before adding additional features.
bi
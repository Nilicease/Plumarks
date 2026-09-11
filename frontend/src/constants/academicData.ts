import type { DashboardSubject, PerformanceSubject, SubjectRecord } from "../types/academic"

export const dashboardSubjects: DashboardSubject[] = [
    { name: "Mathematics", teacher: "Ms. Rivera", grade: 87, color: "#128f96", detail: "3 grading components" },
    { name: "Science", teacher: "Mr. Chen", grade: 92, color: "#d97941", detail: "4 grading components" },
    { name: "English", teacher: "Mrs. Williams", grade: 78, color: "#6d5cae", detail: "2 grading components" },
]

export const performanceSubjects: PerformanceSubject[] = [
    {
        name: "Mathematics",
        teacher: "Ms. Rivera",
        grade: 87,
        color: "#128f96",
        categories: [
            { name: "Exam", weight: 40, tasks: [{ name: "Midterm exam", earned: 86, possible: 100 }] },
            { name: "Performance task", weight: 30, tasks: [{ name: "Performance task 1", earned: 10, possible: 10 }, { name: "Performance task 2", earned: 40, possible: 50 }] },
            { name: "Activities", weight: 30, subcategories: ["Quizzes", "Assignment"], tasks: [{ name: "Quiz 1", subcategory: "Quizzes", earned: 18, possible: 20 }, { name: "Assignment 1", subcategory: "Assignment", earned: 27, possible: 30 }] },
        ],
    },
    {
        name: "Science",
        teacher: "Mr. Chen",
        grade: 92,
        color: "#d97941",
        categories: [
            { name: "Exam", weight: 50, tasks: [{ name: "Unit 1 exam", earned: 92, possible: 100 }] },
            { name: "Laboratory work", weight: 25, tasks: [{ name: "Density lab", earned: 20, possible: 20 }, { name: "Plant lab report", earned: 18, possible: 20 }] },
            { name: "Activities", weight: 25, subcategories: ["Quizzes", "Assignment"], tasks: [{ name: "Review quiz", subcategory: "Quizzes", earned: 24, possible: 25 }] },
        ],
    },
    {
        name: "English",
        teacher: "Mrs. Williams",
        grade: 78,
        color: "#6d5cae",
        categories: [
            { name: "Writing projects", weight: 60, tasks: [{ name: "Personal essay", earned: 36, possible: 50 }, { name: "Book review", earned: 42, possible: 50 }] },
            { name: "Activities", weight: 40, subcategories: ["Quizzes", "Assignment"], tasks: [{ name: "Reading journal", subcategory: "Assignment", earned: 18, possible: 20 }] },
        ],
    },
]

export const subjectRecords: SubjectRecord[] = [
    {
        name: "Mathematics",
        teacher: "Ms. Rivera",
        color: "#128f96",
        categories: [
            { id: 1, name: "Exam", weight: 40, subcategories: [] },
            { id: 2, name: "Performance task", weight: 30, subcategories: [] },
            { id: 3, name: "Activities", weight: 30, subcategories: ["Quizzes", "Assignment"] },
        ],
    },
    {
        name: "Science",
        teacher: "Mr. Chen",
        color: "#d97941",
        categories: [
            { id: 4, name: "Exam", weight: 50, subcategories: [] },
            { id: 5, name: "Laboratory work", weight: 25, subcategories: ["Lab report", "Practical"] },
            { id: 6, name: "Activities", weight: 25, subcategories: ["Quizzes", "Assignment"] },
        ],
    },
    {
        name: "English",
        teacher: "Mrs. Williams",
        color: "#6d5cae",
        categories: [
            { id: 7, name: "Writing projects", weight: 60, subcategories: ["Essays", "Book review"] },
            { id: 8, name: "Activities", weight: 40, subcategories: ["Reading journal"] },
        ],
    },
]

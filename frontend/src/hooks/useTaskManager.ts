import { useState } from "react"
import type { FormEvent } from "react"
import { performanceSubjects } from "../constants/academicData"
import type { GradeTask, PerformanceSubject } from "../types/academic"

type EditingTask = {
    subjectName: string
    categoryName: string
    taskIndex: number
}

type PendingDelete = EditingTask & {
    taskName: string
}

export function useTaskManager() {
    const [subjects, setSubjects] = useState<PerformanceSubject[]>(performanceSubjects)
    const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({ Mathematics: true, Science: true, English: true })
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState(performanceSubjects[0].name)
    const [selectedCategory, setSelectedCategory] = useState(performanceSubjects[0].categories[0].name)
    const [selectedSubcategory, setSelectedSubcategory] = useState("")
    const [taskName, setTaskName] = useState("")
    const [earnedScore, setEarnedScore] = useState("")
    const [possibleScore, setPossibleScore] = useState("")
    const [editingTask, setEditingTask] = useState<EditingTask | null>(null)
    const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)

    const currentSubject = subjects.find((subject) => subject.name === selectedSubject) ?? subjects[0]
    const currentCategory = currentSubject.categories.find((category) => category.name === selectedCategory) ?? currentSubject.categories[0]
    const taskCount = subjects.reduce((total, subject) => total + subject.categories.reduce((categoryTotal, category) => categoryTotal + category.tasks.length, 0), 0)

    function toggleSubject(subjectName: string) {
        setOpenSubjects((current) => ({ ...current, [subjectName]: !current[subjectName] }))
    }

    function toggleCategory(key: string) {
        setOpenCategories((current) => ({ ...current, [key]: !current[key] }))
    }

    function openTaskModal() {
        setEditingTask(null)
        setSelectedSubject(subjects[0].name)
        setSelectedCategory(subjects[0].categories[0].name)
        setSelectedSubcategory("")
        setTaskName("")
        setEarnedScore("")
        setPossibleScore("")
        setIsTaskModalOpen(true)
    }

    function openEditTask(subjectName: string, categoryName: string, taskIndex: number, task: GradeTask) {
        setEditingTask({ subjectName, categoryName, taskIndex })
        setSelectedSubject(subjectName)
        setSelectedCategory(categoryName)
        setSelectedSubcategory(task.subcategory ?? "")
        setTaskName(task.name)
        setEarnedScore(String(task.earned))
        setPossibleScore(String(task.possible))
        setIsTaskModalOpen(true)
    }

    function handleSubjectChange(subjectName: string) {
        const subject = subjects.find((item) => item.name === subjectName) ?? subjects[0]
        setSelectedSubject(subject.name)
        setSelectedCategory(subject.categories[0].name)
        setSelectedSubcategory("")
    }

    function handleCategoryChange(categoryName: string) {
        setSelectedCategory(categoryName)
        setSelectedSubcategory("")
    }

    function removeTask(subjectName: string, categoryName: string, taskIndex: number) {
        const subject = subjects.find((item) => item.name === subjectName)
        const category = subject?.categories.find((item) => item.name === categoryName)
        const task = category?.tasks[taskIndex]
        if (task) setPendingDelete({ subjectName, categoryName, taskIndex, taskName: task.name })
    }

    function confirmRemoveTask() {
        if (!pendingDelete) return
        setSubjects((current) => current.map((subject) => subject.name !== pendingDelete.subjectName ? subject : {
            ...subject,
            categories: subject.categories.map((category) => category.name !== pendingDelete.categoryName ? category : {
                ...category,
                tasks: category.tasks.filter((_, index) => index !== pendingDelete.taskIndex),
            }),
        }))
        setPendingDelete(null)
    }

    function handleTaskSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const earned = Number(earnedScore)
        const possible = Number(possibleScore)
        if (!taskName.trim() || !Number.isFinite(earned) || !Number.isFinite(possible) || possible <= 0 || earned < 0 || earned > possible) return

        setSubjects((current) => current.map((subject) => subject.name !== selectedSubject ? subject : {
            ...subject,
            categories: subject.categories.map((category) => category.name !== selectedCategory ? category : {
                ...category,
                tasks: editingTask?.subjectName === selectedSubject && editingTask.categoryName === selectedCategory
                    ? category.tasks.map((task, index) => index === editingTask.taskIndex ? { name: taskName.trim(), earned, possible, subcategory: selectedSubcategory || undefined } : task)
                    : [...category.tasks, { name: taskName.trim(), earned, possible, subcategory: selectedSubcategory || undefined }],
            }),
        }))
        setIsTaskModalOpen(false)
        setEditingTask(null)
    }

    return {
        subjects,
        openSubjects,
        openCategories,
        isTaskModalOpen,
        selectedSubject,
        selectedCategory,
        selectedSubcategory,
        taskName,
        earnedScore,
        possibleScore,
        editingTask,
        pendingDelete,
        currentSubject,
        currentCategory,
        taskCount,
        setIsTaskModalOpen,
        setSelectedSubcategory,
        setTaskName,
        setEarnedScore,
        setPossibleScore,
        setPendingDelete,
        toggleSubject,
        toggleCategory,
        openTaskModal,
        openEditTask,
        handleSubjectChange,
        handleCategoryChange,
        removeTask,
        confirmRemoveTask,
        handleTaskSubmit,
    }
}

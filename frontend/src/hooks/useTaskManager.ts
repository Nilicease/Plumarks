import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import type { GradeTask, PerformanceSubject } from "../types/academic"
import { useSubjects } from "./useSubjects"
import { getApiErrorMessage } from "../services/authServices"
import { getDashboard } from "../services/dashboardServices"
import { createTask, deleteTask, getTasks, updateTask } from "../services/taskServices"

type EditingTask = {
    subjectName: string
    categoryName: string
    taskIndex: number
}

type PendingDelete = EditingTask & {
    taskName: string
}

export function useTaskManager() {
    const { subjects: configuredSubjects } = useSubjects()

    const [subjects, setSubjects] = useState<PerformanceSubject[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({})
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

    const [selectedSubject, setSelectedSubject] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(0)

    const [taskName, setTaskName] = useState("")
    const [earnedScore, setEarnedScore] = useState("")
    const [possibleScore, setPossibleScore] = useState("")

    const [editingTask, setEditingTask] = useState<EditingTask | null>(null)
    const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)

    useEffect(() => {
        let cancelled = false

        async function loadPerformance() {
            setIsLoading(true)
            setError("")

            try {
                const [dashboard, taskLists] = await Promise.all([
                    getDashboard(),
                    Promise.all(configuredSubjects.map((subject) =>
                        subject.id ? getTasks(subject.id) : Promise.resolve([]),
                    )),
                ])

                if (cancelled) return

                const gradesBySubject = new Map(
                    dashboard.subjects.map((subject) => [subject.id, subject.final_grade ?? 0]),
                )

                setSubjects(configuredSubjects.map((subject, index) => ({
                    id: subject.id ?? 0,
                    name: subject.name,
                    teacher: subject.teacher,
                    grade: gradesBySubject.get(subject.id ?? 0) ?? 0,
                    color: subject.color,
                    categories: subject.categories.map((category) => ({
                        id: category.id,
                        name: category.name,
                        weight: category.weight,
                        subcategories: category.subcategories,
                        tasks: taskLists[index].filter((task) =>
                            task.gradingCategoryId === category.id ||
                            category.subcategories.some((subcategory) => subcategory.id === task.gradingCategoryId),
                        ),
                    })),
                })))
            } catch (requestError) {
                if (!cancelled) {
                    setError(getApiErrorMessage(requestError, "Unable to load tasks and grades."))
                }
            } finally {
                if (!cancelled) setIsLoading(false)
            }
        }

        void loadPerformance()

        return () => { cancelled = true }
    }, [configuredSubjects])

    const currentSubject = subjects.find(
        (subject) => subject.name === selectedSubject,
    )

    const currentCategory = currentSubject?.categories.find(
        (category) => category.name === selectedCategory,
    )

    const currentSubcategory = currentCategory?.subcategories.find(
        (subcategory) => subcategory.id === selectedSubcategoryId,
    )

    const taskCount = subjects.reduce(
        (total, subject) =>
            total +
            subject.categories.reduce(
                (categoryTotal, category) =>
                    categoryTotal + category.tasks.length,
                0,
            ),
        0,
    )

    function toggleSubject(subjectName: string) {
        setOpenSubjects((current) => ({
            ...current,
            [subjectName]: !current[subjectName],
        }))
    }

    function toggleCategory(key: string) {
        setOpenCategories((current) => ({
            ...current,
            [key]: !current[key],
        }))
    }

    function openTaskModal() {
        const subject =
            subjects.find(
                (subject) => subject.name === selectedSubject,
            ) ?? subjects[0]

        if (!subject?.categories[0]) return

        const category = subject.categories[0]
        const subcategory = category.subcategories[0]

        setEditingTask(null)

        setSelectedSubject(subject.name)
        setSelectedCategory(category.name)

        setSelectedSubcategoryId(
            subcategory?.id ?? 0,
        )

        setTaskName("")
        setEarnedScore("")
        setPossibleScore("")

        setIsTaskModalOpen(true)
    }

    function openEditTask(
        subjectName: string,
        categoryName: string,
        taskIndex: number,
        task: GradeTask,
    ) {
        setEditingTask({
            subjectName,
            categoryName,
            taskIndex,
        })

        setSelectedSubject(subjectName)
        setSelectedCategory(categoryName)

        setSelectedSubcategoryId(
            task.gradingCategoryId,
        )

        setTaskName(task.name)
        setEarnedScore(String(task.earned))
        setPossibleScore(String(task.possible))

        setIsTaskModalOpen(true)
    }

    function handleSubjectChange(subjectName: string) {
        const subject =
            subjects.find(
                (item) => item.name === subjectName,
            ) ?? subjects[0]

        if (!subject?.categories[0]) return

        const category = subject.categories[0]
        const subcategory = category.subcategories[0]

        setSelectedSubject(subject.name)
        setSelectedCategory(category.name)

        setSelectedSubcategoryId(
            subcategory?.id ?? 0,
        )
    }

    function handleCategoryChange(categoryName: string) {
        const category = currentSubject?.categories.find(
            (item) => item.name === categoryName,
        )

        const subcategory = category?.subcategories[0]

        setSelectedCategory(categoryName)

        setSelectedSubcategoryId(
            subcategory?.id ?? 0,
        )
    }

    function handleSubcategoryChange(subcategoryId: number) {
        setSelectedSubcategoryId(subcategoryId)
    }

    function removeTask(
        subjectName: string,
        categoryName: string,
        taskIndex: number,
    ) {
        const subject = subjects.find(
            (item) => item.name === subjectName,
        )

        const category = subject?.categories.find(
            (item) => item.name === categoryName,
        )

        const task = category?.tasks[taskIndex]

        if (task) {
            setPendingDelete({
                subjectName,
                categoryName,
                taskIndex,
                taskName: task.name,
            })
        }
    }

    async function confirmRemoveTask() {
        if (!pendingDelete) return

        const subject = subjects.find(
            (subject) =>
                subject.name === pendingDelete.subjectName,
        )

        const category = subject?.categories.find(
            (category) =>
                category.name === pendingDelete.categoryName,
        )

        const task = category?.tasks[pendingDelete.taskIndex]

        if (!task) return

        try {
            await deleteTask(task.id)

            setSubjects((current) =>
                current.map((subject) =>
                    subject.name !== pendingDelete.subjectName
                        ? subject
                        : {
                            ...subject,

                            categories: subject.categories.map(
                                (category) =>
                                    category.name !==
                                    pendingDelete.categoryName
                                        ? category
                                        : {
                                            ...category,

                                            tasks: category.tasks.filter(
                                                (_, index) =>
                                                    index !==
                                                    pendingDelete.taskIndex,
                                            ),
                                        },
                            ),
                        },
                ),
            )

            setPendingDelete(null)
        } catch (error) {
            console.error(
                "Failed to delete task:",
                error,
            )
        }
    }

    async function handleTaskSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        const earned = Number(earnedScore)
        const possible = Number(possibleScore)

        if (
            !taskName.trim() ||
            !Number.isFinite(earned) ||
            !Number.isFinite(possible) ||
            possible <= 0 ||
            earned < 0 ||
            earned > possible
        ) {
            return
        }

        const subject = subjects.find(
            (subject) => subject.name === selectedSubject,
        )

        if (!subject) return

        const category = subject.categories.find(
            (category) => category.name === selectedCategory,
        )

        if (!category) return

        const hasSubcategories = category.subcategories.length > 0

        let leafCategoryId: number

        if (hasSubcategories) {
            const subcategory = category.subcategories.find(
                (item) => item.id === selectedSubcategoryId,
            )

            if (!subcategory) return

            leafCategoryId = subcategory.id
        } else {
            leafCategoryId = category.id
        }

        try {
            if (editingTask) {
                const existingTask = category.tasks[editingTask.taskIndex]

                if (!existingTask) return

                const updatedTask = await updateTask({
                    taskId: existingTask.id,
                    gradingCategoryId: leafCategoryId,
                    name: taskName.trim(),
                    earned,
                    possible,
                })

                setSubjects((current) =>
                    current.map((currentSubject) => {
                        if (currentSubject.id !== subject.id) {
                            return currentSubject
                        }

                        return {
                            ...currentSubject,
                            categories: currentSubject.categories.map(
                                (currentCategory) => {
                                    if (currentCategory.id !== category.id) {
                                        return currentCategory
                                    }

                                    return {
                                        ...currentCategory,
                                        tasks: currentCategory.tasks.map(
                                            (task, index) =>
                                                index === editingTask.taskIndex
                                                    ? updatedTask
                                                    : task,
                                        ),
                                    }
                                },
                            ),
                        }
                    }),
                )
            } else {
                const newTask = await createTask({
                    subjectId: subject.id,
                    gradingCategoryId: leafCategoryId,
                    name: taskName.trim(),
                    earned,
                    possible,
                })

                setSubjects((current) =>
                    current.map((currentSubject) => {
                        if (currentSubject.id !== subject.id) {
                            return currentSubject
                        }

                        return {
                            ...currentSubject,
                            categories: currentSubject.categories.map(
                                (currentCategory) => {
                                    if (currentCategory.id !== category.id) {
                                        return currentCategory
                                    }

                                    return {
                                        ...currentCategory,
                                        tasks: [
                                            ...currentCategory.tasks,
                                            newTask,
                                        ],
                                    }
                                },
                            ),
                        }
                    }),
                )
            }

            setIsTaskModalOpen(false)
            setEditingTask(null)

            setTaskName("")
            setEarnedScore("")
            setPossibleScore("")
        } catch (error) {
            console.error(
                editingTask ? "Failed to update task:" : "Failed to create task:",
                error,
            )
        }
    }

    return {
        subjects,
        isLoading,
        error,

        openSubjects,
        openCategories,

        isTaskModalOpen,

        selectedSubject,
        selectedCategory,
        selectedSubcategoryId,

        taskName,
        earnedScore,
        possibleScore,

        editingTask,
        pendingDelete,

        currentSubject,
        currentCategory,
        currentSubcategory,

        taskCount,

        setIsTaskModalOpen,
        setSelectedSubcategoryId,
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
        handleSubcategoryChange,

        removeTask,
        confirmRemoveTask,
        handleTaskSubmit,
    }
}

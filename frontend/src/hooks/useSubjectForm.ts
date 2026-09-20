import { useState } from "react"
import type { FormEvent } from "react"
import type { GradingCategory, SubjectRecord } from "../types/academic"
import { totalWeight } from "../utils/gradeUtils"

type SaveSubject = (subject: SubjectRecord, editingSubjectName: string | null) => Promise<void>

export function useSubjectForm(onSave: SaveSubject) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [subjectName, setSubjectName] = useState("")
    const [teacherName, setTeacherName] = useState("")
    const [categories, setCategories] = useState<GradingCategory[]>([
        { id: 100, name: "Exam", weight: 100, subcategories: [] },
    ])
    const [nextCategoryId, setNextCategoryId] = useState(101)
    const [editingSubjectName, setEditingSubjectName] = useState<string | null>(null)
    const [saveError, setSaveError] = useState("")

    function openModal() {
        setEditingSubjectName(null)
        setSaveError("")
        setSubjectName("")
        setTeacherName("")
        setCategories([{ id: nextCategoryId, name: "Exam", weight: 100, subcategories: [] }])
        setNextCategoryId((current) => current + 1)
        setIsModalOpen(true)
        setSaveError("")
    }

    function openEditSubject(subject: SubjectRecord) {
        setEditingSubjectName(subject.name)
        setSubjectName(subject.name)
        setTeacherName(subject.teacher === "No teacher added" ? "" : subject.teacher)
        setCategories(subject.categories.map((category) => ({ ...category, subcategories: [...category.subcategories] })))
        setIsModalOpen(true)
        setSaveError("")
    }

    function updateCategory(id: number, field: "name" | "weight", value: string) {
        setCategories((current) => current.map((category) => category.id === id
            ? { ...category, [field]: field === "weight" ? Number(value) : value }
            : category))
    }

    function addCategory() {
        setCategories((current) => [...current, { id: nextCategoryId, name: "New category", weight: 0, subcategories: [] }])
        setNextCategoryId((current) => current + 1)
    }

    function removeCategory(id: number) {
        setCategories((current) => current.filter((category) => category.id !== id))
    }

    function addSubcategory(categoryId: number) {
        const subcategoryId = nextCategoryId
        setNextCategoryId((current) => current + 1)
        setCategories((current) => current.map((category) => category.id === categoryId
            ? {
                ...category,
                subcategories: [...category.subcategories, {
                    id: subcategoryId,
                    name: "New sub-category",
                    weight: 0,
                }],
            }
            : category))
    }

    function updateSubcategory(categoryId: number, index: number, field: "name" | "weight", value: string) {
        setCategories((current) => current.map((category) => category.id === categoryId
            ? {
                ...category,
                subcategories: category.subcategories.map((item, itemIndex) => itemIndex === index
                    ? { ...item, [field]: field === "weight" ? Number(value) : value }
                    : item),
            }
            : category))
    }

    function removeSubcategory(categoryId: number, index: number) {
        setCategories((current) => current.map((category) => category.id === categoryId
            ? { ...category, subcategories: category.subcategories.filter((_, itemIndex) => itemIndex !== index) }
            : category))
    }

    async function saveSubject(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!subjectName.trim() || !categories.length || totalWeight(categories) !== 100 || categories.some((category) => !category.name.trim() || (category.subcategories.length > 0 && totalWeight(category.subcategories) !== 100))) return
        setSaveError("")

        try {
            await onSave({
                name: subjectName.trim(),
                teacher: teacherName.trim() || "No teacher added",
                color: "#bc6c25",
                categories: categories.map((category) => ({
                    ...category,
                    name: category.name.trim(),
                    subcategories: category.subcategories
                        .filter((item) => item.name.trim())
                        .map((item) => ({ ...item, name: item.name.trim() })),
                })),
            }, editingSubjectName)
            setIsModalOpen(false)
            setEditingSubjectName(null)
        } catch (error) {
            setSaveError(error instanceof Error ? error.message : "Unable to save subject.")
        }
    }

    return {
        isModalOpen,
        setIsModalOpen,
        subjectName,
        setSubjectName,
        teacherName,
        setTeacherName,
        categories,
        editingSubjectName,
        saveError,
        gradingSystemValid: totalWeight(categories) === 100 && categories.length > 0 && categories.every((category) => category.subcategories.length === 0 || totalWeight(category.subcategories) === 100),
        openModal,
        openEditSubject,
        updateCategory,
        addCategory,
        removeCategory,
        addSubcategory,
        updateSubcategory,
        removeSubcategory,
        saveSubject,
    }
}

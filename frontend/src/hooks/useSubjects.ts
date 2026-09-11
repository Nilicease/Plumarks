import { useCallback, useEffect, useState } from "react"
import { getApiErrorMessage } from "../services/authServices"
import { createSubject, deleteSubject, getSubjects, mapApiSubject, updateSubject } from "../services/subjectServices"
import type { SubjectRecord } from "../types/academic"

export function useSubjects() {
    const [subjects, setSubjects] = useState<SubjectRecord[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    const loadSubjects = useCallback(async () => {
        setIsLoading(true)
        setError("")
        try {
            setSubjects((await getSubjects()).map(mapApiSubject))
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to load subjects."))
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => { void loadSubjects() }, [loadSubjects])

    async function saveSubject(subject: SubjectRecord, editingId?: number): Promise<void> {
        const saved = editingId ? await updateSubject(editingId, subject) : await createSubject(subject)
        const mapped = mapApiSubject(saved)
        setSubjects((current) => editingId
            ? current.map((item) => item.id === editingId ? mapped : item)
            : [mapped, ...current])
    }

    async function removeSubject(id: number): Promise<void> {
        await deleteSubject(id)
        setSubjects((current) => current.filter((subject) => subject.id !== id))
    }

    return { subjects, isLoading, error, saveSubject, removeSubject, reload: loadSubjects }
}
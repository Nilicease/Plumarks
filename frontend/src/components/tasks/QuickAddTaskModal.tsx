import { useState } from "react"
import { Pencil, X } from "lucide-react"
import { getApiErrorMessage } from "../../services/authServices"
import { createTask } from "../../services/taskServices"
import type { ApiSubject } from "../../types/academic"

type Props = {
    subjects: ApiSubject[]
    onClose: () => void
    onSaved: () => Promise<void>
}

export function QuickAddTaskModal({ subjects, onClose, onSaved }: Props) {
    const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? 0)
    const [categoryId, setCategoryId] = useState(0)
    const [leafCategoryId, setLeafCategoryId] = useState(0)
    const [name, setName] = useState("")
    const [earned, setEarned] = useState("")
    const [possible, setPossible] = useState("")
    const [error, setError] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    const subject = subjects.find((item) => item.id === subjectId)
    const category = subject?.categories.find((item) => item.id === categoryId) ?? subject?.categories[0]
    const options = category?.subcategories.length ? category.subcategories : category ? [category] : []

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const earnedScore = Number(earned)
        const possibleScore = Number(possible)
        const selectedId = options.some((item) => item.id === leafCategoryId) ? leafCategoryId : options[0]?.id

        if (!subject || !selectedId || !name.trim() || !Number.isFinite(earnedScore) || !Number.isFinite(possibleScore) || earnedScore < 0 || possibleScore <= 0 || earnedScore > possibleScore) {
            setError("Choose a category and enter a valid score.")
            return
        }

        setIsSaving(true)
        setError("")
        try {
            await createTask({ subjectId: subject.id, gradingCategoryId: selectedId, name: name.trim(), earned: earnedScore, possible: possibleScore })
            await onSaved()
            onClose()
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to save task."))
        } finally {
            setIsSaving(false)
        }
    }

    return <div className="fixed inset-0 z-[70] flex min-h-full items-start justify-center overflow-y-auto bg-[rgba(15,23,42,0.46)] p-4" role="presentation">
        <div className="my-2 w-full max-w-[560px] rounded-[22px] bg-surface p-5 shadow-[0_28px_80px_rgba(15,23,42,0.22)] sm:my-6 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="quick-add-task-title">
            <div className="mb-7 flex items-start justify-between gap-4"><div><p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-primary">New performance record</p><h2 id="quick-add-task-title" className="m-0 font-serif text-[2rem] font-normal leading-none tracking-[-0.04em]">Add a task</h2></div><button type="button" aria-label="Close add task dialog" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-[8px] text-text-muted hover:bg-primary-light"><X size={18} aria-hidden="true" /></button></div>
            {subjects.length === 0 ? <p className="rounded-[10px] border border-border bg-[#fbfdfd] p-4 text-sm text-text-secondary">Create a subject before adding a task.</p> : <form onSubmit={submit} className="space-y-5">
                {error && <p role="alert" className="rounded-[10px] border border-danger/20 bg-danger/5 p-3 text-[0.8rem] text-danger">{error}</p>}
                <div className="grid gap-5 sm:grid-cols-2"><label className="flex flex-col gap-2 text-[0.8rem] font-bold">Subject<select value={subjectId} onChange={(event) => { const nextSubject = subjects.find((item) => item.id === Number(event.target.value)); const nextCategory = nextSubject?.categories[0]; setSubjectId(Number(event.target.value)); setCategoryId(nextCategory?.id ?? 0); setLeafCategoryId(nextCategory?.subcategories[0]?.id ?? nextCategory?.id ?? 0) }} className="min-h-[48px] rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem]">{subjects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="flex flex-col gap-2 text-[0.8rem] font-bold">Category<select value={category?.id ?? 0} onChange={(event) => { const nextCategory = subject?.categories.find((item) => item.id === Number(event.target.value)); setCategoryId(Number(event.target.value)); setLeafCategoryId(nextCategory?.subcategories[0]?.id ?? nextCategory?.id ?? 0) }} className="min-h-[48px] rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem]">{subject?.categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div>
                {category?.subcategories.length ? <label className="flex flex-col gap-2 text-[0.8rem] font-bold">Sub-category<select value={options.some((item) => item.id === leafCategoryId) ? leafCategoryId : options[0]?.id ?? 0} onChange={(event) => setLeafCategoryId(Number(event.target.value))} className="min-h-[48px] rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem]">{options.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label> : null}
                <label className="flex flex-col gap-2 text-[0.8rem] font-bold">Task name<input value={name} onChange={(event) => setName(event.target.value)} required className="min-h-[48px] rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem]" /></label>
                <div><p className="m-0 mb-2 text-[0.8rem] font-bold">Score</p><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2"><input aria-label="Score earned" type="number" min="0" value={earned} onChange={(event) => setEarned(event.target.value)} required className="min-h-[48px] rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem]" /><span>/</span><input aria-label="Score possible" type="number" min="1" value={possible} onChange={(event) => setPossible(event.target.value)} required className="min-h-[48px] rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem]" /></div></div>
                <div className="flex justify-end gap-3 border-t border-border pt-5"><button type="button" onClick={onClose} className="min-h-[46px] rounded-[10px] px-5 text-[0.84rem] font-bold text-text-secondary">Cancel</button><button type="submit" disabled={isSaving} className="inline-flex min-h-[46px] items-center gap-2 rounded-[10px] bg-primary px-5 text-[0.84rem] font-bold text-white disabled:opacity-50"><Pencil size={16} aria-hidden="true" />{isSaving ? "Saving…" : "Add task"}</button></div>
            </form>}
        </div>
    </div>
}

import { useState } from "react"
import type { FormEvent } from "react"
import { Link } from "react-router-dom"
import { Plus, Save, Trash2 } from "lucide-react"
import { Topbar } from "../components/Topbar"
import { totalWeight } from "../utils/gradeUtils"

type GradeComponent = {
    id: number
    name: string
    weight: number
}

type Assessment = GradeComponent & {
    children?: GradeComponent[]
}

const initialAssessments: Assessment[] = [
    { id: 1, name: "Exam", weight: 40 },
    { id: 2, name: "Performance task", weight: 30 },
    {
        id: 3,
        name: "Activities",
        weight: 30,
        children: [
            { id: 4, name: "Quizzes", weight: 50 },
            { id: 5, name: "Assignment", weight: 50 },
        ],
    },
]

export function SubjectSetupPage() {
    const [subjectName, setSubjectName] = useState("Math")
    const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments)
    const [nextId, setNextId] = useState(6)
    const [saved, setSaved] = useState(false)

    const overallTotal = totalWeight(assessments)
    const isValid = subjectName.trim().length > 0 && overallTotal === 100 && assessments.every((assessment) => {
        return !assessment.children || totalWeight(assessment.children) === 100
    })

    function updateAssessment(id: number, field: "name" | "weight", value: string) {
        setAssessments((current) => current.map((assessment) => {
            if (assessment.id === id) {
                return { ...assessment, [field]: field === "weight" ? Number(value) : value }
            }

            if (assessment.children?.some((child) => child.id === id)) {
                return {
                    ...assessment,
                    children: assessment.children.map((child) => child.id === id
                        ? { ...child, [field]: field === "weight" ? Number(value) : value }
                        : child),
                }
            }

            return assessment
        }))
        setSaved(false)
    }

    function addAssessment(parentId?: number) {
        const newItem = { id: nextId, name: "New component", weight: 0 }
        setNextId((current) => current + 1)
        setAssessments((current) => current.map((assessment) => {
            if (parentId === assessment.id) {
                return { ...assessment, children: [...(assessment.children ?? []), newItem] }
            }
            return assessment
        }))

        if (parentId === undefined) {
            setAssessments((current) => [...current, newItem])
        }
        setSaved(false)
    }

    function removeAssessment(id: number) {
        setAssessments((current) => current
            .filter((assessment) => assessment.id !== id)
            .map((assessment) => ({
                ...assessment,
                children: assessment.children?.filter((child) => child.id !== id),
            })))
        setSaved(false)
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (isValid) {
            setSaved(true)
        }
    }

    return (
        <main className="min-h-screen bg-[linear-gradient(135deg,#eefafa_0%,var(--plumarks-background)_52%,#f1f8f8_100%)] px-4 py-5 font-sans text-text sm:px-8 sm:py-8">
            <div className="mx-auto max-w-[1120px]">
                <Topbar />

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <form onSubmit={handleSubmit} className="rounded-[24px] border border-[rgba(226,232,240,0.9)] bg-surface p-5 shadow-[0_24px_70px_rgba(18,93,101,0.1)] sm:p-8">
                        <div className="mb-8 border-b border-border pb-7">
                            <p className="mb-2 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-primary">Subject setup</p>
                            <h1 className="m-0 mb-2 font-serif text-[clamp(2rem,5vw,3.4rem)] font-normal leading-[1] tracking-[-0.04em]">Build your grading system</h1>
                            <p className="m-0 max-w-[560px] text-[0.92rem] leading-[1.6] text-text-secondary">Set how each part of this subject contributes to the final grade. You can adjust this later.</p>
                        </div>

                        <div className="mb-8 flex flex-col gap-2">
                            <label className="text-[0.82rem] font-bold" htmlFor="subject-name">Subject name</label>
                            <input id="subject-name" className="min-h-[50px] w-full rounded-[10px] border border-border bg-[#fbfdfd] px-4 text-[0.95rem] outline-none transition focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_var(--plumarks-primary-light)]" value={subjectName} onChange={(event) => { setSubjectName(event.target.value); setSaved(false) }} placeholder="e.g. Mathematics" required />
                        </div>

                        <div className="mb-3 flex items-end justify-between gap-4">
                            <div>
                                <h2 className="m-0 font-serif text-[1.45rem] font-normal">Grading components</h2>
                                <p className="m-1 m-0 text-[0.82rem] text-text-secondary">The top-level weights must add up to 100%.</p>
                            </div>
                            <span className={`shrink-0 text-[0.82rem] font-bold ${overallTotal === 100 ? "text-success" : "text-warning"}`}>{overallTotal}% total</span>
                        </div>

                        <div className="space-y-3">
                            {assessments.map((assessment, index) => (
                                <div key={assessment.id} className="rounded-[14px] border border-border bg-[#fbfdfd] p-3 sm:p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-[0.72rem] font-bold text-primary-dark">{index + 1}</span>
                                        <input aria-label={`${assessment.name} name`} className="min-h-[42px] min-w-0 flex-1 rounded-[8px] border border-border bg-white px-3 text-[0.9rem] outline-none focus:border-primary" value={assessment.name} onChange={(event) => updateAssessment(assessment.id, "name", event.target.value)} />
                                        <div className="relative w-[86px] shrink-0">
                                            <input aria-label={`${assessment.name} weight`} className="min-h-[42px] w-full rounded-[8px] border border-border bg-white px-3 pr-7 text-right text-[0.9rem] outline-none focus:border-primary" type="number" min="0" max="100" value={assessment.weight} onChange={(event) => updateAssessment(assessment.id, "weight", event.target.value)} />
                                            <span className="pointer-events-none absolute right-3 top-3 text-[0.85rem] text-text-muted">%</span>
                                        </div>
                                        <button type="button" aria-label={`Remove ${assessment.name}`} title={`Remove ${assessment.name}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-text-muted transition hover:bg-[#feeceb] hover:text-danger" onClick={() => removeAssessment(assessment.id)}><Trash2 size={16} strokeWidth={2} aria-hidden="true" /></button>
                                    </div>

                                    {assessment.children && (
                                        <div className="ml-9 mt-4 border-l-2 border-primary-light pl-3 sm:pl-4">
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <p className="m-0 text-[0.74rem] font-bold uppercase tracking-[0.08em] text-text-secondary">Inside {assessment.name}</p>
                                                <span className={`text-[0.74rem] font-bold ${totalWeight(assessment.children) === 100 ? "text-success" : "text-warning"}`}>{totalWeight(assessment.children)}% total</span>
                                            </div>
                                            <div className="space-y-2">
                                                {assessment.children.map((child) => (
                                                    <div key={child.id} className="flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                                        <input aria-label={`${child.name} name`} className="min-h-[38px] min-w-0 flex-1 rounded-[8px] border border-border bg-white px-3 text-[0.85rem] outline-none focus:border-primary" value={child.name} onChange={(event) => updateAssessment(child.id, "name", event.target.value)} />
                                                        <div className="relative w-[78px] shrink-0">
                                                            <input aria-label={`${child.name} weight`} className="min-h-[38px] w-full rounded-[8px] border border-border bg-white px-2 pr-6 text-right text-[0.85rem] outline-none focus:border-primary" type="number" min="0" max="100" value={child.weight} onChange={(event) => updateAssessment(child.id, "weight", event.target.value)} />
                                                            <span className="pointer-events-none absolute right-2 top-2.5 text-[0.75rem] text-text-muted">%</span>
                                                        </div>
                                                        <button type="button" aria-label={`Remove ${child.name}`} title={`Remove ${child.name}`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-text-muted hover:bg-[#feeceb] hover:text-danger" onClick={() => removeAssessment(child.id)}><Trash2 size={14} strokeWidth={2} aria-hidden="true" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                            <button type="button" className="mt-3 inline-flex items-center gap-1 text-[0.78rem] font-bold text-primary-dark hover:underline" onClick={() => addAssessment(assessment.id)}><Plus size={14} strokeWidth={2.5} aria-hidden="true" />Add nested component</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button type="button" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-dashed border-primary bg-transparent py-3 text-[0.84rem] font-bold text-primary-dark transition hover:bg-primary-light" onClick={() => addAssessment()}><Plus size={16} strokeWidth={2.5} aria-hidden="true" />Add grading component</button>

                        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <Link to="/" className="text-center text-[0.85rem] font-bold text-text-secondary no-underline hover:text-primary-dark">Cancel</Link>
                            <button type="submit" disabled={!isValid} className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[10px] bg-primary px-7 text-[0.88rem] font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-45"><Save size={16} strokeWidth={2.2} aria-hidden="true" />Save subject</button>
                        </div>
                        {saved && <p className="mt-4 text-center text-[0.82rem] font-bold text-success" role="status">{subjectName} grading system saved.</p>}
                    </form>

                    <aside className="h-fit rounded-[24px] bg-primary-dark p-6 text-white shadow-[0_18px_45px_rgba(18,93,101,0.18)] sm:p-7">
                        <p className="mb-7 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[#8ee1df]">A clear formula</p>
                        <div className="mb-8 font-serif text-[2.4rem] leading-[1.05] tracking-[-0.04em]">Your grade,<br />your way.</div>
                        <p className="m-0 text-[0.9rem] leading-[1.7] text-[#c7e8e8]">Use nested components when one grading category is made up of smaller parts, like quizzes and assignments inside Activities.</p>
                        <div className="mt-8 border-t border-white/15 pt-5 text-[0.8rem] leading-[1.6] text-[#a6d9da]">Each level is calculated independently, so every set of components should equal 100%.</div>
                    </aside>
                </div>
            </div>
        </main>
    )
}
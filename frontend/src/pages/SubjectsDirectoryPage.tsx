import { useState } from "react"
import { AlertTriangle, BookOpen, ChevronDown, ChevronUp, Pencil, Plus, Save, Trash2, X } from "lucide-react"
import { Topbar } from "../components/Topbar"
import { PageSkeleton } from "../components/ui/Skeleton"
import { useAsyncPageLoading } from "../hooks/useAsyncPageLoading"
import { useSubjectForm } from "../hooks/useSubjectForm"
import type { SubjectRecord } from "../types/academic"
import { totalWeight } from "../utils/gradeUtils"
import { subjectRecords } from "../constants/academicData"

export function SubjectsPage() {
    const isLoading = useAsyncPageLoading()
    const [subjects, setSubjects] = useState<SubjectRecord[]>(subjectRecords)
    const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({ Mathematics: true, Science: true, English: true })
    const [pendingDelete, setPendingDelete] = useState<string | null>(null)

    const subjectForm = useSubjectForm((subjectData, editingName) => {
        setSubjects((current) => editingName
            ? current.map((subject) => subject.name === editingName ? { ...subjectData, color: subject.color } : subject)
            : [...current, subjectData])
        setExpandedSubjects((current) => ({ ...current, [subjectData.name]: true }))
    })
    const {
        isModalOpen,
        setIsModalOpen,
        subjectName,
        setSubjectName,
        teacherName,
        setTeacherName,
        categories,
        editingSubjectName,
        gradingSystemValid,
        openModal,
        openEditSubject,
        updateCategory,
        addCategory,
        removeCategory,
        addSubcategory,
        updateSubcategory,
        removeSubcategory,
        saveSubject,
    } = subjectForm

    if (isLoading) {
        return <main className="min-h-screen bg-[linear-gradient(135deg,#eefafa_0%,var(--plumarks-background)_52%,#f1f8f8_100%)] px-4 py-5 font-sans text-text sm:px-8 sm:py-8"><div className="mx-auto max-w-[1120px]"><Topbar /><PageSkeleton /></div></main>
    }

    function toggleSubject(name: string) {
        setExpandedSubjects((current) => ({ ...current, [name]: !current[name] }))
    }

    function removeSubject(name: string) {
        setPendingDelete(name)
    }

    function confirmRemoveSubject() {
        if (!pendingDelete) return
        setSubjects((current) => current.filter((subject) => subject.name !== pendingDelete))
        setPendingDelete(null)
    }

    return (
        <main className="min-h-screen bg-[linear-gradient(135deg,#eefafa_0%,var(--plumarks-background)_52%,#f1f8f8_100%)] px-4 py-5 font-sans text-text sm:px-8 sm:py-8">
            <div className="mx-auto max-w-[1120px]">
                <Topbar />

                <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-2 flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-primary"><BookOpen size={14} strokeWidth={2.4} aria-hidden="true" /> Subject library</p>
                        <h1 className="m-0 mb-2 font-serif text-[clamp(2.5rem,5vw,4.4rem)] font-normal leading-[0.95] tracking-[-0.05em]">Your subjects</h1>
                        <p className="m-0 max-w-[580px] text-[0.95rem] leading-[1.6] text-text-secondary">See every subject and the grading system behind its final mark.</p>
                    </div>
                    <button type="button" onClick={openModal} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[10px] bg-primary px-5 text-[0.84rem] font-bold text-white transition hover:bg-primary-dark"><Plus size={16} strokeWidth={2.5} aria-hidden="true" />Add subject</button>
                </section>

                <section className="mb-6 flex items-center justify-between gap-4">
                    <p className="m-0 text-[0.84rem] text-text-secondary"><strong className="text-text">{subjects.length}</strong> subjects set up</p>
                    <span className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-text-muted">Grading systems</span>
                </section>

                <section className="space-y-4">
                    {subjects.map((subject) => {
                        const expanded = expandedSubjects[subject.name]
                        const weightTotal = totalWeight(subject.categories)
                        return <article key={subject.name} className="overflow-hidden rounded-[20px] border border-border bg-surface shadow-[0_12px_30px_rgba(18,93,101,0.06)]">
                            <button type="button" aria-expanded={expanded} onClick={() => toggleSubject(subject.name)} className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-[#f8fffe] sm:p-6">
                                <span className="h-12 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: subject.color }} />
                                <span className="min-w-0 flex-1">
                                    <span className="block font-serif text-[1.55rem] font-normal">{subject.name}</span>
                                    <span className="mt-1 block text-[0.78rem] text-text-secondary">{subject.teacher} · {subject.categories.length} grading categories</span>
                                </span>
                                <span className={`hidden text-[0.72rem] font-bold sm:block ${weightTotal === 100 ? "text-success" : "text-warning"}`}>{weightTotal}% configured</span>
                                <span className="flex shrink-0 items-center gap-1">
                                    <span className="flex items-center gap-1">
                                        <button type="button" aria-label={`Edit ${subject.name}`} title={`Edit ${subject.name}`} onClick={(event) => { event.stopPropagation(); openEditSubject(subject) }} className="flex h-8 w-8 items-center justify-center rounded-[7px] text-text-muted hover:bg-primary-light hover:text-primary-dark"><Pencil size={14} aria-hidden="true" /></button>
                                        <button type="button" aria-label={`Remove ${subject.name}`} title={`Remove ${subject.name}`} onClick={(event) => { event.stopPropagation(); removeSubject(subject.name) }} className="flex h-8 w-8 items-center justify-center rounded-[7px] text-text-muted hover:bg-[#feeceb] hover:text-danger"><Trash2 size={14} aria-hidden="true" /></button>
                                    </span>
                                    {expanded ? <ChevronUp size={19} className="shrink-0 text-primary-dark" aria-hidden="true" /> : <ChevronDown size={19} className="shrink-0 text-primary-dark" aria-hidden="true" />}
                                </span>
                            </button>
                            {expanded && <div className="border-t border-border bg-[#fbfdfd] p-4 sm:p-6">
                                <div className="mb-4 flex items-center justify-between gap-4">
                                    <div><p className="m-0 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-primary">Grading system</p><p className="m-1 m-0 text-[0.8rem] text-text-secondary">How this subject is calculated.</p></div>
                                    <span className={`text-[0.8rem] font-bold ${weightTotal === 100 ? "text-success" : "text-warning"}`}>{weightTotal}% total</span>
                                </div>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {subject.categories.map((category) => <div key={category.id} className="rounded-[14px] border border-border bg-white p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div><h2 className="m-0 text-[0.92rem] font-bold">{category.name}</h2><p className="m-1 m-0 text-[0.75rem] text-text-muted">{category.weight}% of final grade</p></div>
                                            <span className="rounded-full bg-primary-light px-2.5 py-1 text-[0.7rem] font-bold text-primary-dark">Category</span>
                                        </div>
                                        {category.subcategories.length > 0 && <div className="mt-4 border-l-2 border-primary-light pl-3"><p className="m-0 mb-2 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-text-muted">Sub-categories</p><div className="flex flex-wrap gap-2">{category.subcategories.map((subcategory) => <span key={subcategory} className="rounded-[7px] bg-[#f1f5f5] px-2.5 py-1.5 text-[0.75rem] text-text-secondary">{subcategory}</span>)}</div></div>}
                                    </div>)}
                                </div>
                            </div>}
                        </article>
                    })}
                </section>
            </div>

            {pendingDelete && <div className="fixed inset-0 z-[60] flex min-h-full items-start justify-center overflow-y-auto bg-[rgba(15,23,42,0.46)] p-4" role="presentation">
                <div className="my-2 w-full max-w-[420px] rounded-[18px] bg-surface p-6 shadow-[0_28px_80px_rgba(15,23,42,0.22)] sm:my-8" role="alertdialog" aria-modal="true" aria-labelledby="remove-subject-title">
                    <div className="mb-5 flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#feeceb] text-danger"><AlertTriangle size={19} aria-hidden="true" /></span><div><h2 id="remove-subject-title" className="m-0 text-[1.05rem] font-bold">Remove this subject?</h2><p className="m-0 mt-1 text-[0.84rem] leading-[1.5] text-text-secondary">“{pendingDelete}” and its grading system will be removed.</p></div></div>
                    <div className="flex justify-end gap-2"><button type="button" onClick={() => setPendingDelete(null)} className="min-h-[42px] rounded-[9px] px-4 text-[0.82rem] font-bold text-text-secondary hover:bg-primary-light">Cancel</button><button type="button" onClick={confirmRemoveSubject} className="min-h-[42px] rounded-[9px] bg-danger px-4 text-[0.82rem] font-bold text-white hover:opacity-90">Remove subject</button></div>
                </div>
            </div>}

            {isModalOpen && <div className="fixed inset-0 z-50 flex min-h-full items-start justify-center overflow-y-auto bg-[rgba(15,23,42,0.46)] p-4" role="presentation">
                <div className="my-2 w-full max-w-[640px] rounded-[22px] bg-surface p-5 shadow-[0_28px_80px_rgba(15,23,42,0.22)] sm:my-6 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="add-subject-title">
                    <div className="mb-7 flex items-start justify-between gap-4"><div><p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-primary">{editingSubjectName ? "Edit subject" : "New subject"}</p><h2 id="add-subject-title" className="m-0 font-serif text-[2rem] font-normal leading-none tracking-[-0.04em]">{editingSubjectName ? "Update grading system" : "Set up a grading system"}</h2><p className="m-0 mt-2 text-[0.84rem] text-text-secondary">Add the categories and optional sub-categories used for this subject.</p></div><button type="button" aria-label="Close add subject dialog" title="Close" onClick={() => setIsModalOpen(false)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-text-muted hover:bg-primary-light hover:text-primary-dark"><X size={18} aria-hidden="true" /></button></div>
                    <form onSubmit={saveSubject} className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2"><div className="flex flex-col gap-2"><label className="text-[0.8rem] font-bold" htmlFor="new-subject-name">Subject name</label><input id="new-subject-name" value={subjectName} onChange={(event) => setSubjectName(event.target.value)} placeholder="e.g. History" className="min-h-[48px] rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem] outline-none focus:border-primary" required /></div><div className="flex flex-col gap-2"><label className="text-[0.8rem] font-bold" htmlFor="new-subject-teacher">Teacher <span className="font-normal text-text-muted">(optional)</span></label><input id="new-subject-teacher" value={teacherName} onChange={(event) => setTeacherName(event.target.value)} placeholder="e.g. Mr. Santos" className="min-h-[48px] rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem] outline-none focus:border-primary" /></div></div>
                        <div><div className="mb-3 flex items-end justify-between gap-3"><div><h3 className="m-0 text-[0.95rem] font-bold">Grading categories</h3><p className="m-1 m-0 text-[0.75rem] text-text-secondary">Weights must add up to 100%.</p></div><span className={`text-[0.78rem] font-bold ${gradingSystemValid ? "text-success" : "text-warning"}`}>{totalWeight(categories)}% total</span></div><div className="space-y-3">{categories.map((category) => <div key={category.id} className="rounded-[12px] border border-border bg-[#fbfdfd] p-3"><div className="flex items-center gap-2"><input aria-label="Category name" value={category.name} onChange={(event) => updateCategory(category.id, "name", event.target.value)} className="min-h-[42px] min-w-0 flex-1 rounded-[8px] border border-border bg-white px-3 text-[0.85rem] outline-none focus:border-primary" required /><div className="relative w-[78px] shrink-0"><input aria-label="Category weight" type="number" min="0" max="100" value={category.weight} onChange={(event) => updateCategory(category.id, "weight", event.target.value)} className="min-h-[42px] w-full rounded-[8px] border border-border bg-white px-2 pr-6 text-right text-[0.85rem] outline-none focus:border-primary" /><span className="pointer-events-none absolute right-2 top-3 text-[0.75rem] text-text-muted">%</span></div><button type="button" aria-label={`Remove ${category.name}`} title={`Remove ${category.name}`} onClick={() => removeCategory(category.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-text-muted hover:bg-[#feeceb] hover:text-danger"><Trash2 size={15} aria-hidden="true" /></button></div>{category.subcategories.map((subcategory, index) => <div key={`${category.id}-${index}`} className="mt-2 ml-3 flex items-center gap-2 border-l-2 border-primary-light pl-3"><input aria-label="Sub-category name" value={subcategory} onChange={(event) => updateSubcategory(category.id, index, event.target.value)} className="min-h-[36px] min-w-0 flex-1 rounded-[8px] border border-border bg-white px-3 text-[0.8rem] outline-none focus:border-primary" /><button type="button" aria-label={`Remove ${subcategory}`} title={`Remove ${subcategory}`} onClick={() => removeSubcategory(category.id, index)} className="flex h-7 w-7 items-center justify-center rounded-[7px] text-text-muted hover:bg-[#feeceb] hover:text-danger"><Trash2 size={13} aria-hidden="true" /></button></div>)}<button type="button" onClick={() => addSubcategory(category.id)} className="mt-3 ml-3 inline-flex items-center gap-1 text-[0.74rem] font-bold text-primary-dark hover:underline"><Plus size={13} aria-hidden="true" />Add sub-category</button></div>)}</div><button type="button" onClick={addCategory} className="mt-3 inline-flex items-center gap-1 text-[0.78rem] font-bold text-primary-dark hover:underline"><Plus size={14} aria-hidden="true" />Add category</button></div>
                        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={() => setIsModalOpen(false)} className="min-h-[46px] rounded-[10px] px-5 text-[0.84rem] font-bold text-text-secondary hover:bg-[#f1f5f5]">Cancel</button><button type="submit" disabled={!gradingSystemValid} className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[10px] bg-primary px-5 text-[0.84rem] font-bold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-45"><Save size={16} aria-hidden="true" />{editingSubjectName ? "Save changes" : "Save subject"}</button></div>
                    </form>
                </div>
            </div>}
        </main>
    )
}
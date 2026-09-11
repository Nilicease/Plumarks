import { Link } from "react-router-dom"
import { ArrowRight, Plus } from "lucide-react"
import { Topbar } from "../components/Topbar"
import { PageSkeleton } from "../components/ui/Skeleton"
import { useAsyncPageLoading } from "../hooks/useAsyncPageLoading"
import { useSubjects } from "../hooks/useSubjects"

export function DashboardPage() {
    const isLoading = useAsyncPageLoading()
    const { subjects, isLoading: isSubjectsLoading, error } = useSubjects()
    const average: number | null = null

    if (isLoading || isSubjectsLoading) {
        return <main className="min-h-screen bg-[linear-gradient(135deg,#eefafa_0%,var(--plumarks-background)_52%,#f1f8f8_100%)] px-4 py-5 font-sans text-text sm:px-8 sm:py-8"><div className="mx-auto max-w-[1120px]"><Topbar /><PageSkeleton /></div></main>
    }

    return (
        <main className="min-h-screen bg-[linear-gradient(135deg,#eefafa_0%,var(--plumarks-background)_52%,#f1f8f8_100%)] px-4 py-5 font-sans text-text sm:px-8 sm:py-8">
            <div className="mx-auto max-w-[1120px]">
                <Topbar />

                <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-2 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-primary">Friday, September 11</p>
                        <h1 className="m-0 mb-2 font-serif text-[clamp(2.5rem,5vw,4.4rem)] font-normal leading-[0.95] tracking-[-0.05em]">Your academic overview.</h1>
                        <p className="m-0 max-w-[560px] text-[0.95rem] leading-[1.6] text-text-secondary">Here is the latest picture of your academic progress.</p>
                    </div>
                    <Link to="/subjects" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[10px] bg-primary px-5 text-[0.84rem] font-bold text-white no-underline transition hover:bg-primary-dark hover:shadow-[0_8px_18px_rgba(18,143,150,0.2)]"><Plus size={16} strokeWidth={2.5} aria-hidden="true" />Add subject</Link>
                </section>

                <section className="mb-8 grid gap-4 sm:grid-cols-3" aria-label="Academic summary">
                    <div className="rounded-[18px] bg-primary-dark p-5 text-white shadow-[0_18px_45px_rgba(18,93,101,0.16)] sm:p-6">
                        <p className="m-0 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[#a6d9da]">Overall average</p>
                        <p className="m-0 mt-3 whitespace-nowrap font-serif text-[3.4rem] leading-none tracking-[-0.06em]">{average === null ? "—" : average}<span className="ml-1 text-[2.8rem] tracking-[-0.04em] text-[#8ee1df]">{average === null ? "" : "%"}</span></p>
                        <p className="m-0 mt-3 text-[0.8rem] text-[#c7e8e8]">Final grades appear after tasks are recorded</p>
                    </div>
                    <div className="rounded-[18px] border border-border bg-surface p-5 shadow-[0_12px_30px_rgba(18,93,101,0.06)] sm:p-6">
                        <p className="m-0 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-text-muted">Subjects tracked</p>
                        <p className="m-0 mt-3 font-serif text-[3.4rem] leading-none tracking-[-0.06em]">{subjects.length}</p>
                        <Link to="/subjects" className="m-0 mt-3 inline-flex items-center gap-1 text-[0.8rem] font-bold text-primary-dark no-underline hover:underline">View all subjects <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" /></Link>
                    </div>
                    <div className="rounded-[18px] border border-border bg-surface p-5 shadow-[0_12px_30px_rgba(18,93,101,0.06)] sm:p-6">
                        <p className="m-0 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-text-muted">Current focus</p>
                        <p className="m-0 mt-3 font-serif text-[1.75rem] leading-none tracking-[-0.04em]">{subjects[0]?.name ?? "—"}</p>
                        <p className="m-0 mt-3 text-[0.8rem] text-text-secondary">Your first subject is the current focus</p>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <section>
                        <div className="mb-4 flex items-end justify-between gap-4">
                            <div>
                                <h2 className="m-0 font-serif text-[1.7rem] font-normal">Your subjects</h2>
                                <p className="m-1 m-0 text-[0.82rem] text-text-secondary">Final grades based on your current marks.</p>
                            </div>
                            <span className="text-[0.75rem] font-bold uppercase tracking-[0.08em] text-text-muted">{subjects.length} active</span>
                        </div>
                        {error && <p className="rounded-[12px] border border-danger/20 bg-danger/5 p-4 text-sm text-danger">{error}</p>}
                        <div className="space-y-3">
                            {subjects.map((subject) => (
                                <article key={subject.name} className="flex items-center gap-4 rounded-[16px] border border-border bg-surface p-4 shadow-[0_10px_25px_rgba(18,93,101,0.05)] sm:p-5">
                                    <div className="h-12 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: subject.color }} />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <h3 className="m-0 font-serif text-[1.25rem] font-normal">{subject.name}</h3>
                                            <span className="text-[0.72rem] font-bold text-text-muted">{subject.categories.length} categories</span>
                                        </div>
                                        <p className="m-1 m-0 text-[0.78rem] text-text-secondary">{subject.teacher} · Grading system configured</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="m-0 font-serif text-[1.8rem] leading-none">—</p>
                                        <Link to="/tasks" className="mt-1 inline-flex items-center gap-1 text-[0.72rem] font-bold text-primary-dark no-underline hover:underline">View tasks <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" /></Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <aside className="h-fit rounded-[20px] border border-border bg-[#f8fffe] p-6">
                        <p className="mb-6 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-primary">Next step</p>
                        <h2 className="m-0 font-serif text-[1.8rem] font-normal leading-[1.05] tracking-[-0.04em]">Keep the picture current.</h2>
                        <p className="m-0 mt-4 text-[0.88rem] leading-[1.7] text-text-secondary">Add a recent mark to see how it changes your subject grade and overall average.</p>
                        <Link to="/tasks" className="mt-6 inline-flex items-center gap-2 rounded-[9px] border border-primary px-4 py-2.5 text-[0.8rem] font-bold text-primary-dark no-underline transition hover:bg-primary-light">Update a subject <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" /></Link>
                    </aside>
                </div>
            </div>
        </main>
    )
}
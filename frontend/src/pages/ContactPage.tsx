import { useState } from "react"
import type { FormEvent } from "react"
import { Bug, CheckCircle2, Send } from "lucide-react"
import { Topbar } from "../components/Topbar"

export function ContactPage() {
    const [email, setEmail] = useState("jane@example.com")
    const [page, setPage] = useState("Dashboard")
    const [description, setDescription] = useState("")
    const [sent, setSent] = useState(false)

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSent(true)
        setDescription("")
    }

    return (
        <main className="min-h-screen bg-[linear-gradient(135deg,#eefafa_0%,var(--plumarks-background)_52%,#f1f8f8_100%)] px-4 py-5 font-sans text-text sm:px-8 sm:py-8">
            <div className="mx-auto max-w-[1120px]">
                <Topbar />

                <div className="mx-auto grid max-w-[900px] gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <form onSubmit={handleSubmit} className="rounded-[22px] border border-border bg-surface p-5 shadow-[0_18px_50px_rgba(18,93,101,0.08)] sm:p-8">
                        <div className="mb-7 flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-primary-light text-primary-dark"><Bug size={22} aria-hidden="true" /></div>
                            <div><p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-primary">Developer contact</p><h1 className="m-0 font-serif text-[2.2rem] font-normal leading-none tracking-[-0.04em]">Report a bug</h1><p className="m-0 mt-2 text-[0.86rem] leading-[1.5] text-text-secondary">Tell us what happened so we can make PluMarks more reliable.</p></div>
                        </div>

                        <div className="space-y-5">
                            <div className="flex flex-col gap-2"><label className="text-[0.8rem] font-bold" htmlFor="bug-email">Your email</label><input id="bug-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="min-h-[48px] rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem] outline-none focus:border-primary" required /><p className="m-0 text-[0.72rem] text-text-muted">We will use this if the developers need more details.</p></div>
                            <div className="flex flex-col gap-2"><label className="text-[0.8rem] font-bold" htmlFor="bug-page">Where did it happen?</label><select id="bug-page" value={page} onChange={(event) => setPage(event.target.value)} className="min-h-[48px] rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem] outline-none focus:border-primary"><option>Dashboard</option><option>Subjects</option><option>Tasks</option><option>Profile</option><option>Other</option></select></div>
                            <div className="flex flex-col gap-2"><label className="text-[0.8rem] font-bold" htmlFor="bug-description">What went wrong?</label><textarea id="bug-description" value={description} onChange={(event) => { setDescription(event.target.value); setSent(false) }} placeholder="Describe what you expected and what you saw..." className="min-h-[150px] resize-y rounded-[10px] border border-border bg-[#fbfdfd] p-3 text-[0.9rem] outline-none focus:border-primary" required /></div>
                        </div>

                        <div className="mt-7 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="m-0 text-[0.75rem] text-text-muted">Please avoid including passwords or private information.</p><button type="submit" className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[10px] bg-primary px-5 text-[0.84rem] font-bold text-white transition hover:bg-primary-dark"><Send size={16} aria-hidden="true" />Send report</button></div>
                        {sent && <p className="mt-5 flex items-center justify-center gap-2 text-[0.82rem] font-bold text-success" role="status"><CheckCircle2 size={16} aria-hidden="true" />Thanks, your bug report is ready for the developers.</p>}
                    </form>

                    <aside className="h-fit rounded-[20px] border border-border bg-[#f8fffe] p-6"><p className="mb-5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-primary">Useful details</p><h2 className="m-0 font-serif text-[1.7rem] font-normal leading-[1.05]">A clear report helps us fix it faster.</h2><p className="m-0 mt-4 text-[0.86rem] leading-[1.7] text-text-secondary">Include the steps that led to the issue, what you expected to happen, and what happened instead.</p><div className="mt-6 border-t border-border pt-5 text-[0.78rem] leading-[1.6] text-text-muted">Reports from this screen can be connected to the developer support API when the backend is ready.</div></aside>
                </div>
            </div>
        </main>
    )
}
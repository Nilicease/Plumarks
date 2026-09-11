import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { useLogin } from "../hooks/useLogin";

export function LoginPage() {

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        await login();
    }

    const [
        email,
        setEmail,
        password,
        setPassword,
        error,
        login
    ] = useLogin()

    return (
        <main className="auth-layout grid min-h-screen grid-cols-[minmax(280px,0.85fr)_minmax(420px,1.15fr)] gap-6 bg-[linear-gradient(135deg,#eefafa_0%,var(--plumarks-background)_52%,#f1f8f8_100%)] p-6">
            <section className="auth-intro auth-intro-panel auth-reveal relative flex min-h-[640px] flex-col justify-between overflow-hidden rounded-[28px] bg-primary-dark p-[clamp(32px,5vw,72px)] text-white" aria-label="PluMarks introduction">
                <p className="relative z-10 m-0 text-[1.5rem] tracking-[0.02em]"><span className="text-[#8ee1df]">Plu</span>Marks</p>
                <div className="relative z-10 max-w-[480px]">
                    <h1 className="intro-title m-0 mb-5 text-[clamp(2.6rem,5vw,5rem)] font-normal leading-[0.98] tracking-[-0.04em]">Your progress,<br />in one place.</h1>
                    <p className="intro-description m-0 max-w-[360px] font-sans text-base leading-[1.7] text-[#c7e8e8]">Keep your grades organized, understand your progress, and make every study session count.</p>
                </div>
                <p className="intro-note relative z-10 m-0 font-sans text-[0.78rem] uppercase tracking-[0.08em] text-[#a6d9da]">A clearer way to track what matters</p>
            </section>
            <section className="auth-card-panel auth-reveal auth-reveal-delay my-auto w-full max-w-[560px] justify-self-center rounded-3xl border border-[rgba(226,232,240,0.9)] bg-surface p-[clamp(28px,5vw,56px)] shadow-[0_24px_70px_rgba(18,93,101,0.1)]">
                <header className="mb-8">
                    <h2 className="m-0 mb-2 text-[clamp(2rem,4vw,3rem)] font-normal tracking-[-0.04em]">Welcome back</h2>
                    <p className="m-0 font-sans text-[0.9rem] leading-[1.5] text-text-secondary">Sign in to pick up where you left off.</p>
                </header>
                <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
                    <div className="flex flex-col gap-2">
                        <label className="font-sans text-[0.82rem] font-bold" htmlFor="login-email">Email address</label>
                        <Input id="login-email" type="email" placeholder="you@example.com" required={true} value={email} onChange={(event) => setEmail(event.target.value)} />
                        <p className="m-0 min-h-[17px] font-sans text-[0.76rem] text-danger">{error}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-sans text-[0.82rem] font-bold" htmlFor="login-password">Password</label>
                        <Input id="login-password" type="password" placeholder="Enter your password" required={true} value={password} onChange={(event) => setPassword(event.target.value)} />
                    </div>
                    <Button placeholder="Sign in" />
                </form>
                <p className="m-0 mt-6 text-center font-sans text-[0.9rem] leading-[1.5] text-text-secondary">Don&apos;t have an account? <Link className="font-bold text-primary-dark no-underline hover:underline" to="/register">Create one</Link></p>
            </section>
        </main>
    )
}
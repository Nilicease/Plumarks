import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { DatePicker } from "../components/ui/DatePicker"
import { Input } from "../components/ui/Input"
import { useRegister } from "../hooks/useRegister";
import { getApiErrorMessage, registerUser } from "../services/authServices";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function RegisterPage() {
    const navigate = useNavigate();
    const [requestError, setRequestError] = useState("");

    const [
        email,
        setEmail,
        errorEmail,
        errorName,
        password,
        setPassword,
        errorPassword,
        name,
        setName,
        age,
        setAge,
        passwordconfirmed,
        setPasswordConfirmed,
        errorPasswordConfirmed,
        isValid,
        touched,
        touchField,
        university,
        setUniversity,
        errorUniversity,
        birthday,
        setBirthday,
        errorBirthday,
    ] = useRegister()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        (Object.keys(touched) as Array<keyof typeof touched>).forEach(touchField);

        if (!isValid) {
            return;
        }

        setRequestError("");
        const nameParts = name.trim().split(/\s+/);

        try {
            await registerUser({
                firstname: nameParts[0] ?? "",
                lastname: nameParts.slice(1).join(" ") || nameParts[0] || "",
                email: email.trim(),
                university: university.trim(),
                birthday,
                password,
                password_confirmation: passwordconfirmed,
            });

            navigate("/login");
        } catch (requestErrorValue) {
            setRequestError(getApiErrorMessage(requestErrorValue, "Unable to create your account."));
        }
    }

    return (
        <main className="auth-layout grid min-h-screen grid-cols-[minmax(280px,0.85fr)_minmax(420px,1.15fr)] gap-6 bg-[linear-gradient(135deg,#eefafa_0%,var(--plumarks-background)_52%,#f1f8f8_100%)] p-6">
            <section className="auth-intro auth-intro-panel auth-reveal relative flex min-h-[640px] flex-col justify-between overflow-hidden rounded-[28px] bg-primary-dark p-[clamp(32px,5vw,72px)] text-white" aria-label="PluMarks introduction">
                <p className="relative z-10 m-0 text-[1.5rem] tracking-[0.02em]"><span className="text-[#8ee1df]">Plu</span>Marks</p>
                <div className="relative z-10 max-w-[480px]">
                    <h1 className="intro-title m-0 mb-5 text-[clamp(2.6rem,5vw,5rem)] font-normal leading-[0.98] tracking-[-0.04em]">Make your<br />marks count.</h1>
                    <p className="intro-description m-0 max-w-[360px] font-sans text-base leading-[1.7] text-[#c7e8e8]">Build a simple view of your academic journey and turn small improvements into momentum.</p>
                </div>
                <p className="intro-note relative z-10 m-0 font-sans text-[0.78rem] uppercase tracking-[0.08em] text-[#a6d9da]">Start with a clearer picture</p>
            </section>
            <section className="auth-card-panel auth-reveal auth-reveal-delay my-auto w-full max-w-[560px] justify-self-center rounded-3xl border border-[rgba(226,232,240,0.9)] bg-surface p-[clamp(28px,5vw,56px)] shadow-[0_24px_70px_rgba(18,93,101,0.1)]">
                <header className="mb-8">
                    <h2 className="m-0 mb-2 text-[clamp(2rem,4vw,3rem)] font-normal tracking-[-0.04em]">Create your account</h2>
                    <p className="m-0 font-sans text-[0.9rem] leading-[1.5] text-text-secondary">A few details now, a better view of your progress later.</p>
                </header>
                <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
                    <div className="flex flex-col gap-2">
                        <label className="font-sans text-[0.82rem] font-bold" htmlFor="register-name">Full name</label>
                        <Input id="register-name" type="text" placeholder="Jane Doe" required={true} value={name} onChange={(event) => setName(event.target.value)} onBlur={() => touchField("name")} />
                        <p className="m-0 min-h-[17px] font-sans text-[0.76rem] text-danger">{touched.name ? errorName : ""}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-sans text-[0.82rem] font-bold" htmlFor="register-year">Date of birth</label>
                        <DatePicker onAgeChange={setAge} onDateChange={setBirthday} onBlur={() => { touchField("age"); touchField("birthday") }} />
                        <p className="m-0 min-h-[17px] font-sans text-[0.76rem] text-danger">{touched.age || touched.birthday ? (errorBirthday || (age <= 0 ? "Date of birth is required" : "")) : ""}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-sans text-[0.82rem] font-bold" htmlFor="register-university">University</label>
                        <Input id="register-university" type="text" placeholder="Your university" required={true} value={university} onChange={(event) => setUniversity(event.target.value)} onBlur={() => touchField("university")} />
                        <p className="m-0 min-h-[17px] font-sans text-[0.76rem] text-danger">{touched.university ? errorUniversity : ""}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-sans text-[0.82rem] font-bold" htmlFor="register-email">Email address</label>
                        <Input id="register-email" type="email" placeholder="you@example.com" required={true} value={email} onChange={(event) => setEmail(event.target.value)} onBlur={() => touchField("email")} />
                        <p className="m-0 min-h-[17px] font-sans text-[0.76rem] text-danger">{touched.email ? errorEmail : ""}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-sans text-[0.82rem] font-bold" htmlFor="register-password">Password</label>
                        <Input id="register-password" type="password" placeholder="At least 8 characters" required={true} value={password} onChange={(event) => setPassword(event.target.value)} onBlur={() => touchField("password")} />
                        <p className="m-0 min-h-[17px] font-sans text-[0.76rem] text-danger">{touched.password ? errorPassword : ""}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-sans text-[0.82rem] font-bold" htmlFor="register-confirm-password">Confirm password</label>
                        <Input id="register-confirm-password" type="password" placeholder="Repeat your password" required={true} value={passwordconfirmed} onChange={(event) => setPasswordConfirmed(event.target.value)} onBlur={() => touchField("passwordconfirmed")} />
                        <p className="m-0 min-h-[17px] font-sans text-[0.76rem] text-danger">{touched.passwordconfirmed ? errorPasswordConfirmed : ""}</p>
                    </div>
                    <Button placeholder="Create account" />
                    <p className="m-0 min-h-[17px] text-center font-sans text-[0.76rem] text-danger">{requestError}</p>
                </form>
                <p className="m-0 mt-6 text-center font-sans text-[0.9rem] leading-[1.5] text-text-secondary">Already have an account? <Link className="font-bold text-primary-dark no-underline hover:underline" to="/login">Sign in</Link></p>
            </section>
        </main>
    )
}
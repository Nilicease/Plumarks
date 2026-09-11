import { useEffect, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { ImagePlus } from "lucide-react"
import { Link } from "react-router-dom"
import { Topbar } from "../components/Topbar"
import { PageSkeleton } from "../components/ui/Skeleton"
import { useAsyncPageLoading } from "../hooks/useAsyncPageLoading"
import { getAuthenticatedUser, getApiErrorMessage } from "../services/authServices"
import { useSubjects } from "../hooks/useSubjects"

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("") || "P"
}

export function ProfilePage() {
    const isLoading = useAsyncPageLoading()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [userError, setUserError] = useState("")
    const { subjects } = useSubjects()
    const [imageError, setImageError] = useState("")
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        void getAuthenticatedUser().then((user) => {
            setName(`${user.firstname} ${user.lastname}`.trim())
            setEmail(user.email)
            setBirthDate(user.birthday)
        }).catch((error: unknown) => setUserError(getApiErrorMessage(error, "Unable to load your profile.")))
    }, [])

    if (isLoading) {
        return <main className="min-h-screen bg-[linear-gradient(135deg,#eefafa_0%,var(--plumarks-background)_52%,#f1f8f8_100%)] px-4 py-5 font-sans text-text sm:px-8 sm:py-8"><div className="mx-auto max-w-[1120px]"><Topbar /><PageSkeleton /></div></main>
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSaved(true)
        setCurrentPassword("")
        setNewPassword("")
    }

    function clearSaved() {
        setSaved(false)
    }

    function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) return
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setImageError("Please choose a JPG or PNG image.")
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            setProfileImage(String(reader.result))
            setImageError("")
            setSaved(false)
        }
        reader.readAsDataURL(file)
    }

    return (
        <main className="min-h-screen bg-[linear-gradient(135deg,#eefafa_0%,var(--plumarks-background)_52%,#f1f8f8_100%)] px-4 py-5 font-sans text-text sm:px-8 sm:py-8">
            <div className="mx-auto max-w-[1120px]">
                <Topbar />

                <div className="mb-8">
                    <p className="mb-2 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-primary">Account</p>
                    <h1 className="m-0 mb-2 font-serif text-[clamp(2.4rem,5vw,4rem)] font-normal leading-[1] tracking-[-0.04em]">Your profile</h1>
                    <p className="m-0 max-w-[600px] text-[0.95rem] leading-[1.6] text-text-secondary">Keep your details current so PluMarks feels like your own academic space.</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <form onSubmit={handleSubmit} onChange={clearSaved} className="rounded-[24px] border border-[rgba(226,232,240,0.9)] bg-surface p-5 shadow-[0_24px_70px_rgba(18,93,101,0.1)] sm:p-8">
                        <section className="border-b border-border pb-8">
                            <div className="mb-7 flex items-center gap-4">
                                <div className="relative h-16 w-16 shrink-0">
                                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary-dark font-serif text-[1.4rem] text-white" aria-label={`${name} profile image`}>{profileImage ? <img src={profileImage} alt={`${name} profile`} className="h-full w-full object-cover" /> : getInitials(name)}</div>
                                    <label htmlFor="profile-image" title="Upload profile image" className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-sm"><ImagePlus size={14} aria-hidden="true" /></label>
                                    <input id="profile-image" type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" onChange={handleImageChange} className="sr-only" />
                                </div>
                                <div>
                                    <h2 className="m-0 font-serif text-[1.55rem] font-normal">Personal details</h2>
                                    <p className="m-1 m-0 text-[0.82rem] text-text-secondary">This is how your account appears in PluMarks. JPG or PNG only.</p>
                                    {imageError && <p className="m-1 m-0 text-[0.76rem] text-danger" role="alert">{imageError}</p>}
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="flex flex-col gap-2 sm:col-span-2">
                                    <label className="text-[0.82rem] font-bold" htmlFor="profile-name">Full name</label>
                                    <input id="profile-name" className="min-h-[50px] w-full rounded-[10px] border border-border bg-[#fbfdfd] px-4 text-[0.95rem] outline-none transition focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_var(--plumarks-primary-light)]" value={name} onChange={(event) => setName(event.target.value)} required />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[0.82rem] font-bold" htmlFor="profile-email">Email address</label>
                                    <input id="profile-email" className="min-h-[50px] w-full rounded-[10px] border border-border bg-[#fbfdfd] px-4 text-[0.95rem] outline-none transition focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_var(--plumarks-primary-light)]" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[0.82rem] font-bold" htmlFor="profile-birth-date">Date of birth</label>
                                    <input id="profile-birth-date" className="min-h-[50px] w-full rounded-[10px] border border-border bg-[#fbfdfd] px-4 text-[0.95rem] outline-none transition focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_var(--plumarks-primary-light)]" type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} required />
                                </div>
                            </div>
                        </section>

                        <section className="pt-8">
                            <div className="mb-6">
                                <h2 className="m-0 font-serif text-[1.55rem] font-normal">Change password</h2>
                                <p className="m-1 m-0 text-[0.82rem] text-text-secondary">Leave these fields empty if you want to keep your current password.</p>
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[0.82rem] font-bold" htmlFor="current-password">Current password</label>
                                    <input id="current-password" className="min-h-[50px] w-full rounded-[10px] border border-border bg-[#fbfdfd] px-4 text-[0.95rem] outline-none transition focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_var(--plumarks-primary-light)]" type="password" placeholder="••••••••" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[0.82rem] font-bold" htmlFor="new-password">New password</label>
                                    <input id="new-password" className="min-h-[50px] w-full rounded-[10px] border border-border bg-[#fbfdfd] px-4 text-[0.95rem] outline-none transition focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_var(--plumarks-primary-light)]" type="password" placeholder="At least 8 characters" minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                                </div>
                            </div>
                        </section>

                        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-end">
                            {saved && <p className="m-0 text-center text-[0.82rem] font-bold text-success sm:mr-auto">Profile updated.</p>}
                            <button type="submit" className="min-h-[50px] rounded-[10px] bg-primary px-7 text-[0.88rem] font-bold text-white transition hover:bg-primary-dark">Save changes</button>
                        </div>
                    </form>

                    <aside className="h-fit rounded-[24px] bg-primary-dark p-6 text-white shadow-[0_18px_45px_rgba(18,93,101,0.18)] sm:p-7">
                        <p className="mb-7 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[#8ee1df]">Your progress</p>
                        <div className="mb-7 grid grid-cols-2 gap-3">
                            <div className="rounded-[12px] bg-white/10 p-4">
                                <p className="m-0 font-serif text-[2rem]">{subjects.length}</p>
                                <p className="m-1 m-0 text-[0.75rem] text-[#c7e8e8]">Subjects</p>
                            </div>
                            <div className="rounded-[12px] bg-white/10 p-4">
                                <p className="m-0 font-serif text-[2rem]">—</p>
                                <p className="m-1 m-0 text-[0.75rem] text-[#c7e8e8]">Average</p>
                            </div>
                        </div>
                        {userError && <p className="m-0 mb-3 text-[0.82rem] text-[#ffd2d2]">{userError}</p>}
                        <p className="m-0 text-[0.9rem] leading-[1.7] text-[#c7e8e8]">Your dashboard will start taking shape as you add subjects and record marks.</p>
                        <Link to="/subjects" className="mt-6 inline-block text-[0.82rem] font-bold text-white underline decoration-[#8ee1df] underline-offset-4">Set up your first subject</Link>
                    </aside>
                </div>
            </div>
        </main>
    )
}
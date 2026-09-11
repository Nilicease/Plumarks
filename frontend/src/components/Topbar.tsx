import { useEffect, useState } from "react"
import { NavLink, Link, useNavigate } from "react-router-dom"
import { BookOpen, Bug, ChevronDown, ClipboardList, LayoutDashboard, LogOut, Moon, Plus, Sun, UserRound } from "lucide-react"
import { logoutUser } from "../services/authServices"

const navItems = [
    { label: "Dashboard", to: "/", icon: LayoutDashboard },
    { label: "Subjects", to: "/subjects", icon: BookOpen },
    { label: "Add", to: "/subjects", icon: Plus, mobileOnly: true, addAction: true },
    { label: "Tasks", to: "/tasks", icon: ClipboardList },
    { label: "Profile", to: "/profile", icon: UserRound, mobileOnly: true, profileAction: true },
]

export function Topbar() {
    const navigate = useNavigate()
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("plumarks-theme") === "dark")
    const [profileImage] = useState<string | null>(null)

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode)
        localStorage.setItem("plumarks-theme", isDarkMode ? "dark" : "light")
    }, [isDarkMode])

    async function handleLogout() {
        setIsProfileMenuOpen(false)
        try {
            await logoutUser()
        } finally {
            localStorage.removeItem("plumarks-token")
        }
        navigate("/login")
    }

    return (
        <header className="mobile-topbar mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
            <Link to="/" className="topbar-brand text-[1.45rem] font-serif tracking-[0.02em] text-text no-underline"><span className="text-primary">Plu</span>Marks</Link>
            <nav aria-label="Main navigation" className="mobile-nav order-3 flex w-full items-center gap-1 sm:order-2 sm:w-auto">
                {navItems.map((item) => item.addAction ? <div key={item.label} className="add-nav-item mobile-add-nav mobile-nav-item relative flex items-center gap-1.5 rounded-[8px] px-3 py-2 text-[0.78rem] font-bold no-underline transition">
                    <button type="button" aria-label="Add subject or task" aria-expanded={isAddMenuOpen} onClick={() => setIsAddMenuOpen((current) => !current)} className="flex flex-col items-center justify-center gap-1 text-white sm:flex-row"><item.icon size={18} strokeWidth={2.4} aria-hidden="true" /><span>{item.label}</span></button>
                    {isAddMenuOpen && <div className="mobile-add-menu absolute bottom-[calc(100%+10px)] left-1/2 w-36 -translate-x-1/2 rounded-[14px] border border-border bg-surface p-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.2)]">
                        <button type="button" onClick={() => { setIsAddMenuOpen(false); navigate("/subjects") }} className="flex w-full items-center gap-2 rounded-[9px] px-3 py-2.5 text-left text-[0.78rem] font-bold text-text-secondary hover:bg-primary-light hover:text-primary-dark"><BookOpen size={15} aria-hidden="true" />Subject</button>
                        <button type="button" onClick={() => { setIsAddMenuOpen(false); navigate("/tasks") }} className="flex w-full items-center gap-2 rounded-[9px] px-3 py-2.5 text-left text-[0.78rem] font-bold text-text-secondary hover:bg-primary-light hover:text-primary-dark"><ClipboardList size={15} aria-hidden="true" />Task</button>
                    </div>}
                </div> : item.profileAction ? <div key={item.label} className="mobile-profile-nav mobile-only-nav mobile-nav-item relative flex items-center justify-center">
                    <button type="button" aria-label="Open profile menu" aria-expanded={isProfileMenuOpen} onClick={() => setIsProfileMenuOpen((current) => !current)} className="flex flex-col items-center justify-center gap-1 text-[0.65rem] font-bold text-text-secondary"><span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary-dark text-white">{profileImage ? <img src={profileImage} alt="Profile" className="h-full w-full object-cover" /> : <UserRound size={16} aria-hidden="true" />}</span><span>Profile</span></button>
                    {isProfileMenuOpen && <div className="mobile-profile-menu absolute bottom-[calc(100%+10px)] right-0 w-44 rounded-[14px] border border-border bg-surface p-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.2)]">
                        <Link to="/profile" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-2 rounded-[9px] px-3 py-2.5 text-[0.78rem] font-bold text-text-secondary no-underline hover:bg-primary-light hover:text-primary-dark"><UserRound size={15} aria-hidden="true" />Profile page</Link>
                        <Link to="/contact" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-2 rounded-[9px] px-3 py-2.5 text-[0.78rem] font-bold text-text-secondary no-underline hover:bg-primary-light hover:text-primary-dark"><Bug size={15} aria-hidden="true" />Report a bug</Link>
                        <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-[9px] px-3 py-2.5 text-[0.78rem] font-bold text-danger hover:bg-[#feeceb]"><LogOut size={15} aria-hidden="true" />Logout</button>
                    </div>}
                </div> : <NavLink key={item.label} to={item.to} end={item.to === "/"} className={({ isActive }) => `mobile-nav-item ${item.mobileOnly ? "mobile-only-nav" : ""} flex items-center gap-1.5 rounded-[8px] px-3 py-2 text-[0.78rem] font-bold no-underline transition ${isActive ? "bg-primary-light text-primary-dark" : "text-text-secondary hover:bg-white hover:text-primary-dark"}`}>
                    <item.icon size={15} strokeWidth={2.2} aria-hidden="true" />
                    {item.label}
                </NavLink>)}
            </nav>
            <div className="flex items-center gap-2 sm:order-3">
                <button type="button" aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"} title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setIsDarkMode((current) => !current)} className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition hover:border-primary hover:text-primary"><span className="sr-only">{isDarkMode ? "Switch to light mode" : "Switch to dark mode"}</span>{isDarkMode ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}</button>
                <div className="relative">
                <button type="button" aria-label="Open profile menu" aria-expanded={isProfileMenuOpen} title="Profile menu" onClick={() => setIsProfileMenuOpen((current) => !current)} className="flex h-10 items-center gap-1.5 rounded-full bg-primary-dark pl-1 pr-2 text-white transition hover:bg-primary"><span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary-light text-primary-dark">{profileImage ? <img src={profileImage} alt="Profile" className="h-full w-full object-cover" /> : <UserRound size={17} strokeWidth={2} aria-hidden="true" />}</span><ChevronDown size={14} className={`transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`} aria-hidden="true" /></button>
                {isProfileMenuOpen && <div className="absolute right-0 top-12 z-50 w-44 rounded-[12px] border border-border bg-white p-1.5 shadow-[0_14px_35px_rgba(15,23,42,0.15)]" role="menu">
                    <Link to="/profile" role="menuitem" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-2 rounded-[8px] px-3 py-2.5 text-[0.8rem] font-bold text-text-secondary no-underline hover:bg-primary-light hover:text-primary-dark"><UserRound size={15} aria-hidden="true" />Profile</Link>
                    <Link to="/contact" role="menuitem" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-2 rounded-[8px] px-3 py-2.5 text-[0.8rem] font-bold text-text-secondary no-underline hover:bg-primary-light hover:text-primary-dark"><Bug size={15} aria-hidden="true" />Report a bug</Link>
                    <button type="button" role="menuitem" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2.5 text-[0.8rem] font-bold text-danger hover:bg-[#feeceb]"><LogOut size={15} aria-hidden="true" />Logout</button>
                </div>}
                </div>
            </div>
        </header>
    )
}
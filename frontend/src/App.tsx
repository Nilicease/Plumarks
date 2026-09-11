import { BrowserRouter, Routes, Route } from "react-router-dom"
import type { ReactElement } from "react"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { SubjectSetupPage } from "./pages/SubjectSetupPage"
import { ProfilePage } from "./pages/ProfilePage"
import { DashboardPage } from "./pages/DashboardPage"
import { TasksPage } from "./pages/SubjectsPage"
import { SubjectsPage } from "./pages/SubjectsDirectoryPage"
import { ContactPage } from "./pages/ContactPage"
import { ProtectedRoute } from "./components/common/ProtectedRoute"

function protectedPage(element: ReactElement) {
    return <ProtectedRoute>{element}</ProtectedRoute>
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={protectedPage(<DashboardPage />)} />
                <Route path="/subjects" element={protectedPage(<SubjectsPage />)} />
                <Route path="/tasks" element={protectedPage(<TasksPage />)} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />}/>
                <Route path="/subjects/new" element={protectedPage(<SubjectSetupPage />)} />
                <Route path="/profile" element={protectedPage(<ProfilePage />)} />
                <Route path="/contact" element={protectedPage(<ContactPage />)} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
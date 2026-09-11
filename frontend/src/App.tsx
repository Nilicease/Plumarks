import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { SubjectSetupPage } from "./pages/SubjectSetupPage"
import { ProfilePage } from "./pages/ProfilePage"
import { DashboardPage } from "./pages/DashboardPage"
import { TasksPage } from "./pages/SubjectsPage"
import { SubjectsPage } from "./pages/SubjectsDirectoryPage"
import { ContactPage } from "./pages/ContactPage"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/subjects" element={<SubjectsPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />}/>
                <Route path="/subjects/new" element={<SubjectSetupPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/contact" element={<ContactPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
import api from "../api/api"
import type { User } from "../types/auth"

export type BugReport = { id: number; email: string; page: string; description: string; resolved_at: string | null; created_at: string; user?: { firstname: string; lastname: string } }

export async function getAdminUsers(): Promise<User[]> {
    return (await api.get<{ data: User[] }>("/api/admin/users")).data.data
}

export async function setUserBlocked(id: number, isBlocked: boolean): Promise<User> {
    return (await api.patch<{ data: User }>(`/api/admin/users/${id}/blocked`, { is_blocked: isBlocked })).data.data
}

export async function getBugReports(): Promise<BugReport[]> {
    return (await api.get<{ data: BugReport[] }>("/api/admin/reports")).data.data
}

export async function resolveBugReport(id: number): Promise<void> {
    await api.patch(`/api/admin/reports/${id}/resolve`)
}

export async function submitBugReport(data: { email: string; page: string; description: string }): Promise<void> {
    await api.post("/api/reports", data)
}

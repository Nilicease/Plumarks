import api from "../api/api"
import type { DashboardData } from "../types/academic"

type DashboardResponse = {
    data: DashboardData
}

export async function getDashboard(): Promise<DashboardData> {
    const response = await api.get<DashboardResponse>("/api/dashboard")

    return response.data.data
}

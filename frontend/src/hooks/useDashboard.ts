import { useCallback, useEffect, useState } from "react"
import { getApiErrorMessage } from "../services/authServices"
import { getDashboard } from "../services/dashboardServices"
import type { DashboardData } from "../types/academic"

export function useDashboard() {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    const loadDashboard = useCallback(async () => {
        try {
            const response = await getDashboard()
            setDashboard(response)
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to load your academic overview."))
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const loadAfterMount = window.setTimeout(() => {
            void loadDashboard()
        }, 0)

        return () => window.clearTimeout(loadAfterMount)
    }, [loadDashboard])

    return { dashboard, isLoading, error, reload: loadDashboard }
}

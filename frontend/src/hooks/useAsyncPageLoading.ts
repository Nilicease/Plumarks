import { useEffect, useState } from "react"

export function useAsyncPageLoading() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        async function loadPage() {
            // Replace this boundary with the page's API request when connected.
            await Promise.resolve()
            if (isMounted) setIsLoading(false)
        }

        void loadPage()
        return () => {
            isMounted = false
        }
    }, [])

    return isLoading
}
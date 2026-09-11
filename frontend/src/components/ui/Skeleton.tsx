export function Skeleton({ className = "" }: { className?: string }) {
    return <span aria-hidden="true" className={`skeleton block rounded-[8px] bg-border/60 ${className}`} />
}

export function PageSkeleton() {
    return (
        <div className="space-y-6" aria-label="Loading page" role="status">
            <div className="grid gap-4 sm:grid-cols-3">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
    )
}
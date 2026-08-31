export function Link({destination, title}: {destination: string, title: string}) {
    return (
        <a className="text-primary underline italic hover:text-text-muted"
        href={destination}>
            {title}
        </a>
    )
}
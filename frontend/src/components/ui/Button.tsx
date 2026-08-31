export function Button({placeholder}: {placeholder: string}) {
    return (
        <button className="bg-primary font-bold text-background w-90 h-10 rounded-lg hover:cursor-pointer"
        >
            {placeholder}
            
        </button>
    )
}
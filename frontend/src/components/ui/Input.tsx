export function Input({type, placeholder, required}: {type: string, placeholder: string, required: boolean}) {
    return (
        <input className="p-4 m-2 w-100 rounded-4xl shadow-lg"
        type={type}
        placeholder={placeholder}
        required={required}
        />
    )
}
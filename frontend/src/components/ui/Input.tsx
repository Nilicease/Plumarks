import type { ChangeEvent } from "react";

export function Input({type, placeholder, required, value, onChange}: {type: string, placeholder: string, required: boolean, value: string, onChange: (event: ChangeEvent<HTMLInputElement>) => void}) {
    return (
        <input className="p-4 m-2 w-100 rounded-4xl shadow-lg"
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        />
    )
}
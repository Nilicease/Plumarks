import type { ButtonHTMLAttributes } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    placeholder: string
}

export function Button({ placeholder, className = "", type = "submit", ...props }: ButtonProps) {
    return (
        <button className={`mt-1 min-h-[52px] w-full rounded-[10px] border-0 bg-primary text-[0.9rem] font-bold text-white transition duration-150 hover:-translate-y-px hover:bg-primary-dark hover:shadow-[0_8px_18px_rgba(18,143,150,0.2)] focus-visible:outline-3 focus-visible:outline-primary-light focus-visible:outline-offset-2 ${className}`} type={type} {...props}
        >
            {placeholder}
            
        </button>
    )
}
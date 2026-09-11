import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className = "", ...props }: InputProps) {
    return (
        <input className={`w-full min-h-[50px] rounded-[10px] border border-border bg-[#fbfdfd] px-[15px] text-[0.95rem] text-text outline-none transition duration-150 placeholder:text-text-muted focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_var(--plumarks-primary-light)] ${className}`}
        {...props}
        />
    )
}
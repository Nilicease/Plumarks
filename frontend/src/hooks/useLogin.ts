import { useState } from "react";

export function useLogin() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassowrd] = useState<string>("");

    const error =
        email !== "" && !email.includes("@")
            ? "Please include your email '@'"
            : "";

    return [
        email,
        setEmail,
        password,
        setPassowrd,
        error
    ] as const

}
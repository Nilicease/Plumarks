import { useState } from "react";
import { loginUser } from "../services/authServices";

export function useLogin() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const emailError =
        email !== "" && !email.includes("@")
            ? "Please include your email '@'"
            : "";

    async function login() {
        if (emailError) {
            setError(emailError);
            return;
        }
        const data = await loginUser(
            email,
            password,
        );

        console.log(data);
    }

    return [
        email,
        setEmail,
        password,
        setPassword,
        error,
        login,
    ] as const;
}
import { useState } from "react";

export function useRegister() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [age, setAge] = useState<number>(0);
    const [passwordconfirmed, setPasswordConfirmed] = useState<string>("");

    const errorEmail =
        email !== "" && !email.includes("@")
            ? "Please include your email '@'"
            : "";
    const errorPasswordConfirmed: string = passwordconfirmed === password ? "Password Confirm not match" : ""

    let errorPassword: string;

    if (password.length < 8) {
        errorPassword = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
        errorPassword = "Password must have one uppercase letter";
    } else {
        errorPassword = "";
    }

    return [
        email,
        setEmail,
        errorEmail,
        password,
        setPassword,
        errorPassword,
        name,
        setName,
        age,
        setAge,
        passwordconfirmed,
        setPasswordConfirmed,
        errorPasswordConfirmed,
    ] as const

}
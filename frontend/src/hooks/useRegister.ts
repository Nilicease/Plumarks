import { useState } from "react";

type RegisterField = "name" | "age" | "email" | "password" | "passwordconfirmed";

export function useRegister() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [age, setAge] = useState<number>(0);
    const [passwordconfirmed, setPasswordConfirmed] = useState<string>("");
    const [touched, setTouched] = useState<Record<RegisterField, boolean>>({
        name: false,
        age: false,
        email: false,
        password: false,
        passwordconfirmed: false,
    });

    function touchField(field: RegisterField) {
        setTouched((current) => ({ ...current, [field]: true }));
    }

    const errorName = name.trim() === "" ? "Name is required" : "";
    const errorAge = age <= 0 ? "Date of birth is required" : "";
    const errorEmail = email !== "" && !email.includes("@")
        ? "Please include '@' in your email"
        : "";
    const errorPassword = password.length === 0
        ? "Password is required"
        : password.length < 8
            ? "Password must be at least 8 characters"
            : !/[A-Z]/.test(password)
                ? "Password must have one uppercase letter"
                : "";
    const errorPasswordConfirmed = passwordconfirmed === ""
        ? "Please confirm your password"
        : passwordconfirmed !== password
            ? "Passwords do not match"
            : "";

    const isValid = [
        errorName,
        errorAge,
        errorEmail,
        errorPassword,
        errorPasswordConfirmed,
    ].every((error) => error === "") && email.includes("@");

    return [
        email,
        setEmail,
        errorEmail,
        errorName,
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
        isValid,
        touched,
        touchField,
    ] as const

}
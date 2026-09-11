import { useState } from "react";

type RegisterField = "name" | "age" | "email" | "password" | "passwordconfirmed" | "university" | "birthday";

export function useRegister() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [age, setAge] = useState<number>(0);
    const [passwordconfirmed, setPasswordConfirmed] = useState<string>("");
    const [university, setUniversity] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [touched, setTouched] = useState<Record<RegisterField, boolean>>({
        name: false,
        age: false,
        email: false,
        password: false,
        passwordconfirmed: false,
        university: false,
        birthday: false,
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

    const errorUniversity = university.trim() === "" ? "University is required" : "";
    const errorBirthday = birthday === "" ? "Date of birth is required" : "";
    const isValid = [
        errorName,
        errorAge,
        errorEmail,
        errorPassword,
        errorPasswordConfirmed,
        errorUniversity,
        errorBirthday,
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
        university,
        setUniversity,
        errorUniversity,
        birthday,
        setBirthday,
        errorBirthday,
    ] as const

}
import { useState } from "react";
import { getApiErrorMessage, loginUser } from "../services/authServices";
import { useNavigate } from "react-router-dom";

export function useLogin() {
    const navigate = useNavigate();
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
        setError("");

        try {
            const response = await loginUser(email.trim(), password);
            localStorage.setItem("plumarks-token", response.data.token);
            navigate("/");
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to sign in. Please check your details."));
        }
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
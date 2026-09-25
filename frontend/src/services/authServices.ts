import api from "../api/api";
import type { AuthResponse, RegisterPayload, User } from "../types/auth";

export async function loginUser(
    email: string,
    password: string
): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/api/login", {
        email,
        password,
    });
    return response.data;
}

export async function registerUser(payload: RegisterPayload): Promise<User> {
    const response = await api.post<{ data: User }>("/api/register", payload);
    return response.data.data;
}

export async function logoutUser(): Promise<void> {
    await api.post("/api/logout");
}

export async function getAuthenticatedUser(): Promise<User> {
    const response = await api.get<{ data: User }>("/api/user");
    return response.data.data;
}

export async function changePassword(currentPassword: string, password: string): Promise<void> {
    await api.put("/api/password", {
        current_password: currentPassword,
        password,
        password_confirmation: password,
    });
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === "object" && error !== null && "response" in error) {
        const response = (error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }).response;
        const validationMessage = response?.data?.errors
            ? Object.values(response.data.errors).flat()[0]
            : undefined;

        return validationMessage ?? response?.data?.message ?? fallback;
    }

    return fallback;
}

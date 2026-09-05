import api from "../api/api";

export async function loginUser(
    email: string,
    password: string
    ) {

    const response = await api.post("/api/loginUser", {
        email,
        password,
    });

    return response.data;
}
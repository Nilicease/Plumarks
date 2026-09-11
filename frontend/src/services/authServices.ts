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

export async function RegisterUser(
    name: string,
    age: number,
    email: string,
    password: string,
    passwordconfirmed: string,
    ) {

    const response = await api.post("/api/createUsercd", {
        name,
        age,
        email,
        password,
        passwordconfirmed,
    });

    return response.data;
}
export type User = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    university: string;
    birthday: string;
};

export type AuthResponse = {
    message: string;
    data: {
        user: User;
        token: string;
    };
};

export type RegisterPayload = {
    firstname: string;
    lastname: string;
    email: string;
    university: string;
    birthday: string;
    password: string;
    password_confirmation: string;
};
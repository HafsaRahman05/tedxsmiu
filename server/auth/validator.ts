import * as z from "zod";

const SignUpValidator = z.object({
    email: z.email("Invalid Email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    name: z.string().min(2, "Name must be at least 2 characters long"),
});

const SignInValidator = z.object({
    email: z.email("Invalid Email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const validateSignUp = (data: SignUpType) => {
    return SignUpValidator.safeParse(data);
};

export const validateSignIn = (data: SignInType) => {
    return SignInValidator.safeParse(data);
};

export type SignUpType = z.infer<typeof SignUpValidator>;
export type SignInType = z.infer<typeof SignInValidator>;
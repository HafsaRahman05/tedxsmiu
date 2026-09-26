"use server";

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { SignInType, SignUpType, validateSignIn, validateSignUp } from "./validator";

export const getCurrentSession = async () => {
    return await auth.api.getSession({
        headers: await headers()
    });
};

export const loginWithEmail = async (user: SignInType) => {
    const validator = validateSignIn(user);

    if (!validator.success) {
        return validator.error.issues.map((issue) => issue.message);
    }

    return await auth.api.signInEmail({
        body: {
            email: user.email,
            password: user.password,
        }
    });
}

export const signUpWithEmail = async (user: SignUpType) => {
    const validator = validateSignUp(user);

    if (!validator.success) {
        return validator.error.issues.map((issue) => issue.message);
    }

    return await auth.api.signUpEmail({
        body: {
            email: user.email,
            password: user.password,
            name: user.name,
        }
    });
}

export const logout = async () => {
    return await auth.api.signOut({
        headers: await headers()
    });
}
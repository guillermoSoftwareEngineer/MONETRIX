"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchAPI } from "../lib/api";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    email: string;
    fullName: string;
    level: number;
    xp: number;
    medals: string; // JSON string
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    register: (fullName: string, email: string, pass: string) => Promise<void>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                try {
                    // Verify token with backend
                    const userData = await fetchAPI("/users/profile");
                    setToken(storedToken);
                    setUser(userData);
                    localStorage.setItem("user", JSON.stringify(userData));
                } catch (error: any) {
                    console.error("Session expired or invalid:", error);
                    logout();
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email: string, pass: string) => {
        try {
            const data = await fetchAPI("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password: pass }),
            });

            const { access_token, user } = data;
            setToken(access_token);
            setUser(user);

            localStorage.setItem("token", access_token);
            localStorage.setItem("user", JSON.stringify(user));

            router.push("/");
        } catch (error) {
            throw error;
        }
    };

    const register = async (fullName: string, email: string, pass: string) => {
        try {
            await fetchAPI("/auth/register", {
                method: "POST",
                body: JSON.stringify({ fullName, email, password: pass }),
            });
            // Auto login after register
            await login(email, pass);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
    };

    const refreshProfile = async () => {
        try {
            const userData = await fetchAPI("/users/profile");
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
            console.error("Error refreshing profile:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

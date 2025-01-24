'use client'
import { getUser } from "@/service/userService";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [isError, setIsError] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedAccounts = localStorage.getItem('accounts');

        if (storedToken) {
            setToken(storedToken);
        }
        if (storedRefreshToken) {
            setRefreshToken(storedRefreshToken);
        }
        if (storedAccounts?.length > 0) {
            setAccounts(JSON.parse(storedAccounts));
        }
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    useEffect(() => {
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        } else {
            localStorage.removeItem('refreshToken');
        }
    }, [refreshToken]);

    useEffect(() => {
        if (accounts.length > 0) {
            localStorage.setItem('accounts', JSON.stringify(accounts));
        } else {
            localStorage.removeItem('accounts');
        }
    }, [accounts]);

    const addAccount = (token, refresh_token, email) => {
        setAccounts(prevAccounts => {
            const accountIndex = prevAccounts.findIndex(account => account.email === email);
            if (accountIndex !== -1) {
                const updatedAccounts = [...prevAccounts];
                updatedAccounts[accountIndex] = { token, refresh_token, email };
                return updatedAccounts;
            } else {
                return [...prevAccounts, { token, refresh_token, email }];
            }
        });
    }

    const removeAccount = (token) => {
        setAccounts(prevAccounts => {
            const updatedAccounts = prevAccounts.filter(account => account.token !== token);
            if (prevAccounts.length > 0 && prevAccounts[0].token === token) {
                // Se a conta principal está sendo removida, substitua pelos dados de qualquer outra conta
                if (updatedAccounts.length > 0) {
                    const randomIndex = Math.floor(Math.random() * updatedAccounts.length);
                    const nextAccount = updatedAccounts[randomIndex];
                    setToken(nextAccount.token);
                    setRefreshToken(nextAccount.refresh_token);
                } else {
                    setToken(null);
                    setRefreshToken(null);
                }
            }
            return updatedAccounts;
        });
    }

    const setAsPrimaryAccount = (token, refresh_token) => {
        setToken(token);
        setRefreshToken(refresh_token);
    }

    useEffect(() => {
        const checkTokenValidity = async () => {
            if (token) {
                try {
                    const response = await getUser(token);
                    if (response.status === 401) {
                        setToken(null);
                        setIsError(true);
                        router.push('/access');
                    }
                } catch (error) {
                    console.error("Erro ao verificar o token:", error);
                    setIsError(true);
                    setToken(null);
                    router.push('/access');
                }
            }
        };

        checkTokenValidity();
    }, [token, router]);

    return (
        <AuthContext.Provider value={{ token, setToken, refreshToken, setRefreshToken, accounts, setAccounts, isError, setIsError, addAccount, removeAccount, setAsPrimaryAccount }}>
            {children}
        </AuthContext.Provider>
    );
}
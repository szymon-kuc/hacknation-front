'use client'
import {createContext, useContext, useState} from "react";

// Tworzymy interfejs dla kontekstu
interface AuthContextType {
    isAuthenticated: boolean;
    login: (id: number) => void;
    logout: () => void;
    userId: number;
}

// Tworzymy kontekst z domyślną wartością
const AuthContext = createContext<AuthContextType | null>(null);

// Hook do łatwego dostępu do kontekstu
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// Provider dla kontekstu autoryzacji
export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userId, setUserId] = useState<number>(0);

    const login = (id: number) => {
        setIsAuthenticated(true)
        setUserId(id);
    };
    const logout = () => setIsAuthenticated(false);

    return (
        <AuthContext.Provider value={{isAuthenticated, userId, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

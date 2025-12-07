'use client'
import {createContext, useContext, useState} from "react";

interface IUser {
    id: number;
    name: string;
    email: string;
    surname: string;
    voivodeship: string;
    organization: string;
    city: string;
}
// Tworzymy interfejs dla kontekstu
interface AuthContextType {
    isAuthenticated: boolean;
    login: (user: IUser) => void;
    logout: () => void;
    user: IUser;
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
    const [user, setUser] = useState<IUser>({id: 0, city: "", email: "", surname: "", name: "", organization: "", voivodeship: ""});

    const login = (user: IUser) => {
        setIsAuthenticated(true)
        setUser(user);
    };
    const logout = () => setIsAuthenticated(false);

    return (
        <AuthContext.Provider value={{isAuthenticated, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

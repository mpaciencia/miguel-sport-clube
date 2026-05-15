import { createContext, useState } from "react";

/* eslint-disable react-refresh/only-export-components */
// criar a nuvem
export const AuthContext = createContext();
// fornecedor q envolve o site todo
export const AuthProvider = ({ children }) => {
    // variaveis de estado q guarda quem está logado, começa vazia
    const[user, setUser] = useState(null);
    const fazerLogin = (dadosUtilizador) => {
        setUser(dadosUtilizador);
    };

    const fazerLogout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, fazerLogin, fazerLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
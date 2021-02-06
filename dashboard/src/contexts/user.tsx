import React from "react";

import Api from "../api/index";

import { User } from "../api/models";

const UserContext = React.createContext<UserProviderI | null>(null);

interface UserProviderI {
    login  : (user: User, token: string) => void;
    logout : () => void;
    user   : User | null;
}

const UserProvider: React.FC = (props) => {
    const [user, setUser] = React.useState<User | null>(() => {
        const user = window.localStorage.getItem("user");
        return user ? JSON.parse(user) : user;
    });

    const context = React.useMemo(() => {
        const login = (user: User, token: string) => {
            setUser(user);
            window.localStorage.setItem("user", JSON.stringify(user));
            window.localStorage.setItem("token", token);
            Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        };

        const logout = () => {
            setUser(null);
            window.localStorage.removeItem("user");
            window.localStorage.removeItem("token");
            delete Api.defaults.headers.common["Authorization"];
        };

        return { login, logout };
    }, []);


    return <UserContext.Provider value={{ ...context, user }} { ...props } />;
};

function useUser() {
    const context = React.useContext(UserContext);

    if (!context)
        throw new Error("useUser must be used as a child of UserProvider");

    return context;
}

export {
    UserProvider,
    useUser,
};

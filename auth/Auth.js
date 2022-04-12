import React, { useState, createContext } from 'react';
export const AuthContext = createContext({});

export const Auth = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

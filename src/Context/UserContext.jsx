import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) return;

            const parsedUser = JSON.parse(storedUser);

            // ✅ CHỐT AN TOÀN
            if (parsedUser && typeof parsedUser === 'object' && parsedUser.id) {
                setUser(parsedUser);
            } else {
                localStorage.removeItem('user');
                setUser(null);
            }
        } catch (err) {
            localStorage.removeItem('user');
            setUser(null);
        }
    }, []);

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

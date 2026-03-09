import { createContext, useState, useEffect } from 'react';
import getCookie from '../utils/getToken';

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const token = getCookie('token');

            if (storedUser && token) {
                const parsedUser = JSON.parse(storedUser);

                // ✅ CHECK ĐÚNG KEY
                if (parsedUser?.id_user) {
                    setUser(parsedUser);
                } else {
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (err) {
            localStorage.removeItem('user');
            setUser(null);
        }

        // 🔥 BẮT BUỘC
        setInitialized(true);
    }, []);

    return <UserContext.Provider value={{ user, setUser, initialized }}>{children}</UserContext.Provider>;
}

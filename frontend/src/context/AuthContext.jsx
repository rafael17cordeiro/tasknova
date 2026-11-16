import { useState } from 'react';
import api from '../api/axios';
import { AuthContext } from './authContext';

// Lê o utilizador guardado, com proteção contra dados corrompidos
const loadStoredUser = () => {
    try {
        const stored = localStorage.getItem('tasknova_user');
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(loadStoredUser);

    const saveSession = ({ user, token }) => {
        localStorage.setItem('tasknova_token', token);
        localStorage.setItem('tasknova_user', JSON.stringify(user));
        setUser(user);
    };

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        saveSession(data);
    };

    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        saveSession(data);
    };

    const logout = () => {
        localStorage.removeItem('tasknova_token');
        localStorage.removeItem('tasknova_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
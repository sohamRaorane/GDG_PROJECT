import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
    type User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    sendEmailVerification,
    updateProfile
} from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { auth } from '../firebase';
import { createUserProfile } from '../services/db';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    sendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (email: string, password: string, name: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: name
            });

            // Create User Profile in Firestore
            await createUserProfile({
                uid: userCredential.user.uid,
                email: email,
                displayName: name,
                role: 'customer',
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });

            await sendEmailVerification(userCredential.user);
        } catch (error) {
            console.error("Signup failed", error);
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed", error);
            throw error;
        }
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Google Sign In failed", error);
            throw error;
        }
    };

    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error("Password reset failed", error);
            throw error;
        }
    };

    const sendVerificationEmail = async () => {
        if (currentUser) {
            try {
                await sendEmailVerification(currentUser);
            } catch (error) {
                console.error("Email verification failed", error);
                throw error;
            }
        }
    };

    const value = {
        currentUser,
        loading,
        login,
        signup,
        logout,
        signInWithGoogle,
        resetPassword,
        sendVerificationEmail
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

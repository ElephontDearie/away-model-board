'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    getAuth,
    User,
    IdTokenResult,
} from 'firebase/auth';
import firebase_app from '../firebase/firebase_config'

interface Props {
    children: React.ReactNode;
}

const auth = getAuth(firebase_app);

type GivenContext = {
    user: User | null;
    isAdmin: boolean;
    refreshedIdToken: IdTokenResult | undefined;
}

export const AuthContext = createContext<GivenContext>({
    user: null,
    isAdmin: false,
    refreshedIdToken: undefined
})


export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({children}: Props) => {
    const [user, setUser] = useState<User | null>(null);
    const [givenContext, setGivenContext] = useState<GivenContext>({
        user: null,
        isAdmin: false,
        refreshedIdToken: undefined
    })
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async authUser => {
            setUser(authUser);
            const idToken = await authUser?.getIdTokenResult(true);
            const isAdmin = await idToken?.claims['admin'] == true;
            setGivenContext({
                user: authUser,
                isAdmin,
                refreshedIdToken: idToken
            })
        })
        return unsubscribe;
    }, [user]);

    return (
        <AuthContext.Provider value={givenContext}>
            {children}
        </AuthContext.Provider>
    );
};

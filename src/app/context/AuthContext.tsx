'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    getAuth,
    User,
    signOut,
    IdTokenResult
} from 'firebase/auth';
import firebase_app from '../firebase/firebase_config'

interface Props {
    children: React.ReactNode;
}

const auth = getAuth(firebase_app);

// export const AuthContext = createContext({});
export const AuthContext = createContext<User | null>(null);


export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({children}: Props) => {
    const [user, setUser] = useState<User | null>(null);
    // const [isAdmin, setIsAdmin] = useState<boolean>(false);
    // const [idToken, setIdToken] = useState<IdTokenResult | undefined>(undefined);
    // const [loading, setLoading] = useState<boolean>(true);

    // const logout = async () => {
    //     await signOut(auth);
    //     setUser(null);
    // };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            setUser(user);
            // const idToken = await user.getIdTokenResult(true);
            // setIdToken(idToken);
        })
        return unsubscribe;
        // const unsubscribe = onAuthStateChanged(auth, (user) => {
        //     if (user) {
        //         setUser(user);
        //     } else {
        //         setUser(null);
        //     }
        //     setLoading(false);
        // });

        // return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={user}>
            {children}
            {/* {loading ? <div>Loading...</div> : children} */}
        </AuthContext.Provider>
    );
};

import React, { useEffect, useState, FC, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthUser } from '../api';
import { AuthContext } from '../context/AuthContext';
import { User } from '../types';

export function useAuth() {
    const localtion = useLocation();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | undefined>();
    const controller = new AbortController();
    const { updateAuthUser } = useContext(AuthContext);
    useEffect(() => {
        setLoading(true)
        getAuthUser()
            .then(({ data }) => {
                setUser(data);
                updateAuthUser(data);
                //setTimeo  ut(() => setLoading(false),5000)
                setLoading(false);
            })
            .catch((err) => {
                console.log(err)
                setLoading(false);
                // setTimeout(() => setLoading(false), 5000)
            })
        return () => {
            controller.abort();
        }

    }, [])
    return { user, loading }
}

import React, { useEffect, useState, FC, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthUser } from '../utils/api';
import { AuthContext } from '../utils/context/AuthContext';
import { useAuth } from '../utils/hook/useAuth';
import { User } from '../utils/types';


export const AuthenticatedRoute: FC<React.PropsWithChildren> = ({ children }) => {
    const localtion = useLocation();
    const { user, loading } = useAuth();
    if (loading) {
        return <>loading</>
    } else {
        if (user) {
            return <>{children}</>;
        } else {
            return <Navigate to="/login" state={{ from: localtion }} replace />
        }
    }
}
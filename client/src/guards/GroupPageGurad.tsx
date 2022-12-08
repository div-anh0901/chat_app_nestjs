
import React, { FC } from 'react';
import { useLocation,Navigate } from 'react-router';
import { useGroupGurad } from '../utils/hook/useGroupGuard';

export const GroupPageGurad: FC<React.PropsWithChildren> = ({ children }) => {

    const location = useLocation();

    const { loading,error} = useGroupGurad();
    if (loading) return <div>loading group</div>;
    return error ? (<Navigate to="/groups" state={{ from: location }} />) : <>{ children}</>
}
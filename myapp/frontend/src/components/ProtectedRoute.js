import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAccount } from '../elements/Account';

const AuthGuard = () => {
    const { user, isLoading } = useAccount();
    const location = useLocation();

    if (isLoading) {
        return <div>กำลังโหลด...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default AuthGuard;
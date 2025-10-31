import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAccount } from '../elements/Account';

const RoleBasedGuard = ({ allowedRoles }) => {
    const { user } = useAccount(); 
    console.log(user.roles)
    const hasAccess = user.roles.some(role => allowedRoles.includes(role));

    if (!hasAccess) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default RoleBasedGuard;
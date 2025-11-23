import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';
import Spinners from "./shared/Spinners";

const PrivateRoute = ({ publicPage = false, redirectTo = "/profile", loginPath = "/login", adminOnly = false }) => {
    const { user, isAuthenticating, initialized } = useSelector((state) => state.auth);

    // 仅在私有页鉴权加载期间展示占位，公共页直接渲染
    if (!publicPage && (isAuthenticating || !initialized)) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <Spinners />
            </div>
        );
    }

    // 公共页：已登录则重定向到指定页面
    if (publicPage) {
        return user ? <Navigate to={redirectTo} /> : <Outlet />
    }

    // 管理员/卖家专属页：需登录且具备管理员或卖家角色
    if (adminOnly) {
        const hasAdminRoleArray = Array.isArray(user?.roles) && user.roles.some((r) => {
            const role = String(r || '').toUpperCase();
            return role === 'ADMIN' || role === 'ROLE_ADMIN';
        });
        const singleRole = String(user?.role || '').toUpperCase();
        const hasAdminSingle = singleRole === 'ADMIN' || singleRole === 'ROLE_ADMIN';
        const isAdmin = hasAdminRoleArray || hasAdminSingle;

        const hasSellerRoleArray = Array.isArray(user?.roles) && user.roles.some((r) => {
            const role = String(r || '').toUpperCase();
            return role === 'SELLER' || role === 'ROLE_SELLER';
        });
        const hasSellerSingle = singleRole === 'SELLER' || singleRole === 'ROLE_SELLER';
        const isSeller = hasSellerRoleArray || hasSellerSingle;
        const hasAccess = isAdmin || isSeller;
        if (!user) return <Navigate to={loginPath} />;
        if (!hasAccess) return <Navigate to={redirectTo || '/'} />;
        return <Outlet />;
    }

    // 普通私有页：需登录
    return user ? <Outlet /> : <Navigate to={loginPath} />;
}

export default PrivateRoute
import React from 'react'
import { FaTachometerAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom'
import { adminNavigation, sellerNavigation } from '../../utils';
import classNames from 'classnames';

// 使用已安装的 classnames 进行类名合并

const Sidebar = ({isProfileLayout = false}) => {
    const pathName = useLocation().pathname;
    const { user } = useSelector((state) => state.auth);

    // 角色判断：优先管理员，其次卖家
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

    const sideBarLayout = isAdmin ? adminNavigation : (isSeller ? sellerNavigation : adminNavigation);
    
  return (
    <div className='flex grow flex-col gap-y-7 overflow-y-auto bg-custom-gradient px-6 pb-4'>
        <div className='flex h-16 shrink-0 gap-x-3 pt-2'>
            <FaTachometerAlt className='h-8 w-8 text-indigo-500'/>
            <h1 className='text-white text-xl font-bold'>
                {isAdmin ? 'Admin Panel' : 'Seller Panel'}
            </h1>
        </div>
        <nav className='flex flex-1 flex-col'>
            <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                <li>
                    <ul role='list' className='-mx-2 space-y-4'>
                        {sideBarLayout.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.href}
                                    className={classNames(
                                        pathName === item.href
                                            ? "bg-custom-blue text-white"
                                            : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    )}>

                                        <item.icon className='text-2xl'/>
                                        {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </li>
            </ul>
        </nav>
    </div>
  )
}

export default Sidebar;
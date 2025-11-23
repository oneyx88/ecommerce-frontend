import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import React from 'react'
import { BiUser } from 'react-icons/bi';
import { FaShoppingCart } from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';
import { IoExitOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../store/actions';
import BackDrop from './BackDrop';

const UserMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
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
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const logOutHandler = () => {
        try {
          dispatch(logout());
          handleClose();
          navigate('/');
        } catch (_) {}
      };
  
    return (
      <div className='relative z-30'>
        <div
        className='sm:border-[1px] sm:border-slate-400 flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-slate-700'
          onClick={handleClick}
        >
          <Avatar alt='Menu' src=''/>
        </div>
        <Menu
          sx={{ width:"400px" }}
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
            sx: {width: 160},
          }}
        >

          <Link to="/profile">
            <MenuItem className="flex gap-2" 
                onClick={handleClose}>
                    <BiUser className='text-xl'/>
                    <span className='font-bold text-[16px] mt-1'>
                        {user?.username || 'Profile'}
                    </span>
            </MenuItem>
          </Link>

          <Link to="/profile/orders">
            <MenuItem className="flex gap-2" 
                onClick={handleClose}>
                    <FaShoppingCart className='text-xl'/>
                    <span className='font-semibold'>
                        Order
                    </span>
            </MenuItem>
          </Link>

          {(isAdmin || isSeller) && (
            <Link to="/admin">
              <MenuItem className="flex gap-2" 
                  onClick={handleClose}>
                      <MdAdminPanelSettings className='text-xl'/>
                      <span className='font-semibold'>
                          {isAdmin ? 'Admin Panel' : 'Seller Panel'}
                      </span>
              </MenuItem>
            </Link>
          )}

            <MenuItem className="flex gap-2" 
                onClick={logOutHandler}>
                    <div className='font-semibold w-full flex gap-2 items-center bg-button-gradient px-4 py-1 text-white rounded-sm'>
                    <IoExitOutline className='text-xl'/>
                    <span className='font-bold text-[16px] mt-1'>
                        LogOut
                    </span>
                    </div>
            </MenuItem>

        </Menu>
        {open && <BackDrop />}
      </div>
    );
}

export default UserMenu
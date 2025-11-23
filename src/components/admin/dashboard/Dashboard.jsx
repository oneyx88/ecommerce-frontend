import React, { useEffect, useState } from 'react'
import DashboardOverview from './DashboardOverview'
import { FaBoxOpen, FaDollarSign, FaShoppingCart } from 'react-icons/fa';
import api from '../../../api/api.js';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const totalRevenue = 8680.0; // 仍为示例值，如需也改为动态可提供接口

  useEffect(() => {
    let mounted = true;
    const fetchCounts = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          api.get('/products/count'),
          api.get('/orders/count'),
        ]);
        if (!mounted) return;
        const pCount = Number(prodRes?.data?.count ?? prodRes?.data ?? 0);
        const oCount = Number(orderRes?.data?.count ?? orderRes?.data ?? 0);
        setProductCount(Number.isFinite(pCount) ? pCount : 0);
        setTotalOrders(Number.isFinite(oCount) ? oCount : 0);
      } catch (err) {
        // 后端未启动或接口错误时，保持为 0
        if (!mounted) return;
        setProductCount(0);
        setTotalOrders(0);
        // 可选：在此处集成 toast 或日志上报
      }
    };
    fetchCounts();
    return () => { mounted = false; };
  }, []);
  
  return (
    <div>
      <div className='flex md:flex-row mt-8 flex-col lg:justify-between 
          border border-slate-400 rounded-lg bg-linear-to-r
           from-blue-50 to-blue-100 shadow-lg'>
            <DashboardOverview 
              title="Total Products"
              amount={productCount}
              Icon={FaBoxOpen}
            />

            <DashboardOverview 
              title="Total Orders"
              amount={totalOrders}
              Icon={FaShoppingCart}
            />

            <DashboardOverview 
              title="Total Revenue"
              amount={totalRevenue}
              Icon={FaDollarSign}
              revenue
            />
      </div>
      <div className='mt-6'>
        <Link
          to='/admin/orders'
          className='inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-500 transition-colors cursor-pointer'
        >
          <FaShoppingCart className='mr-2' />
          Manage Orders
        </Link>
      </div>
    </div>
  )
}

export default Dashboard;
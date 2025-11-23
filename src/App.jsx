import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { LiaVimeo } from 'react-icons/lia'
import Products from './components/products/Products'
import Home from './components/home/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { bootstrapSession } from './store/actions'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/shared/Navbar'
import { Toaster } from 'react-hot-toast'
import About from './components/About'
import Contact from './components/Contact'
import ProductDetail from './components/products/ProductDetail'
import Cart from './components/cart/Cart'
import LogIn from './components/auth/LogIn'
import Profile from './components/auth/Profile'
import Register from './components/auth/Register'
import Checkout from './components/checkout/Checkout'
import PaymentConfirmation from './components/checkout/PaymentConfirmation'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './components/admin/dashboard/Dashboard'
import AdminProducts from './components/admin/prouduct/AdminProducts'
import Sellers from './components/admin/seller/Sellers'
import Category from './components/admin/category/Category'
import Orders from './components/admin/order/Orders'
import Inventory from './components/admin/inventory/Inventory'

function App() {
  const [count, setCount] = useState(0)
  const dispatch = useDispatch();

  useEffect(() => {
    // 应用启动时初始化会话用户
    dispatch(bootstrapSession());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <div><Toaster /></div>
      <Routes>
        <Route path='/' element={ <Home />}/>
        <Route path='/products' element={ <Products />}/>
        <Route path='/products/:id' element={<ProductDetail />}/>
        <Route path='/about' element={ <About />}/>
        <Route path='/contact' element={ <Contact />}/>
        {/* 支付成功页：支付完成后显示，可公开访问 */}
        <Route path='/payment-success' element={<PaymentConfirmation />} />
        {/* Checkout 作为私有路由：登录后可访问 */}
        <Route path='/' element={<PrivateRoute />}> 
          <Route path='/checkout' element={ <Checkout />}/> 
        </Route>
        {/* 私有页：需要登录 */}
        <Route element={<PrivateRoute loginPath="/login" />}> 
          <Route path='/cart' element={ <Cart />}/> 
          <Route path='/profile' element={ <Profile />}/> 
        </Route>

        {/* 管理员页：需要登录且具备管理员权限 */}
        <Route path='/' element={<PrivateRoute adminOnly redirectTo="/" />}> 
            <Route path='/admin' element={ <AdminLayout />}> 
              <Route index element={<Dashboard />} /> 
              <Route path='products' element={<AdminProducts />} /> 
              <Route path='sellers' element={<Sellers />} /> 
              <Route path='categories' element={<Category />} /> 
              <Route path='orders' element={<Orders />} /> 
              <Route path='inventory' element={<Inventory />} /> 
            </Route>
        </Route>

        {/* 公开页：已登录用户禁止访问，重定向到首页 */}
        <Route element={<PrivateRoute publicPage redirectTo="/" />}> 
          <Route path='/login' element={ <LogIn />}/> 
          <Route path='/register' element={ <Register />}/> 
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

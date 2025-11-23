import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaUserPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../shared/InputField';
import Spinners from "../shared/Spinners";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, registerSeller } from '../../store/actions';
import { toast } from 'react-hot-toast';
import { loginWithPassword } from '../../store/actions';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isRegistering, registerError } = useSelector((state) => state.auth);
    const [accountType, setAccountType] = useState('user');

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm({
        mode: "onTouched",
    });

    const registerHandler = async (form) => {
        const payload = {
            username: form.username?.trim(),
            firstName: form.firstName?.trim(),
            lastName: form.lastName?.trim(),
            email: form.email?.trim(),
            password: form.password,
        };

        try {
            const result = accountType === 'seller'
                ? await dispatch(registerSeller(payload))
                : await dispatch(registerUser(payload));
            toast.success('Registration successful, logging you in...');
            // 使用用户名登录，后端通过 Cookie 写入令牌
            try {
                await dispatch(loginWithPassword(payload.username, payload.password));
                navigate('/');
            } catch (e) {
                toast.error('Auto login failed, please log in manually');
                navigate('/login');
            }
        } catch (err) {
            toast.error(err?.message || 'Registration failed');
        } finally {
            // no local loader; Redux state controls button
        }
     };

    return (
        <div className="min-h-[calc(100vh-64px)] flex justify-center items-center">
            <form
                onSubmit={handleSubmit(registerHandler)}
                className="sm:w-[450px] w-[360px] shadow-custom py-8 sm:px-8 px-4 rounded-md">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <FaUserPlus className="text-slate-800 text-5xl"/>
                        <h1 className="text-slate-800 text-center font-montserrat lg:text-3xl text-2xl font-bold">
                            Register Here
                        </h1>
                    </div>
            <hr className="mt-2 mb-5 text-black" />
            <div className="flex flex-col gap-3">
                {/* Account Type Selector: User or Seller */}
                <div className="flex flex-col gap-1 w-full">
                    <label className="font-semibold text-sm text-slate-800">Account Type</label>
                    <div className="flex gap-6 items-center px-2 py-2 border rounded-md border-slate-700 text-slate-800">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="accountType"
                                value="user"
                                checked={accountType === 'user'}
                                onChange={() => setAccountType('user')}
                            />
                            User
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="accountType"
                                value="seller"
                                checked={accountType === 'seller'}
                                onChange={() => setAccountType('seller')}
                            />
                            Seller
                        </label>
                    </div>
                </div>

                <InputField
                    label="UserName"
                    required
                    id="username"
                    type="text"
                    message="*UserName is required"
                    min={3}
                    max={20}
                    pattern={/^[A-Za-z0-9_]+$/}
                    patternMessage="Only letters, numbers and underscore"
                    placeholder="Enter your username"
                    register={register}
                    errors={errors}
                    />

                <InputField
                    label="First Name"
                    required
                    id="firstName"
                    type="text"
                    message="*First name is required"
                    max={50}
                    placeholder="Enter your first name"
                    register={register}
                    errors={errors}
                />

                <InputField
                    label="Last Name"
                    required
                    id="lastName"
                    type="text"
                    message="*Last name is required"
                    max={50}
                    placeholder="Enter your last name"
                    register={register}
                    errors={errors}
                />

                <InputField
                    label="Email"
                    required
                    id="email"
                    type="email"
                    message="*Email is required"
                    max={50}
                    placeholder="Enter your email"
                    register={register}
                    errors={errors}
                    />

                <InputField
                    label="Password"
                    required
                    id="password"
                    min={8}
                    max={40}
                    type="password"
                    message="*Password is required"
                    pattern={/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,40}$/}
                    patternMessage={'Password must contain uppercase, lowercase, number, and special character'}
                    placeholder="Enter your password"
                    register={register}
                    errors={errors}
                    />
            </div>

            {registerError && (
                <div className="text-red-600 text-sm text-center mb-2">{registerError}</div>
            )}

            <button
                disabled={isRegistering}
                className="bg-button-gradient flex gap-2 items-center justify-center font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3 cursor-pointer"
                type="submit">
                {isRegistering ? (
                    <>
                    <Spinners /> Loading...
                    </>
                ) : (
                    <>Register</>
                )}
            </button>

            <p className="text-center text-sm text-slate-700 mt-6">
              Already have an account?
              <Link
                className="font-semibold underline hover:text-black"
                to="/login">
              <span> Login</span></Link>  
            </p>
            </form>
        </div>
    );
}

export default Register
import React, { useState } from 'react'
import LoginLeftSide from './LoginLeftSide'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const LoginForm = ({ role, title, subtitle }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmail("admin@example.com");
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password, role);
            navigate('/dashboard');
            // const response = await fetch('http://localhost:3000/api/auth/login', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         email,
            //         password,
            //         role,
            //     }),
            // });

            // const data = await response.json();

            // if (!response.ok) {
            //     throw new Error(data.message || 'Login failed');
            // }

            // // Store token and user info
            // localStorage.setItem('token', data.token);
            // localStorage.setItem('user', JSON.stringify(data.user));
            // localStorage.setItem('role', data.user.role);

            // // Redirect to dashboard
            // window.location.href = '/dashboard';

        } catch (error) {
            toast.error(error.response?.data?.error || error.message || "Login failed")
            // setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen flex flex-col md:flex-row'>
            <LoginLeftSide />
            <div className='flex-1 flex items-center justify-center p-6 sm:p-12 bg-white'>
                <div className='w-full max-w-md animate-animate-fade-in'>
                    <Link to='/login' className='inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm mb-10 transition-colors'>
                        <ArrowLeftIcon size={16} /> Back to Portal
                    </Link>
                    <div className='mb-8'>
                        <h1 className='text-2xl font-medium sm:text-3xl text-zinc-800'>{title}</h1>
                        <p className='text-slate-500 text-sm sm:text-base mt-2'>{subtitle}</p>
                    </div>

                    {error && (
                        <div className='mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-start gap-3'>
                            <div className='w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0' />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-slate-700 mb-2'>Email Address</label>
                            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 outline-none transition-all' placeholder='john@example.com' required />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-slate-700 mb-2'>Password</label>
                            <div className='relative'>
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className='w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 outline-none transition-all' placeholder='••••••••' required />
                                <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 transition-colors'>
                                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* <div className='flex items-center justify-between'>

                            <Link to='/forgot-password' className='text-sm text-blue-600 hover:text-blue-700 transition-colors'>Forgot Password?</Link>
                        </div> */}
                        <button type='submit' disabled={loading} className='w-full py-3 bg-linear-to-r from-indigo-600 to-indigo-500 text-white rounded-md text-sm font-semibold hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 transition-all duration-200'>
                            {loading && <Loader2Icon className='animate-spin h-4 w-4 mr-2' />}
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginForm
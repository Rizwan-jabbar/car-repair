import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { FiEye, FiEyeOff, FiLock, FiMail, FiUser, FiZap, FiHeadphones, FiArrowRight, FiShield } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { loginUser } from '../../rtk/thunks/userThunk/userThunk'
import logo from '../../pictures/mainLogo.png'
import { getMediaUrl } from '../../rtk/utils/apiUrl'

function Login () {
    const dispatch = useDispatch()
    const { loading, error } = useSelector((state) => state.user)
    const [showPassword, setShowPassword] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [form, setForm] = useState({ email: '', password: '', remember: true })
    const loginBackground = getMediaUrl('/uploads/login-picture.png')

    useEffect(() => {
        if (!submitted) return undefined

        const timerId = setTimeout(() => setSubmitted(false), 3000)
        return () => clearTimeout(timerId)
    }, [submitted])

    const onSubmit = (e) => {
        e.preventDefault()

        dispatch(
            loginUser({
                email: form.email.trim(),
                password: form.password,
            }),
        )
            .unwrap()
            .then(() => setSubmitted(true))
            .catch(() => setSubmitted(false))
    }

    return (
        <section className='login-reference cr-section cr-section-muted relative min-h-screen overflow-hidden' style={{ backgroundImage: `linear-gradient(90deg, rgba(248,250,252,.78), rgba(248,250,252,.48)), url(${loginBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className='pointer-events-none absolute -left-12 -top-20 h-48 w-48 rotate-45 bg-red-600/95' />
            <div className='pointer-events-none absolute -bottom-20 -left-20 h-24 w-[34rem] -rotate-[28deg] bg-red-600/90' />
            <div className='pointer-events-none absolute -right-24 top-40 h-20 w-80 rotate-[42deg] bg-red-500/25' />
            <div className='pointer-events-none absolute inset-0 -z-10'>
                <div className='absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl' />
                <div className='absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-gray-900/5 blur-3xl' />
            </div>

            <div className='cr-container cr-section-pad'>
                <div className='mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.95fr]'>
                    <div className='space-y-5'>
                        <Link to='/' className='inline-flex items-center gap-3'><img src={logo} alt='AutoSphere logo' className='h-14 w-auto object-contain' /></Link>
                        <p className='inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-600'><FiUser className='h-4 w-4' /> Account <span className='h-px w-8 bg-red-500' /></p>
                        <h1 className='max-w-lg text-4xl font-extrabold leading-tight tracking-tight text-[#102957] sm:text-5xl'>
                            Welcome <span className='text-red-600'>Back</span>
                        </h1>
                        <p className='max-w-md text-base leading-7 text-[#526b84] sm:text-lg'>
                            Login to manage your bookings, track your repairs and get faster support.
                        </p>

                        <div className='grid gap-3 sm:grid-cols-2'>
                            <div className='flex items-center gap-3 rounded-xl border border-[#dfe8f0] bg-white/90 p-3 shadow-sm'>
                                <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600'><FiZap className='h-5 w-5' /></span><div><p className='text-xs font-extrabold text-[#17345c]'>Fast Booking</p><p className='mt-1 text-[10px] leading-4 text-[#6d86a0]'>Save time with quick booking.</p></div><FiArrowRight className='ml-auto h-4 w-4 text-[#17345c]' />
                            </div>
                            <div className='flex items-center gap-3 rounded-xl border border-[#dfe8f0] bg-white/90 p-3 shadow-sm'>
                                <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600'><FiHeadphones className='h-5 w-5' /></span><div><p className='text-xs font-extrabold text-[#17345c]'>24/7 Support</p><p className='mt-1 text-[10px] leading-4 text-[#6d86a0]'>We’re always here to help.</p></div><FiArrowRight className='ml-auto h-4 w-4 text-[#17345c]' />
                            </div>
                        </div>
                    </div>

                    <div className='mx-auto w-full max-w-xl'>
                        <div className='overflow-hidden rounded-2xl border border-[#dfe8f0] bg-white/95 shadow-xl ring-1 ring-black/5'>
                            <div className='border-b border-[#edf1f5] px-6 py-6 sm:px-8'>
                                <div className='flex items-center gap-4'><span className='flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600'><FiUser className='h-7 w-7' /></span><div><p className='text-2xl font-extrabold text-[#102957]'>Login</p><p className='mt-1 text-sm text-[#6d86a0]'>Use your email and password.</p></div></div>
                            </div>

                            {!submitted ? (
                                <form onSubmit={onSubmit} className='space-y-4 px-6 py-6 sm:px-8 sm:py-7'>
                                    <label className='block'>
                                        <span className='text-xs font-bold text-[#17345c]'>Email</span>
                                        <span className='relative mt-1 block'><FiMail className='pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#17345c]' /><input type='email' value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder='you@email.com' className='w-full rounded-md border border-[#d8e3ed] bg-white py-3 pl-11 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-[#8ca3ba] focus:border-red-300 focus:ring-4 focus:ring-red-100' required /></span>
                                    </label>

                                    <label className='block'>
                                        <span className='text-xs font-bold text-[#17345c]'>Password</span>
                                        <div className='relative'>
                                            <FiLock className='pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#17345c]' />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={form.password}
                                                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                                                placeholder='••••••••'
                                                className='mt-1 w-full rounded-md border border-[#d8e3ed] bg-white py-3 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-[#8ca3ba] focus:border-red-300 focus:ring-4 focus:ring-red-100'
                                                required
                                            />
                                            <button
                                                type='button'
                                                onClick={() => setShowPassword((v) => !v)}
                                                className='absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2'
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <FiEyeOff className='h-4 w-4' aria-hidden='true' /> : <FiEye className='h-4 w-4' aria-hidden='true' />}
                                            </button>
                                        </div>
                                    </label>

                                    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                                        <label className='inline-flex items-center gap-2 text-sm text-gray-700'>
                                            <input
                                                type='checkbox'
                                                checked={form.remember}
                                                onChange={(e) => setForm((p) => ({ ...p, remember: e.target.checked }))}
                                                className='h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600'
                                            />
                                            Remember me
                                        </label>

                                        <button
                                            type='button'
                                            className='text-sm font-semibold text-gray-700 transition hover:text-red-600'
                                        >
                                            Forgot password?
                                        </button>
                                    </div>

                                    {error && (
                                        <div className='rounded-2xl border border-red-200 bg-red-50 p-4'>
                                            <p className='text-sm font-extrabold text-red-900'>Login failed</p>
                                            <p className='mt-1 text-sm text-red-900/80'>
                                                {typeof error === 'string' ? error : (error?.message || 'Please try again.')}
                                            </p>
                                        </div>
                                    )}

                                    <button type='submit' className='inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700' disabled={loading}>
                                        {loading ? <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' aria-label='Signing in' /> : 'Continue'} {!loading && <FiArrowRight />}
                                    </button>

                                    <p className='text-center text-sm text-gray-600'>
                                        New here?{' '}
                                        <Link to='/register' className='font-semibold text-red-600 transition hover:text-red-700'>
                                            Create an account
                                        </Link>
                                    </p>
                                </form>
                            ) : (
                                <div className='px-6 py-6 sm:px-8 sm:py-8'>
                                    <div className='rounded-2xl border border-emerald-200 bg-emerald-50 p-6'>
                                        <p className='text-sm font-extrabold text-emerald-900'>Logged in</p>
                                        <p className='mt-1 text-sm leading-6 text-emerald-900/80'>
                                            Login successful.
                                        </p>
                                    </div>

                                    <button
                                        type='button'
                                        onClick={() => setSubmitted(false)}
                                        className='mt-5 cr-btn-outline w-full'
                                    >
                                        Back
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                    <div className='mx-auto mt-8 hidden max-w-xl items-center justify-between gap-8 rounded-xl border border-[#dfe8f0] bg-white/80 px-5 py-4 text-xs text-[#526b84] shadow-sm sm:flex lg:ml-auto lg:mr-0'><span className='flex items-center gap-3'><span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600'><FiShield className='h-4 w-4' /></span><span><b className='block text-[10px] text-[#17345c]'>Secure Login</b><small className='text-[9px]'>Your data is safe</small></span></span><span className='h-9 w-px shrink-0 bg-[#d8e3ed]' /><span className='flex items-center gap-3'><span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600'><FiLock className='h-4 w-4' /></span><span><b className='block text-[10px] text-[#17345c]'>Trusted Platform</b><small className='text-[9px]'>Used by 10K+ customers</small></span></span><span className='h-9 w-px shrink-0 bg-[#d8e3ed]' /><span className='flex items-center gap-3'><span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600'><FiHeadphones className='h-4 w-4' /></span><span><b className='block text-[10px] text-[#17345c]'>24/7 Support</b><small className='text-[9px]'>Always here for you</small></span></span></div>
            </div>
        </section>
    )
}

export default Login

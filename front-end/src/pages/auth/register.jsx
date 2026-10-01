import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

import { FiEye, FiEyeOff, FiLock, FiMail, FiPhone, FiUser, FiZap, FiShield, FiHeadphones, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { registerUser } from '../../rtk/thunks/userThunk/userThunk'
import { getMediaUrl } from '../../rtk/utils/apiUrl'
import logo from '../../pictures/mainLogo.png'

function Register() {
    const dispatch = useDispatch()
    const { loading, error } = useSelector((state) => state.user)
    const [showPassword, setShowPassword] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', contact: '', password: '', confirm: '', consent: true })
    const registrationBackground = getMediaUrl('/uploads/registraion-picture.png')

    const onSubmit = (e) => {
        e.preventDefault()

        const userData = {
            name: form.name.trim(),
            email: form.email.trim(),
            contact: form.contact.trim(),
            password: form.password,
        }

        dispatch(
            registerUser(userData),
        )
            .unwrap()
            .then(() => setSubmitted(true))
    }

    return (
        <section className='cr-section cr-section-muted relative min-h-screen overflow-hidden' style={{ backgroundImage: `linear-gradient(90deg, rgba(248,250,252,.84), rgba(248,250,252,.62)), url(${registrationBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className='pointer-events-none absolute -left-12 -top-20 h-48 w-48 rotate-45 bg-red-600/95' />
            <div className='pointer-events-none absolute -bottom-20 -left-20 h-24 w-[34rem] -rotate-[28deg] bg-red-600/90' />
            <div className='pointer-events-none absolute inset-0 -z-10'>
                <div className='absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl' />
                <div className='absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-gray-900/5 blur-3xl' />
            </div>

            <div className='cr-container cr-section-pad'>
                <div className='mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.95fr]'>
                    <div className='space-y-5'>
                        <Link to='/' className='inline-flex items-center'><img src={logo} alt='AutoSphere logo' className='h-14 w-auto object-contain' /></Link>
                        <p className='inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-600'><FiUser className='h-4 w-4' /> Account <span className='h-px w-8 bg-red-500' /></p>
                        <h1 className='max-w-lg text-4xl font-extrabold leading-tight tracking-tight text-[#102957] sm:text-5xl'>Create Your <span className='text-red-600'>Account</span></h1>
                        <p className='max-w-md text-base leading-7 text-[#526b84] sm:text-lg'>Register to manage your bookings, track repairs and get faster support.</p>
                        <div className='grid gap-3 sm:grid-cols-2'>
                            <div className='flex items-center gap-3 rounded-xl border border-[#dfe8f0] bg-white/90 p-4 shadow-sm'><span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600'><FiZap className='h-6 w-6' /></span><div><p className='text-sm font-extrabold text-[#17345c]'>Easy Booking</p><p className='mt-1 text-xs text-[#6d86a0]'>Book your service in minutes.</p></div><FiArrowRight className='ml-auto text-[#17345c]' /></div>
                            <div className='flex items-center gap-3 rounded-xl border border-[#dfe8f0] bg-white/90 p-4 shadow-sm'><span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600'><FiHeadphones className='h-6 w-6' /></span><div><p className='text-sm font-extrabold text-[#17345c]'>24/7 Support</p><p className='mt-1 text-xs text-[#6d86a0]'>We’re always here to help.</p></div><FiArrowRight className='ml-auto text-[#17345c]' /></div>
                        </div>
                    </div>

                    <div className='mx-auto w-full max-w-xl'>
                    <div className='overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5'>
                        <div className='border-b border-[#edf1f5] px-6 py-6 sm:px-8'>
                            <div className='flex items-center gap-4'><span className='flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600'><FiUser className='h-7 w-7' /></span><div><p className='text-2xl font-extrabold text-[#102957]'>Create Account</p><p className='mt-1 text-sm text-[#6d86a0]'>Join us for better car care.</p></div></div>
                        </div>

                        {!submitted ? (
                            <form onSubmit={onSubmit} className='register-form space-y-4 px-6 py-6 sm:px-8 sm:py-7'>
                                <label className='block'>
                                    <span className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                        <FiUser className='h-4 w-4 text-gray-500' aria-hidden='true' />
                                        Full name
                                    </span>
                                    <input
                                        type='text'
                                        value={form.name}
                                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                        placeholder='e.g. Ali Khan'
                                        className='cr-input'
                                    />
                                </label>

                                <label className='block'>
                                    <span className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                        <FiMail className='h-4 w-4 text-gray-500' aria-hidden='true' />
                                        Email
                                    </span>
                                    <input
                                        type='email'
                                        value={form.email}
                                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                        placeholder='you@email.com'
                                        className='cr-input'
                                    />
                                </label>

                                <label className='block'>
                                    <span className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                        <FiPhone className='h-4 w-4 text-gray-500' aria-hidden='true' />
                                        Contact
                                    </span>
                                    <input
                                        type='tel'
                                        value={form.contact}
                                        onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))}
                                        placeholder='e.g. +92 300 1234567'
                                        className='cr-input'
                                        required
                                    />
                                </label>

                                <label className='block'>
                                    <span className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                        <FiLock className='h-4 w-4 text-gray-500' aria-hidden='true' />
                                        Password
                                    </span>
                                    <div className='relative'>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={form.password}
                                            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                                            placeholder='Create a password'
                                            className='cr-input pr-12'
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
                                    <p className='mt-1 text-xs font-semibold text-gray-500'>Use at least 6 characters.</p>
                                </label>

                                <label className='block'>
                                    <span className='text-sm font-semibold text-gray-900'>Confirm password</span>
                                    <input
                                        type='password'
                                        value={form.confirm}
                                        onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                                        placeholder='Repeat password'
                                        className='cr-input'
                                    />
                                    <p className='mt-1 text-xs font-semibold text-gray-500'>For your own confirmation (not sent to server).</p>
                                </label>

                                <label className='flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4'>
                                    <input
                                        type='checkbox'
                                        checked={form.consent}
                                        onChange={(e) => setForm((p) => ({ ...p, consent: e.target.checked }))}
                                        className='mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600'
                                    />
                                    <span className='text-sm text-gray-700'>
                                        I agree to the terms and privacy policy.
                                    </span>
                                </label>

                                {error && (
                                    <div className='rounded-2xl border border-red-200 bg-red-50 p-4'>
                                        <p className='text-sm font-extrabold text-red-900'>Registration failed</p>
                                        <p className='mt-1 text-sm text-red-900/80'>
                                            {typeof error === 'string' ? error : (error?.message || 'Please try again.')}
                                        </p>
                                    </div>
                                )}

                                <button type='submit' className='cr-btn-primary w-full' disabled={loading}>
                                    {loading ? 'Creating…' : 'Create account'}
                                </button>

                                <p className='text-center text-sm text-gray-600'>
                                    Already have an account?{' '}
                                    <Link to='/login' className='font-semibold text-red-600 transition hover:text-red-700'>
                                        Login
                                    </Link>
                                </p>
                            </form>
                        ) : (
                            <div className='px-6 py-6 sm:px-8 sm:py-8'>
                                <div className='rounded-2xl border border-emerald-200 bg-emerald-50 p-6'>
                                    <p className='text-sm font-extrabold text-emerald-900'>Account created (demo)</p>
                                    <p className='mt-1 text-sm leading-6 text-emerald-900/80'>
                                        UI preview complete — connect your backend to finish registration.
                                    </p>
                                </div>

                                <div className='mt-5 grid gap-3 sm:grid-cols-2'>
                                    <Link to='/login' className='cr-btn-primary'>
                                        Go to login
                                    </Link>
                                    <button
                                        type='button'
                                        onClick={() => setSubmitted(false)}
                                        className='cr-btn-outline'
                                    >
                                        Back
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </div>
        </section>
    )
}

export default Register

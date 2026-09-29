import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { FiChevronDown, FiMenu, FiPhoneCall, FiUser, FiX } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { logout } from '../../rtk/slices/userSlice/userSlice'
import { getVerifiedToken } from '../../rtk/utils/authToken'
import logo from '../../pictures/mainLogo.png'

function Navbar () {
    const [isOpen, setIsOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isExploreOpen, setIsExploreOpen] = useState(false)

    const dispatch = useDispatch()

    // Logged-in user (set by login + fetchCurrentUser thunk). If null => not logged in.
    const { user, loading } = useSelector((state) => state.user)

    const tokenRole = (() => {
        try {
            const token = getVerifiedToken()
            if (!token) return null

            const payloadBase64 = token.split('.')[1]
            if (!payloadBase64) return null

            const payload = JSON.parse(atob(payloadBase64))
            if (Array.isArray(payload?.roles)) return payload.roles
            return payload?.role || null
        } catch {
            return null
        }
    })()

    const hasToken = Boolean(getVerifiedToken())
    const isAuthed = Boolean(user) || hasToken
    const isHydratingAuth = hasToken && !user && loading
    const isAdmin = String(user?.role || '').toLowerCase() === 'admin'
        || tokenRole === 'admin'
        || (Array.isArray(tokenRole) && tokenRole.includes('admin'))

    const navLinks = [
        { name: 'Home', to: '/' },
        { name: 'Services', to: '/services' },
        { name: 'Car Tips', to: '/tips-for-car' },
        { name: 'Book Repair', to: isAuthed ? '/book-repair' : '/login' },
        { name: 'Contact', to: '/contact' },
    ]

    const exploreLinks = [
        { name: 'Why Us', to: '/why-us' },
        { name: 'Reviews', to: '/reviews' },
        { name: 'FAQ', to: '/faq' },
    ]

    const authLinks = [
        { name: 'Sign In', to: '/login' },
        { name: 'Sign Up', to: '/register' },
    ]

    const navItemClass = ({ isActive }) => (
        isActive
            ? 'text-sm font-semibold text-red-600'
            : 'text-sm font-medium text-gray-700 transition-colors hover:text-red-600'
    )

    const handleLogout = () => {
        dispatch(logout())
        setIsProfileOpen(false)
        setIsOpen(false)
    }

    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = ''
            return
        }

        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    return (
        <header className='sticky top-0 z-50 border-b border-gray-200/90 bg-white/95 shadow-sm backdrop-blur'>
            <nav className='mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8'>
                <NavLink to='/' className='flex items-center gap-2 lg:gap-3'>
                    <img src={logo} className='h-9 w-auto object-contain sm:h-10 lg:h-12' alt='Car Repair Pro Logo' />
                    <span className='text-base font-extrabold tracking-tight text-gray-900 sm:text-lg lg:text-xl'>Auto<span className='text-red-600'>Sphere</span></span>
                </NavLink>

                <ul className='hidden items-center gap-7 md:flex'>
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <NavLink to={link.to} className={navItemClass}>
                                {link.name}
                            </NavLink>
                        </li>
                    ))}

                    <li
                        className='relative'
                        onMouseEnter={() => setIsExploreOpen(true)}
                        onMouseLeave={() => setIsExploreOpen(false)}
                    >
                        <button
                            type='button'
                            className='inline-flex items-center gap-1 text-sm font-medium text-gray-700 transition hover:text-red-600'
                            aria-haspopup='menu'
                            aria-expanded={isExploreOpen}
                        >
                            Explore
                            <FiChevronDown className={`h-4 w-4 transition ${isExploreOpen ? 'rotate-180 text-red-600' : 'text-gray-500'}`} />
                        </button>

                        <AnimatePresence>
                            {isExploreOpen && (
                                <motion.div
                                    key='explore-menu'
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.16, ease: 'easeOut' }}
                                    className='absolute left-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg'
                                    role='menu'
                                >
                                    {exploreLinks.map((link) => (
                                        <NavLink
                                            key={link.name}
                                            to={link.to}
                                            className='block px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-red-600'
                                            role='menuitem'
                                            onClick={() => setIsExploreOpen(false)}
                                        >
                                            {link.name}
                                        </NavLink>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </li>
                </ul>

                <div className='hidden items-center gap-3 md:flex'>
                    {!isAuthed && !isHydratingAuth ? (
                        <>
                            <NavLink to={authLinks[0].to} className={navItemClass}>
                                {authLinks[0].name}
                            </NavLink>
                            <NavLink
                                to={authLinks[1].to}
                                className={({ isActive }) => (
                                    isActive
                                        ? 'rounded-md border border-red-600 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600'
                                        : 'rounded-md border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50'
                                )}
                            >
                                {authLinks[1].name}
                            </NavLink>
                        </>
                    ) : (
                        isAdmin ? (
                            <NavLink
                                to='/admin'
                                className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 hover:text-red-600'
                                aria-label='Go to admin dashboard'
                                title='Admin Dashboard'
                            >
                                <FiUser className='h-5 w-5' aria-hidden='true' />
                            </NavLink>
                        ) : (
                            <div className='relative'>
                                <button
                                    type='button'
                                    onClick={() => setIsProfileOpen((prev) => !prev)}
                                    className='inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50'
                                    aria-haspopup='menu'
                                    aria-expanded={isProfileOpen}
                                >
                                    <span className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-700'>
                                        <FiUser className='h-4 w-4' aria-hidden='true' />
                                    </span>
                                    <span className='max-w-[140px] truncate'>{user?.name || (isHydratingAuth ? 'Loading...' : 'Account')}</span>
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            key='profile-menu'
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            transition={{ duration: 0.15, ease: 'easeOut' }}
                                            className='absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg'
                                            role='menu'
                                        >
                                            <NavLink
                                                to='/my-appointments'
                                                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                                                role='menuitem'
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                My Appointments
                                            </NavLink>
                                            <NavLink
                                                to='/profile'
                                                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                                                role='menuitem'
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                My Profile
                                            </NavLink>

                                            <button
                                                type='button'
                                                className='block w-full px-4 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50'
                                                role='menuitem'
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    )}

                    <a
                        href='tel:+923001234567'
                        className='rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 hover:shadow'
                    >
                        <span className='inline-flex items-center gap-2'>
                            <FiPhoneCall className='h-4 w-4' aria-hidden='true' />
                            Call Now
                        </span>
                    </a>
                </div>

                <button
                    type='button'
                    className='inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden'
                    aria-label='Toggle menu'
                    onClick={() => {
                        setIsOpen((prev) => !prev)
                        setIsProfileOpen(false)
                    }}
                >
                    {isOpen ? <FiX className='h-6 w-6' aria-hidden='true' /> : <FiMenu className='h-6 w-6' aria-hidden='true' />}
                </button>
            </nav>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key='mobile-menu'
                        className='absolute left-0 right-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-gray-200 bg-white px-4 pb-4 pt-2 shadow-lg md:hidden'
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                    >
                        <ul className='space-y-2'>
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <NavLink
                                        to={link.to}
                                        className={({ isActive }) => (
                                            isActive
                                                ? 'block rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700'
                                                : 'block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600'
                                        )}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </NavLink>
                                </li>
                            ))}

                            <li className='rounded-md border border-gray-200 bg-gray-50/60 p-2'>
                                <p className='px-2 py-1 text-xs font-bold uppercase tracking-wide text-gray-500'>Explore</p>
                                <div className='mt-1 space-y-1'>
                                    {exploreLinks.map((link) => (
                                        <NavLink
                                            key={link.name}
                                            to={link.to}
                                            className={({ isActive }) => (
                                                isActive
                                                    ? 'block rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700'
                                                    : 'block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600'
                                            )}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.name}
                                        </NavLink>
                                    ))}
                                </div>
                            </li>
                        </ul>

                        <div className='mt-3 grid gap-2'>
                            {!isAuthed && !isHydratingAuth ? (
                                <>
                                    <NavLink
                                        to={authLinks[0].to}
                                        className='inline-flex w-full items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50'
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {authLinks[0].name}
                                    </NavLink>
                                    <NavLink
                                        to={authLinks[1].to}
                                        className='inline-flex w-full items-center justify-center rounded-md border border-red-600 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50'
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {authLinks[1].name}
                                    </NavLink>
                                </>
                            ) : (
                                <>
                                    {!isAdmin ? (
                                        <>
                                            <NavLink
                                                to='/my-appointments'
                                                className='inline-flex w-full items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50'
                                                onClick={() => setIsOpen(false)}
                                            >
                                                My Appointments
                                            </NavLink>
                                            <NavLink
                                                to='/profile'
                                                className='inline-flex w-full items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50'
                                                onClick={() => setIsOpen(false)}
                                            >
                                                My Profile
                                            </NavLink>
                                        </>
                                    ) : (
                                        <>
                                            <NavLink
                                                to='/admin'
                                                className='inline-flex w-full items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50'
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Visit Admin Panel
                                            </NavLink>

                                            <button
                                                type='button'
                                                className='inline-flex w-full items-center justify-center rounded-md border border-red-600 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50'
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                            <a
                                href='tel:+923001234567'
                                className='inline-flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700'
                            >
                                Emergency Call
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Navbar

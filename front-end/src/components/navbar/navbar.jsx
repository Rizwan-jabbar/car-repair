import { useEffect, useMemo, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { FiChevronDown, FiMenu, FiPhoneCall, FiUser, FiX, FiTool, FiArrowUpRight, FiHelpCircle, FiStar, FiInfo, FiHome, FiBookOpen, FiCalendar, FiHeadphones, FiGrid, FiSearch, FiMapPin, FiShield, FiClock } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { logout } from '../../rtk/slices/userSlice/userSlice'
import { getVerifiedToken } from '../../rtk/utils/authToken'
import logo from '../../pictures/mainLogo.png'
import { fetchServices } from '../../rtk/thunks/serviceThunk/serviceThunk'
import { servicesCatalog } from '../../data/servicesCatalog'

function Navbar () {
    const [isOpen, setIsOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isExploreOpen, setIsExploreOpen] = useState(false)
    const [isServicesOpen, setIsServicesOpen] = useState(false)

    const dispatch = useDispatch()

    // Logged-in user (set by login + fetchCurrentUser thunk). If null => not logged in.
    const { user, loading } = useSelector((state) => state.user)
    const serviceState = useSelector((state) => state.service)

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
        { name: 'Home', to: '/', Icon: FiHome },
        { name: 'Car Tips', to: '/tips-for-car', Icon: FiBookOpen },
        { name: 'Book Repair', to: isAuthed ? '/book-repair' : '/login', Icon: FiCalendar },
        { name: 'Contact', to: '/contact', Icon: FiHeadphones },
    ]

    const exploreLinks = [
        { name: 'Why Us', to: '/why-us', Icon: FiInfo, description: 'Why drivers choose us' },
        { name: 'Reviews', to: '/reviews', Icon: FiStar, description: 'Real customer feedback' },
        { name: 'FAQ', to: '/faq', Icon: FiHelpCircle, description: 'Common questions answered' },
    ]

    const authLinks = [
        { name: 'Sign In', to: '/login' },
        { name: 'Sign Up', to: '/register' },
    ]

    const serviceItems = useMemo(() => {
        const apiItems = Array.isArray(serviceState?.items) ? serviceState.items : []
        const normalized = apiItems.map((item) => item?.service ?? item).filter(Boolean).map((item) => ({
            title: item.title || item.name || item.serviceName,
            description: item.description || item.details || 'Professional care for your vehicle',
        })).filter((item) => item.title)

        return normalized.length > 0 ? normalized : servicesCatalog.slice(0, 9)
    }, [serviceState?.items])

    const shortDescription = (text) => String(text || '').split(/\s+/).filter(Boolean).slice(0, 5).join(' ')

    const navItemClass = ({ isActive }) => (
        isActive
            ? 'text-xs font-semibold text-red-600'
            : 'text-xs font-medium text-gray-700 transition-colors hover:text-red-600'
    )

    const handleLogout = () => {
        dispatch(logout())
        setIsProfileOpen(false)
        setIsOpen(false)
    }

    useEffect(() => {
        dispatch(fetchServices())
    }, [dispatch])

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
            <div className='hidden border-b border-[#edf2f7] bg-[#f7fafd] md:block'><div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-[11px] font-semibold text-[#526b84] sm:px-6 lg:px-8'><div className='flex items-center gap-5'><span className='flex items-center gap-2'><FiShield className='text-red-600' />Trusted Car Repair Experts</span><span className='h-4 w-px bg-[#dce5ee]' /><span className='flex items-center gap-2'><FiTool className='text-[#17345c]' />Quality Service</span><span className='h-4 w-px bg-[#dce5ee]' /><span className='flex items-center gap-2'><FiClock className='text-red-600' />Open Mon - Sun | 9:00 AM - 10:00 PM</span></div><span className='flex items-center gap-2'><FiMapPin className='text-red-600' />Johar Town, Lahore</span></div></div>
            <nav className='mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 py-2.5 sm:px-4 lg:px-6'>
                <NavLink to='/' className='flex items-center gap-2 lg:gap-3'>
                    <img src={logo} className='h-9 w-auto object-contain sm:h-10 lg:h-12' alt='Car Repair Pro Logo' />
                    <span className='text-base font-extrabold tracking-tight text-gray-900 sm:text-lg lg:text-xl'>Auto<span className='text-red-600'>Sphere</span></span>
                </NavLink>

                <ul className='hidden items-center gap-0.5 bg-white p-0 md:flex'>
                    <li
                        className='relative'
                        onMouseEnter={() => { setIsServicesOpen(true); setIsExploreOpen(false) }}
                        onMouseLeave={() => setIsServicesOpen(false)}
                    >
                        <button type='button' className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition ${isServicesOpen ? 'text-red-600' : 'text-[#17345c] hover:text-red-600'}`} aria-haspopup='menu' aria-expanded={isServicesOpen}>
                            <FiTool className='h-4 w-4' />Services <FiChevronDown className={`h-4 w-4 transition ${isServicesOpen ? 'rotate-180 text-red-600' : 'text-gray-500'}`} />
                        </button>
                        <AnimatePresence>
                            {isServicesOpen && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.16 }} className='absolute left-1/2 top-full z-20 mt-3 grid w-[780px] -translate-x-1/2 grid-cols-[190px_1fr] overflow-hidden rounded-2xl border border-[#dfe8f0] bg-white p-3 shadow-2xl' role='menu'>
                                    <div className='rounded-xl bg-red-50 p-5'><span className='flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white'><FiTool /></span><h3 className='mt-4 text-lg font-extrabold text-[#102957]'>Our Services</h3><p className='mt-2 text-xs leading-5 text-[#527292]'>Complete car care under one roof.</p><NavLink to='/services' onClick={() => setIsServicesOpen(false)} className='mt-5 inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700'>View All Services <FiArrowUpRight /></NavLink></div>
                                    <div className='grid grid-cols-3 gap-x-3 gap-y-1 px-4 py-2'>{serviceItems.slice(0, 9).map((service) => <NavLink key={service.title} to={`/book-repair?service=${encodeURIComponent(service.title)}`} onClick={() => setIsServicesOpen(false)} className='group flex gap-3 rounded-lg p-3 hover:bg-red-50' role='menuitem'><FiTool className='mt-1 h-5 w-5 shrink-0 text-red-600' /><span><span className='block text-sm font-bold text-[#17345c] group-hover:text-red-600'>{service.title}</span><span className='mt-1 block text-[10px] leading-4 text-[#7890a8]'>{shortDescription(service.description)}</span></span></NavLink>)}</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </li>

                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <NavLink to={link.to} className={({ isActive }) => `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition ${isActive ? 'text-red-600' : 'text-[#17345c] hover:text-red-600'}`}>
                                <link.Icon className='h-4 w-4' />{link.name}
                            </NavLink>
                        </li>
                    ))}

                    <li
                        className='relative'
                        onMouseEnter={() => { setIsExploreOpen(true); setIsServicesOpen(false) }}
                        onMouseLeave={() => setIsExploreOpen(false)}
                    >
                        <button
                            type='button'
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition ${isExploreOpen ? 'text-red-600' : 'text-[#17345c] hover:text-red-600'}`}
                            aria-haspopup='menu'
                            aria-expanded={isExploreOpen}
                        >
                            <FiGrid className='h-4 w-4' />Explore
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
                                    className='absolute left-1/2 top-full z-20 mt-3 w-64 -translate-x-1/2 overflow-hidden rounded-2xl border border-[#dfe8f0] bg-white p-2 shadow-2xl'
                                    role='menu'
                                >
                                    {exploreLinks.map((link) => (
                                        <NavLink
                                            key={link.name}
                                            to={link.to}
                                            className='flex items-center gap-3 rounded-lg px-3 py-3 transition hover:bg-red-50'
                                            role='menuitem'
                                            onClick={() => setIsExploreOpen(false)}
                                        >
                                            <link.Icon className='h-5 w-5 text-red-600' /><span><span className='block text-sm font-bold text-[#17345c]'>{link.name}</span><span className='block text-[10px] text-[#7890a8]'>{link.description}</span></span><FiArrowUpRight className='ml-auto h-4 w-4 text-[#7890a8]' />
                                        </NavLink>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </li>
                </ul>

                <div className='hidden items-center gap-1.5 md:flex'>
                    <div className='hidden items-center gap-2 rounded-full px-2 py-1.5 text-[11px] text-[#7890a8] xl:flex'><FiSearch className='h-4 w-4 text-[#17345c]' />Search services, tips...</div>
                    {!isAuthed && !isHydratingAuth ? (
                        <>
                            <NavLink to={authLinks[0].to} className={navItemClass}>
                                {authLinks[0].name}
                            </NavLink>
                            <NavLink
                                to={authLinks[1].to}
                                className={({ isActive }) => (
                                    isActive
                                        ? 'px-2 py-1.5 text-xs font-semibold text-red-600'
                                        : 'px-2 py-1.5 text-xs font-semibold text-red-600 transition hover:text-red-700'
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
                                    className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 hover:text-red-600'
                                    aria-haspopup='menu'
                                    aria-expanded={isProfileOpen}
                                    aria-label='Open account menu'
                                    title='Account menu'
                                >
                                    <FiUser className='h-5 w-5' aria-hidden='true' />
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
                        className='rounded-full bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 hover:shadow'
                    >
                        <span className='inline-flex items-center gap-2'>
                            <FiPhoneCall className='h-4 w-4' aria-hidden='true' />
                            Call Now <FiArrowUpRight className='h-4 w-4' />
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

                            <li className='rounded-xl border border-[#dfe8f0] bg-red-50/50 p-2'>
                                <div className='flex items-center justify-between px-2 py-1'><p className='flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#17345c]'><FiTool className='text-red-600' />Services</p><NavLink to='/services' className='text-xs font-bold text-red-600' onClick={() => setIsOpen(false)}>View all</NavLink></div>
                                <div className='mt-1 grid grid-cols-2 gap-1'>
                                    {serviceItems.slice(0, 8).map((service) => (
                                        <NavLink key={service.title} to={`/book-repair?service=${encodeURIComponent(service.title)}`} className='rounded-md px-2 py-2 text-xs font-semibold text-gray-700 hover:bg-white hover:text-red-600' onClick={() => setIsOpen(false)}>{service.title}</NavLink>
                                    ))}
                                </div>
                            </li>

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

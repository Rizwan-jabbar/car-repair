import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
    FiChevronDown,
    FiCompass,
    FiEdit3,
    FiFileText,
    FiHelpCircle,
    FiHome,
    FiList,
    FiLogIn,
    FiMail,
    FiMessageSquare,
    FiImage,
    FiPlusCircle,
    FiSettings,
    FiStar,
    FiTool,
    FiUserPlus,
    FiUsers,
    FiMenu,
    FiX,
} from 'react-icons/fi'
import sidebarHero from '../pictures/banner3.jpg'

const getGroupFromPath = (path) => {
    if (path === '/admin') return 'dashboard'
    if (path.startsWith('/admin/services')) return 'services'
    if (path.startsWith('/admin/bookings')) return 'booking'
    if (path.startsWith('/admin/reviews')) return 'reviews'
    if (path.startsWith('/admin/faq')) return 'faq'
    if (path.startsWith('/admin/tips-for-car')) return 'car-tips'
    if (path.startsWith('/admin/contact')) return 'contact'
    if (path.startsWith('/admin/banner')) return 'banner'
    if (path.startsWith('/admin/auth')) return 'auth-pages'
    return 'dashboard'
}

function SideBar () {
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const { pathname } = useLocation()
    const [openGroup, setOpenGroup] = useState(getGroupFromPath(pathname))

    useEffect(() => {
        setOpenGroup(getGroupFromPath(pathname))
        setIsMobileOpen(false)
    }, [pathname])

    const groupClass = 'overflow-hidden rounded-2xl'
    const summaryClass = 'flex min-h-[62px] w-full items-center justify-between gap-3 rounded-2xl border px-5 py-3 text-left text-base font-bold transition'
    const navItemBaseClass = 'mx-1 flex min-h-[52px] items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition'
    const navItemInactiveClass = 'text-[#243957] hover:bg-red-50 hover:text-red-700'
    const navItemActiveClass = 'bg-gradient-to-r from-red-50 to-rose-50 text-[#1c3150] shadow-sm ring-1 ring-red-100'

    const closeMobile = () => setIsMobileOpen(false)
    const toggleGroup = (groupKey) => setOpenGroup((prev) => (prev === groupKey ? null : groupKey))

    const navLinkClass = ({ isActive }) => `${navItemBaseClass} ${isActive ? navItemActiveClass : navItemInactiveClass}`

    const sections = [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: FiHome,
            items: [
                { type: 'link', to: '/admin', end: true, icon: FiCompass, label: 'Dashboard' },
            ],
        },
        {
            key: 'services',
            label: 'Services',
            icon: FiTool,
            items: [
                { type: 'link', to: '/admin/services/view', icon: FiList, label: 'View Services' },
                { type: 'link', to: '/admin/services/add', icon: FiPlusCircle, label: 'Add New Service' },
                { type: 'soon', icon: FiSettings, label: 'Manage Services (coming soon)' },
            ],
        },
        {
            key: 'booking',
            label: 'Booking',
            icon: FiFileText,
            items: [
                { type: 'link', to: '/admin/bookings/view', icon: FiList, label: 'View Booking' },
            ],
        },
        {
            key: 'reviews',
            label: 'Reviews',
            icon: FiStar,
            items: [
                { type: 'link', to: '/admin/reviews/view', icon: FiList, label: 'View Reviews' },
                { type: 'soon', icon: FiMessageSquare, label: 'Manage Feedback (coming soon)' },
            ],
        },
        {
            key: 'faq',
            label: 'FAQ',
            icon: FiHelpCircle,
            items: [
                { type: 'link', to: '/admin/faq/view', icon: FiFileText, label: 'View FAQs' },
                { type: 'link', to: '/admin/faq/add', icon: FiPlusCircle, label: 'Add New FAQ' },
            ],
        },
        {
            key: 'car-tips',
            label: 'Car Tips',
            icon: FiCompass,
            items: [
                { type: 'link', to: '/admin/tips-for-car/view', icon: FiList, label: 'View Car Tips' },
                { type: 'soon', icon: FiPlusCircle, label: 'Add New Tip (coming soon)' },
            ],
        },
        {
            key: 'contact',
            label: 'Contact',
            icon: FiMail,
            items: [
                { type: 'link', to: '/admin/contact/view', icon: FiCompass, label: 'View Contact Page' },
                { type: 'soon', icon: FiUsers, label: 'Manage Contact Requests (coming soon)' },
            ],
        },
        {
            key: 'banner',
            label: 'Banner',
            icon: FiImage,
            items: [
                { type: 'link', to: '/admin/banner/view', icon: FiList, label: 'View Banner' },
                { type: 'link', to: '/admin/banner/update', icon: FiEdit3, label: 'Update Banner' },
            ],
        },
        {
            key: 'auth-pages',
            label: 'Auth Pages',
            icon: FiLogIn,
            items: [
                { type: 'link', to: '/admin/auth/login-page', icon: FiLogIn, label: 'Login Page' },
                { type: 'link', to: '/admin/auth/register-page', icon: FiUserPlus, label: 'Register Page' },
            ],
        },
    ]

    const menuContent = (
        <>
            <div className='relative mb-4 h-[132px] overflow-hidden rounded-2xl bg-[#101b2e] shadow-lg'>
                <img src={sidebarHero} alt='' className='absolute inset-0 h-full w-full object-cover opacity-45' />
                <div className='absolute inset-0 bg-gradient-to-r from-[#0b1527] via-[#101b2e]/90 to-transparent' />
                <div className='relative flex h-full items-center gap-3 px-5'>
                    <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-900/30'><FiTool className='h-6 w-6' /></span>
                    <div><p className='text-[10px] font-bold uppercase tracking-[0.22em] text-slate-300'>Admin Panel</p><p className='mt-1 text-xl font-extrabold text-white'>Website Navigation</p><p className='mt-1 text-xs text-slate-300'>Manage your website content easily</p></div>
                </div>
            </div>

            <div className='space-y-3'>
                {sections.map((section) => {
                    const SectionIcon = section.icon
                    const isOpen = openGroup === section.key

                    return (
                        <div key={section.key} className={groupClass}>
                            <button
                                type='button'
                                className={`${summaryClass} ${isOpen ? 'border-red-500 bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-200' : 'border-[#e5edf6] bg-white text-[#243957] shadow-sm hover:border-red-100 hover:bg-red-50/40'}`}
                                onClick={() => toggleGroup(section.key)}
                            >
                                <span className='inline-flex items-center gap-3'>
                                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${isOpen ? 'bg-red-700 text-white' : 'bg-red-50 text-red-600'}`}><SectionIcon className='h-5 w-5' /></span>
                                    {section.label}
                                </span>
                                <FiChevronDown className={`h-5 w-5 transition ${isOpen ? 'rotate-180 text-white/90' : 'text-[#64748b]'}`} />
                            </button>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        key={`${section.key}-content`}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.24, ease: 'easeInOut' }}
                                        className='overflow-hidden'
                                    >
                                        <div className='mt-3 space-y-2 rounded-2xl border-l-4 border-red-500 bg-white/70 px-2 pb-3 pt-1 shadow-sm'>
                                            {section.items.map((item) => {
                                                const ItemIcon = item.icon

                                                if (item.type === 'soon') {
                                                    return (
                                                        <button
                                                            key={item.label}
                                                            type='button'
                                                            disabled
                                                            className={`${navItemBaseClass} cursor-not-allowed text-gray-400`}
                                                        >
                                                            <ItemIcon className='h-4 w-4 text-gray-400' />
                                                            {item.label}
                                                        </button>
                                                    )
                                                }

                                                return (
                                                    <NavLink
                                                        key={item.to}
                                                        to={item.to}
                                                        end={item.end}
                                                        className={navLinkClass}
                                                        onClick={closeMobile}
                                                    >
                                                        {({ isActive }) => (
                                                            <>
                                                                <span className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-red-600' : 'bg-slate-300'}`} />
                                                                <ItemIcon className={`h-5 w-5 rounded-lg p-1 ${isActive ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`} />
                                                                {item.label}
                                                            </>
                                                        )}
                                                    </NavLink>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })}
            </div>
        </>
    )

    return (
        <div className='w-full lg:h-full lg:min-h-0'>
            <div className='mb-3 flex lg:hidden'>
                <button
                    type='button'
                    onClick={() => setIsMobileOpen(true)}
                    className='inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50'
                >
                    <FiMenu className='h-4 w-4 text-red-600' />
                    Open Menu
                </button>
            </div>

            {isMobileOpen && (
                <div className='fixed inset-0 z-[60] lg:hidden'>
                    <button
                        type='button'
                        aria-label='Close menu overlay'
                        onClick={closeMobile}
                        className='absolute inset-0 bg-black/40'
                    />

                    <aside className='absolute left-0 top-0 h-full w-[88vw] max-w-sm overflow-y-auto border-r border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4 shadow-xl'>
                        <div className='mb-3 flex justify-end'>
                            <button
                                type='button'
                                onClick={closeMobile}
                                className='inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50'
                            >
                                <FiX className='h-4 w-4' />
                                Close
                            </button>
                        </div>

                        {menuContent}
                    </aside>
                </div>
            )}

            <aside className='hidden h-full w-full max-w-sm min-h-0 rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4 shadow-sm lg:sticky lg:top-0 lg:block lg:overflow-y-auto'>
                {menuContent}
            </aside>
        </div>
    )
}

export default SideBar

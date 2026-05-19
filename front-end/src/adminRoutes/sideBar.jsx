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

    const groupClass = 'overflow-hidden rounded-2xl border border-gray-200 bg-white/95 shadow-sm'
    const summaryClass = 'flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition'
    const navItemBaseClass = 'mx-1 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition'
    const navItemInactiveClass = 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
    const navItemActiveClass = 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 ring-1 ring-red-200 shadow-sm'

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
            <div className='mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3'>
                <p className='text-xs font-semibold uppercase tracking-wide text-red-700'>Admin Panel</p>
                <p className='mt-1 text-sm font-extrabold text-gray-900'>Website Navigation</p>
            </div>

            <div className='space-y-3'>
                {sections.map((section) => {
                    const SectionIcon = section.icon
                    const isOpen = openGroup === section.key

                    return (
                        <div key={section.key} className={groupClass}>
                            <button
                                type='button'
                                className={`${summaryClass} ${isOpen ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm' : 'text-gray-800 hover:bg-gray-50'}`}
                                onClick={() => toggleGroup(section.key)}
                            >
                                <span className='inline-flex items-center gap-2'>
                                    <SectionIcon className={`h-4 w-4 ${isOpen ? 'text-white' : 'text-red-600'}`} />
                                    {section.label}
                                </span>
                                <FiChevronDown className={`h-4 w-4 transition ${isOpen ? 'rotate-180 text-white/90' : 'text-gray-500'}`} />
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
                                        <div className='mt-3 space-y-2 px-3 pb-3'>
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
                                                                <ItemIcon className={`h-4 w-4 ${isActive ? 'text-red-600' : 'text-gray-500'}`} />
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
        <div className='w-full'>
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

            <aside className='hidden w-full max-w-sm rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4 shadow-sm lg:sticky lg:top-4 lg:block lg:max-h-[calc(100dvh-2rem)] lg:overflow-y-auto'>
                {menuContent}
            </aside>
        </div>
    )
}

export default SideBar

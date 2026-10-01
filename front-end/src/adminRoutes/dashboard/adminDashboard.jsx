import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    FiBarChart2,
    FiCalendar,
    FiCheckCircle,
    FiEye,
    FiFileText,
    FiImage,
    FiMail,
    FiMessageSquare,
    FiMoreVertical,
    FiTool,
    FiTrendingUp,
    FiArrowRight,
} from 'react-icons/fi'

import { getAllBookings } from '../../rtk/thunks/bookingThunk/bookingThunk'
import { fetchServices } from '../../rtk/thunks/serviceThunk/serviceThunk'
import { fetchReviews } from '../../rtk/thunks/reviewThunk/reviewThunk'
import { fetchFaqs } from '../../rtk/thunks/faqThunk/faqThunk'
import { getAllContacts } from '../../rtk/thunks/contactThunk/contactThunk'
import { fetchBanners } from '../../rtk/thunks/bannerThunk/bannerThunk'
import { getMediaUrl } from '../../rtk/utils/apiUrl'

function AdminDashboard () {
    const dispatch = useDispatch()
    const dashboardImage = getMediaUrl('/uploads/cartips.png')

    const bookingState = useSelector((state) => state.booking)
    const serviceState = useSelector((state) => state.service)
    const reviewState = useSelector((state) => state.review)
    const faqState = useSelector((state) => state.faq)
    const contactState = useSelector((state) => state.contact)
    const bannerState = useSelector((state) => state.banner)

    useEffect(() => {
        dispatch(getAllBookings())
        dispatch(fetchServices())
        dispatch(fetchReviews())
        dispatch(fetchFaqs())
        dispatch(getAllContacts())
        dispatch(fetchBanners())
    }, [dispatch])

    const bookings = useMemo(() => (
        Array.isArray(bookingState?.booking?.bookings) ? bookingState.booking.bookings : []
    ), [bookingState?.booking])

    const services = useMemo(() => {
        const list = Array.isArray(serviceState?.items) ? serviceState.items : []
        return list
            .map((item) => item?.service ?? item)
            .filter((service) => service && typeof service === 'object')
    }, [serviceState?.items])

    const reviews = useMemo(() => (
        Array.isArray(reviewState?.items) ? reviewState.items : []
    ), [reviewState?.items])

    const faqs = useMemo(() => {
        const list = Array.isArray(faqState?.items) ? faqState.items : []
        return list
            .map((item) => item?.faq ?? item)
            .filter((faq) => faq && typeof faq === 'object')
    }, [faqState?.items])

    const contacts = useMemo(() => (
        Array.isArray(contactState?.contacts) ? contactState.contacts : []
    ), [contactState?.contacts])

    const banners = useMemo(() => (
        Array.isArray(bannerState?.banners) ? bannerState.banners : []
    ), [bannerState?.banners])

    const bookingSummary = useMemo(() => {
        const summary = {
            pending: 0,
            inProgress: 0,
            completed: 0,
            cancelled: 0,
        }

        bookings.forEach((item) => {
            const status = String(item?.status || 'Pending').toLowerCase()
            if (status === 'pending') summary.pending += 1
            else if (status === 'in progress') summary.inProgress += 1
            else if (status === 'completed') summary.completed += 1
            else if (status === 'cancelled') summary.cancelled += 1
        })

        return summary
    }, [bookings])

    const activeServicesCount = useMemo(
        () => services.filter((service) => service?.isAvailable !== false).length,
        [services],
    )

    const visibleReviewsCount = useMemo(
        () => reviews.filter((review) => review?.visible !== false && review?.isVisible !== false).length,
        [reviews],
    )

    const inactiveServicesCount = services.length - activeServicesCount
    const hiddenReviewsCount = reviews.length - visibleReviewsCount
    const averageRating = useMemo(() => {
        if (reviews.length === 0) return 0
        const sum = reviews.reduce((acc, item) => acc + (Number(item?.rating) || 0), 0)
        return Math.round((sum / reviews.length) * 10) / 10
    }, [reviews])

    const faqCategoriesCount = useMemo(() => {
        const categories = new Set(
            faqs
                .map((faq) => String(faq?.category || '').trim())
                .filter(Boolean),
        )
        return categories.size
    }, [faqs])

    const contactsWithPhoneCount = useMemo(
        () => contacts.filter((item) => String(item?.phone || '').trim()).length,
        [contacts],
    )

    const contactsWithEmailCount = useMemo(
        () => contacts.filter((item) => String(item?.email || '').trim()).length,
        [contacts],
    )

    const bannerImagesCount = useMemo(
        () => banners.reduce((count, banner) => {
            const images = [banner?.imageOne, banner?.imageTwo, banner?.imageThree].filter(Boolean)
            return count + images.length
        }, 0),
        [banners],
    )

    const totalEntities = bookings.length + services.length + reviews.length + faqs.length + contacts.length + banners.length
    const bookingCompletionRate = bookings.length ? Math.round((bookingSummary.completed / bookings.length) * 100) : 0
    const serviceAvailabilityRate = services.length ? Math.round((activeServicesCount / services.length) * 100) : 0
    const reviewVisibilityRate = reviews.length ? Math.round((visibleReviewsCount / reviews.length) * 100) : 0

    const cards = [
        {
            label: 'Bookings',
            value: bookings.length,
            icon: FiCalendar,
            tone: 'text-red-600 bg-red-50 border-red-100',
            stats: [
                { label: 'Pending', value: bookingSummary.pending, color: 'text-amber-700', bg: 'bg-amber-500' },
                { label: 'In Progress', value: bookingSummary.inProgress, color: 'text-blue-700', bg: 'bg-blue-500' },
                { label: 'Completed', value: bookingSummary.completed, color: 'text-emerald-700', bg: 'bg-emerald-500' },
                { label: 'Cancelled', value: bookingSummary.cancelled, color: 'text-red-700', bg: 'bg-red-500' },
            ],
        },
        {
            label: 'Services',
            value: services.length,
            icon: FiTool,
            tone: 'text-red-600 bg-red-50 border-red-100',
            stats: [
                { label: 'Active', value: activeServicesCount, color: 'text-emerald-700', bg: 'bg-emerald-500' },
                { label: 'Inactive', value: inactiveServicesCount, color: 'text-gray-700', bg: 'bg-gray-500' },
            ],
        },
        {
            label: 'Reviews',
            value: reviews.length,
            icon: FiMessageSquare,
            tone: 'text-red-600 bg-red-50 border-red-100',
            stats: [
                { label: 'Visible', value: visibleReviewsCount, color: 'text-emerald-700', bg: 'bg-emerald-500' },
                { label: 'Hidden', value: hiddenReviewsCount, color: 'text-gray-700', bg: 'bg-gray-500' },
                { label: 'Avg Rating', value: averageRating, color: 'text-amber-700', bg: 'bg-amber-500' },
            ],
        },
        {
            label: 'FAQs',
            value: faqs.length,
            icon: FiFileText,
            tone: 'text-red-600 bg-red-50 border-red-100',
            stats: [
                { label: 'Categories', value: faqCategoriesCount, color: 'text-blue-700', bg: 'bg-blue-500' },
            ],
        },
        {
            label: 'Contacts',
            value: contacts.length,
            icon: FiMail,
            tone: 'text-red-600 bg-red-50 border-red-100',
            stats: [
                { label: 'With Phone', value: contactsWithPhoneCount, color: 'text-emerald-700', bg: 'bg-emerald-500' },
                { label: 'With Email', value: contactsWithEmailCount, color: 'text-blue-700', bg: 'bg-blue-500' },
            ],
        },
        {
            label: 'Banners',
            value: banners.length,
            icon: FiImage,
            tone: 'text-red-600 bg-red-50 border-red-100',
            stats: [
                { label: 'Total Images', value: bannerImagesCount, color: 'text-purple-700', bg: 'bg-purple-500' },
            ],
        },
    ]

    const quickStats = [
        { label: 'Total Records', value: totalEntities, icon: FiBarChart2, tone: 'red', change: '+12%' },
        { label: 'Booking Completion', value: `${bookingCompletionRate}%`, icon: FiCheckCircle, tone: 'green', change: '0%' },
        { label: 'Service Availability', value: `${serviceAvailabilityRate}%`, icon: FiTrendingUp, tone: 'blue', change: '+8%' },
        { label: 'Review Visibility', value: `${reviewVisibilityRate}%`, icon: FiEye, tone: 'purple', change: '+10%' },
    ]

    const toneStyles = {
        red: { card: 'border-red-200 bg-red-50/55', icon: 'bg-red-500 text-white', text: 'text-red-600', line: 'bg-red-400' },
        green: { card: 'border-emerald-200 bg-emerald-50/55', icon: 'bg-emerald-500 text-white', text: 'text-emerald-600', line: 'bg-emerald-400' },
        blue: { card: 'border-blue-200 bg-blue-50/55', icon: 'bg-blue-500 text-white', text: 'text-blue-600', line: 'bg-blue-400' },
        purple: { card: 'border-purple-200 bg-purple-50/55', icon: 'bg-purple-500 text-white', text: 'text-purple-600', line: 'bg-purple-400' },
    }

    const getStatWidth = (card, item) => {
        if (item.label === 'Avg Rating') {
            return Math.min(100, Math.max(0, (Number(item.value) / 5) * 100))
        }

        const total = Number(card.value || 0)
        if (!total) return 0

        return Math.min(100, Math.max(0, (Number(item.value || 0) / total) * 100))
    }

    const hasError = bookingState?.error || serviceState?.error || reviewState?.error || faqState?.error || contactState?.error || bannerState?.error

    return (
        <section className='relative overflow-hidden bg-[#f5f9fe]'>
            <div className='mb-4 grid min-h-[132px] items-center overflow-hidden rounded-2xl border border-white bg-gradient-to-r from-white via-[#f7fbff] to-[#eaf3fc] px-5 py-5 shadow-sm sm:px-6 lg:grid-cols-[1fr_310px]'>
                <div className='relative z-10'>
                    <p className='inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-red-600'><FiBarChart2 className='h-3.5 w-3.5' /> Dashboard Overview</p>
                    <h1 className='mt-2 text-2xl font-extrabold tracking-tight text-[#112744] sm:text-3xl'>Dashboard Overview</h1>
                    <p className='mt-1 text-xs text-[#6b82a0] sm:text-sm'>Here’s a quick snapshot of your car service business performance.</p>
                </div>
                <div className='relative hidden h-full overflow-hidden lg:block'>
                    <div className='absolute -right-8 -top-16 h-40 w-40 rotate-[38deg] border-[14px] border-red-200/70' />
                    <img src={dashboardImage} alt='' className='absolute -right-20 bottom-[-68px] h-52 w-80 object-cover object-right opacity-55 mix-blend-multiply' />
                </div>
                <div className='absolute right-4 top-5 z-10 hidden items-center gap-2 rounded-lg border border-[#e0e9f3] bg-white px-3 py-2 text-[10px] font-semibold text-[#667e9b] shadow-sm sm:flex lg:right-5 lg:top-5'>
                    <FiCalendar className='h-4 w-4 text-[#6883a2]' /> Mon, 7 Apr 2025 - Sun, 13 Apr 2025 <span className='text-xs'>⌄</span>
                </div>
            </div>

            {hasError && (
                <div className='mb-4 rounded-xl border border-red-200 bg-red-50 p-3'>
                    <p className='text-sm font-semibold text-red-700'>Some dashboard data could not be loaded.</p>
                </div>
            )}

            <div className='mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                {quickStats.map((item) => {
                    const Icon = item.icon
                    const style = toneStyles[item.tone]
                    return (
                        <article key={item.label} className={`relative overflow-hidden rounded-xl border-l-4 p-3.5 shadow-sm ${style.card}`}>
                            <div className='flex items-start justify-between gap-2'>
                                <div className='flex items-center gap-3'>
                                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${style.icon}`}><Icon className='h-5 w-5' /></span>
                                    <div><p className='text-[11px] font-semibold text-[#647b98]'>{item.label}</p><p className='mt-1 text-2xl font-extrabold text-[#102441]'>{item.value}</p></div>
                                </div>
                                <FiMoreVertical className={`h-4 w-4 ${style.text}`} />
                            </div>
                            <div className='mt-3 flex items-end justify-between'><p className={`text-[10px] font-bold ${style.text}`}>↗ {item.change}</p><p className='text-[10px] text-[#8093aa]'>vs last week</p><div className='h-7 w-24 overflow-hidden'><div className={`mt-4 h-5 w-28 -skew-y-6 rounded-t-full opacity-30 ${style.line}`} /></div></div>
                        </article>
                    )
                })}
            </div>

            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                {cards.map((card) => {
                    const Icon = card.icon
                    return (
                        <article
                            key={card.label}
                            className={`group relative overflow-hidden rounded-xl border border-l-4 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${card.label === 'Bookings' ? 'border-red-200 border-l-red-400' : card.label === 'Services' ? 'border-blue-200 border-l-blue-400' : card.label === 'Reviews' ? 'border-purple-200 border-l-purple-500' : card.label === 'FAQs' ? 'border-cyan-200 border-l-cyan-500' : card.label === 'Contacts' ? 'border-pink-200 border-l-pink-500' : 'border-purple-200 border-l-purple-500'}`}
                        >
                            <div className='flex items-start justify-between gap-3 pb-3'>
                                <div className='flex items-center gap-3'><span className={`inline-flex h-10 w-10 items-center justify-center rounded-full shadow-sm ${card.label === 'Bookings' ? 'bg-red-100 text-red-600' : card.label === 'Services' ? 'bg-blue-100 text-blue-600' : card.label === 'Reviews' ? 'bg-purple-100 text-purple-600' : card.label === 'FAQs' ? 'bg-cyan-100 text-cyan-600' : card.label === 'Contacts' ? 'bg-pink-100 text-pink-600' : 'bg-purple-100 text-purple-600'}`}>
                                    <Icon className='h-5 w-5' />
                                </span><div><p className='text-sm font-bold text-[#607a9c]'>{card.label}</p><p className='mt-1 text-2xl font-extrabold text-[#102441]'>{card.value}</p></div></div>
                                <button type='button' className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-blue-600 transition hover:bg-blue-50' aria-label={`Open ${card.label}`}><FiArrowRight className='h-4 w-4' /></button>
                            </div>

                            <div className='mt-3 space-y-2'>
                                {card.stats.map((item) => (
                                    <div
                                        key={`${card.label}-${item.label}`}
                                        className='flex items-center justify-between px-2 py-1.5'
                                    >
                                        <div className='min-w-0 flex-1'>
                                            <div className='flex items-center justify-between gap-2'>
                                                <span className='inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600'>
                                                    <span className={`h-3.5 w-3.5 rounded-full ${item.bg || 'bg-gray-400'}`} />
                                                    {item.label}
                                                </span>
                                                <span className={`text-xs font-extrabold ${item.color}`}>{item.value}</span>
                                            </div>
                                            <div className='mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#e8eff7]'>
                                                <div
                                                    className={`h-full rounded-full ${item.bg || 'bg-red-500'}`}
                                                    style={{ width: `${getStatWidth(card, item)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}

export default AdminDashboard

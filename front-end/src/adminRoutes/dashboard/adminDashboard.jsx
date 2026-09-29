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
    FiTool,
    FiTrendingUp,
} from 'react-icons/fi'

import { getAllBookings } from '../../rtk/thunks/bookingThunk/bookingThunk'
import { fetchServices } from '../../rtk/thunks/serviceThunk/serviceThunk'
import { fetchReviews } from '../../rtk/thunks/reviewThunk/reviewThunk'
import { fetchFaqs } from '../../rtk/thunks/faqThunk/faqThunk'
import { getAllContacts } from '../../rtk/thunks/contactThunk/contactThunk'
import { fetchBanners } from '../../rtk/thunks/bannerThunk/bannerThunk'

function AdminDashboard () {
    const dispatch = useDispatch()

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
        { label: 'Total Records', value: totalEntities, icon: FiBarChart2, tone: 'text-red-700 border-red-200 bg-red-50' },
        { label: 'Booking Completion', value: `${bookingCompletionRate}%`, icon: FiCheckCircle, tone: 'text-emerald-700 border-emerald-200 bg-emerald-50' },
        { label: 'Service Availability', value: `${serviceAvailabilityRate}%`, icon: FiTrendingUp, tone: 'text-blue-700 border-blue-200 bg-blue-50' },
        { label: 'Review Visibility', value: `${reviewVisibilityRate}%`, icon: FiEye, tone: 'text-purple-700 border-purple-200 bg-purple-50' },
    ]

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
        <section className='relative'>
            <div className='mb-5 rounded-2xl border border-red-100 bg-gradient-to-r from-white via-white to-red-50 p-4 shadow-sm sm:p-5'>
                <p className='inline-flex items-center rounded-full border border-red-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-700'>
                    Live Analytics
                </p>
                <h1 className='mt-3 text-2xl font-extrabold tracking-tight text-gray-900'>Dashboard Overview</h1>
                <p className='mt-1 text-sm text-gray-600'>All dynamic website stats in one place.</p>
            </div>

            {hasError && (
                <div className='mb-4 rounded-xl border border-red-200 bg-red-50 p-3'>
                    <p className='text-sm font-semibold text-red-700'>Some dashboard data could not be loaded.</p>
                </div>
            )}

            <div className='mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                {quickStats.map((item) => {
                    const Icon = item.icon
                    return (
                        <article key={item.label} className={`rounded-xl border p-3 shadow-sm ${item.tone}`}>
                            <div className='flex items-center justify-between gap-2'>
                                <p className='text-xs font-semibold uppercase tracking-wide'>{item.label}</p>
                                <Icon className='h-4 w-4' />
                            </div>
                            <p className='mt-2 text-2xl font-extrabold'>{item.value}</p>
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
                            className='group relative overflow-hidden rounded-2xl border border-red-100/80 bg-gradient-to-br from-white via-white to-red-50/40 p-4 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-red-100'
                        >
                            <div className='pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-red-100/40 blur-2xl transition group-hover:bg-red-200/50' />

                            <div className='flex items-start justify-between gap-3 border-b border-red-100/70 pb-3'>
                                <div>
                                    <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>{card.label}</p>
                                    <p className='mt-2 text-3xl font-extrabold text-gray-900'>{card.value}</p>
                                </div>
                                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm ${card.tone}`}>
                                    <Icon className='h-5 w-5' />
                                </span>
                            </div>

                            <div className='mt-3 space-y-2'>
                                {card.stats.map((item) => (
                                    <div
                                        key={`${card.label}-${item.label}`}
                                        className='flex items-center justify-between rounded-lg border border-white/80 bg-white/80 px-2.5 py-2 shadow-sm transition group-hover:bg-white'
                                    >
                                        <div className='min-w-0 flex-1'>
                                            <div className='flex items-center justify-between gap-2'>
                                                <span className='inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600'>
                                                    <FiEye className='h-3.5 w-3.5 text-gray-400' />
                                                    {item.label}
                                                </span>
                                                <span className={`text-sm font-extrabold ${item.color}`}>{item.value}</span>
                                            </div>
                                            <div className='mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-200'>
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

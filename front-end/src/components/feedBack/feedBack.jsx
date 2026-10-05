import { useEffect, useMemo, useState } from 'react'
import { FiCheckCircle, FiSend, FiStar, FiTool, FiUser, FiPhone, FiMail, FiTag } from 'react-icons/fi'
import { motion } from 'framer-motion'

import { cardIn, fadeUp, sectionStagger, viewportOnce } from '../../utils/motion'
import { useDispatch, useSelector } from 'react-redux'

import { createReview } from '../../rtk/thunks/reviewThunk/reviewThunk'
import { resetReviewCreate } from '../../rtk/slices/reviewSlice/reviewSlice'
import { fetchServices } from '../../rtk/thunks/serviceThunk/serviceThunk'

function FeedBack () {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.user)
    const { created, loading, error } = useSelector((state) => state.review)
    const { items: serviceItems = [], loading: servicesLoading, error: servicesError } = useSelector((state) => state.service)
    const serviceOptions = useMemo(() => {
        const list = Array.isArray(serviceItems) ? serviceItems : []
        return list
            .map((item) => item?.service ?? item)
            .filter((item) => item?.isAvailable !== false && item?.title)
            .map((item) => item.title)
    }, [serviceItems])

    const [rating, setRating] = useState(5)
    const [hoverRating, setHoverRating] = useState(null)
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        service: '',
        title: '',
        body: '',
    })

    useEffect(() => {
        dispatch(fetchServices())
    }, [dispatch])

    const [touched, setTouched] = useState({})

    const errors = useMemo(() => {
        const e = {}
        const name = form.name || user?.name || ''
        if (!name.trim()) e.name = 'Required'
        if (!form.title.trim()) e.title = 'Required'
        if (!form.service.trim()) e.service = 'Required'
        if (!form.body.trim()) e.body = 'Required'
        if (!rating || rating < 1) e.rating = 'Required'
        return e
    }, [form, rating, user])

    const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }))
    const markTouched = (key) => setTouched((p) => ({ ...p, [key]: true }))

    const onSubmit = (e) => {
        e.preventDefault()

        setTouched({
            name: true,
            phone: true,
            email: true,
            service: true,
            title: true,
            body: true,
            rating: true,
        })

        if (Object.keys(errors).length > 0) return

        dispatch(
            createReview({
                name: form.name || user?.name || '',
                phone: form.phone || user?.contact || '',
                email: form.email || user?.email || '',
                rating,
                title: form.title,
                service: form.service,
                body: form.body,
            })
        )
    }

    const active = hoverRating ?? rating

    return (
        <motion.section
            className='cr-section cr-section-light overflow-hidden'
            initial='hidden'
            whileInView='show'
            viewport={viewportOnce}
            variants={sectionStagger}
        >
            <div className='pointer-events-none absolute inset-0 -z-10'>
                <div className='absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl' />
                <div className='absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-gray-900/5 blur-3xl' />
            </div>

            <div className='cr-container cr-section-pad'>
                <div className='overflow-hidden rounded-xl border border-[#dfe8f0] bg-white shadow-sm lg:grid lg:grid-cols-5'>
                    <motion.div className='relative space-y-3 overflow-hidden p-6 sm:p-8 lg:col-span-2 lg:p-10' variants={fadeUp}>
                        <div className='pointer-events-none absolute -left-14 bottom-0 h-48 w-48 rounded-full border-[18px] border-[#edf3f8]' />
                        <p className='relative inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-red-600'>
                            <span className='h-px w-9 bg-red-500' />
                            Share Your Experience
                            <span className='h-px w-9 bg-red-500' />
                        </p>
                        <h3 className='relative mt-3 max-w-sm text-3xl font-extrabold leading-tight tracking-tight text-[#102957] sm:text-4xl'>
                            Your feedback helps us improve
                        </h3>
                        <p className='relative max-w-sm text-sm leading-6 text-[#31557d]'>
                            Tell us about your experience with our auto service. Your review helps us serve you and others better.
                        </p>
                        <div className='relative mt-8 grid grid-cols-3 gap-3 border-t border-[#e4ebf2] pt-5'>
                            <div className='text-center'><FiTool className='mx-auto h-6 w-6 text-red-600' /><p className='mt-2 text-[10px] font-bold leading-3 text-[#17345c]'>Better<br />Service</p></div>
                            <div className='border-x border-[#e4ebf2] text-center'><FiCheckCircle className='mx-auto h-6 w-6 text-red-600' /><p className='mt-2 text-[10px] font-bold leading-3 text-[#17345c]'>Higher<br />Standards</p></div>
                            <div className='text-center'><FiStar className='mx-auto h-6 w-6 text-red-600' /><p className='mt-2 text-[10px] font-bold leading-3 text-[#17345c]'>A Stronger<br />Community</p></div>
                        </div>
                    </motion.div>

                    <motion.div className='border-l border-[#e4ebf2] lg:col-span-3' variants={cardIn}>
                        <div className='overflow-hidden bg-white'>

                            {!created ? (
                                <form onSubmit={onSubmit} className='space-y-3 px-5 py-4 sm:px-7 sm:py-5'>
                                    <div>
                                        <div className='flex items-center justify-between gap-3'>
                                            <p className='text-[11px] font-bold text-[#17345c]'>Your Rating <span className='text-red-600'>*</span></p>
                                            {touched.rating && errors.rating && (
                                                <p className='text-xs font-semibold text-red-600'>{errors.rating}</p>
                                            )}
                                        </div>

                                        <div className='mt-1 flex flex-wrap items-center gap-1'>
                                            {Array.from({ length: 5 }).map((_, i) => {
                                                const v = i + 1
                                                const filled = v <= active
                                                return (
                                                    <button
                                                        key={v}
                                                        type='button'
                                                        onMouseEnter={() => setHoverRating(v)}
                                                        onMouseLeave={() => setHoverRating(null)}
                                                        onClick={() => setRating(v)}
                                                        aria-label={`${v} star`}
                                                        className='rounded-md border border-transparent p-1 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2'
                                                    >
                                                        <FiStar
                                                            className={filled ? 'h-6 w-6 text-amber-500' : 'h-6 w-6 text-gray-300'}
                                                            aria-hidden='true'
                                                        />
                                                    </button>
                                                )
                                            })}
                                            <span className='ml-2 text-xs font-semibold text-[#527292]'>
                                                {rating}/5
                                            </span>
                                        </div>
                                    </div>

                                    <label className='block'>
                                        <span className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                            <FiTag className='h-4 w-4 text-gray-500' aria-hidden='true' />
                                            Title
                                        </span>
                                        <input
                                            type='text'
                                            value={form.title}
                                            onChange={(e) => setField('title', e.target.value)}
                                            onBlur={() => markTouched('title')}
                                            placeholder='e.g. Quick service and clear communication'
                                            className='mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100'
                                        />
                                        {touched.title && errors.title && (
                                            <p className='mt-1 text-xs font-semibold text-red-600'>{errors.title}</p>
                                        )}
                                    </label>

                                    <div className='grid gap-4 sm:grid-cols-2'>
                                        <label className='block'>
                                            <span className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                                <FiTool className='h-4 w-4 text-gray-500' aria-hidden='true' />
                                                Service
                                            </span>
                                            <select
                                                value={form.service}
                                                onChange={(e) => setField('service', e.target.value)}
                                                onBlur={() => markTouched('service')}
                                                disabled={servicesLoading || Boolean(servicesError) || serviceOptions.length === 0}
                                                className='mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100'
                                            >
                                                <option value=''>
                                                    {servicesLoading ? 'Loading services...' : servicesError ? 'Unable to load services. Please try again.' : serviceOptions.length === 0 ? 'No services are currently available.' : 'Select a service'}
                                                </option>
                                                {serviceOptions.map((t) => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                            {touched.service && errors.service && (
                                                <p className='mt-1 text-xs font-semibold text-red-600'>{errors.service}</p>
                                            )}
                                        </label>

                                        <label className='block'>
                                            <span className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                                <FiUser className='h-4 w-4 text-gray-500' aria-hidden='true' />
                                                Name
                                            </span>
                                            <input
                                                type='text'
                                                value={form.name || user?.name || ''}
                                                onChange={(e) => setField('name', e.target.value)}
                                                onBlur={() => markTouched('name')}
                                                placeholder='Your name'
                                                className='mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100'
                                            />
                                            {touched.name && errors.name && (
                                                <p className='mt-1 text-xs font-semibold text-red-600'>{errors.name}</p>
                                            )}
                                        </label>
                                    </div>

                                    <div className='grid gap-4 sm:grid-cols-2'>
                                        <label className='block'>
                                            <span className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                                <FiPhone className='h-4 w-4 text-gray-500' aria-hidden='true' />
                                                Phone (optional)
                                            </span>
                                            <input
                                                type='tel'
                                                value={form.phone || user?.contact || ''}
                                                onChange={(e) => setField('phone', e.target.value)}
                                                placeholder='03xx-xxxxxxx'
                                                className='mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100'
                                            />
                                        </label>

                                        <label className='block'>
                                            <span className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                                <FiMail className='h-4 w-4 text-gray-500' aria-hidden='true' />
                                                Email (optional)
                                            </span>
                                            <input
                                                type='email'
                                                value={form.email || user?.email || ''}
                                                onChange={(e) => setField('email', e.target.value)}
                                                placeholder='you@email.com'
                                                className='mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100'
                                            />
                                        </label>
                                    </div>

                                    <label className='block'>
                                        <span className='text-[11px] font-bold text-[#17345c]'>Your Review <span className='text-red-600'>*</span></span>
                                        <textarea
                                            value={form.body}
                                            onChange={(e) => setField('body', e.target.value)}
                                            onBlur={() => markTouched('body')}
                                            rows={4}
                                            placeholder='Write your review…'
                                            className='mt-1 w-full resize-none rounded-md border border-[#d8e3ed] bg-white px-3 py-2 text-xs text-gray-900 outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100'
                                        />
                                        {touched.body && errors.body && (
                                            <p className='mt-1 text-xs font-semibold text-red-600'>{errors.body}</p>
                                        )}
                                    </label>

                                    {error && (
                                        <div className='rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700'>
                                            {typeof error === 'string' ? error : (error?.message || 'Review submission failed')}
                                        </div>
                                    )}

                                    <button
                                        type='submit'
                                        className='inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 ease-out hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 active:translate-y-0'
                                        disabled={loading}
                                    >
                                        <FiSend className='h-4 w-4' aria-hidden='true' />
                                        {loading ? <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' aria-label='Submitting review' /> : 'Submit review'}
                                    </button>
                                </form>
                            ) : (
                                <div className='p-6 sm:p-8'>
                                    <div className='rounded-2xl border border-emerald-200 bg-emerald-50 p-6'>
                                    <div className='flex items-start gap-3'>
                                        <FiCheckCircle className='mt-0.5 h-5 w-5 text-emerald-600' aria-hidden='true' />
                                        <div>
                                            <p className='text-sm font-extrabold text-emerald-900'>Done</p>
                                            <p className='mt-1 text-sm leading-6 text-emerald-900/80'>Thanks.</p>
                                        </div>
                                    </div>

                                    </div>

                                    <button
                                        type='button'
                                        onClick={() => {
                                            dispatch(resetReviewCreate())
                                            setTouched({})
                                            setForm({
                                                name: user?.name || '',
                                                phone: user?.contact || '',
                                                email: user?.email || '',
                                                service: '',
                                                title: '',
                                                body: '',
                                            })
                                            setRating(5)
                                        }}
                                        className='mt-5 inline-flex w-full items-center justify-center rounded-xl border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'
                                    >
                                        New feedback
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    )
}

export default FeedBack

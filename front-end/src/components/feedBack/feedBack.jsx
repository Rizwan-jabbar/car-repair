import { useEffect, useMemo, useState } from 'react'
import { FiCheckCircle, FiSend, FiStar, FiTool, FiUser, FiPhone, FiMail, FiTag } from 'react-icons/fi'
import { motion } from 'framer-motion'

import { cardIn, fadeUp, sectionStagger, viewportOnce } from '../../utils/motion'
import { serviceTitles } from '../../data/servicesCatalog'
import { useDispatch, useSelector } from 'react-redux'

import { createReview } from '../../rtk/thunks/reviewThunk/reviewThunk'
import { resetReviewCreate } from '../../rtk/slices/reviewSlice/reviewSlice'

function FeedBack () {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.user)
    const { created, loading, error } = useSelector((state) => state.review)

    const [rating, setRating] = useState(5)
    const [hoverRating, setHoverRating] = useState(null)
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        service: serviceTitles[0] ?? 'Engine Diagnostics',
        title: '',
        body: '',
    })
    const [touched, setTouched] = useState({})

    // Prefill from logged-in user (but still editable)
    useEffect(() => {
        if (!user) return
        setForm((prev) => ({
            ...prev,
            name: prev.name || user.name || '',
            email: prev.email || user.email || '',
            phone: prev.phone || user.contact || '',
        }))
    }, [user])

    const errors = useMemo(() => {
        const e = {}
        if (!form.name.trim()) e.name = 'Required'
        if (!form.title.trim()) e.title = 'Required'
        if (!form.service.trim()) e.service = 'Required'
        if (!form.body.trim()) e.body = 'Required'
        if (!rating || rating < 1) e.rating = 'Required'
        return e
    }, [form, rating])

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
                name: form.name,
                phone: form.phone,
                email: form.email,
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
                <div className='grid items-start gap-8 lg:grid-cols-5'>
                    <motion.div className='space-y-3 lg:col-span-2' variants={fadeUp}>
                        <p className='inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700'>
                            <span className='h-2 w-2 rounded-full bg-red-600' />
                            Feedback
                        </p>
                        <h3 className='text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl'>
                            Share your experience
                        </h3>
                        <p className='max-w-sm text-sm leading-6 text-gray-600'>
                            A quick rating + short message helps us improve.
                        </p>
                    </motion.div>

                    <motion.div className='lg:col-span-3' variants={cardIn}>
                        <div className='overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5'>
                            <div className='border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-5 sm:px-8'>
                                <p className='text-sm font-extrabold text-gray-900'>Leave feedback</p>
                                <p className='mt-1 text-sm text-gray-600'>No long forms—just the essentials.</p>
                            </div>

                            {!created ? (
                                <form onSubmit={onSubmit} className='space-y-6 px-6 py-6 sm:px-8 sm:py-8'>
                                    <div>
                                        <div className='flex items-center justify-between gap-3'>
                                            <p className='text-sm font-semibold text-gray-900'>Rating</p>
                                            {touched.rating && errors.rating && (
                                                <p className='text-xs font-semibold text-red-600'>{errors.rating}</p>
                                            )}
                                        </div>

                                        <div className='mt-2 flex flex-wrap items-center gap-1.5'>
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
                                                        className='rounded-lg border border-transparent p-1.5 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2'
                                                    >
                                                        <FiStar
                                                            className={filled ? 'h-5 w-5 text-amber-500' : 'h-5 w-5 text-gray-300'}
                                                            aria-hidden='true'
                                                        />
                                                    </button>
                                                )
                                            })}
                                            <span className='ml-2 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600 ring-1 ring-gray-200'>
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
                                            placeholder='e.g. Quick service and transparent pricing'
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
                                                className='mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100'
                                            >
                                                {serviceTitles.map((t) => (
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
                                                value={form.name}
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
                                                value={form.phone}
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
                                                value={form.email}
                                                onChange={(e) => setField('email', e.target.value)}
                                                placeholder='you@email.com'
                                                className='mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100'
                                            />
                                        </label>
                                    </div>

                                    <label className='block'>
                                        <span className='text-sm font-semibold text-gray-900'>Review</span>
                                        <textarea
                                            value={form.body}
                                            onChange={(e) => setField('body', e.target.value)}
                                            onBlur={() => markTouched('body')}
                                            rows={4}
                                            placeholder='Write your review…'
                                            className='mt-2 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100'
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
                                        className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 active:translate-y-0'
                                        disabled={loading}
                                    >
                                        <FiSend className='h-4 w-4' aria-hidden='true' />
                                        {loading ? 'Submitting...' : 'Submit review'}
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
                                                service: serviceTitles[0] ?? 'Engine Diagnostics',
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
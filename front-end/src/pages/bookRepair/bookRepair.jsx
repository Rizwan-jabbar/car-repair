import { useEffect, useMemo, useState } from 'react'
import { FiCalendar, FiClock, FiMapPin, FiPhone, FiTool, FiUser, FiMail, FiCheckCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { NavLink, useSearchParams } from 'react-router-dom'

import { serviceTitles } from '../../data/servicesCatalog'
import { cardIn, fadeUp, sectionStagger, viewportOnce } from '../../utils/motion'
import { useDispatch, useSelector } from 'react-redux'

import { bookRepair } from '../../rtk/thunks/bookingThunk/bookingThunk'
import { resetBooking } from '../../rtk/slices/bookRepair/bookRepair'

function BookRepair () {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const { booking, loading, error } = useSelector((state) => state.booking)
    const serviceOptions = useMemo(() => ([...serviceTitles, 'Others']), [])
    const requestedService = (searchParams.get('service') || '').trim()
    const defaultService = serviceOptions[0] ?? 'Engine Diagnostics'

    const [form, setForm] = useState(() => {
        let initialService = defaultService
        let initialOtherService = ''

        if (requestedService) {
            if (serviceOptions.includes(requestedService)) {
                initialService = requestedService
            } else {
                initialService = 'Others'
                initialOtherService = requestedService
            }
        }

        return {
        fullName: '',
        phone: '',
        email: '',
        carModel: '',
        service: initialService,
        otherService: initialOtherService,
        cityArea: '',
        preferredDate: '',
        preferredTime: '',
        notes: '',
        consent: true,
        }
    })

    // If the URL query changes while staying on this page, keep the service in sync.
    useEffect(() => {
        if (!requestedService) return

        if (serviceOptions.includes(requestedService)) {
            setForm((prev) => ({ ...prev, service: requestedService, otherService: '' }))
            return
        }

        setForm((prev) => ({ ...prev, service: 'Others', otherService: requestedService }))
    }, [requestedService, serviceOptions])

    const [touched, setTouched] = useState({})

    useEffect(() => {
        dispatch(resetBooking())

        return () => {
            dispatch(resetBooking())
        }
    }, [dispatch])

    const errors = useMemo(() => {
        const e = {}

        if (!form.fullName.trim()) e.fullName = 'Full name is required'
        if (!form.phone.trim()) e.phone = 'Phone number is required'
        if (!form.carModel.trim()) e.carModel = 'Car model is required'
        if (!form.cityArea.trim()) e.cityArea = 'City / Area is required'
        if (!form.preferredDate) e.preferredDate = 'Preferred date is required'
        if (!form.preferredTime) e.preferredTime = 'Preferred time is required'
        if (!form.service) e.service = 'Please select a service'
        if (form.service === 'Others' && !form.otherService.trim()) e.otherService = 'Please describe the service'
        if (!form.consent) e.consent = 'Please confirm consent'

        if (form.email.trim()) {
            const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
            if (!ok) e.email = 'Please enter a valid email'
        }

        return e
    }, [form])

    const hasErrors = Object.keys(errors).length > 0

    const setField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    const markTouched = (key) => setTouched((prev) => ({ ...prev, [key]: true }))

    const onSubmit = (e) => {
        e.preventDefault()

        setTouched({
            fullName: true,
            phone: true,
            email: true,
            carModel: true,
            service: true,
            otherService: true,
            cityArea: true,
            preferredDate: true,
            preferredTime: true,
            consent: true,
        })

        if (Object.keys(errors).length > 0) return

        // Uses your existing RTK thunk (adds token automatically and calls the backend controller)
        dispatch(bookRepair(form))
    }

    return (
        <motion.section
            id='book-repair'
            className='cr-section cr-section-muted'
            initial='hidden'
            whileInView='show'
            viewport={viewportOnce}
            variants={sectionStagger}
        >
            <div className='pointer-events-none absolute inset-0 -z-10'>
                <div className='absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl' />
                <div className='absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-gray-900/5 blur-3xl' />
            </div>

            <div className='cr-container cr-section-pad'>
                <div className='flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end'>
                    <motion.div variants={fadeUp}>
                        <p className='inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700'>
                            <span className='h-2 w-2 rounded-full bg-red-600' />
                            Book Repair
                        </p>
                        <h2 className='mt-3 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl'>
                            Get a quick booking in minutes
                        </h2>
                        <p className='mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-relaxed'>
                            Share your details and we’ll confirm the schedule and estimate. No hidden charges—ever.
                        </p>
                    </motion.div>

                    <motion.a
                        href='tel:+923001234567'
                        className='cr-btn-primary'
                        variants={fadeUp}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Call for Emergency
                    </motion.a>
                </div>

                <div className='mt-10 grid gap-6 lg:grid-cols-5'>
                    <div className='lg:col-span-3'>
                        <motion.div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8' variants={cardIn}>
                            {!booking ? (
                                <form onSubmit={onSubmit} className='space-y-6'>
                                    <div className='grid gap-4 sm:grid-cols-2'>
                                        <label className='block'>
                                            <span className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                                <FiUser className='h-4 w-4 text-gray-500' aria-hidden='true' />
                                                Full name
                                            </span>
                                            <input
                                                type='text'
                                                value={form.fullName}
                                                onChange={(e) => setField('fullName', e.target.value)}
                                                onBlur={() => markTouched('fullName')}
                                                placeholder='e.g. Ali Khan'
                                                className='cr-input'
                                            />
                                            {touched.fullName && errors.fullName && (
                                                <p className='mt-1 text-xs font-semibold text-red-600'>{errors.fullName}</p>
                                            )}
                                        </label>

                                        <label className='block'>
                                            <span className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                                <FiPhone className='h-4 w-4 text-gray-500' aria-hidden='true' />
                                                Phone
                                            </span>
                                            <input
                                                type='tel'
                                                value={form.phone}
                                                onChange={(e) => setField('phone', e.target.value)}
                                                onBlur={() => markTouched('phone')}
                                                placeholder='e.g. +92 3xx xxxxxxx'
                                                className='cr-input'
                                            />
                                            {touched.phone && errors.phone && (
                                                <p className='mt-1 text-xs font-semibold text-red-600'>{errors.phone}</p>
                                            )}
                                        </label>
                                    </div>

                                    <div className='grid gap-4 sm:grid-cols-2'>
                                        <label className='block'>
                                            <span className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                                <FiMail className='h-4 w-4 text-gray-500' aria-hidden='true' />
                                                Email (optional)
                                            </span>
                                            <input
                                                type='email'
                                                value={form.email}
                                                onChange={(e) => setField('email', e.target.value)}
                                                onBlur={() => markTouched('email')}
                                                placeholder='e.g. ali@email.com'
                                                className='cr-input'
                                            />
                                            {touched.email && errors.email && (
                                                <p className='mt-1 text-xs font-semibold text-red-600'>{errors.email}</p>
                                            )}
                                        </label>

                                        <label className='block'>
                                            <span className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                                <FiTool className='h-4 w-4 text-gray-500' aria-hidden='true' />
                                                Car model
                                            </span>
                                            <input
                                                type='text'
                                                value={form.carModel}
                                                onChange={(e) => setField('carModel', e.target.value)}
                                                onBlur={() => markTouched('carModel')}
                                                placeholder='e.g. Corolla 2018'
                                                className='cr-input'
                                            />
                                            {touched.carModel && errors.carModel && (
                                                <p className='mt-1 text-xs font-semibold text-red-600'>{errors.carModel}</p>
                                            )}
                                        </label>
                                    </div>

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
                                                className='cr-input'
                                            >
                                                {serviceOptions.map((title) => (
                                                    <option key={title} value={title}>{title}</option>
                                                ))}
                                            </select>
                                            {touched.service && errors.service && (
                                                <p className='mt-1 text-xs font-semibold text-red-600'>{errors.service}</p>
                                            )}
                                        </label>

                                        <label className='block'>
                                            <span className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                                <FiMapPin className='h-4 w-4 text-gray-500' aria-hidden='true' />
                                                City / Area
                                            </span>
                                            <input
                                                type='text'
                                                value={form.cityArea}
                                                onChange={(e) => setField('cityArea', e.target.value)}
                                                onBlur={() => markTouched('cityArea')}
                                                placeholder='e.g. Lahore, Johar Town'
                                                className='cr-input'
                                            />
                                            {touched.cityArea && errors.cityArea && (
                                                <p className='mt-1 text-xs font-semibold text-red-600'>{errors.cityArea}</p>
                                            )}
                                        </label>
                                    </div>

                                    {form.service === 'Others' && (
                                        <label className='block'>
                                            <span className='text-sm font-semibold text-gray-900'>Please describe the service</span>
                                            <input
                                                type='text'
                                                value={form.otherService}
                                                onChange={(e) => setField('otherService', e.target.value)}
                                                onBlur={() => markTouched('otherService')}
                                                placeholder='e.g. Suspension noise / steering issue'
                                                className='cr-input'
                                            />
                                            {touched.otherService && errors.otherService && (
                                                <p className='mt-1 text-xs font-semibold text-red-600'>{errors.otherService}</p>
                                            )}
                                        </label>
                                    )}

                                    <div className='grid gap-4 sm:grid-cols-2'>
                                        <label className='block'>
                                            <span className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                                <FiCalendar className='h-4 w-4 text-gray-500' aria-hidden='true' />
                                                Preferred date
                                            </span>
                                            <input
                                                type='date'
                                                value={form.preferredDate}
                                                onChange={(e) => setField('preferredDate', e.target.value)}
                                                onBlur={() => markTouched('preferredDate')}
                                                className='cr-input'
                                            />
                                            {touched.preferredDate && errors.preferredDate && (
                                                <p className='mt-1 text-xs font-semibold text-red-600'>{errors.preferredDate}</p>
                                            )}
                                        </label>

                                        <label className='block'>
                                            <span className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                                <FiClock className='h-4 w-4 text-gray-500' aria-hidden='true' />
                                                Preferred time
                                            </span>
                                            <input
                                                type='time'
                                                value={form.preferredTime}
                                                onChange={(e) => setField('preferredTime', e.target.value)}
                                                onBlur={() => markTouched('preferredTime')}
                                                className='cr-input'
                                            />
                                            {touched.preferredTime && errors.preferredTime && (
                                                <p className='mt-1 text-xs font-semibold text-red-600'>{errors.preferredTime}</p>
                                            )}
                                        </label>
                                    </div>

                                    <label className='block'>
                                        <span className='text-sm font-semibold text-gray-900'>Notes (optional)</span>
                                        <textarea
                                            value={form.notes}
                                            onChange={(e) => setField('notes', e.target.value)}
                                            rows={4}
                                            placeholder='Tell us about the issue (noise, warning light, leaking, etc.)'
                                            className='cr-textarea'
                                        />
                                    </label>

                                    <label className='flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4'>
                                        <input
                                            type='checkbox'
                                            checked={form.consent}
                                            onChange={(e) => setField('consent', e.target.checked)}
                                            onBlur={() => markTouched('consent')}
                                            className='mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600'
                                        />
                                        <span className='text-sm text-gray-700'>
                                            I agree to be contacted about this booking request.
                                            {touched.consent && errors.consent && (
                                                <span className='block text-xs font-semibold text-red-600'>{errors.consent}</span>
                                            )}
                                        </span>
                                    </label>

                                    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                                        {(error || hasErrors) && (
                                            <div className='text-sm font-semibold text-red-700'>
                                                {error && (typeof error === 'string' ? error : (error?.message || 'Booking failed'))}
                                                {!error && hasErrors && 'Please fill the required fields.'}
                                            </div>
                                        )}
                                        <button
                                            type='submit'
                                            className='cr-btn-primary'
                                            disabled={loading}
                                        >
                                            {loading ? 'Submitting...' : 'Submit Booking'}
                                        </button>

                                    </div>
                                </form>
                            ) : (
                                <div className='rounded-2xl border border-emerald-200 bg-emerald-50 p-6'>
                                    <div className='flex items-start gap-3'>
                                        <FiCheckCircle className='mt-0.5 h-5 w-5 text-emerald-600' aria-hidden='true' />
                                        <div>
                                            <p className='text-sm font-extrabold text-emerald-900'>Request submitted!</p>
                                            <p className='mt-1 text-sm leading-6 text-emerald-900/80'>
                                                We’ll contact you shortly to confirm the schedule and share an estimate.
                                            </p>
                                        </div>
                                    </div>

                                    <NavLink
                                        to='/'  
                                        className='mt-5 inline-flex items-center justify-center rounded-md border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 active:translate-y-0'
                                    >
                                        BACK TO HOME
                                    </NavLink>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    <aside className='lg:col-span-2'>
                        <div className='sticky top-24 space-y-4'>
                            <motion.div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm' variants={fadeUp}>
                                <p className='text-sm font-extrabold text-gray-900'>What happens next?</p>
                                <ol className='mt-3 space-y-3 text-sm text-gray-700'>
                                    <li className='flex gap-3'>
                                        <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-xs font-extrabold text-red-600 ring-1 ring-red-100'>1</span>
                                        <span>We review your request and confirm the appointment.</span>
                                    </li>
                                    <li className='flex gap-3'>
                                        <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-xs font-extrabold text-red-600 ring-1 ring-red-100'>2</span>
                                        <span>We share an estimate before starting any repair.</span>
                                    </li>
                                    <li className='flex gap-3'>
                                        <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-xs font-extrabold text-red-600 ring-1 ring-red-100'>3</span>
                                        <span>Service is completed and backed with warranty.</span>
                                    </li>
                                </ol>
                            </motion.div>

                            <motion.div className='rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-red-50 p-6 shadow-sm' variants={fadeUp}>
                                <p className='text-sm font-extrabold text-gray-900'>Need help choosing a service?</p>
                                <p className='mt-1 text-sm leading-6 text-gray-600'>Call us and we’ll guide you based on the symptoms.</p>
                                <motion.a
                                    href='tel:+923001234567'
                                    className='mt-4 inline-flex w-full items-center justify-center rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 active:translate-y-0'
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Call: +92 300 1234567
                                </motion.a>
                            </motion.div>
                        </div>
                    </aside>
                </div>
            </div>
        </motion.section>
    )
}

export default BookRepair
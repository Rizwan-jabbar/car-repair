import { useEffect, useMemo, useState } from 'react'
import { FiCalendar, FiClock, FiMapPin, FiPhone, FiTool, FiUser, FiMail, FiCheckCircle, FiShield, FiZap, FiAward, FiArrowRight } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'

import { cardIn, fadeUp, sectionStagger, viewportOnce } from '../../utils/motion'
import { useDispatch, useSelector } from 'react-redux'

import { bookRepair } from '../../rtk/thunks/bookingThunk/bookingThunk'
import { resetBooking } from '../../rtk/slices/bookRepair/bookRepair'
import bookingImage from '../../pictures/banner2.jpg'
import { getVerifiedToken } from '../../rtk/utils/authToken'
import { fetchServices } from '../../rtk/thunks/serviceThunk/serviceThunk'

function BookRepair () {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { booking, loading, error } = useSelector((state) => state.booking)
    const { items: serviceItems = [] } = useSelector((state) => state.service)
    const serviceOptions = useMemo(() => serviceItems
        .map((item) => item?.service ?? item)
        .filter((service) => service?.isAvailable !== false && service?.title)
        .map((service) => ({ id: service._id, title: service.title })), [serviceItems])
    const requestedService = (searchParams.get('service') || '').trim()
    const defaultService = serviceOptions[0]?.title || ''

    const [form, setForm] = useState(() => {
        let initialService = defaultService
        let initialOtherService = ''

        if (requestedService) {
            initialService = serviceOptions.some((service) => service.title === requestedService || service.id === requestedService)
                ? requestedService
                : ''
        }

        return {
        fullName: '',
        phone: '',
        email: '',
        carModel: '',
        vehicleBrand: '',
        manufacturingYear: '',
        registrationNumber: '',
        fuelType: 'Petrol',
        transmission: 'Manual',
        service: initialService,
        otherService: initialOtherService,
        cityArea: '',
        completeAddress: '',
        locationType: 'Visit Workshop',
        problemDescription: '',
        preferredDate: '',
        preferredTime: '',
        notes: '',
        consent: true,
        }
    })

    useEffect(() => {
        dispatch(fetchServices())
    }, [dispatch])

    // If the URL query changes while staying on this page, keep the service in sync.
    useEffect(() => {
        if (!requestedService) return

        if (serviceOptions.some((service) => service.title === requestedService || service.id === requestedService)) {
            setForm((prev) => ({ ...prev, service: requestedService, otherService: '' }))
            return
        }
        setForm((prev) => ({ ...prev, service: '' }))
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
        if (form.locationType === 'Mechanic at My Location' && !form.cityArea.trim()) e.cityArea = 'City / Area is required'
        if (form.locationType === 'Mechanic at My Location' && !form.completeAddress.trim()) e.completeAddress = 'Complete address is required'
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
            completeAddress: true,
            preferredDate: true,
            preferredTime: true,
            consent: true,
        })

        if (Object.keys(errors).length > 0) return

        // Uses your existing RTK thunk (adds token automatically and calls the backend controller)
        if (!getVerifiedToken()) {
            navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)
            return
        }
        dispatch(bookRepair(form))
    }

    return (
        <motion.section
            id='book-repair'
            className='cr-section cr-section-muted'
            style={{ backgroundImage: `linear-gradient(90deg, rgba(248,250,252,.98) 0%, rgba(248,250,252,.92) 48%, rgba(248,250,252,.35) 100%), url(${bookingImage})`, backgroundSize: 'cover', backgroundPosition: 'right top' }}
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
                        <p className='inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.16em] text-red-600'>
                            <span className='h-px w-9 bg-red-500' />
                            Book Repair
                            <span className='h-px w-9 bg-red-500' />
                        </p>
                        <h2 className='mt-3 max-w-md text-3xl font-extrabold leading-tight tracking-tight text-[#102957] sm:text-4xl'>
                            Get a quick booking <span className='text-red-600'>in minutes</span>
                        </h2>
                        <p className='mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-relaxed'>
                            Share your details and we’ll confirm the schedule and estimate. No hidden charges—ever.
                        </p>
                    </motion.div>

                    <div className='flex flex-wrap items-center gap-3 text-[10px] font-bold text-[#17345c]'>
                        <span className='flex items-center gap-2 rounded-full border border-[#dfe8f0] bg-white px-3 py-2'><FiShield className='h-5 w-5 text-red-600' />Trusted</span>
                        <span className='flex items-center gap-2 rounded-full border border-[#dfe8f0] bg-white px-3 py-2'><FiZap className='h-5 w-5 text-red-600' />Fast Service</span>
                        <span className='flex items-center gap-2 rounded-full border border-[#dfe8f0] bg-white px-3 py-2'><FiAward className='h-5 w-5 text-red-600' />Quality Parts</span>
                    </div>
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
                        <motion.div className='overflow-hidden rounded-xl border border-[#dfe8f0] bg-white shadow-sm' variants={cardIn}>
                            <div className='flex items-center justify-between border-b border-[#e5edf4] bg-white px-5 py-4 sm:px-7'>
                                <div className='flex items-center gap-3'><span className='flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600'><FiCalendar className='h-5 w-5' /></span><div><p className='text-sm font-extrabold text-[#17345c]'>Booking Details</p><p className='text-[10px] text-[#6d86a0]'>Fill in the information below to schedule your car repair service.</p></div></div>
                                <span className='hidden items-center gap-1 rounded-full bg-red-50 px-3 py-2 text-[10px] font-bold text-red-600 sm:flex'><FiTool /> Quick & Easy</span>
                            </div>
                            {!booking ? (
                                <form onSubmit={onSubmit} className='booking-form space-y-4 p-5 sm:p-7'>
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
                                        <label className='block'><span className='text-sm font-semibold text-gray-900'>Vehicle brand / make</span><input className='cr-input' value={form.vehicleBrand} onChange={(e) => setField('vehicleBrand', e.target.value)} placeholder='e.g. Toyota' /></label>
                                        <label className='block'><span className='text-sm font-semibold text-gray-900'>Manufacturing year</span><input className='cr-input' value={form.manufacturingYear} onChange={(e) => setField('manufacturingYear', e.target.value)} placeholder='e.g. 2020' /></label>
                                        <label className='block'><span className='text-sm font-semibold text-gray-900'>Registration number (optional)</span><input className='cr-input' value={form.registrationNumber} onChange={(e) => setField('registrationNumber', e.target.value)} placeholder='e.g. ABC-123' /></label>
                                        <label className='block'><span className='text-sm font-semibold text-gray-900'>Fuel type</span><select className='cr-input' value={form.fuelType} onChange={(e) => setField('fuelType', e.target.value)}><option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>Electric</option></select></label>
                                        <label className='block'><span className='text-sm font-semibold text-gray-900'>Transmission</span><select className='cr-input' value={form.transmission} onChange={(e) => setField('transmission', e.target.value)}><option>Manual</option><option>Automatic</option></select></label>
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
                                                {serviceOptions.map((service) => (
                                                    <option key={service.id || service.title} value={service.title}>{service.title}</option>
                                                ))}
                                            </select>
                                            {touched.service && errors.service && (
                                                <p className='mt-1 text-xs font-semibold text-red-600'>{errors.service}</p>
                                            )}
                                        </label>

                                        <label className='block'>
                                            <span className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                                <FiMapPin className='h-4 w-4 text-gray-500' aria-hidden='true' />
                                                Service location
                                            </span>
                                            <select className='cr-input' value={form.locationType} onChange={(e) => setField('locationType', e.target.value)}><option>Visit Workshop</option><option>Mechanic at My Location</option></select>
                                            {form.locationType === 'Mechanic at My Location' && <input type='text' value={form.cityArea} onChange={(e) => setField('cityArea', e.target.value)} onBlur={() => markTouched('cityArea')} placeholder='City / Area' className='cr-input mt-2' />}
                                            {touched.cityArea && errors.cityArea && (
                                                <p className='mt-1 text-xs font-semibold text-red-600'>{errors.cityArea}</p>
                                            )}
                                        </label>
                                    </div>

                                    {form.locationType === 'Mechanic at My Location' && <label className='block'><span className='text-sm font-semibold text-gray-900'>Complete address</span><textarea className='cr-input mt-2' value={form.completeAddress} onChange={(e) => setField('completeAddress', e.target.value)} onBlur={() => markTouched('completeAddress')} rows={2} placeholder='Enter the complete location address' />{touched.completeAddress && errors.completeAddress && <p className='mt-1 text-xs font-semibold text-red-600'>{errors.completeAddress}</p>}</label>}
                                    <label className='block'><span className='text-sm font-semibold text-gray-900'>Problem / symptoms</span><textarea className='cr-input mt-2' value={form.problemDescription} onChange={(e) => setField('problemDescription', e.target.value)} rows={3} placeholder='Tell us what you noticed' /></label>

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
                                            {loading ? <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' aria-label='Submitting booking' /> : 'Submit Booking'}
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
                            <motion.div className='relative min-h-[250px] overflow-hidden rounded-xl border border-[#1d3448] bg-[#101f33] p-6 text-white shadow-sm' variants={fadeUp}>
                                <img src={bookingImage} alt='' className='absolute inset-0 h-full w-full object-cover object-right opacity-55' />
                                <div className='absolute inset-0 bg-gradient-to-r from-[#101f33] via-[#101f33]/90 to-[#101f33]/35' />
                                <div className='relative border-l-4 border-red-600 pl-4'><p className='text-[10px] font-bold uppercase tracking-[0.18em] text-red-400'>Why choose us</p><h3 className='mt-2 text-3xl font-extrabold leading-tight'>Your Car, Our <span className='text-red-500'>Priority</span></h3></div>
                                <ul className='relative mt-6 space-y-3 text-xs text-gray-100'>
                                    <li className='flex items-center gap-2'><FiCheckCircle className='h-4 w-4 shrink-0 text-red-500' /> Expert & certified mechanics</li>
                                    <li className='flex items-center gap-2'><FiCheckCircle className='h-4 w-4 shrink-0 text-red-500' /> Modern diagnostic tools</li>
                                    <li className='flex items-center gap-2'><FiCheckCircle className='h-4 w-4 shrink-0 text-red-500' /> Fast and reliable service</li>
                                    <li className='flex items-center gap-2'><FiCheckCircle className='h-4 w-4 shrink-0 text-red-500' /> Affordable and transparent pricing</li>
                                </ul>
                            </motion.div>

                            <motion.div className='rounded-xl border border-[#dfe8f0] bg-white p-5 shadow-sm' variants={fadeUp}>
                                <div className='flex items-center gap-3'><span className='flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600'><FiPhone className='h-5 w-5' /></span><div><p className='text-xs font-extrabold text-[#17345c]'>Need help choosing a service?</p><p className='mt-1 text-[10px] text-[#6d86a0]'>Call us and we’ll guide you based on the symptoms.</p></div></div>
                                <motion.a href='tel:+923001234567' className='mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700' whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>Call: +92 300 1234567 <FiArrowRight /></motion.a>
                            </motion.div>

                            <motion.div className='rounded-xl border border-red-100 bg-white p-5 shadow-sm' variants={fadeUp}>
                                <div className='flex items-start gap-3 border-l-2 border-red-600 pl-4'><FiTool className='mt-1 h-6 w-6 text-red-600' /><div><p className='text-xs font-extrabold text-[#17345c]'>Quick Service. Better Performance.</p><p className='mt-1 text-[10px] leading-5 text-[#6d86a0]'>Keep your car in top condition with our professional repair services.</p></div></div>
                            </motion.div>

                        </div>
                    </aside>
                </div>
            </div>
        </motion.section>
    )
}

export default BookRepair
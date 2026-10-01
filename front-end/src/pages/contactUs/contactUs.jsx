import { useMemo, useState } from 'react'
import {
    FiMapPin,
    FiPhone,
    FiMail,
    FiClock,
    FiSend,
    FiMessageCircle,
    FiCheckCircle,
    FiTool,
    FiUser,
    FiMessageSquare,
} from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'

import { cardIn, fadeUp, sectionStagger, viewportOnce } from '../../utils/motion'
import { createContact } from '../../rtk/thunks/contactThunk/contactThunk'
import contactHero from '../../pictures/banner2.jpg'
import contactCard from '../../pictures/banner1.jpg'

function ContactUs () {
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.contact)

    const contact = useMemo(
        () => ({
            phoneDisplay: '+92 300 1234567',
            phoneHref: 'tel:+923001234567',
            email: 'support@carrepairpro.com',
            addressLine1: 'Car Repair Pro Workshop',
            addressLine2: 'Johar Town, Lahore',
            hours: 'Mon–Sun • 9:00 AM – 10:00 PM',
            whatsappHref: 'https://wa.me/923001234567',
            mapsHref: 'https://www.google.com/maps/search/?api=1&query=Car%20Repair%20Pro%20Johar%20Town%20Lahore',
        }),
        [],
    )

    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
    })
    const [touched, setTouched] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [submitError, setSubmitError] = useState('')

    const errors = useMemo(() => {
        const e = {}
        if (!form.name.trim()) e.name = 'Name is required'
        if (!form.phone.trim()) e.phone = 'Phone number is required'
        if (!form.message.trim()) e.message = 'Message is required'
        if (form.email.trim()) {
            const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
            if (!ok) e.email = 'Please enter a valid email'
        }
        return e
    }, [form])

    const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }))
    const markTouched = (key) => setTouched((p) => ({ ...p, [key]: true }))

    const onSubmit = async (e) => {
        e.preventDefault()
        setTouched({ name: true, phone: true, email: true, message: true })
        setSubmitError('')
        if (Object.keys(errors).length > 0) return

        try {
            await dispatch(
                createContact({
                    name: form.name.trim(),
                    phone: form.phone.trim(),
                    email: form.email.trim(),
                    message: form.message.trim(),
                }),
            ).unwrap()

            setSubmitted(true)
            setForm({
                name: '',
                phone: '',
                email: '',
                message: '',
            })
            setTouched({})
        } catch (error) {
            setSubmitError(error?.message || 'Failed to send message. Please try again.')
        }
    }

    return (
        <motion.section
            id='contact'
            className='cr-section cr-section-light'
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
                            Contact Us
                            <span className='h-px w-9 bg-red-500' />
                        </p>
                        <h2 className='mt-3 text-3xl font-extrabold tracking-tight text-[#102957] sm:text-4xl lg:text-[2.65rem]'>
                            Talk to a mechanic—fast
                        </h2>
                        <p className='mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-relaxed'>
                            Share your issue and we’ll guide you. For urgent cases, call us anytime.
                        </p>
                    </motion.div>

                    <motion.div className='flex flex-col gap-2 sm:flex-row' variants={fadeUp}>
                        <motion.a
                            href={contact.whatsappHref}
                            target='_blank'
                            rel='noreferrer'
                            className='inline-flex items-center justify-center gap-2 rounded-full border border-emerald-100 bg-white px-5 py-2.5 text-sm font-bold text-[#17345c] shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 active:translate-y-0'
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FiMessageCircle className='h-4 w-4' aria-hidden='true' />
                            WhatsApp
                        </motion.a>
                        <motion.a
                            href={contact.phoneHref}
                            className='inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 active:translate-y-0'
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FiPhone className='h-4 w-4' aria-hidden='true' />
                            Call Now
                        </motion.a>
                    </motion.div>
                </div>

                <div className='mt-10 grid gap-6 lg:grid-cols-5'>
                    <div className='lg:col-span-2'>
                        <div className='space-y-4'>
                            <motion.div className='rounded-xl border-l-4 border-red-600 bg-white p-5 shadow-sm' style={{ backgroundImage: `linear-gradient(90deg, rgba(255,255,255,.98), rgba(255,255,255,.72)), url(${contactCard})`, backgroundSize: 'cover', backgroundPosition: 'center' }} variants={cardIn}>
                                <div className='flex items-start gap-3'>
                                    <span className='inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-sm'>
                                        <FiPhone className='h-5 w-5' aria-hidden='true' />
                                    </span>
                                    <div>
                                        <p className='text-sm font-extrabold text-gray-900'>Phone</p>
                                        <a
                                            href={contact.phoneHref}
                                            className='mt-1 block text-sm font-semibold text-gray-700 transition hover:text-red-600'
                                        >
                                            {contact.phoneDisplay}
                                        </a>
                                        <p className='mt-1 text-xs text-gray-500'>Fastest response for emergencies</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div className='rounded-xl border-l-4 border-blue-600 bg-white p-5 shadow-sm' style={{ backgroundImage: `linear-gradient(90deg, rgba(255,255,255,.98), rgba(255,255,255,.72)), url(${contactCard})`, backgroundSize: 'cover', backgroundPosition: 'center' }} variants={cardIn}>
                                <div className='flex items-start gap-3'>
                                    <span className='inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm'>
                                        <FiMail className='h-5 w-5' aria-hidden='true' />
                                    </span>
                                    <div>
                                        <p className='text-sm font-extrabold text-gray-900'>Email</p>
                                        <a
                                            href={`mailto:${contact.email}`}
                                            className='mt-1 block text-sm font-semibold text-gray-700 transition hover:text-red-600'
                                        >
                                            {contact.email}
                                        </a>
                                        <p className='mt-1 text-xs text-gray-500'>For quotes and non-urgent requests</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div className='rounded-xl border-l-4 border-emerald-600 bg-white p-5 shadow-sm' style={{ backgroundImage: `linear-gradient(90deg, rgba(255,255,255,.98), rgba(255,255,255,.72)), url(${contactCard})`, backgroundSize: 'cover', backgroundPosition: 'center' }} variants={cardIn}>
                                <div className='flex items-start gap-3'>
                                    <span className='inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm'>
                                        <FiMapPin className='h-5 w-5' aria-hidden='true' />
                                    </span>
                                    <div>
                                        <p className='text-sm font-extrabold text-gray-900'>Address</p>
                                        <p className='mt-1 text-sm font-semibold text-gray-700'>{contact.addressLine1}</p>
                                        <p className='text-sm text-gray-600'>{contact.addressLine2}</p>
                                        <a
                                            href={contact.mapsHref}
                                            target='_blank'
                                            rel='noreferrer'
                                            className='mt-3 inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 active:translate-y-0'
                                        >
                                            Open in Google Maps
                                        </a>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div className='rounded-xl border-l-4 border-indigo-600 bg-white p-5 shadow-sm' style={{ backgroundImage: `linear-gradient(90deg, rgba(255,255,255,.98), rgba(255,255,255,.72)), url(${contactCard})`, backgroundSize: 'cover', backgroundPosition: 'center' }} variants={cardIn}>
                                <div className='flex items-start gap-3'>
                                    <span className='inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm'>
                                        <FiClock className='h-5 w-5' aria-hidden='true' />
                                    </span>
                                    <div>
                                        <p className='text-sm font-extrabold text-gray-900'>Working hours</p>
                                        <p className='mt-1 text-sm font-semibold text-gray-700'>{contact.hours}</p>
                                        <p className='mt-1 text-xs text-gray-500'>Emergency calls available</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className='lg:col-span-3'>
                        <motion.div className='overflow-hidden rounded-2xl border border-[#dfe8f0] bg-white shadow-sm' variants={fadeUp}>
                            {!submitted ? (
                                <>
                                    <div className='relative overflow-hidden bg-[#142238] px-6 py-5 text-white sm:px-8'>
                                        <img src={contactHero} alt='' className='absolute inset-0 h-full w-full object-cover opacity-35' />
                                        <div className='absolute inset-0 bg-[#142238]/75' />
                                        <div className='relative flex items-center gap-3'>
                                            <FiTool className='h-10 w-10 text-red-500' />
                                            <div><p className='text-xs uppercase tracking-[0.18em] text-gray-300'>Get in touch</p><h3 className='text-2xl font-extrabold sm:text-3xl'>Tell us about your issue</h3><p className='mt-1 text-xs text-gray-300'>Fill out the form below and our team will get back to you as soon as possible.</p></div>
                                        </div>
                                    </div>
                                <form onSubmit={onSubmit} className='space-y-4 p-6 sm:p-8'>
                                    <div className='grid gap-4 sm:grid-cols-2'>
                                        <label className='block'>
                                            <span className='text-xs font-bold text-[#17345c]'>Your name <span className='text-red-600'>*</span></span>
                                            <span className='relative mt-1 block'><FiUser className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#527292]' /><input type='text' value={form.name} onChange={(e) => setField('name', e.target.value)} onBlur={() => markTouched('name')} placeholder='e.g. Ali Khan' className='w-full rounded-md border border-[#d8e3ed] bg-white py-2.5 pl-10 pr-3 text-xs text-gray-900 outline-none transition placeholder:text-[#8ca3ba] focus:border-red-300 focus:ring-4 focus:ring-red-100' /></span>
                                            {touched.name && errors.name && (
                                                <p className='mt-1 text-xs font-semibold text-red-600'>{errors.name}</p>
                                            )}
                                        </label>

                                        <label className='block'>
                                            <span className='text-xs font-bold text-[#17345c]'>Phone <span className='text-red-600'>*</span></span>
                                            <span className='relative mt-1 block'><FiPhone className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#527292]' /><input type='tel' value={form.phone} onChange={(e) => setField('phone', e.target.value)} onBlur={() => markTouched('phone')} placeholder='e.g. +92 3xx xxxxxxx' className='w-full rounded-md border border-[#d8e3ed] bg-white py-2.5 pl-10 pr-3 text-xs text-gray-900 outline-none transition placeholder:text-[#8ca3ba] focus:border-red-300 focus:ring-4 focus:ring-red-100' /></span>
                                            {touched.phone && errors.phone && (
                                                <p className='mt-1 text-xs font-semibold text-red-600'>{errors.phone}</p>
                                            )}
                                        </label>
                                    </div>

                                    <label className='block'>
                                        <span className='text-xs font-bold text-[#17345c]'>Email <span className='font-normal text-[#527292]'>(optional)</span></span>
                                        <span className='relative mt-1 block'><FiMail className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#527292]' /><input type='email' value={form.email} onChange={(e) => setField('email', e.target.value)} onBlur={() => markTouched('email')} placeholder='e.g. ali@email.com' className='w-full rounded-md border border-[#d8e3ed] bg-white py-2.5 pl-10 pr-3 text-xs text-gray-900 outline-none transition placeholder:text-[#8ca3ba] focus:border-red-300 focus:ring-4 focus:ring-red-100' /></span>
                                        {touched.email && errors.email && (
                                            <p className='mt-1 text-xs font-semibold text-red-600'>{errors.email}</p>
                                        )}
                                    </label>

                                    <label className='block'>
                                        <span className='text-xs font-bold text-[#17345c]'>Message <span className='text-red-600'>*</span></span>
                                        <span className='relative mt-1 block'><FiMessageSquare className='pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#527292]' /><textarea value={form.message} onChange={(e) => setField('message', e.target.value)} onBlur={() => markTouched('message')} rows={4} maxLength={1000} placeholder='Tell us what’s wrong with the car (noise, warning light, AC issue, etc.)' className='w-full resize-none rounded-md border border-[#d8e3ed] bg-white py-2.5 pl-10 pr-3 text-xs text-gray-900 outline-none transition placeholder:text-[#8ca3ba] focus:border-red-300 focus:ring-4 focus:ring-red-100' /><span className='pointer-events-none absolute bottom-2 right-3 text-[9px] text-[#8ca3ba]'>{form.message.length}/1000</span></span>
                                        {touched.message && errors.message && (
                                            <p className='mt-1 text-xs font-semibold text-red-600'>{errors.message}</p>
                                        )}
                                    </label>

                                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                                        <button
                                            type='submit'
                                            className='inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-8 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2'
                                            disabled={loading}
                                        >
                                            <FiSend className='h-4 w-4' aria-hidden='true' />
                                            {loading ? 'Sending...' : 'Send message'}
                                        </button>
                                        <p className='text-xs font-semibold text-gray-500'>We usually respond within 30 minutes.</p>
                                    </div>

                                    {submitError && (
                                        <p className='text-sm font-semibold text-red-600'>{submitError}</p>
                                    )}
                                </form>
                                </>
                            ) : (
                                <div className='rounded-2xl border border-emerald-200 bg-emerald-50 p-6'>
                                    <div className='flex items-start gap-3'>
                                        <FiCheckCircle className='mt-0.5 h-5 w-5 text-emerald-600' aria-hidden='true' />
                                        <div>
                                            <p className='text-sm font-extrabold text-emerald-900'>Message sent!</p>
                                            <p className='mt-1 text-sm leading-6 text-emerald-900/80'>
                                                Thanks — we’ll contact you shortly.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type='button'
                                        onClick={() => {
                                            setSubmitted(false)
                                            setTouched({})
                                        }}
                                        className='mt-5 inline-flex items-center justify-center rounded-md border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 active:translate-y-0'
                                    >
                                        Send another message
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

export default ContactUs
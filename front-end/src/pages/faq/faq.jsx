import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
    FiChevronDown,
    FiClock,
    FiHelpCircle,
    FiMessageCircle,
    FiPhone,
    FiShield,
    FiTool,
} from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'

import { fetchFaqs } from '../../rtk/thunks/faqThunk/faqThunk'

import { cardIn, fadeUp, sectionStagger } from '../../utils/motion'

function Faq () {
    const dispatch = useDispatch()
    const { items = [], loading, error } = useSelector((state) => state.faq)

    useEffect(() => {
        dispatch(fetchFaqs())
    }, [dispatch])

    const faqs = useMemo(() => {
        const list = Array.isArray(items) ? items : []
        return list
            .map((item) => item?.faq ?? item)
            .filter((faq) => faq && typeof faq === 'object')
    }, [items])

    const faqGroups = useMemo(() => {
        const grouped = faqs.reduce((acc, faq) => {
            const category = faq?.category?.trim() || 'General Questions'
            if (!acc[category]) acc[category] = []
            acc[category].push(faq)
            return acc
        }, {})

        return Object.entries(grouped).map(([title, groupItems], index) => ({
            title,
            icon: [FiHelpCircle, FiShield, FiTool, FiClock][index % 4],
            items: groupItems,
        }))
    }, [faqs])

    const [openKey, setOpenKey] = useState('0-0')

    const totalQuestions = faqGroups.reduce((acc, g) => acc + g.items.length, 0)
    const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to load FAQs')

    return (
        <motion.section
            id='faq'
            className='cr-section cr-section-light'
            initial='hidden'
            animate='show'
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
                            FAQ
                        </p>
                        <h1 className='cr-heading-lg'>
                            Frequently asked questions
                        </h1>
                        <p className='mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-relaxed'>
                            Everything you need to know about bookings, pricing, parts, warranties, and support.
                            If you still need help, our team is one call away.
                        </p>
                    </motion.div>

                    <motion.div className='w-full max-w-sm p-5 cr-card' variants={cardIn}>
                        <p className='text-sm font-semibold text-gray-600'>Knowledge base</p>
                        <p className='mt-1 text-3xl font-extrabold text-gray-900'>{totalQuestions}</p>
                        <p className='mt-2 text-xs font-semibold text-gray-500'>Detailed answers across key service topics</p>

                        <div className='mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3'>
                            <p className='text-xs font-semibold text-gray-700'>Need immediate help?</p>
                            <div className='mt-2 flex flex-wrap gap-2'>
                                <a
                                    href='tel:+923001234567'
                                    className='inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 transition hover:bg-gray-50'
                                >
                                    <FiPhone className='h-3.5 w-3.5' aria-hidden='true' />
                                    Call
                                </a>
                                <a
                                    href='https://wa.me/923001234567'
                                    target='_blank'
                                    rel='noreferrer'
                                    className='inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 transition hover:bg-gray-50'
                                >
                                    <FiMessageCircle className='h-3.5 w-3.5' aria-hidden='true' />
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className='mt-10 grid gap-5 lg:grid-cols-2'>
                    {loading && (
                        <motion.div className='p-6 text-sm font-semibold text-gray-600 cr-card lg:col-span-2' variants={fadeUp}>
                            Loading FAQs...
                        </motion.div>
                    )}

                    {!loading && error && (
                        <motion.div className='p-6 cr-card lg:col-span-2' variants={fadeUp}>
                            <p className='text-sm font-semibold text-red-700'>{errorMessage}</p>
                            <button
                                type='button'
                                onClick={() => dispatch(fetchFaqs())}
                                className='mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100'
                            >
                                Retry
                            </button>
                        </motion.div>
                    )}

                    {!loading && !error && faqGroups.length === 0 && (
                        <motion.div className='p-6 text-sm font-semibold text-gray-600 cr-card lg:col-span-2' variants={fadeUp}>
                            No FAQs available right now.
                        </motion.div>
                    )}

                    {!loading && !error && faqGroups.map((group, groupIndex) => {
                        const GroupIcon = group.icon

                        return (
                            <motion.article key={group.title} className='p-6 cr-card' variants={cardIn}>
                                <div className='mb-4 flex items-center gap-2'>
                                    <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-700 ring-1 ring-red-100'>
                                        <GroupIcon className='h-4 w-4' aria-hidden='true' />
                                    </span>
                                    <h2 className='text-base font-extrabold tracking-tight text-gray-900'>{group.title}</h2>
                                </div>

                                <div className='space-y-3'>
                                    {group.items.map((faq, itemIndex) => {
                                        const key = `${groupIndex}-${itemIndex}`
                                        const isOpen = openKey === key

                                        return (
                                            <div key={faq?._id ?? `${faq.question}-${itemIndex}`} className='overflow-hidden rounded-xl border border-gray-200 bg-white'>
                                                <button
                                                    type='button'
                                                    onClick={() => setOpenKey((prev) => (prev === key ? '' : key))}
                                                    className='flex w-full items-center justify-between gap-3 px-4 py-3 text-left'
                                                    aria-expanded={isOpen}
                                                >
                                                    <span className='text-sm font-semibold text-gray-900'>{faq.question}</span>
                                                    <FiChevronDown
                                                        className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                                        aria-hidden='true'
                                                    />
                                                </button>

                                                <AnimatePresence initial={false}>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2, ease: 'easeOut' }}
                                                        >
                                                            <div className='border-t border-gray-100 px-4 py-3'>
                                                                <p className='text-sm leading-6 text-gray-600'>{faq.answer}</p>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.article>
                        )
                    })}
                </div>

                <motion.div
                    className='mt-8 rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-red-50 p-5 shadow-sm ring-1 ring-black/5 sm:p-6'
                    variants={fadeUp}
                >
                    <p className='text-sm font-extrabold text-gray-900'>Still have a question?</p>
                    <p className='mt-1 text-sm text-gray-600'>
                        Contact our support team and share your vehicle issue. We’ll guide you with the next best step.
                    </p>
                    <div className='mt-4 flex flex-wrap gap-2'>
                        <a href='/contact' className='cr-btn-primary'>Contact support</a>
                        <a href='/book-repair' className='cr-btn-outline'>Book a repair</a>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default Faq
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
import banner3 from '../../pictures/banner3.jpg'

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
                <div className='relative overflow-hidden rounded-3xl bg-slate-50 px-6 py-8 sm:px-10 sm:py-10'>
                    <div className='pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-cover bg-center lg:block' style={{ backgroundImage: `linear-gradient(90deg, rgba(248,250,252,1), rgba(248,250,252,0.05)), url(${banner3})` }} />
                    <div className='relative grid gap-8 lg:grid-cols-5 lg:items-center'>
                    <motion.div className='lg:col-span-3' variants={fadeUp}>
                        <p className='inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-red-600'>
                            <span className='h-px w-9 bg-red-500' />
                            FAQ
                        </p>
                        <h1 className='mt-3 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl'>
                            Frequently Asked <span className='text-red-600'>Questions</span>
                        </h1>
                        <p className='mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-relaxed'>
                            Everything you need to know about bookings, pricing, parts, warranties, and support.
                            If you still need help, our team is one call away.
                        </p>
                    </motion.div>

                    <motion.div className='relative w-full max-w-sm rounded-2xl border border-gray-200 bg-white/95 p-5 shadow-lg backdrop-blur-sm lg:col-span-2 lg:justify-self-end' variants={cardIn}>
                        <p className='text-xs font-semibold text-slate-500'>Knowledge Base</p>
                        <p className='mt-1 text-3xl font-extrabold text-red-600'>{totalQuestions}</p>
                        <p className='mt-2 text-xs font-semibold text-slate-500'>Detailed answers across key service topics</p>

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
                </div>

                <div className='mt-10 grid gap-5 lg:grid-cols-2'>
                    {loading && (
                        <motion.div className='flex min-h-40 items-center justify-center p-6 cr-card lg:col-span-2' variants={fadeUp} role='status' aria-label='Loading FAQs'>
                            <span className='h-8 w-8 animate-spin rounded-full border-4 border-red-100 border-t-red-600' />
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

                    {!loading && !error && faqGroups.flatMap((group, groupIndex) => group.items.map((faq, itemIndex) => {
                        const GroupIcon = group.icon
                        const key = `${groupIndex}-${itemIndex}`
                        const isOpen = openKey === key

                        return (
                            <motion.article key={faq?._id ?? `${faq.question}-${itemIndex}`} className={`overflow-hidden rounded-2xl border bg-[#fbfdff] shadow-[0_5px_18px_rgba(31,67,96,0.06)] transition hover:shadow-[0_8px_22px_rgba(31,67,96,0.1)] ${isOpen ? 'border-red-200' : 'border-[#dce7f0]'}`} variants={cardIn}>
                                <div className='flex min-h-[112px] items-center gap-3 px-4 py-4'>
                                    <span className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff0f1] text-red-600 ring-1 ring-red-100'>
                                        <GroupIcon className='h-4 w-4' aria-hidden='true' />
                                    </span>
                                    <div className='min-w-0'>
                                        <p className='text-xs font-semibold text-red-500'>{group.title}</p>
                                        <button
                                            type='button'
                                            onClick={() => setOpenKey((prev) => (prev === key ? '' : key))}
                                            className='mt-1 flex w-full items-center justify-between gap-3 text-left'
                                            aria-expanded={isOpen}
                                        >
                                            <span className='text-sm font-bold leading-5 text-[#17324d]'>{faq.question}</span>
                                            <FiChevronDown
                                                className={`h-4 w-4 shrink-0 text-[#17324d] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                                aria-hidden='true'
                                            />
                                        </button>
                                    </div>
                                </div>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2, ease: 'easeOut' }}
                                        >
                                            <div className='mx-4 mb-4 mt-0 border-l-2 border-red-500 bg-[#f7f6fb] px-4 py-3'>
                                                <p className='text-sm leading-6 text-[#49677f]'>{faq.answer}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.article>
                        )
                    }))}
                </div>

                <motion.div
                    className='relative mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 text-white shadow-sm sm:p-8'
                    variants={fadeUp}
                >
                    <div className='pointer-events-none absolute inset-y-0 right-0 hidden w-2/5 bg-cover bg-center opacity-70 sm:block' style={{ backgroundImage: `linear-gradient(90deg, rgba(2,12,24,1), rgba(2,12,24,0.1)), url(${banner3})` }} />
                    <div className='relative'>
                    <p className='text-xs font-bold uppercase tracking-[0.16em] text-red-400'>Still have a question?</p>
                    <p className='mt-2 text-2xl font-extrabold text-white'>We’re here to help.</p>
                    <p className='mt-1 max-w-xl text-sm text-slate-300'>
                        Contact our support team and share your vehicle issue. We’ll guide you with the next best step.
                    </p>
                    <div className='mt-4 flex flex-wrap gap-2'>
                        <a href='/contact' className='inline-flex items-center rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700'>Contact support</a>
                        <a href='/book-repair' className='inline-flex items-center rounded-md border border-slate-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10'>Book a repair</a>
                    </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default Faq
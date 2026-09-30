import { FiShield, FiTool, FiClock, FiThumbsUp, FiStar, FiPhoneCall } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { cardIn, fadeUp, sectionStagger, viewportOnce } from '../../utils/motion'

function WhyUs () {
    const { user } = useSelector((state) => state.user)
    const highlights = [
        {
            title: 'Certified & Experienced',
            description: 'Skilled mechanics with the right tools to diagnose and fix issues properly.',
            Icon: FiTool,
        },
        {
            title: 'Warranty-backed Repairs',
            description: 'We stand behind our work so you can drive with confidence.',
            Icon: FiShield,
        },
        {
            title: 'Fast Turnaround',
            description: 'Quick inspection and same-day service for common repairs (when possible).',
            Icon: FiClock,
        },
        {
            title: 'Trusted by Customers',
            description: 'Clear estimates, honest advice, and friendly support—every time.',
            Icon: FiThumbsUp,
        },
    ]

    return (
        <motion.section
            id='why-us'
            className='cr-section cr-section-muted overflow-hidden'
            initial='hidden'
            whileInView='show'
            viewport={viewportOnce}
            variants={sectionStagger}
        >
            <div className='pointer-events-none absolute inset-0 -z-10'>
                <div className='absolute -top-32 right-0 h-96 w-96 rounded-full bg-red-500/10 blur-3xl' />
                <div className='absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-gray-900/5 blur-3xl' />
            </div>

            <div className='cr-container cr-section-pad'>
                <div className='flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end'>
                    <motion.div variants={fadeUp}>
                        <p className='inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.16em] text-red-600'>
                            <span className='h-px w-9 bg-red-500' />
                            Why Choose Us
                            <span className='h-px w-9 bg-red-500' />
                        </p>

                        <h2 className='mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'>
                            Honest service. Quality repairs. Zero stress.
                        </h2>

                        <p className='mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-relaxed'>
                            We focus on transparency, safety, and long-term reliability—so you feel confident every time you drive.
                        </p>
                    </motion.div>

                    <motion.div className='flex flex-col gap-2 sm:flex-row' variants={fadeUp}>
                        <motion.a
                            href='tel:+923001234567'
                            className='inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 active:translate-y-0'
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FiPhoneCall className='h-4 w-4' aria-hidden='true' />
                            Call Now
                        </motion.a>
                        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                            <NavLink
                                to={user ? '/book-repair' : '/login'}
                                className='inline-flex items-center justify-center rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 active:translate-y-0'
                            >
                                Book Repair
                            </NavLink>
                        </motion.div>
                    </motion.div>
                </div>

                <div className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
                    {highlights.map((item) => (
                        <motion.article
                            key={item.title}
                            className='group p-6 cr-card cr-card-hover'
                            variants={cardIn}
                            whileHover={{ y: -6 }}
                        >
                            <div className='inline-flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100 transition group-hover:bg-red-100'>
                                <item.Icon className='h-5 w-5' aria-hidden='true' />
                            </div>
                            <h3 className='mt-4 text-base font-extrabold tracking-tight text-gray-900'>
                                {item.title}
                            </h3>
                            <p className='mt-2 text-sm leading-6 text-gray-600'>
                                {item.description}
                            </p>
                        </motion.article>
                    ))}
                </div>

                <div className='mt-12 grid gap-5 lg:grid-cols-3'>
                    <motion.div className='p-6 lg:col-span-2 cr-card' variants={fadeUp}>
                        <div className='flex items-start justify-between gap-4'>
                            <div>
                                <p className='text-sm font-extrabold text-gray-900'>Customer satisfaction comes first</p>
                                <p className='mt-1 text-sm leading-6 text-gray-600'>
                                    We provide a clear estimate and explain the repair—no hidden charges, no confusing jargon.
                                </p>
                            </div>
                            <div className='hidden shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 sm:inline-flex'>
                                <FiStar className='h-4 w-4 text-amber-500' aria-hidden='true' />
                                4.8 average rating
                            </div>
                        </div>

                        <div className='mt-6 grid gap-3 sm:grid-cols-3'>
                            <div className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
                                <p className='text-xs font-semibold text-gray-500'>Response time</p>
                                <p className='mt-1 text-lg font-extrabold text-gray-900'>~30 min</p>
                            </div>
                            <div className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
                                <p className='text-xs font-semibold text-gray-500'>Happy customers</p>
                                <p className='mt-1 text-lg font-extrabold text-gray-900'>2,500+</p>
                            </div>
                            <div className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
                                <p className='text-xs font-semibold text-gray-500'>Warranty</p>
                                <p className='mt-1 text-lg font-extrabold text-gray-900'>Up to 6 mo</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div className='p-6 cr-card bg-gradient-to-br from-white to-red-50' variants={fadeUp}>
                        <p className='text-sm font-extrabold text-gray-900'>Emergency help?</p>
                        <p className='mt-1 text-sm leading-6 text-gray-600'>Call us anytime. We’ll guide you and arrange help.</p>

                        <motion.a
                            href='tel:+923001234567'
                            className='mt-5 inline-flex w-full items-center justify-center rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 active:translate-y-0'
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Call: +92 300 1234567
                        </motion.a>

                        <p className='mt-3 text-xs font-semibold text-gray-500'>Available 7 days/week</p>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    )
}

export default WhyUs
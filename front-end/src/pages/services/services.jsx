import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiTool } from 'react-icons/fi'
import { NavLink, useNavigate } from 'react-router-dom'

import { cardIn, fadeUp, sectionStagger } from '../../utils/motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchServices } from '../../rtk/thunks/serviceThunk/serviceThunk'

function Services () {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { items = [], loading, error } = useSelector((state) => state.service)

    useEffect(() => {
        dispatch(fetchServices())
    }, [dispatch])

    const serviceList = useMemo(() => {
        const list = Array.isArray(items) ? items : []
        return list
            .map((item) => item?.service ?? item)
            .filter((service) => service && typeof service === 'object')
            .filter((service) => service?.isAvailable !== false)
    }, [items])

    const previewServices = serviceList.slice(0, 4)

    const {user} = useSelector((state) => state.user)

    return (
        <motion.section
            id='services'
            className='cr-section cr-section-light overflow-hidden'
            initial='hidden'
            animate='show'
            variants={sectionStagger}
        >
            <div className='pointer-events-none absolute inset-0 -z-10'>
                <div className='absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl' />
                <div className='absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-gray-900/5 blur-3xl' />
            </div>

            <div className='cr-container cr-section-pad'>
                <div className='flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end'>
                    <motion.div variants={fadeUp}>
                        <p className='inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700'>
                            <span className='h-2 w-2 rounded-full bg-red-600' />
                            Our Services
                        </p>
                        <h2 className='cr-heading-lg'>
                            Everything your car needs—under one roof
                        </h2>
                        <p className='mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-relaxed'>
                            Choose a service below. We’ll share a clear estimate before starting any work and back repairs with warranty.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeUp} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                        <NavLink to={user ? '/book-repair' : '/login'} className='cr-btn-primary'>
                            Book a Service
                        </NavLink>
                    </motion.div>
                </div>

                <motion.div className='mt-8 grid gap-4 sm:grid-cols-3' variants={fadeUp}>
                    <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ring-1 ring-black/5'>
                        <p className='text-sm font-extrabold text-gray-900'>Transparent pricing</p>
                        <p className='mt-1 text-sm text-gray-600'>Estimate first—no surprise bills.</p>
                    </div>
                    <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ring-1 ring-black/5'>
                        <p className='text-sm font-extrabold text-gray-900'>Quality parts</p>
                        <p className='mt-1 text-sm text-gray-600'>We use reliable parts for long life.</p>
                    </div>
                    <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ring-1 ring-black/5'>
                        <p className='text-sm font-extrabold text-gray-900'>Warranty support</p>
                        <p className='mt-1 text-sm text-gray-600'>Repairs backed for peace of mind.</p>
                    </div>
                </motion.div>

                <div className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
                    {!loading && !error && previewServices.length === 0 && (
                        <motion.div className='p-6 text-sm font-semibold text-gray-600 cr-card sm:col-span-2 lg:col-span-4' variants={fadeUp}>
                            No services available right now.
                        </motion.div>
                    )}

                    {loading && (
                        <motion.div className='p-6 text-sm font-semibold text-gray-600 cr-card sm:col-span-2 lg:col-span-4' variants={fadeUp}>
                            Loading services...
                        </motion.div>
                    )}

                    {!loading && error && (
                        <motion.div className='p-6 text-sm font-semibold text-red-700 cr-card sm:col-span-2 lg:col-span-4' variants={fadeUp}>
                            {typeof error === 'string' ? error : (error?.message || 'Failed to load services')}
                        </motion.div>
                    )}

                    {previewServices.map((service) => (
                        <motion.article
                            key={service._id ?? service.id ?? service.title}
                            className='group relative overflow-hidden p-6 cr-card cr-card-hover focus-within:ring-2 focus-within:ring-red-600/30'
                            variants={cardIn}
                            whileHover={{ y: -6 }}
                        >
                            <div
                                className='pointer-events-none absolute inset-0 opacity-0 transition duration-200 group-hover:opacity-100'
                                aria-hidden='true'
                            >
                                <div className='absolute -right-24 -top-24 h-56 w-56 rounded-full bg-red-600/10 blur-2xl' />
                            </div>

                            <div className='flex h-full flex-col'>
                                <div className='flex items-start gap-4'>
                                    <div className='inline-flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100 transition-all duration-200 group-hover:bg-red-100 group-hover:scale-[1.02]'>
                                        <FiTool className='h-5 w-5' aria-hidden='true' />
                                    </div>

                                    <div className='min-w-0'>
                                        <p className='text-[11px] font-semibold uppercase tracking-wide text-gray-500'>Service</p>
                                        <h3 className='mt-1 text-base font-extrabold tracking-tight text-gray-900 sm:text-lg'>
                                            {service.title}
                                        </h3>
                                        <p className='mt-2 text-sm leading-6 text-gray-600'>
                                            {service.description}
                                        </p>
                                    </div>
                                </div>

                                <div className='mt-5 flex items-center justify-between border-t border-gray-100 pt-4'>
                                    <NavLink
                                    to={user ? `/book-repair?service=${encodeURIComponent(service.title)}` : '/login'}
                                        className='inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition-colors hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2'
                                    >
                                        Book now
                                        <span className='text-red-500' aria-hidden='true'>→</span>
                                    </NavLink>
                                    <span className='text-xs font-semibold text-gray-500'>Estimate first</span>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                <motion.div className='mt-8 flex justify-center' variants={fadeUp}>
                    <button
                        type='button'
                        onClick={() => navigate('/services')}
                        className='cr-btn-outline'
                    >
                        Explore services
                    </button>
                </motion.div>

                <motion.div className='mt-12 rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-6 sm:p-8' variants={fadeUp}>
                    <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                        <div>
                            <p className='text-sm font-extrabold text-gray-900'>Not sure what you need?</p>
                            <p className='mt-1 text-sm leading-6 text-gray-600'>Tell us the problem—our team will guide you to the right service.</p>
                        </div>
                        <div className='flex flex-col gap-2 sm:flex-row'>
                            <a
                                href='tel:+923001234567'
                                className='inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 active:translate-y-0'
                            >
                                Call Now
                            </a>
                            <a
                                href='#contact'
                                className='inline-flex items-center justify-center rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 active:translate-y-0'
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default Services
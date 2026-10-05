import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiTool, FiShield, FiSettings, FiAward, FiArrowRight, FiGrid } from 'react-icons/fi'
import { NavLink, useNavigate } from 'react-router-dom'

import { cardIn, fadeUp, sectionStagger } from '../../utils/motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchServices } from '../../rtk/thunks/serviceThunk/serviceThunk'
import { getMediaUrl } from '../../rtk/utils/apiUrl'
import servicesBackground from '../../pictures/banner1.jpg'

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
            .filter((service) => service && typeof service === 'object' && service.isAvailable !== false)
    }, [items])

    const previewServices = serviceList.slice(0, 4)

    const {user} = useSelector((state) => state.user)

    return (
        <motion.section
            id='services'
            className='cr-section cr-section-light overflow-hidden'
            style={{ backgroundImage: `linear-gradient(90deg, rgba(248,250,252,.97), rgba(248,250,252,.9)), url(${servicesBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            initial='hidden'
            animate='show'
            variants={sectionStagger}
        >
            <div className='pointer-events-none absolute inset-0 -z-10'>
                <div className='absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl' />
                <div className='absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-gray-900/5 blur-3xl' />
            </div>

            <div className='cr-container cr-section-pad'>
                <div className='flex flex-col items-center gap-5 text-center'>
                    <motion.div className='max-w-3xl' variants={fadeUp}>
                        <p className='inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-red-600'>
                            <FiTool className='h-4 w-4' /> Our Services <span className='h-px w-9 bg-red-500' />
                        </p>
                        <h2 className='mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#102957] sm:text-4xl lg:text-[2.7rem]'>
                            Everything your car needs—<br /><span className='text-red-600 block mt-3'>under one roof</span>
                        </h2>
                        <p className='mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-relaxed'>
                            Choose a service below. We’ll share a clear estimate before starting any work and back repairs with warranty.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeUp} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                        <NavLink to={user ? '/book-repair' : '/login'} className='inline-flex items-center gap-2 rounded-md bg-red-600 px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-red-700'>
                            <FiTool /> Book a Service <FiArrowRight />
                        </NavLink>
                    </motion.div>
                </div>

                <motion.div className='mt-8 grid gap-4 sm:grid-cols-3' variants={fadeUp}>
                    <div className='flex items-center gap-3 rounded-xl border border-red-100 bg-red-50/80 p-4 shadow-sm'>
                        <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600'><FiShield className='h-6 w-6' /></span><div><p className='text-sm font-extrabold text-[#17345c]'>Clear Estimates</p>
                        <p className='mt-1 text-sm text-gray-600'>Get a clear estimate after vehicle inspection before repair work begins.</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3 rounded-xl border border-[#dfe8f0] bg-white/90 p-4 shadow-sm'>
                        <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600'><FiSettings className='h-6 w-6' /></span><div><p className='text-sm font-extrabold text-[#17345c]'>Quality Parts</p>
                        <p className='mt-1 text-sm text-gray-600'>We use reliable parts for long life.</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3 rounded-xl border border-[#dfe8f0] bg-white/90 p-4 shadow-sm'>
                        <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600'><FiAward className='h-6 w-6' /></span><div><p className='text-sm font-extrabold text-[#17345c]'>Warranty Support</p>
                        <p className='mt-1 text-sm text-gray-600'>Repairs backed for peace of mind.</p>
                        </div>
                    </div>
                </motion.div>

                <div className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
                    {!loading && !error && previewServices.length === 0 && (
                        <motion.div className='p-6 text-sm font-semibold text-gray-600 cr-card sm:col-span-2 lg:col-span-4' variants={fadeUp}>
                            No services available right now.
                        </motion.div>
                    )}

                    {loading && (
                        <motion.div className='flex min-h-40 items-center justify-center p-6 cr-card sm:col-span-2 lg:col-span-4' variants={fadeUp} role='status' aria-label='Loading services'>
                            <span className='h-8 w-8 animate-spin rounded-full border-4 border-red-100 border-t-red-600' />
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
                            className='group relative overflow-hidden rounded-xl border border-[#dfe8f0] bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg focus-within:ring-2 focus-within:ring-red-600/30'
                            variants={cardIn}
                            whileHover={{ y: -5 }}
                        >
                            <div className='relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-slate-100 via-gray-200 to-slate-300' aria-label={`${service.title} image`}>
                                <div className='absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.35),transparent_55%)]' />
                                {service.image && (
                                    <img
                                        src={getMediaUrl(service.image)}
                                        alt={service.title}
                                        className='absolute inset-0 h-full w-full object-cover object-center transition duration-500 ease-out group-hover:scale-105'
                                    />
                                )}
                                <div className='absolute bottom-3 left-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-red-600 text-white shadow-md'>
                                    <FiTool className='h-5 w-5' aria-hidden='true' />
                                </div>
                                {service.isAvailable === false && (
                                    <span className='absolute right-4 top-4 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700 shadow-sm'>
                                        Currently unavailable
                                    </span>
                                )}
                            </div>

                            <div className='flex min-h-[205px] flex-col p-5'>
                                <div className='pl-1'>
                                    <p className='inline-flex items-center gap-1 rounded bg-red-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-red-600'><FiTool className='h-3 w-3' /> Service</p>
                                    <h3 className='mt-1 line-clamp-2 text-base font-extrabold tracking-tight text-gray-900 sm:text-lg'>
                                        {service.title}
                                    </h3>
                                    <p className='mt-2 line-clamp-3 text-sm leading-5 text-gray-600'>
                                        {service.description}
                                    </p>
                                </div>

                                <div className='mt-auto flex items-end justify-between gap-3 border-t border-gray-100 pt-4'>
                                    <p className='text-[11px] font-medium text-gray-500'>Clear estimate after inspection</p>
                                    {service.isAvailable !== false ? (
                                        <NavLink
                                            to={`/book-repair?service=${encodeURIComponent(service.title)}`}
                                            className='inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2'
                                        >
                                            Book This Service
                                            <FiArrowRight className='h-3.5 w-3.5 text-red-300' aria-hidden='true' />
                                        </NavLink>
                                    ) : (
                                        <span className='rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-700'>Unavailable</span>
                                    )}
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
                        <FiGrid className='h-4 w-4' /> Explore All Services <FiArrowRight className='h-4 w-4' />
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

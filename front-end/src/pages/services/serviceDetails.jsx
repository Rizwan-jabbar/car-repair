import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { NavLink, useParams } from 'react-router-dom'
import { FiArrowRight, FiCheckCircle, FiInfo, FiShield, FiTool } from 'react-icons/fi'

import { fetchServiceById } from '../../rtk/thunks/serviceThunk/serviceThunk'
import { getMediaUrl } from '../../rtk/utils/apiUrl'
import { fadeUp, sectionStagger } from '../../utils/motion'

function ServiceDetails () {
    const { serviceId } = useParams()
    const dispatch = useDispatch()
    const { selectedService: service, selectedLoading, selectedError } = useSelector((state) => state.service)

    useEffect(() => {
        if (serviceId) dispatch(fetchServiceById(serviceId))
    }, [dispatch, serviceId])

    const symptoms = Array.isArray(service?.commonSymptoms) ? service.commonSymptoms.filter(Boolean) : []
    const inspectionPoints = Array.isArray(service?.inspectionPoints) ? service.inspectionPoints.filter(Boolean) : []
    const errorMessage = typeof selectedError === 'string'
        ? selectedError
        : (selectedError?.message || 'Unable to load service details.')

    return (
        <motion.section className='cr-section cr-section-light overflow-hidden' initial='hidden' animate='show' variants={sectionStagger}>
            <div className='cr-container cr-section-pad'>
                {selectedLoading && (
                    <div className='flex min-h-64 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm' role='status'>
                        <span className='text-sm font-semibold text-gray-600'>Loading service details...</span>
                    </div>
                )}

                {!selectedLoading && selectedError && (
                    <div className='rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700'>
                        {errorMessage || 'Service not found or currently unavailable.'}
                    </div>
                )}

                {!selectedLoading && !selectedError && !service && (
                    <div className='rounded-2xl border border-gray-200 bg-white p-6 text-sm font-semibold text-gray-600'>
                        Service not found or currently unavailable.
                    </div>
                )}

                {!selectedLoading && !selectedError && service && (
                    <div className='grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start'>
                        <motion.div className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5' variants={fadeUp}>
                            <div className='relative aspect-[16/8] bg-gradient-to-br from-slate-100 to-slate-300'>
                                {service.image && (
                                    <img src={getMediaUrl(service.image)} alt={service.title} className='h-full w-full object-cover' />
                                )}
                                <div className='absolute bottom-4 left-4 inline-flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-red-600 text-white shadow-md'>
                                    <FiTool className='h-5 w-5' />
                                </div>
                            </div>

                            <div className='p-5 sm:p-7'>
                                <p className='inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-red-600'>
                                    <FiTool className='h-3.5 w-3.5' /> Service Details
                                </p>
                                <h1 className='mt-4 text-3xl font-extrabold tracking-tight text-[#102441] sm:text-4xl'>
                                    {service.title}
                                </h1>
                                <p className='mt-4 text-sm leading-7 text-gray-600 sm:text-base'>
                                    {service.description}
                                </p>
                            </div>
                        </motion.div>

                        <motion.aside className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ring-1 ring-black/5' variants={fadeUp}>
                            <div className='flex items-center justify-between gap-3 border-b border-gray-100 pb-4'>
                                <div>
                                    <p className='text-xs font-bold uppercase tracking-wide text-gray-500'>Availability</p>
                                    <p className='mt-1 text-sm font-extrabold text-gray-900'>
                                        {service.isAvailable === false ? 'Currently unavailable' : 'Available now'}
                                    </p>
                                </div>
                                <span className={`h-3 w-3 rounded-full ${service.isAvailable === false ? 'bg-gray-400' : 'bg-emerald-500'}`} />
                            </div>

                            <div className='mt-4 rounded-xl border border-red-100 bg-red-50 p-4'>
                                <p className='flex items-start gap-2 text-sm font-semibold leading-6 text-red-800'>
                                    <FiInfo className='mt-0.5 h-4 w-4 shrink-0' />
                                    Final cost will be confirmed after vehicle inspection.
                                </p>
                            </div>

                            <NavLink
                                to={`/book-repair?serviceId=${encodeURIComponent(service._id)}`}
                                className='mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700'
                            >
                                Book This Service <FiArrowRight className='h-4 w-4' />
                            </NavLink>

                            <div className='mt-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3'>
                                <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-red-600 shadow-sm'>
                                    <FiShield className='h-4 w-4' />
                                </span>
                                <p className='text-xs font-semibold leading-5 text-gray-600'>Inspection first, repair after approval.</p>
                            </div>
                        </motion.aside>

                        <motion.div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2 sm:p-6' variants={fadeUp}>
                            <div className='grid gap-5 md:grid-cols-2'>
                                <div className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
                                    <h2 className='text-lg font-extrabold text-gray-900'>When You May Need This Service</h2>
                                    {symptoms.length > 0 ? (
                                        <ul className='mt-3 space-y-2'>
                                            {symptoms.map((item) => (
                                                <li key={item} className='flex gap-2 text-sm text-gray-700'>
                                                    <FiCheckCircle className='mt-0.5 h-4 w-4 shrink-0 text-red-600' />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className='mt-3 text-sm leading-6 text-gray-600'>Use this service when your vehicle needs expert inspection related to {service.title}.</p>
                                    )}
                                </div>

                                <div className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
                                    <h2 className='text-lg font-extrabold text-gray-900'>What We Inspect</h2>
                                    {inspectionPoints.length > 0 ? (
                                        <ul className='mt-3 space-y-2'>
                                            {inspectionPoints.map((item) => (
                                                <li key={item} className='flex gap-2 text-sm text-gray-700'>
                                                    <FiCheckCircle className='mt-0.5 h-4 w-4 shrink-0 text-red-600' />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className='mt-3 text-sm leading-6 text-gray-600'>Our mechanic checks the relevant system, confirms the fault, and explains the repair before work begins.</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </motion.section>
    )
}

export default ServiceDetails

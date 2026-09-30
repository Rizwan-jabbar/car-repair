import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCheckCircle, FiEdit3, FiTool, FiXCircle } from 'react-icons/fi'
import { FiX } from 'react-icons/fi'

import {
    deleteService,
    fetchServices,
    toggleServiceAvailability,
    updateService,
} from '../../rtk/thunks/serviceThunk/serviceThunk'

function ViewServices () {
    const dispatch = useDispatch()
    const { items = [], loading, error } = useSelector((state) => state.service)
    const [selectedService, setSelectedService] = useState(null)
    const [editingService, setEditingService] = useState(null)
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        price: '',
    })

    useEffect(() => {
        dispatch(fetchServices())
    }, [dispatch])

    const services = useMemo(() => {
        const list = Array.isArray(items) ? items : []

        return list
            .map((item) => item?.service ?? item)
            .filter((service) => service && typeof service === 'object')
    }, [items])

    const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to load services')

    const formatDate = (value) => {
        if (!value) return '-'
        const d = new Date(value)
        if (Number.isNaN(d.getTime())) return '-'
        return d.toLocaleDateString()
    }

    const getServiceId = (service) => service?._id ?? service?.id

    const onToggleAvailability = (service) => {
        const serviceId = getServiceId(service)
        if (!serviceId) return
        dispatch(toggleServiceAvailability(serviceId))
    }

    const onDeleteService = (service) => {
        const serviceId = getServiceId(service)
        if (!serviceId) return

        const ok = window.confirm('Are you sure you want to delete this service?')
        if (!ok) return

        dispatch(deleteService(serviceId))

        if (getServiceId(selectedService) === serviceId) {
            setSelectedService(null)
        }
    }

    const onEditService = (service) => {
        const serviceId = getServiceId(service)
        if (!serviceId) return

        setEditForm({
            title: service?.title || '',
            description: service?.description || '',
            price: String(service?.price ?? ''),
        })
        setEditingService(service)
    }

    const closeEditModal = () => {
        setEditingService(null)
        setEditForm({ title: '', description: '', price: '' })
    }

    const submitEditForm = async (e) => {
        e.preventDefault()

        const serviceId = getServiceId(editingService)
        if (!serviceId) return

        const title = editForm.title.trim()
        const description = editForm.description.trim()
        const parsedPrice = Number(editForm.price)

        if (!title || !description || Number.isNaN(parsedPrice) || parsedPrice < 0) {
            return
        }

        await dispatch(
            updateService({
                serviceId,
                serviceData: {
                    title,
                    description,
                    price: parsedPrice,
                },
            }),
        )

        if (selectedService && getServiceId(selectedService) === serviceId) {
            setSelectedService({
                ...selectedService,
                title,
                description,
                price: parsedPrice,
            })
        }

        closeEditModal()
    }

    return (
        <section className='w-full max-w-full'>
            <div className='mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <h1 className='text-2xl font-extrabold tracking-tight text-gray-900'>View Services</h1>
                        <p className='mt-1 text-sm text-gray-600'>All services added by admin are listed here.</p>
                    </div>

                    <div className='inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 shadow-sm'>
                        <FiTool className='h-4 w-4 text-red-600' />
                        {services.length} services
                    </div>
                </div>
            </div>

            {loading && (
                <div className='rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-600'>
                    Loading services...
                </div>
            )}

            {!loading && error && (
                <div className='rounded-xl border border-red-200 bg-red-50 p-4'>
                    <p className='text-sm font-semibold text-red-700'>{errorMessage}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className='hidden w-full max-w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm md:block'>
                        <table className='w-full min-w-[760px] text-left'>
                            <thead className='border-b border-gray-200 bg-gray-50'>
                                <tr>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Image</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Title</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Price</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Availability</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Created</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='[&>tr:nth-child(even)]:bg-gray-50/40'>
                                {services.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className='px-4 py-6 text-center text-sm font-semibold text-gray-500'>
                                            No services found.
                                        </td>
                                    </tr>
                                ) : (
                                    services.map((service, idx) => {
                                        const key = service?._id ?? service?.id ?? idx
                                        const isAvailable = service?.isAvailable !== false

                                        return (
                                            <tr
                                                key={key}
                                                onClick={() => setSelectedService(service)}
                                                className={`cursor-pointer border-b border-gray-100 transition hover:bg-red-50/60 ${!isAvailable ? 'bg-red-50/50' : ''}`}
                                            >
                                                <td className='px-4 py-3'>
                                                    <div className='h-12 w-16 overflow-hidden rounded-md border border-gray-200 bg-gradient-to-br from-slate-100 to-slate-300'>
                                                        {service?.image && (
                                                            <img
                                                                src={service.image}
                                                                alt={service?.title || 'Service'}
                                                                className='h-full w-full object-cover'
                                                                onError={(event) => { event.currentTarget.style.display = 'none' }}
                                                            />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className='px-4 py-3 text-sm font-semibold text-gray-900'>{service?.title || '-'}</td>
                                                <td className='px-4 py-3 text-sm font-semibold text-gray-800'>
                                                    Rs. {Number(service?.price || 0).toLocaleString()}
                                                </td>
                                                <td className='px-4 py-3'>
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${isAvailable ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'border border-gray-300 bg-gray-100 text-gray-700'}`}>
                                                        {isAvailable ? <FiCheckCircle className='h-3.5 w-3.5' /> : <FiXCircle className='h-3.5 w-3.5' />}
                                                        {isAvailable ? 'Available' : 'Unavailable'}
                                                    </span>
                                                </td>
                                                <td className='px-4 py-3 text-sm text-gray-600'>{formatDate(service?.createdAt)}</td>
                                                <td className='px-4 py-3'>
                                                    <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            type='button'
                                                            onClick={() => onEditService(service)}
                                                            className='inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50'
                                                        >
                                                            <FiEdit3 className='h-3.5 w-3.5' />
                                                            Edit
                                                        </button>
                                                        <button
                                                            type='button'
                                                            onClick={() => onToggleAvailability(service)}
                                                            className='inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100'
                                                        >
                                                            {isAvailable ? <FiXCircle className='h-3.5 w-3.5' /> : <FiCheckCircle className='h-3.5 w-3.5' />}
                                                            {isAvailable ? 'Disable' : 'Enable'}
                                                        </button>
                                                        <button
                                                            type='button'
                                                            onClick={() => onDeleteService(service)}
                                                            className='inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100'
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className='space-y-3 md:hidden'>
                        {services.length === 0 ? (
                            <div className='rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-500'>
                                No services found.
                            </div>
                        ) : (
                            services.map((service, idx) => {
                                const key = service?._id ?? service?.id ?? idx
                                const isAvailable = service?.isAvailable !== false

                                return (
                                    <motion.article
                                        key={key}
                                        layout
                                        onClick={() => setSelectedService(service)}
                                        className={`rounded-xl border p-4 shadow-sm ring-1 ring-black/5 ${isAvailable ? 'border-gray-200 bg-gradient-to-b from-white to-gray-50' : 'border-red-200 bg-red-50/50'}`}
                                    >
                                        <div className='flex items-start justify-between gap-3'>
                                            <div className='flex min-w-0 items-center gap-3'>
                                                <div className='h-12 w-16 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gradient-to-br from-slate-100 to-slate-300'>
                                                    {service?.image && (
                                                        <img
                                                            src={service.image}
                                                            alt={service?.title || 'Service'}
                                                            className='h-full w-full object-cover'
                                                            onError={(event) => { event.currentTarget.style.display = 'none' }}
                                                        />
                                                    )}
                                                </div>
                                                <h3 className='truncate text-sm font-bold text-gray-900'>{service?.title || '-'}</h3>
                                            </div>
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${isAvailable ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'border border-gray-300 bg-gray-100 text-gray-700'}`}>
                                                {isAvailable ? <FiCheckCircle className='h-3.5 w-3.5' /> : <FiXCircle className='h-3.5 w-3.5' />}
                                                {isAvailable ? 'Available' : 'Unavailable'}
                                            </span>
                                        </div>

                                        <div className='mt-3 flex items-center justify-between'>
                                            <p className='text-sm font-semibold text-gray-900'>Rs. {Number(service?.price || 0).toLocaleString()}</p>
                                            <p className='text-xs font-medium text-gray-500'>{formatDate(service?.createdAt)}</p>
                                        </div>

                                        <div className='mt-3 flex gap-2' onClick={(e) => e.stopPropagation()}>
                                            <button
                                                type='button'
                                                onClick={() => onEditService(service)}
                                                className='inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50'
                                            >
                                                <FiEdit3 className='h-3.5 w-3.5' />
                                                Edit
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => onToggleAvailability(service)}
                                                className='inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100'
                                            >
                                                {isAvailable ? <FiXCircle className='h-3.5 w-3.5' /> : <FiCheckCircle className='h-3.5 w-3.5' />}
                                                {isAvailable ? 'Disable' : 'Enable'}
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => onDeleteService(service)}
                                                className='inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-2 text-xs font-semibold text-red-700 shadow-sm transition hover:bg-red-100'
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </motion.article>
                                )
                            })
                        )}
                    </div>
                </>
            )}

            <AnimatePresence>
                {selectedService && (
                    <motion.div
                        className='fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedService(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                            className='w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6'
                        >
                            <div className='flex items-start justify-between gap-3'>
                                <div>
                                    <p className='text-xs font-semibold uppercase tracking-wide text-red-600'>Service Details</p>
                                    <h3 className='mt-1 text-xl font-extrabold text-gray-900'>{selectedService?.title || 'Service'}</h3>
                                </div>
                                <button
                                    type='button'
                                    onClick={() => setSelectedService(null)}
                                    className='inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50'
                                >
                                    <FiX className='h-4 w-4' />
                                </button>
                            </div>

                            <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                                <div className='rounded-xl border border-gray-200 bg-gray-50 p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Price</p>
                                    <p className='mt-1 text-sm font-semibold text-gray-900'>Rs. {Number(selectedService?.price || 0).toLocaleString()}</p>
                                </div>
                                <div className='rounded-xl border border-gray-200 bg-gray-50 p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Availability</p>
                                    <p className='mt-1 text-sm font-semibold text-gray-900'>
                                        {selectedService?.isAvailable === false ? 'Unavailable' : 'Available'}
                                    </p>
                                </div>
                                <div className='rounded-xl border border-gray-200 bg-gray-50 p-3 sm:col-span-2'>
                                    <p className='text-xs font-semibold text-gray-500'>Created</p>
                                    <p className='mt-1 text-sm font-semibold text-gray-900'>{formatDate(selectedService?.createdAt)}</p>
                                </div>
                            </div>

                            <div className='mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
                                <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Description</p>
                                <p className='mt-2 text-sm leading-6 text-gray-700'>{selectedService?.description || '-'}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {editingService && (
                    <motion.div
                        className='fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeEditModal}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                            className='w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6'
                        >
                            <div className='flex items-start justify-between gap-3'>
                                <div>
                                    <p className='text-xs font-semibold uppercase tracking-wide text-red-600'>Edit Service</p>
                                    <h3 className='mt-1 text-xl font-extrabold text-gray-900'>Update service details</h3>
                                </div>
                                <button
                                    type='button'
                                    onClick={closeEditModal}
                                    className='inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50'
                                >
                                    <FiX className='h-4 w-4' />
                                </button>
                            </div>

                            <form className='mt-4 space-y-4' onSubmit={submitEditForm}>
                                <label className='block'>
                                    <span className='text-sm font-semibold text-gray-900'>Title</span>
                                    <input
                                        type='text'
                                        value={editForm.title}
                                        onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                                        className='mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100'
                                    />
                                </label>

                                <label className='block'>
                                    <span className='text-sm font-semibold text-gray-900'>Description</span>
                                    <textarea
                                        rows={4}
                                        value={editForm.description}
                                        onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                                        className='mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100'
                                    />
                                </label>

                                <label className='block'>
                                    <span className='text-sm font-semibold text-gray-900'>Price</span>
                                    <input
                                        type='number'
                                        min='0'
                                        value={editForm.price}
                                        onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                                        className='mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100'
                                    />
                                </label>

                                <div className='flex items-center justify-end gap-2 pt-2'>
                                    <button
                                        type='button'
                                        onClick={closeEditModal}
                                        className='rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50'
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type='submit'
                                        className='rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700'
                                    >
                                        Update Service
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default ViewServices
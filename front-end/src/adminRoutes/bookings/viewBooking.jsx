import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// motion is used by the responsive booking cards and detail panels below.
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion'
import { FiCalendar, FiClock, FiFilter, FiMail, FiMapPin, FiPhone, FiUser, FiX } from 'react-icons/fi'

import { getAllBookings, updateBookingArrival, updateBookingStatus } from '../../rtk/thunks/bookingThunk/bookingThunk'

function ViewBookings () {
    const dispatch = useDispatch()
    const { booking, loading, error } = useSelector((state) => state.booking)
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [acceptBooking, setAcceptBooking] = useState(null)
    const [arrivalDateInput, setArrivalDateInput] = useState('')
    const [arrivalTimeInput, setArrivalTimeInput] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [serviceFilter, setServiceFilter] = useState('All')
    const [dateFilter, setDateFilter] = useState('')

    useEffect(() => {
        dispatch(getAllBookings())
    }, [dispatch])

    const bookings = useMemo(() => {
        if (Array.isArray(booking?.bookings)) return booking.bookings
        return []
    }, [booking])

    const formatDate = (value) => {
        if (!value) return '-'
        const d = new Date(value)
        if (Number.isNaN(d.getTime())) return '-'
        return d.toLocaleDateString()
    }

    const formatTime = (value) => value || '-'

    const getServiceLabel = (item) => {
        if (!item) return '-'
        return item?.service === 'Others' ? (item?.otherService || 'Others') : (item?.service || '-')
    }

    const serviceOptions = useMemo(() => {
        const values = new Set()
        bookings.forEach((item) => {
            const label = getServiceLabel(item)
            if (label && label !== '-') values.add(label)
        })
        return ['All', ...Array.from(values)]
    }, [bookings])

    const filteredBookings = useMemo(() => {
        return bookings.filter((item) => {
            const status = item?.status || 'Pending'
            const service = getServiceLabel(item)

            const q = searchQuery.trim().toLowerCase()
            const matchesSearch = !q || [
                item?.fullName,
                item?.phone,
                item?.referenceNumber,
                service,
                item?.carModel,
            ].some((v) => String(v || '').toLowerCase().includes(q))

            const matchesStatus = statusFilter === 'All'
                || (statusFilter === 'Emergency' ? item?.bookingType === 'Emergency' : status === statusFilter)
            const matchesService = serviceFilter === 'All' || service === serviceFilter

            const bookingDate = item?.preferredDate ? new Date(item.preferredDate) : null
            const bookingDateValue = bookingDate && !Number.isNaN(bookingDate.getTime())
                ? bookingDate.toISOString().slice(0, 10)
                : ''
            const matchesDate = !dateFilter || bookingDateValue === dateFilter

            return matchesSearch && matchesStatus && matchesService && matchesDate
        })
    }, [bookings, searchQuery, statusFilter, serviceFilter, dateFilter])

    const statusOptions = ['All', 'Pending', 'Confirmed', 'Mechanic Assigned', 'In Progress', 'Completed', 'Cancelled', 'Emergency']
    const hasActiveFilters = Boolean(searchQuery.trim() || dateFilter || statusFilter !== 'All' || serviceFilter !== 'All')

    const getStatusTone = (status) => {
        const normalized = String(status || 'Pending').toLowerCase()
        if (normalized === 'confirmed') return 'border border-emerald-200 bg-emerald-50 text-emerald-700'
        if (normalized === 'in progress') return 'border border-blue-200 bg-blue-50 text-blue-700'
        if (normalized === 'completed') return 'border border-blue-200 bg-blue-50 text-blue-700'
        if (normalized === 'cancelled') return 'border border-red-200 bg-red-50 text-red-700'
        return 'border border-amber-200 bg-amber-50 text-amber-700'
    }

    const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to load bookings')

    const handleStatusUpdate = async (bookingItem, nextStatus) => {
        const bookingId = bookingItem?._id
        if (!bookingId || !nextStatus) return

        const action = await dispatch(updateBookingStatus({ bookingId, status: nextStatus }))

        if (updateBookingStatus.fulfilled.match(action)) {
            setSelectedBooking((prev) => {
                if (!prev || prev?._id !== bookingId) return prev
                return {
                    ...prev,
                    status: nextStatus,
                }
            })
        }
    }

    const openAcceptPopup = (bookingItem) => {
        if (!bookingItem?._id) return
        setAcceptBooking(bookingItem)
        setArrivalDateInput('')
        setArrivalTimeInput('')
    }

    const closeAcceptPopup = () => {
        setAcceptBooking(null)
        setArrivalDateInput('')
        setArrivalTimeInput('')
    }

    const handleAcceptConfirm = async () => {
        const bookingId = acceptBooking?._id
        if (!bookingId || !arrivalDateInput || !arrivalTimeInput) return

        const arrivalAction = await dispatch(updateBookingArrival({
            bookingId,
            arrivalDate: arrivalDateInput,
            arrivalTime: arrivalTimeInput,
        }))

        if (!updateBookingArrival.fulfilled.match(arrivalAction)) return

        const statusAction = await dispatch(updateBookingStatus({ bookingId, status: 'In Progress' }))
        if (!updateBookingStatus.fulfilled.match(statusAction)) return

        setSelectedBooking((prev) => {
            if (!prev || prev?._id !== bookingId) return prev
            return {
                ...prev,
                status: 'In Progress',
                arrivalDate: arrivalDateInput,
                arrivalTime: arrivalTimeInput,
            }
        })

        closeAcceptPopup()
    }

    const renderActionButtons = (item, compact = false) => {
        const status = item?.status || 'Pending'
        const isPending = status === 'Pending'
        const isInProgress = status === 'In Progress'
        const baseClass = compact
            ? 'inline-flex flex-1 items-center justify-center rounded-md px-2.5 py-2 text-xs font-semibold transition'
            : 'inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-semibold transition'

        return (
            <>
                {isPending && (
                    <button
                        type='button'
                        onClick={() => openAcceptPopup(item)}
                        className={`${baseClass} border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
                    >
                        Accept
                    </button>
                )}

                {isInProgress && (
                    <button
                        type='button'
                        onClick={() => handleStatusUpdate(item, 'Completed')}
                        className={`${baseClass} border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100`}
                    >
                        Complete
                    </button>
                )}

                {(isPending || isInProgress) && (
                    <button
                        type='button'
                        onClick={() => handleStatusUpdate(item, 'Cancelled')}
                        className={`${baseClass} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}
                    >
                        Cancel
                    </button>
                )}
            </>
        )
    }

    return (
        <section className='w-full max-w-full bg-[#f5f9fe]'>
            <div className='mb-5 rounded-2xl border border-white bg-gradient-to-r from-white via-[#f9fbff] to-red-50/70 p-5 shadow-sm sm:p-6'>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <p className='inline-flex rounded-full bg-red-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-red-600'>Bookings</p>
                        <h1 className='mt-2 text-2xl font-extrabold tracking-tight text-[#102441] sm:text-3xl'>View Bookings</h1>
                        <p className='mt-1 text-sm text-[#6c83a2]'>All customer booking requests are listed below.</p>
                    </div>

                    <div className='inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 shadow-sm'>
                        {filteredBookings.length} / {bookings.length} bookings
                    </div>
                </div>
            </div>

            {!loading && !error && (
                <div className='mb-4 overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-r from-red-50/70 via-white to-white shadow-sm ring-1 ring-black/5'>
                    <div className='border-b border-red-100/80 px-4 py-3 sm:px-5'>
                        <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
                            <div className='flex items-center gap-2'>
                                <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600'>
                                    <FiFilter className='h-4 w-4' />
                                </span>
                                <div>
                                    <p className='text-sm font-extrabold text-gray-900'>Filter Bookings</p>
                                    <p className='text-xs text-gray-500'>Quickly narrow down booking records</p>
                                </div>
                            </div>

                            <div className='flex flex-wrap items-center gap-2'>
                                {hasActiveFilters && (
                                    <span className='inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700'>
                                        Filters active
                                    </span>
                                )}
                                <button
                                    type='button'
                                    onClick={() => {
                                        setSearchQuery('')
                                        setStatusFilter('All')
                                        setServiceFilter('All')
                                        setDateFilter('')
                                    }}
                                    className='rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50'
                                >
                                    Clear all
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='space-y-4 px-4 py-4 sm:px-5'>
                        <div className='flex flex-wrap gap-2'>
                            {statusOptions.map((option) => {
                                const isActive = statusFilter === option
                                return (
                                    <button
                                        key={option}
                                        type='button'
                                        onClick={() => setStatusFilter(option)}
                                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${isActive ? 'border-red-200 bg-red-600 text-white shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {option}
                                    </button>
                                )
                            })}
                        </div>

                        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3'>
                            <label className='block'>
                                <span className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Search</span>
                                <input
                                    type='text'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder='Name, phone, service, car model...'
                                    className='mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-300 focus:ring-2 focus:ring-red-100'
                                />
                            </label>

                            <label className='block'>
                                <span className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Service</span>
                                <select
                                    value={serviceFilter}
                                    onChange={(e) => setServiceFilter(e.target.value)}
                                    className='mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100'
                                >
                                    {serviceOptions.map((service) => (
                                        <option key={service} value={service}>{service}</option>
                                    ))}
                                </select>
                            </label>

                            <label className='block'>
                                <span className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Date</span>
                                <input
                                    type='date'
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className='mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100'
                                />
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className='flex items-center justify-center rounded-xl border border-gray-200 bg-white p-8'>
                    <span className='h-7 w-7 animate-spin rounded-full border-4 border-red-100 border-t-red-600' aria-label='Loading bookings' />
                </div>
            )}

            {!loading && error && (
                <div className='rounded-xl border border-red-200 bg-red-50 p-4'>
                    <p className='text-sm font-semibold text-red-700'>{errorMessage}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className='hidden w-full overflow-x-auto md:block'>
                        <table className='w-full min-w-[860px] text-left whitespace-nowrap'>
                            <thead className='bg-black text-white'>
                                <tr>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Customer</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Phone</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Service</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Date</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Status</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Actions</th>
                                </tr>
                            </thead>

                            <tbody className='before:block before:h-3 before:content-["_"]'>
                                {filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className='px-4 py-6 text-center text-sm font-semibold text-gray-500'>
                                            No bookings match current filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((item, idx) => {
                                        const id = item?._id ?? idx
                                        const status = item?.status || 'Pending'
                                        return (
                                            <tr
                                                key={id}
                                                onClick={() => setSelectedBooking(item)}
                                                className='cursor-pointer border-b border-gray-100 transition duration-200 hover:bg-red-50/40'
                                            >
                                                <td className='px-4 py-3 text-sm font-semibold text-gray-900'>{item?.fullName || '-'}</td>
                                                <td className='px-4 py-3 text-sm text-gray-700'>{item?.phone || '-'}</td>
                                                <td className='px-4 py-3 text-sm text-gray-700 max-w-[220px] overflow-hidden text-ellipsis'>
                                                    {getServiceLabel(item)}
                                                </td>
                                                <td className='px-4 py-3 text-sm text-gray-700'>{formatDate(item?.preferredDate)}</td>
                                                <td className='px-4 py-3'>
                                                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusTone(status)}`}>
                                                        {status}
                                                    </span>
                                                </td>
                                                <td className='px-4 py-3'>
                                                    <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            type='button'
                                                            onClick={() => setSelectedBooking(item)}
                                                            className='inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow'
                                                        >
                                                            View
                                                        </button>
                                                        {renderActionButtons(item)}
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
                        {filteredBookings.length === 0 ? (
                            <div className='rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-500'>
                                No bookings match current filters.
                            </div>
                        ) : (
                            filteredBookings.map((item, idx) => {
                                const id = item?._id ?? idx
                                const status = item?.status || 'Pending'

                                return (
                                    <motion.article
                                        key={id}
                                        layout
                                        onClick={() => setSelectedBooking(item)}
                                        className='rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4 shadow-sm ring-1 ring-black/5'
                                    >
                                        <div className='flex items-start justify-between gap-3'>
                                            <div>
                                                <p className='text-sm font-bold text-gray-900'>{item?.fullName || '-'}</p>
                                                <p className='mt-0.5 text-xs text-gray-500'>{item?.phone || '-'}</p>
                                            </div>
                                            <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${getStatusTone(status)}`}>
                                                {status}
                                            </span>
                                        </div>

                                        <div className='mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600'>
                                            <p><span className='font-semibold text-gray-800'>Car:</span> {item?.carModel || '-'}</p>
                                            <p><span className='font-semibold text-gray-800'>Service:</span> {getServiceLabel(item)}</p>
                                            <p><span className='font-semibold text-gray-800'>Date:</span> {formatDate(item?.preferredDate)}</p>
                                            <p><span className='font-semibold text-gray-800'>Time:</span> {formatTime(item?.preferredTime)}</p>
                                        </div>

                                        <div className='mt-3 flex gap-2' onClick={(e) => e.stopPropagation()}>
                                            <button
                                                type='button'
                                                onClick={() => setSelectedBooking(item)}
                                                className='inline-flex flex-1 items-center justify-center rounded-md border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50'
                                            >
                                                View
                                            </button>
                                            {renderActionButtons(item, true)}
                                        </div>
                                    </motion.article>
                                )
                            })
                        )}
                    </div>
                </>
            )}

            <AnimatePresence>
                {selectedBooking && (
                    <motion.div
                        className='fixed inset-0 z-[90] overflow-y-auto bg-black/50 p-4'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedBooking(null)}
                    >
                        <div className='flex min-h-full items-center justify-center py-6'>
                            <motion.div
                                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                onClick={(e) => e.stopPropagation()}
                                className='w-full max-w-2xl max-h-[85dvh] overflow-y-auto rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-5 shadow-2xl ring-1 ring-black/5 sm:p-6'
                            >
                            <div className='flex items-start justify-between gap-3'>
                                <div>
                                    <p className='text-xs font-semibold uppercase tracking-wide text-red-600'>Booking Details</p>
                                    <h3 className='mt-1 text-xl font-extrabold text-gray-900'>{selectedBooking?.fullName || 'Customer'}</h3>
                                </div>

                                <button
                                    type='button'
                                    onClick={() => setSelectedBooking(null)}
                                    className='inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50'
                                >
                                    <FiX className='h-4 w-4' />
                                </button>
                            </div>

                            <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                                <div className='rounded-xl border border-gray-200 bg-white p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Customer</p>
                                    <p className='mt-1 inline-flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                        <FiUser className='h-4 w-4 text-gray-500' />
                                        {selectedBooking?.fullName || '-'}
                                    </p>
                                </div>

                                <div className='rounded-xl border border-gray-200 bg-white p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Phone</p>
                                    <p className='mt-1 inline-flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                        <FiPhone className='h-4 w-4 text-gray-500' />
                                        {selectedBooking?.phone || '-'}
                                    </p>
                                </div>

                                <div className='rounded-xl border border-gray-200 bg-white p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Email</p>
                                    <p className='mt-1 inline-flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                        <FiMail className='h-4 w-4 text-gray-500' />
                                        {selectedBooking?.email || '-'}
                                    </p>
                                </div>

                                <div className='rounded-xl border border-gray-200 bg-white p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Car Model</p>
                                    <p className='mt-1 text-sm font-semibold text-gray-900'>{selectedBooking?.carModel || '-'}</p>
                                </div>

                                <div className='rounded-xl border border-gray-200 bg-white p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Area</p>
                                    <p className='mt-1 inline-flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                        <FiMapPin className='h-4 w-4 text-gray-500' />
                                        {selectedBooking?.cityArea || '-'}
                                    </p>
                                </div>

                                <div className='rounded-xl border border-gray-200 bg-white p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Status</p>
                                    <p className='mt-1'>
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusTone(selectedBooking?.status || 'Pending')}`}>
                                            {selectedBooking?.status || 'Pending'}
                                        </span>
                                    </p>
                                </div>

                                <div className='rounded-xl border border-gray-200 bg-white p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Date</p>
                                    <p className='mt-1 inline-flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                        <FiCalendar className='h-4 w-4 text-gray-500' />
                                        {formatDate(selectedBooking?.preferredDate)}
                                    </p>
                                </div>

                                <div className='rounded-xl border border-gray-200 bg-white p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Time</p>
                                    <p className='mt-1 inline-flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                        <FiClock className='h-4 w-4 text-gray-500' />
                                        {formatTime(selectedBooking?.preferredTime)}
                                    </p>
                                </div>

                                <div className='rounded-xl border border-gray-200 bg-white p-3 sm:col-span-2'>
                                    <p className='text-xs font-semibold text-gray-500'>Service</p>
                                    <p className='mt-1 text-sm font-semibold text-gray-900'>
                                        {getServiceLabel(selectedBooking)}
                                    </p>
                                </div>

                                <div className='rounded-xl border border-gray-200 bg-white p-3 sm:col-span-2'>
                                    <p className='text-xs font-semibold text-gray-500'>Notes</p>
                                    <p className='mt-1 text-sm text-gray-700'>{selectedBooking?.notes || '-'}</p>
                                </div>

                                <div className='rounded-xl border border-gray-200 bg-white p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Consent</p>
                                    <p className='mt-1 text-sm font-semibold text-gray-900'>{selectedBooking?.consent ? 'Yes' : 'No'}</p>
                                </div>

                                <div className='rounded-xl border border-gray-200 bg-white p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Created At</p>
                                    <p className='mt-1 text-sm font-semibold text-gray-900'>{formatDate(selectedBooking?.createdAt)}</p>
                                </div>

                                <div className='rounded-xl border border-gray-200 bg-white p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Arrival Date</p>
                                    <p className='mt-1 text-sm font-semibold text-gray-900'>{formatDate(selectedBooking?.arrivalDate)}</p>
                                </div>

                                <div className='rounded-xl border border-gray-200 bg-white p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Arrival Time</p>
                                    <p className='mt-1 text-sm font-semibold text-gray-900'>{formatTime(selectedBooking?.arrivalTime)}</p>
                                </div>
                            </div>

                            <div className='mt-4 flex flex-wrap items-center justify-end gap-2'>
                                {selectedBooking?.status === 'Pending' && (
                                    <button
                                        type='button'
                                        onClick={() => openAcceptPopup(selectedBooking)}
                                        className='rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100'
                                    >
                                        Accept
                                    </button>
                                )}

                                {selectedBooking?.status === 'In Progress' && (
                                    <button
                                        type='button'
                                        onClick={() => handleStatusUpdate(selectedBooking, 'Completed')}
                                        className='rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100'
                                    >
                                        Complete
                                    </button>
                                )}

                                {(selectedBooking?.status === 'Pending' || selectedBooking?.status === 'In Progress') && (
                                    <button
                                        type='button'
                                        onClick={() => handleStatusUpdate(selectedBooking, 'Cancelled')}
                                        className='rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100'
                                    >
                                        Cancel
                                    </button>
                                )}

                                <button
                                    type='button'
                                    onClick={() => setSelectedBooking(null)}
                                    className='rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50'
                                >
                                    Close
                                </button>
                            </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
                {acceptBooking && (
                    <motion.div
                        className='fixed inset-0 z-[100] overflow-y-auto bg-black/50 p-4'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeAcceptPopup}
                    >
                        <div className='flex min-h-full items-center justify-center py-6'>
                            <motion.div
                                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                onClick={(e) => e.stopPropagation()}
                                className='w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl ring-1 ring-black/5 sm:p-6'
                            >
                                <div className='flex items-start justify-between gap-3'>
                                    <div>
                                        <p className='text-xs font-semibold uppercase tracking-wide text-red-600'>Accept Booking</p>
                                        <h3 className='mt-1 text-xl font-extrabold text-gray-900'>Set Arrival Date & Time</h3>
                                        <p className='mt-1 text-sm text-gray-600'>{acceptBooking?.fullName || 'Customer'}</p>
                                    </div>
                                    <button
                                        type='button'
                                        onClick={closeAcceptPopup}
                                        className='inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50'
                                    >
                                        <FiX className='h-4 w-4' />
                                    </button>
                                </div>

                                <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                                    <label className='block'>
                                        <span className='text-sm font-semibold text-gray-900'>Arrival Date</span>
                                        <input
                                            type='date'
                                            value={arrivalDateInput}
                                            onChange={(e) => setArrivalDateInput(e.target.value)}
                                            className='mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100'
                                        />
                                    </label>

                                    <label className='block'>
                                        <span className='text-sm font-semibold text-gray-900'>Arrival Time</span>
                                        <input
                                            type='time'
                                            value={arrivalTimeInput}
                                            onChange={(e) => setArrivalTimeInput(e.target.value)}
                                            className='mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100'
                                        />
                                    </label>
                                </div>

                                <div className='mt-5 flex items-center justify-end gap-2'>
                                    <button
                                        type='button'
                                        onClick={closeAcceptPopup}
                                        className='rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50'
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type='button'
                                        onClick={handleAcceptConfirm}
                                        disabled={!arrivalDateInput || !arrivalTimeInput}
                                        className='rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

        </section>
    )
}

export default ViewBookings
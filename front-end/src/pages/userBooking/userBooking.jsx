import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getUserBookings, updateBookingStatus } from '../../rtk/thunks/bookingThunk/bookingThunk'

const progressSteps = ['Pending', 'Confirmed', 'Mechanic Assigned', 'In Progress', 'Completed']
const progressLabels = {
    Pending: 'Request Sent',
    Confirmed: 'Confirmed',
    'Mechanic Assigned': 'Mechanic Assigned',
    'In Progress': 'In Progress',
    Completed: 'Completed',
}

const getServiceLabel = (item) => {
    if (!item) return 'Service unavailable'
    if (item?.serviceName) return item.serviceName
    if (item?.serviceId?.title) return item.serviceId.title
    if (item?.service === 'Others') return item?.otherService || 'Others'
    return item?.service || 'Service unavailable'
}

function StatusTracker ({ status }) {
    if (status === 'Cancelled') {
        return <div className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700'>Cancelled</div>
    }

    const currentIndex = Math.max(0, progressSteps.indexOf(status || 'Pending'))

    return (
        <div className='min-w-[240px]'>
            <div className='flex items-center gap-1'>
                {progressSteps.map((step, index) => {
                    const done = index <= currentIndex
                    return (
                        <span key={step} className={`h-2 flex-1 rounded-full ${done ? 'bg-red-600' : 'bg-gray-200'}`} />
                    )
                })}
            </div>
            <p className='mt-2 text-[11px] font-semibold text-gray-600'>{progressLabels[progressSteps[currentIndex]]}</p>
        </div>
    )
}

function UserBooking () {
    const dispatch = useDispatch()
    const { booking, loading, error } = useSelector((state) => state.booking)

    useEffect(() => {
        dispatch(getUserBookings())
    }, [dispatch])

    const bookings = useMemo(() => (
        Array.isArray(booking?.bookings) ? booking.bookings : []
    ), [booking])

    const pendingCount = useMemo(
        () => bookings.filter((item) => (item?.status || 'Pending') === 'Pending').length,
        [bookings],
    )

    const formatDate = (value) => {
        if (!value) return '-'
        const d = new Date(value)
        if (Number.isNaN(d.getTime())) return '-'
        return d.toLocaleDateString()
    }

    const onCancelBooking = (bookingId) => {
        if (!bookingId) return
        dispatch(updateBookingStatus({ bookingId, status: 'Cancelled' }))
    }

    const getStatusTone = (status) => {
        const normalized = String(status || 'Pending').toLowerCase()
        if (normalized === 'in progress') return 'border border-blue-200 bg-blue-50 text-blue-700'
        if (normalized === 'completed') return 'border border-emerald-200 bg-emerald-50 text-emerald-700'
        if (normalized === 'cancelled') return 'border border-red-200 bg-red-50 text-red-700'
        return 'border border-amber-200 bg-amber-50 text-amber-700'
    }

    const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to load appointments')

    return (
        <section className='mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10'>
            <div className='mb-5 rounded-2xl border border-gray-200 bg-gradient-to-r from-white via-white to-red-50 p-4 shadow-sm ring-1 ring-black/5 sm:p-5'>
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <h1 className='text-2xl font-extrabold tracking-tight text-gray-900'>My Appointments</h1>
                        <p className='mt-1 text-sm text-gray-600'>Your booked appointments are listed below.</p>
                    </div>

                    <div className='flex flex-wrap items-center gap-2'>
                        <span className='inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700'>
                            Total: {bookings.length}
                        </span>
                        <span className='inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700'>
                            Pending: {pendingCount}
                        </span>
                    </div>
                </div>
            </div>

            {loading && (
                <div className='flex min-h-52 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm' role='status' aria-label='Loading appointments'>
                    <span className='h-9 w-9 animate-spin rounded-full border-4 border-red-100 border-t-red-600' />
                </div>
            )}

            {!loading && error && (
                <div className='rounded-xl border border-red-200 bg-red-50 p-4'>
                    <p className='text-sm font-semibold text-red-700'>{errorMessage}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className='hidden overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5 md:block'>
                        <table className='w-full min-w-[780px] text-left whitespace-nowrap'>
                            <thead className='border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white'>
                                <tr>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Reference</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Service</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Date</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Time</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Car Model</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Status</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Action</th>
                                </tr>
                            </thead>

                            <tbody className='[&>tr:nth-child(even)]:bg-gray-50/40'>
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className='px-4 py-6 text-center text-sm font-semibold text-gray-500'>
                                            No appointments found.
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((item, idx) => {
                                        const id = item?._id ?? idx
                                        const status = item?.status || 'Pending'
                                        const service = getServiceLabel(item)
                                        const isEmergency = item?.bookingType === 'Emergency'

                                        return (
                                            <tr key={id} className='border-b border-gray-100'>
                                                <td className='px-4 py-3 text-sm font-semibold text-gray-900'>{item?.referenceNumber || '-'}</td>
                                                <td className='px-4 py-3 text-sm font-semibold text-gray-900'>{service} {isEmergency && <span className='ml-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] text-red-700'>Emergency</span>}</td>
                                                <td className='px-4 py-3 text-sm text-gray-700'>{formatDate(item?.preferredDate)}</td>
                                                <td className='px-4 py-3 text-sm text-gray-700'>{item?.preferredTime || '-'}</td>
                                                <td className='px-4 py-3 text-sm text-gray-700'>{item?.carModel || '-'}</td>
                                                <td className='px-4 py-3'>
                                                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusTone(status)}`}>
                                                        {status}
                                                    </span>
                                                    <div className='mt-2'><StatusTracker status={status} /></div>
                                                </td>
                                                <td className='px-4 py-3'>
                                                    {status === 'Pending' ? (
                                                        <button
                                                            type='button'
                                                            onClick={() => onCancelBooking(item?._id)}
                                                            className='inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100'
                                                        >
                                                            Cancel
                                                        </button>
                                                    ) : (
                                                        <span className='text-xs font-semibold text-gray-400'>-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className='space-y-3 md:hidden'>
                        {bookings.length === 0 ? (
                            <div className='rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-500'>
                                No appointments found.
                            </div>
                        ) : (
                            bookings.map((item, idx) => {
                                const id = item?._id ?? idx
                                const status = item?.status || 'Pending'
                                const service = getServiceLabel(item)
                                const isEmergency = item?.bookingType === 'Emergency'

                                return (
                                    <article
                                        key={id}
                                        className='rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4 shadow-sm ring-1 ring-black/5'
                                    >
                                        <div className='flex items-start justify-between gap-3'>
                                            <div>
                                                <p className='text-[11px] font-bold uppercase tracking-wide text-gray-500'>{item?.referenceNumber || '-'}</p>
                                                <h3 className='mt-1 text-sm font-bold text-gray-900'>{service}</h3>
                                                {isEmergency && <span className='mt-1 inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700'>Emergency</span>}
                                            </div>
                                            <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${getStatusTone(status)}`}>
                                                {status}
                                            </span>
                                        </div>

                                        <div className='mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600'>
                                            <p><span className='font-semibold text-gray-800'>Date:</span> {formatDate(item?.preferredDate)}</p>
                                            <p><span className='font-semibold text-gray-800'>Time:</span> {item?.preferredTime || '-'}</p>
                                            <p className='col-span-2'><span className='font-semibold text-gray-800'>Car:</span> {item?.carModel || '-'}</p>
                                            <p className='col-span-2'><span className='font-semibold text-gray-800'>Booking Type:</span> {item?.bookingType || 'Regular'}</p>
                                        </div>
                                        <div className='mt-3'><StatusTracker status={status} /></div>

                                        <div className='mt-3'>
                                            {status === 'Pending' ? (
                                                <button
                                                    type='button'
                                                    onClick={() => onCancelBooking(item?._id)}
                                                    className='inline-flex w-full items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100'
                                                >
                                                    Cancel Appointment
                                                </button>
                                            ) : (
                                                <span className='text-xs font-semibold text-gray-400'>No action available</span>
                                            )}
                                        </div>
                                    </article>
                                )
                            })
                        )}
                    </div>
                </>
            )}
        </section>
    )
}

export default UserBooking

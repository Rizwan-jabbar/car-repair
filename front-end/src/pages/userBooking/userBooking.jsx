import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getUserBookings, updateBookingStatus } from '../../rtk/thunks/bookingThunk/bookingThunk'

function UserBooking () {
    const dispatch = useDispatch()
    const { booking, loading, error } = useSelector((state) => state.booking)

    useEffect(() => {
        dispatch(getUserBookings())
    }, [dispatch])

    const bookings = Array.isArray(booking?.bookings) ? booking.bookings : []
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
                <div className='rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-600'>
                    Loading appointments...
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
                                        <td colSpan={6} className='px-4 py-6 text-center text-sm font-semibold text-gray-500'>
                                            No appointments found.
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((item, idx) => {
                                        const id = item?._id ?? idx
                                        const status = item?.status || 'Pending'
                                        const service = item?.service === 'Others' ? (item?.otherService || 'Others') : (item?.service || '-')

                                        return (
                                            <tr key={id} className='border-b border-gray-100'>
                                                <td className='px-4 py-3 text-sm font-semibold text-gray-900'>{service}</td>
                                                <td className='px-4 py-3 text-sm text-gray-700'>{formatDate(item?.preferredDate)}</td>
                                                <td className='px-4 py-3 text-sm text-gray-700'>{item?.preferredTime || '-'}</td>
                                                <td className='px-4 py-3 text-sm text-gray-700'>{item?.carModel || '-'}</td>
                                                <td className='px-4 py-3'>
                                                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusTone(status)}`}>
                                                        {status}
                                                    </span>
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
                                const service = item?.service === 'Others' ? (item?.otherService || 'Others') : (item?.service || '-')

                                return (
                                    <article
                                        key={id}
                                        className='rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4 shadow-sm ring-1 ring-black/5'
                                    >
                                        <div className='flex items-start justify-between gap-3'>
                                            <h3 className='text-sm font-bold text-gray-900'>{service}</h3>
                                            <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${getStatusTone(status)}`}>
                                                {status}
                                            </span>
                                        </div>

                                        <div className='mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600'>
                                            <p><span className='font-semibold text-gray-800'>Date:</span> {formatDate(item?.preferredDate)}</p>
                                            <p><span className='font-semibold text-gray-800'>Time:</span> {item?.preferredTime || '-'}</p>
                                            <p className='col-span-2'><span className='font-semibold text-gray-800'>Car:</span> {item?.carModel || '-'}</p>
                                        </div>

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
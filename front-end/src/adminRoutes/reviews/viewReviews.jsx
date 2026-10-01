import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import {
    FiEye,
    FiEyeOff,
    FiMessageSquare,
    FiStar,
    FiTrash2,
    FiUser,
    FiX,
} from 'react-icons/fi'

import { fetchReviews, toggleReviewVisibility } from '../../rtk/thunks/reviewThunk/reviewThunk'

function ViewReviews () {
    const dispatch = useDispatch()
    const { items = [], loading, error } = useSelector((state) => state.review)
    const reviews = Array.isArray(items) ? items : []
    const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to load reviews')

    const [selectedReview, setSelectedReview] = useState(null)
    const [deletedIds, setDeletedIds] = useState([])

    useEffect(() => {
        dispatch(fetchReviews())
    }, [dispatch])

    const visibleReviews = useMemo(
        () => reviews.filter((r) => !deletedIds.includes(r?._id ?? r?.id)),
        [reviews, deletedIds],
    )

    const toggleHidden = (review) => {
        const id = review?._id ?? review?.id
        if (!id) return
        dispatch(toggleReviewVisibility(id))
    }

    const deleteReview = (review) => {
        const id = review?._id ?? review?.id
        if (!id) return

        setDeletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))

        if ((selectedReview?._id ?? selectedReview?.id) === id) {
            setSelectedReview(null)
        }
    }

    const formatDate = (review) => {
        const raw = review?.createdAt || review?.date
        if (!raw) return '-'
        const d = new Date(raw)
        if (Number.isNaN(d.getTime())) return '-'
        return d.toLocaleDateString()
    }

    const StarRow = ({ rating }) => (
        <div className='flex items-center gap-1'>
            {Array.from({ length: 5 }).map((_, i) => (
                <FiStar
                    key={i}
                    className={i < Number(rating || 0) ? 'h-4 w-4 text-amber-500' : 'h-4 w-4 text-gray-300'}
                />
            ))}
        </div>
    )

    return (
        <section className='bg-[#f5f9fe]'>
            <div className='mb-5 rounded-2xl border border-white bg-gradient-to-r from-white via-[#f9fbff] to-red-50/70 p-5 shadow-sm sm:p-6'>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <p className='inline-flex rounded-full bg-red-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-red-600'>Reviews</p>
                    <h1 className='mt-2 text-2xl font-extrabold tracking-tight text-[#102441] sm:text-3xl'>View Reviews</h1>
                    <p className='mt-1 text-sm text-[#6c83a2]'>Manage customer reviews in a simple tabular view.</p>
                </div>

                <div className='inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 shadow-sm'>
                    <FiMessageSquare className='h-4 w-4 text-red-600' />
                    {visibleReviews.length} visible reviews
                </div>
            </div>
            </div>

            {loading && (
                <div className='flex items-center justify-center rounded-xl border border-gray-200 bg-white p-8'>
                    <span className='h-7 w-7 animate-spin rounded-full border-4 border-red-100 border-t-red-600' aria-label='Loading reviews' />
                </div>
            )}

            {!loading && error && (
                <div className='rounded-xl border border-red-200 bg-red-50 p-4'>
                    <p className='text-sm font-semibold text-red-700'>{errorMessage}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className='hidden overflow-x-auto md:block'>
                        <table className='min-w-full text-left'>
                            <thead className='bg-gradient-to-r from-[#1d2d48] to-[#536780] text-white'>
                                <tr>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Customer</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Service</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Rating</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Date</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Status</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='before:block before:h-3 before:content-["_"]'>
                                {visibleReviews.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className='px-4 py-6 text-center text-sm font-semibold text-gray-500'>
                                            No reviews to show.
                                        </td>
                                    </tr>
                                ) : (
                                    visibleReviews.map((review, idx) => {
                                        const id = review?._id ?? review?.id ?? idx
                                        const hidden = review?.visible === false || review?.isVisible === false

                                        return (
                                            <tr
                                                key={id}
                                                onClick={() => setSelectedReview(review)}
                                                className='cursor-pointer bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md'
                                            >
                                                <td className='px-4 py-3'>
                                                    <div>
                                                        <p className='text-sm font-semibold text-gray-900'>{review?.name || 'Anonymous'}</p>
                                                        <p className='text-xs text-gray-500'>{review?.email || review?.phone || '-'}</p>
                                                    </div>
                                                </td>
                                                <td className='px-4 py-3 text-sm font-medium text-gray-700'>{review?.service || '-'}</td>
                                                <td className='px-4 py-3'>
                                                    <StarRow rating={review?.rating} />
                                                </td>
                                                <td className='px-4 py-3 text-sm text-gray-600'>{formatDate(review)}</td>
                                                <td className='px-4 py-3'>
                                                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${hidden ? 'border border-amber-200 bg-amber-50 text-amber-700' : 'border border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                                                        {hidden ? 'Hidden' : 'Visible'}
                                                    </span>
                                                </td>
                                                <td className='px-4 py-3'>
                                                    <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            type='button'
                                                            onClick={() => toggleHidden(review)}
                                                            className='inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow'
                                                        >
                                                            {hidden ? <FiEye className='h-3.5 w-3.5' /> : <FiEyeOff className='h-3.5 w-3.5' />}
                                                            {hidden ? 'Show' : 'Hide'}
                                                        </button>

                                                        <button
                                                            type='button'
                                                            onClick={() => deleteReview(review)}
                                                            className='inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow'
                                                        >
                                                            <FiTrash2 className='h-3.5 w-3.5' />
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
                        {visibleReviews.length === 0 ? (
                            <div className='rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-500'>
                                No reviews to show.
                            </div>
                        ) : (
                            visibleReviews.map((review, idx) => {
                                const id = review?._id ?? review?.id ?? idx
                                const hidden = review?.visible === false || review?.isVisible === false

                                return (
                                    <motion.article
                                        key={id}
                                        layout
                                        onClick={() => setSelectedReview(review)}
                                        className='rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4 shadow-sm ring-1 ring-black/5'
                                    >
                                        <div className='flex items-start justify-between gap-3'>
                                            <div>
                                                <p className='text-sm font-bold text-gray-900'>{review?.name || 'Anonymous'}</p>
                                                <p className='mt-0.5 text-xs text-gray-500'>{review?.service || '-'}</p>
                                            </div>
                                            <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${hidden ? 'border border-amber-200 bg-amber-50 text-amber-700' : 'border border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                                                {hidden ? 'Hidden' : 'Visible'}
                                            </span>
                                        </div>

                                        <div className='mt-2 flex items-center justify-between'>
                                            <StarRow rating={review?.rating} />
                                            <span className='text-xs font-medium text-gray-500'>{formatDate(review)}</span>
                                        </div>

                                        <div className='mt-3 flex gap-2' onClick={(e) => e.stopPropagation()}>
                                            <button
                                                type='button'
                                                onClick={() => toggleHidden(review)}
                                                className='inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50'
                                            >
                                                {hidden ? <FiEye className='h-3.5 w-3.5' /> : <FiEyeOff className='h-3.5 w-3.5' />}
                                                {hidden ? 'Show' : 'Hide'}
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => deleteReview(review)}
                                                className='inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-2 text-xs font-semibold text-red-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-100'
                                            >
                                                <FiTrash2 className='h-3.5 w-3.5' />
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
                {selectedReview && (
                    <motion.div
                        className='fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedReview(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                            className='w-full max-w-2xl rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-5 shadow-2xl ring-1 ring-black/5 sm:p-6'
                        >
                            <div className='flex items-start justify-between gap-3'>
                                <div>
                                    <p className='text-xs font-semibold uppercase tracking-wide text-red-600'>Review Details</p>
                                    <h3 className='mt-1 text-xl font-extrabold text-gray-900'>{selectedReview?.title || 'Customer Review'}</h3>
                                </div>
                                <button
                                    type='button'
                                    onClick={() => setSelectedReview(null)}
                                    className='inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50'
                                >
                                    <FiX className='h-4 w-4' />
                                </button>
                            </div>

                            <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                                <div className='rounded-xl border border-gray-200 bg-gray-50 p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Customer</p>
                                    <p className='mt-1 inline-flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                        <FiUser className='h-4 w-4 text-gray-500' />
                                        {selectedReview?.name || 'Anonymous'}
                                    </p>
                                </div>
                                <div className='rounded-xl border border-gray-200 bg-gray-50 p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Service</p>
                                    <p className='mt-1 text-sm font-semibold text-gray-900'>{selectedReview?.service || '-'}</p>
                                </div>
                                <div className='rounded-xl border border-gray-200 bg-gray-50 p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Rating</p>
                                    <div className='mt-1'>
                                        <StarRow rating={selectedReview?.rating} />
                                    </div>
                                </div>
                                <div className='rounded-xl border border-gray-200 bg-gray-50 p-3'>
                                    <p className='text-xs font-semibold text-gray-500'>Date</p>
                                    <p className='mt-1 text-sm font-semibold text-gray-900'>{formatDate(selectedReview)}</p>
                                </div>
                            </div>

                            <div className='mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
                                <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Review Message</p>
                                <p className='mt-2 text-sm leading-6 text-gray-700'>{selectedReview?.body || '-'}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default ViewReviews
import { useEffect, useMemo } from 'react'
import { FiEdit3, FiStar } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { cardIn, fadeUp, sectionStagger } from '../../utils/motion'
import { fetchReviews } from '../../rtk/thunks/reviewThunk/reviewThunk'

function AllCustomerReviews () {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { items = [], loading, error } = useSelector((state) => state.review)
	const reviews = Array.isArray(items) ? items : []
	const visibleReviews = useMemo(
		() => reviews.filter((r) => r?.visible === true || r?.isVisible === true),
		[reviews],
	)
	const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to load reviews')

	useEffect(() => {
		dispatch(fetchReviews())
	}, [dispatch])

	const avgRating = useMemo(() => {
		if (visibleReviews.length === 0) return 0
		const sum = visibleReviews.reduce((acc, r) => acc + (Number(r?.rating) || 0), 0)
		return Math.round((sum / visibleReviews.length) * 10) / 10
	}, [visibleReviews])

	const formatReviewDate = (review) => {
		const raw = review?.createdAt || review?.date
		if (!raw) return ''
		const d = new Date(raw)
		if (Number.isNaN(d.getTime())) return ''
		return d.toLocaleDateString()
	}

	const StarRow = ({ rating }) => (
		<div className='flex items-center gap-1' aria-label={`${rating} out of 5 stars`}>
			{Array.from({ length: 5 }).map((_, i) => (
				<FiStar
					key={i}
					className={i < rating ? 'h-4 w-4 text-amber-500' : 'h-4 w-4 text-gray-300'}
					aria-hidden='true'
				/>
			))}
		</div>
	)

	return (
		<motion.section
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
				<div className='flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end'>
					<motion.div variants={fadeUp}>
						<p className='inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700'>
							<span className='h-2 w-2 rounded-full bg-red-600' />
							Customer Reviews
						</p>
						<h1 className='mt-3 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl'>
							All customer reviews
						</h1>
						<p className='mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-relaxed'>
							Read the full list of reviews. Want to share yours? It takes less than a minute.
						</p>
					</motion.div>

					<motion.div className='w-full max-w-sm p-5 cr-card' variants={cardIn}>
						<div className='flex items-center justify-between gap-4'>
							<div>
								<p className='text-sm font-semibold text-gray-600'>Average rating</p>
								<p className='mt-1 text-3xl font-extrabold text-gray-900'>{avgRating}</p>
							</div>
							<div className='text-right'>
								<StarRow rating={Math.round(avgRating)} />
								<p className='mt-2 text-xs font-semibold text-gray-500'>{visibleReviews.length} reviews</p>
							</div>
						</div>

						<button
							type='button'
							onClick={() => navigate('/feedback')}
							className='mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 active:translate-y-0'
						>
							<FiEdit3 className='h-4 w-4' aria-hidden='true' />
							Add your review
						</button>
					</motion.div>
				</div>

				<div className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
					{loading && (
						<motion.div className='p-6 text-sm font-semibold text-gray-600 cr-card sm:col-span-2 lg:col-span-3' variants={fadeUp}>
							Loading latest reviews...
						</motion.div>
					)}

					{!loading && error && (
						<motion.div className='p-6 cr-card sm:col-span-2 lg:col-span-3' variants={fadeUp}>
							<p className='text-sm font-semibold text-red-700'>{errorMessage}</p>
							<button
								type='button'
								onClick={() => dispatch(fetchReviews())}
								className='mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100'
							>
								Retry
							</button>
						</motion.div>
					)}

					{!loading && !error && visibleReviews.length === 0 && (
						<motion.div className='p-6 text-sm font-semibold text-gray-600 cr-card sm:col-span-2 lg:col-span-3' variants={fadeUp}>
							No reviews yet. Be the first to share your experience.
						</motion.div>
					)}

					{!loading && !error && visibleReviews.map((r, idx) => (
						<motion.article
							key={r._id ?? r.id ?? idx}
							className='group p-6 cr-card cr-card-hover'
							variants={cardIn}
							whileHover={{ y: -6 }}
						>
							<div className='flex items-start justify-between gap-4'>
								<div className='min-w-0'>
									<p className='truncate text-sm font-extrabold text-gray-900'>{r.name}</p>
									<div className='mt-2 flex flex-wrap items-center gap-x-3 gap-y-1'>
										<StarRow rating={Number(r?.rating) || 0} />
										<span className='text-xs font-semibold text-gray-500'>{formatReviewDate(r)}</span>
									</div>
								</div>

								{r.verified && (
									<span className='shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'>
										Verified service
									</span>
								)}
							</div>

							<h3 className='mt-4 text-base font-extrabold tracking-tight text-gray-900'>
								{r.title}
							</h3>

							<p className='mt-2 text-sm leading-6 text-gray-600'>
								{r.body}
							</p>

							<div className='mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4'>
								<span className='text-xs font-semibold text-gray-500'>Service: {r.service}</span>
							</div>
						</motion.article>
					))}
				</div>
			</div>
		</motion.section>
	)
}

export default AllCustomerReviews

import { useEffect, useMemo } from 'react'
import { FiEdit3, FiStar, FiCheckCircle, FiTool, FiArrowUpRight } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import reviewImage from '../../pictures/banner3.jpg'

import { cardIn, fadeUp, sectionStagger } from '../../utils/motion'
import { fetchReviews } from '../../rtk/thunks/reviewThunk/reviewThunk'

function AllCustomerReviews () {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { items = [], loading, error } = useSelector((state) => state.review)
	const reviews = Array.isArray(items) ? items : []
	const visibleReviews = useMemo(
		() => reviews.filter((r) => r?.visible !== false && r?.isVisible !== false),
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
			<div className='cr-container cr-section-pad'>
				<div className='grid items-center gap-8 lg:grid-cols-[1.05fr_1fr]'>
					<motion.div variants={fadeUp}>
						<p className='inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-red-600'>
							<span className='h-px w-9 bg-red-500' />
							Customer Reviews
							<span className='h-px w-9 bg-red-500' />
						</p>
						<h1 className='mt-3 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-[#102957] sm:text-4xl lg:text-[2.65rem]'>
							Real feedback from our valued customers
						</h1>
						<p className='mt-3 max-w-xl text-sm leading-6 text-[#31557d] sm:text-base'>
							See what our customers have to say about our reliable auto repair services, professional team, and commitment to quality.
						</p>
					</motion.div>

					<motion.div className='relative min-h-[180px] overflow-hidden rounded-xl border border-[#e1e9f1] bg-white shadow-sm' variants={cardIn}>
						<img src={reviewImage} alt='' className='absolute inset-0 h-full w-full object-cover object-center opacity-85' />
						<div className='absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/10' />
						<div className='relative max-w-[390px] p-5'>
							<div className='flex items-center justify-between gap-4'>
							<div>
								<p className='text-xs font-bold text-[#31557d]'>Average Rating</p>
								<p className='mt-1 text-3xl font-extrabold text-[#102957]'>{avgRating}</p>
							</div>
							<div className='text-right'>
								<StarRow rating={Math.round(avgRating)} />
								<p className='mt-2 text-[11px] font-semibold text-[#527292]'>Based on {visibleReviews.length} reviews</p>
							</div>
							</div>

							<div className='mt-3 rounded-lg border border-[#dae6f0] bg-[#f4f8fc] p-2.5'>
								<p className='text-[11px] font-bold text-[#17345c]'>Top highlights</p>
								<p className='mt-1 text-[10px] text-[#527292]'>Reliable Service &nbsp;•&nbsp; Skilled Technicians &nbsp;•&nbsp; Fair Pricing</p>
							</div>
							<button type='button' onClick={() => navigate('/feedback')} className='mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700'>
								<FiEdit3 className='h-3.5 w-3.5' aria-hidden='true' /> Add your review
							</button>
							<p className='mt-1 text-center text-[10px] font-semibold text-[#527292]'>Takes less than 2 minutes.</p>
						</div>
					</motion.div>
				</div>

				<div className='mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5'>
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
							className='group flex min-h-[250px] flex-col rounded-lg border border-[#dfe8f0] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md'
							variants={cardIn}
							whileHover={{ y: -6 }}
						>
							<div className='flex items-start gap-3'>
								<div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-red-500 text-red-600'><FiTool className='h-5 w-5' /></div>
								<div className='min-w-0'>
									<p className='truncate text-xs font-extrabold text-[#17345c]'>{r.service || 'General Service'}</p>
									<div className='mt-1 flex flex-wrap items-center gap-1'>
										<StarRow rating={Number(r?.rating) || 0} />
										<span className='text-[9px] font-semibold text-[#6c89a3]'>{formatReviewDate(r)}</span>
									</div>
								</div>
								<span className='ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f3f7fb] text-[#17345c] transition group-hover:bg-red-600 group-hover:text-white'><FiArrowUpRight className='h-4 w-4' /></span>
							</div>

							<h3 className='mt-3 line-clamp-2 text-xs font-extrabold leading-4 text-[#17345c]'>{r.title || 'Customer Experience'}</h3>
							<p className='mt-2 flex-1 text-xs leading-5 text-[#31557d]'>&ldquo;{r.body}&rdquo;</p>

							<div className='mt-4 flex items-center gap-2 border-t border-[#edf1f5] pt-3'>
								<span className='flex h-7 w-7 items-center justify-center rounded-full bg-[#153b64] text-xs font-bold text-white'>{(r.name || 'C').charAt(0)}</span>
								<span className='text-[10px] font-bold text-[#17345c]'>{r.name || 'Customer'}<span className='block text-[9px] font-normal text-[#7190aa]'>{r.verified ? 'Verified Customer' : 'Customer'}</span></span>
								{r.verified && <span className='ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700'><FiCheckCircle className='h-3 w-3' /> Verified</span>}
							</div>
							<span className='mt-3 inline-flex w-fit items-center gap-1 rounded-full border border-[#dfe8f0] bg-[#f7fafd] px-2.5 py-1 text-[9px] font-bold text-[#527292]'><FiTool className='h-3 w-3 text-red-600' /> {r.service || 'General Service'}</span>
						</motion.article>
					))}
				</div>
			</div>
		</motion.section>
	)
}

export default AllCustomerReviews

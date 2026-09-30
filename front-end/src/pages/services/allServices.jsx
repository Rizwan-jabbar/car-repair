import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiTool } from 'react-icons/fi'

import { cardIn, fadeUp, sectionStagger } from '../../utils/motion'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchServices } from '../../rtk/thunks/serviceThunk/serviceThunk'



function AllServices () {
	const dispatch = useDispatch()
	const { items = [], loading, error } = useSelector((state) => state.service)

	useEffect(() => {
		dispatch(fetchServices())
	}, [dispatch])

	const services = useMemo(() => {
		const list = Array.isArray(items) ? items : []
		return list
			.map((item) => item?.service ?? item)
			.filter((service) => service && typeof service === 'object')
	}, [items])

	const {user} = useSelector((state) => state.user)
	return (
		<motion.section
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
						<h1 className='mt-3 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl'>
							Explore all services
						</h1>
						<p className='mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-relaxed'>
							Browse our complete service list. We share an estimate before starting any work and back repairs with warranty.
						</p>
					</motion.div>

					<motion.a
						href='#book-repair'
						className='cr-btn-primary'
						variants={fadeUp}
						whileHover={{ y: -2 }}
						whileTap={{ scale: 0.98 }}
					>
						Book a Service
					</motion.a>
				</div>

				<div className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
					{loading && (
						<motion.div className='p-6 text-sm font-semibold text-gray-600 cr-card sm:col-span-2 lg:col-span-3' variants={fadeUp}>
							Loading services...
						</motion.div>
					)}

					{!loading && error && (
						<motion.div className='p-6 text-sm font-semibold text-red-700 cr-card sm:col-span-2 lg:col-span-3' variants={fadeUp}>
							{typeof error === 'string' ? error : (error?.message || 'Failed to load services')}
						</motion.div>
					)}

					{!loading && !error && services.length === 0 && (
						<motion.div className='p-6 text-sm font-semibold text-gray-600 cr-card sm:col-span-2 lg:col-span-3' variants={fadeUp}>
							No services available right now.
						</motion.div>
					)}

					{!loading && !error && services.map((service) => (
						<motion.article
							key={service._id ?? service.id ?? service.title}
							className='group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5 transition-shadow duration-200 hover:shadow-lg focus-within:ring-2 focus-within:ring-red-600/30'
							variants={cardIn}
							whileHover={{ y: -5 }}
						>
                            <div className='relative h-32 bg-gradient-to-br from-slate-100 via-gray-200 to-slate-300' aria-label={`${service.title} image`}>
								<div className='absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.35),transparent_55%)]' />
								{service.image && (
									<img
										src={service.image}
										alt={service.title}
										className='absolute inset-0 h-full w-full object-cover'
										onError={(event) => { event.currentTarget.style.display = 'none' }}
									/>
								)}
								<div className='absolute -bottom-5 left-5 inline-flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-red-600 text-white shadow-md'>
									<FiTool className='h-5 w-5' aria-hidden='true' />
								</div>
								{service.isAvailable === false && (
									<span className='absolute right-4 top-4 rounded-full border border-red-200 bg-white/95 px-2.5 py-1 text-[11px] font-bold text-red-700 shadow-sm'>
										Currently unavailable
									</span>
								)}
							</div>

							<div className='flex min-h-[205px] flex-col p-5'>
								<div className='pl-1'>
									<p className='text-[11px] font-semibold uppercase tracking-wide text-gray-500'>Service</p>
									<h3 className='mt-1 line-clamp-2 text-base font-extrabold tracking-tight text-gray-900 sm:text-lg'>
										{service.title}
									</h3>
									<p className='mt-2 line-clamp-3 text-sm leading-5 text-gray-600'>
										{service.description}
									</p>
								</div>

								<div className='mt-auto flex items-end justify-between gap-3 border-t border-gray-100 pt-4'>
									<div>
										<p className='text-[11px] font-medium text-gray-500'>From</p>
										<p className='text-sm font-extrabold text-red-600'>
											{service.price ? `Rs. ${Number(service.price).toLocaleString()}` : 'Get a quote'}
										</p>
									</div>
									{service.isAvailable !== false ? (
										<NavLink
											to={user ? `/book-repair?service=${encodeURIComponent(service.title)}` : '/login'}
											className='inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2'
										>
											Book Now
											<span className='text-red-300' aria-hidden='true'>→</span>
										</NavLink>
									) : (
										<span className='rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-700'>Unavailable</span>
									)}
								</div>
							</div>
						</motion.article>
					))}
				</div>
			</div>
		</motion.section>
	)
}

export default AllServices

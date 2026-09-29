import { useEffect, useMemo, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { FiArrowRight, FiCheckCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { fetchLatestBanner } from '../../rtk/thunks/bannerThunk/bannerThunk'

import banner1 from '../../pictures/banner1.jpg'
import banner2 from '../../pictures/banner2.jpg'
import banner3 from '../../pictures/banner3.jpg'

function Banner () {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.user)
    const { latestBanner } = useSelector((state) => state.banner)

    useEffect(() => {
        dispatch(fetchLatestBanner())
    }, [dispatch])

    const images = useMemo(
        () => ([
            { src: latestBanner?.imageOne || banner1, alt: 'Car repair workshop banner image' },
            { src: latestBanner?.imageTwo || banner2, alt: 'Mechanic service banner image' },
            { src: latestBanner?.imageThree || banner3, alt: 'Car maintenance banner image' },
        ]),
        [latestBanner],
    )

    const bannerTitle = latestBanner?.title || 'Professional Car Repair You Can Trust'
    const bannerDescription = latestBanner?.description
        || 'Quick diagnostics, quality parts, and skilled technicians. Book online or call now—get your car back on the road without the stress.'
    const ctaLink = latestBanner?.link || (user ? '/book-repair' : '/login')

    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        const id = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % images.length)
        }, 6000)

        return () => clearInterval(id)
    }, [images.length])

    return (
        <section className='relative overflow-hidden bg-gradient-to-b from-white via-white to-gray-50'>
            <div className='pointer-events-none absolute inset-0 -z-10'>
                <div className='absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl' />
                <div className='absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-red-500/10 blur-3xl' />
                <div className='absolute -bottom-48 right-0 h-[28rem] w-[28rem] rounded-full bg-gray-900/5 blur-3xl' />
            </div>

            <motion.div
                className='group relative h-[80vh] min-h-[540px] w-full overflow-hidden bg-gray-100 sm:h-[84vh] lg:h-[90vh] lg:min-h-[640px]'
                whileHover={{ y: -2 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
            >
                <AnimatePresence mode='wait' initial={false}>
                    <motion.img
                        key={images[activeIndex].src}
                        src={images[activeIndex].src}
                        alt={images[activeIndex].alt}
                        className='absolute inset-0 h-full w-full object-cover object-center'
                        loading='eager'
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.01 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                </AnimatePresence>

                <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/5' />
                <div className='pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/12' />

                <button
                    type='button'
                    aria-label='Previous banner image'
                    onClick={() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className='absolute left-3 top-1/2 z-20 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white backdrop-blur transition hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
                >
                    <FiChevronLeft className='h-4 w-4' aria-hidden='true' />
                </button>

                <button
                    type='button'
                    aria-label='Next banner image'
                    onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
                    className='absolute right-3 top-1/2 z-20 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white backdrop-blur transition hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
                >
                    <FiChevronRight className='h-4 w-4' aria-hidden='true' />
                </button>

                <div className='absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/35 bg-black/20 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur'>
                    <span className='inline-flex h-2 w-2 rounded-full bg-green-400' />
                    Open Now
                </div>

                <div className='absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/25 px-2 py-1 backdrop-blur'>
                    {images.map((img, idx) => (
                        <button
                            key={`${img.src}-dot`}
                            type='button'
                            aria-label={`Go to slide ${idx + 1}`}
                            aria-current={idx === activeIndex ? 'true' : undefined}
                            onClick={() => setActiveIndex(idx)}
                            className={
                                idx === activeIndex
                                    ? 'h-1.5 w-5 rounded-full bg-white'
                                    : 'h-1.5 w-1.5 rounded-full bg-white/70 transition hover:bg-white'
                            }
                        />
                    ))}
                </div>

                <div className='absolute inset-0 z-10 flex items-end'>
                    <div className='w-full px-4 pb-10 sm:px-7 sm:pb-12 lg:px-12 lg:pb-14'>
                        <div className='max-w-3xl'>
                            <div className='flex flex-wrap items-center gap-2'>
                                <span className='inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/25 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur'>
                                    <span className='h-2 w-2 rounded-full bg-red-500' />
                                    24/7 Emergency Support
                                </span>
                                <span className='inline-flex items-center rounded-full border border-white/30 bg-black/20 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur'>
                                    Certified Mechanics
                                </span>
                                <span className='inline-flex items-center rounded-full border border-white/30 bg-black/20 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur'>
                                    Transparent Pricing
                                </span>
                            </div>

                            <h1 className='mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl'>
                                {bannerTitle}
                            </h1>

                            <p className='mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base'>
                                {bannerDescription}
                            </p>

                            <ul className='mt-5 grid gap-2.5 text-xs leading-6 text-white/90 sm:grid-cols-2 sm:text-[13px]'>
                                <li className='flex items-start gap-2.5'>
                                    <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-white'>
                                        <FiCheckCircle className='h-4 w-4' aria-hidden='true' />
                                    </span>
                                    <span><span className='font-semibold text-white'>Same-day service</span> on common repairs</span>
                                </li>
                                <li className='flex items-start gap-2.5'>
                                    <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-white'>
                                        <FiCheckCircle className='h-4 w-4' aria-hidden='true' />
                                    </span>
                                    <span><span className='font-semibold text-white'>Warranty-backed</span> workmanship</span>
                                </li>
                            </ul>

                            <div className='mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center'>
                                <NavLink
                                    to={ctaLink}
                                    className='inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20'
                                >
                                    Book a Repair
                                    <FiArrowRight className='h-4 w-4' aria-hidden='true' />
                                </NavLink>
                                <a
                                    href='#services'
                                    className='inline-flex items-center justify-center gap-2 rounded-md border border-white/40 bg-black/20 px-5 py-2.5 text-[13px] font-semibold text-white backdrop-blur transition hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
                                >
                                    Get a Quote
                                    <FiArrowRight className='h-4 w-4' aria-hidden='true' />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default Banner
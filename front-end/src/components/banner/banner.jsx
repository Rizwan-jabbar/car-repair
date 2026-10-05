import { useEffect, useMemo, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { FiArrowRight, FiCheckCircle, FiChevronLeft, FiChevronRight, FiShield, FiSettings, FiClock, FiPhoneCall, FiStar, FiTool } from 'react-icons/fi'
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
    const titleLead = bannerTitle.replace(/\s+You Can Trust\s*$/i, '').trim()
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

                <div className='absolute left-4 right-4 top-5 z-20 flex items-center justify-between gap-4 sm:left-8 sm:right-8 lg:left-12 lg:right-12'>
                    <div className='hidden items-center gap-3 text-white/90 sm:flex'>
                        <span className='flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-5 py-3 backdrop-blur'><span className='flex h-10 w-10 items-center justify-center rounded-full bg-red-700/80'><FiShield className='h-5 w-5 text-white' /></span><span><b className='block text-xs'>Trusted Experts</b><small className='block text-[10px] font-normal text-white/60'>Skilled Technicians</small></span></span>
                        <span className='flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-5 py-3 backdrop-blur'><span className='flex h-10 w-10 items-center justify-center rounded-full bg-red-700/80'><FiSettings className='h-5 w-5 text-white' /></span><span><b className='block text-xs'>Quality Parts</b><small className='block text-[10px] font-normal text-white/60'>Genuine & Durable</small></span></span>
                        <span className='flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-5 py-3 backdrop-blur'><span className='flex h-10 w-10 items-center justify-center rounded-full bg-red-700/80'><FiClock className='h-5 w-5 text-white' /></span><span><b className='block text-xs'>Fast Service</b><small className='block text-[10px] font-normal text-white/60'>Get Back on Road</small></span></span>
                    </div>
                    <div className='ml-auto' />
                </div>

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

                <div className='hidden'>
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

                <div className='absolute inset-0 z-10 flex items-center'>
                    <div className='w-full px-5 pt-12 sm:px-9 sm:pt-14 lg:px-16 lg:pt-16 lg:pr-[42%]'>
                        <div className='max-w-3xl'>
                            <p className='mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/50 bg-red-600 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white shadow-lg'><FiTool className='h-3.5 w-3.5' />Professional Car Repair Service</p>
                            <h1 className='mt-2 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-[3.35rem]'>
                                {titleLead}<br /><span className='text-red-500 block mt-3'>You Can Trust</span>
                            </h1>

                            <p className='mt-4 max-w-2xl text-base leading-7 text-white/85 sm:text-lg'>
                                {bannerDescription}
                            </p>

                            <ul className='mt-6 flex flex-wrap gap-3 text-xs leading-5 text-white/90 sm:gap-4 sm:text-[13px]'>
                                <li className='flex items-center gap-3 rounded-full border border-white/20 bg-black/30 px-3 py-2 backdrop-blur-sm'><span className='inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-700/90'><FiShield className='h-5 w-5' /></span><span><b className='block text-white'>24/7</b><small className='block text-[10px] text-white/70'>Emergency Support</small></span></li>
                                <li className='flex items-center gap-3 rounded-full border border-white/20 bg-black/30 px-3 py-2 backdrop-blur-sm'><span className='inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-700/90'><FiSettings className='h-5 w-5' /></span><span><b className='block text-white'>Certified</b><small className='block text-[10px] text-white/70'>Mechanics</small></span></li>
                                <li className='flex items-center gap-3 rounded-full border border-white/20 bg-black/30 px-3 py-2 backdrop-blur-sm'><span className='inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-700/90'><FiCheckCircle className='h-5 w-5' /></span><span><b className='block text-white'>Clear</b><small className='block text-[10px] text-white/70'>Estimates</small></span></li>
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
                                    href='tel:+923001234567'
                                    className='inline-flex items-center justify-center gap-2 rounded-md border border-white/40 bg-black/20 px-5 py-2.5 text-[13px] font-semibold text-white backdrop-blur transition hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
                                >
                                    <FiPhoneCall className='h-4 w-4' /> Call Now <span className='text-[10px] font-normal'>+92 300 1234567</span>
                                    <FiArrowRight className='h-4 w-4' aria-hidden='true' />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='absolute right-10 top-28 z-20 hidden text-right lg:block'><p className='text-2xl font-extrabold italic leading-tight text-white/90'>Your Car,<br /><span className='text-red-500'>Our Priority</span></p><span className='mt-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60'>Professional care. Every drive.</span></div>

                <div className='absolute bottom-24 right-6 z-20 hidden w-[330px] rounded-2xl border border-white/25 bg-black/60 p-4 text-white shadow-2xl backdrop-blur-md lg:block'>
                    <div className='flex items-center justify-between'><div className='flex -space-x-2'><span className='flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-xs font-bold'>A</span><span className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-bold'>S</span><span className='flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold'>R</span></div><div className='flex items-center gap-1 text-amber-400'><FiStar /><FiStar /><FiStar /><FiStar /><FiStar /></div><NavLink to='/reviews' aria-label='View all reviews' className='flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition hover:bg-red-600'><FiArrowRight className='h-4 w-4' /></NavLink></div>
                    <p className='mt-3 text-xs leading-5 text-white/90'>&ldquo;Excellent service! My car runs like new again. Highly recommended!&rdquo;</p>
                    <p className='mt-2 text-[10px] text-white/60'>— Ali Raza, Lahore</p>
                </div>

                <div className='absolute bottom-0 left-0 right-0 z-20 hidden border-t border-white/15 bg-black/45 px-8 py-3 text-white/90 backdrop-blur-sm lg:flex lg:items-center lg:justify-between lg:px-12'>
                    <span className='flex items-center gap-3'><FiTool className='h-7 w-7 text-red-500' /><span><b className='block text-xl'>1000+</b><small className='text-[10px] text-white/65'>Happy Customers</small></span></span><span className='h-8 w-px bg-white/20' /><span className='flex items-center gap-3'><FiTool className='h-7 w-7 text-red-500' /><span><b className='block text-xl'>5000+</b><small className='text-[10px] text-white/65'>Repairs Completed</small></span></span><span className='h-8 w-px bg-white/20' /><span className='flex items-center gap-3'><FiShield className='h-7 w-7 text-red-500' /><span><b className='block text-xl'>100%</b><small className='text-[10px] text-white/65'>Genuine Parts</small></span></span><span className='h-8 w-px bg-white/20' /><span className='flex items-center gap-3'><FiClock className='h-7 w-7 text-red-500' /><span><b className='block text-xl'>24/7</b><small className='text-[10px] text-white/65'>Roadside Support</small></span></span><span className='text-sm font-bold'>Quality Service. Every Time.</span>
                </div>
            </motion.div>
        </section>
    )
}

export default Banner

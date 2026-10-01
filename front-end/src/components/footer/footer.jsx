import { motion } from 'framer-motion'
import { FiArrowUpRight, FiMail, FiMapPin, FiPhone, FiLogIn, FiUserPlus, FiShield, FiTool, FiLink2 } from 'react-icons/fi'
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

import logo from '../../pictures/mainLogo.png'
import footerImage from '../../pictures/banner3.jpg'
import footerCarImage from '../../pictures/banner1.jpg'

const container = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: 'easeOut',
            when: 'beforeChildren',
            staggerChildren: 0.06,
        },
    },
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

function Footer () {
    const { user } = useSelector((state) => state.user)

    return (
        <motion.footer
            className='relative overflow-hidden border-t border-[#1d3448] bg-[#091b2a] text-white'
            style={{ backgroundImage: `linear-gradient(90deg, rgba(9,27,42,.78), rgba(9,27,42,.96) 43%, rgba(9,27,42,.99)), url(${footerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.2 }}
            variants={container}
        >
            <div className='pointer-events-none absolute bottom-0 left-0 h-64 w-[30rem] opacity-45' style={{ backgroundImage: `linear-gradient(90deg, transparent 35%, #091b2a 100%), url(${footerCarImage})`, backgroundSize: 'cover', backgroundPosition: 'left center' }} />
            <div className='relative mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8'>
                <div className='grid gap-8 lg:grid-cols-5 lg:gap-0'>
                    <motion.div className='relative z-10 space-y-4 pr-8 lg:border-r lg:border-[#284052]' variants={item}>
                        <NavLink to='/' className='inline-flex items-center gap-2.5'>
                            <img src={logo} alt='AutoSphere logo' className='h-16 w-16 object-contain' />
                            <span className='text-2xl font-extrabold tracking-tight text-white'>
                                Auto<span className='text-red-600'>Sphere</span>
                            </span>
                        </NavLink>
                        <p className='max-w-xs text-sm leading-6 text-gray-300'>
                            Your trusted car repair and maintenance partner. We provide reliable, professional, and affordable services to keep your vehicle running at its best.
                        </p>

                        <div className='flex items-center gap-3'>
                            <motion.a
                                href='https://facebook.com'
                                target='_blank'
                                rel='noreferrer'
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#102b42] text-white shadow-sm transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2'
                                aria-label='Facebook'
                            >
                                <FaFacebookF className='h-4 w-4' aria-hidden='true' />
                            </motion.a>
                            <motion.a
                                href='https://instagram.com'
                                target='_blank'
                                rel='noreferrer'
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#102b42] text-white shadow-sm transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2'
                                aria-label='Instagram'
                            >
                                <FaInstagram className='h-4 w-4' aria-hidden='true' />
                            </motion.a>
                            <motion.a
                                href='https://wa.me/923001234567'
                                target='_blank'
                                rel='noreferrer'
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#102b42] text-white shadow-sm transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2'
                                aria-label='WhatsApp'
                            >
                                <FaWhatsapp className='h-4 w-4' aria-hidden='true' />
                            </motion.a>
                        </div>
                    </motion.div>

                    <motion.div className='px-2 lg:border-r lg:border-[#284052] lg:px-8' variants={item}>
                        <p className='flex items-center gap-3 text-lg font-extrabold text-white'><FiLink2 className='h-7 w-7 text-red-500' />Quick Links</p>
                        <ul className='mt-5 space-y-3 text-sm'>
                            <li>
                                    <NavLink className='group flex w-full items-center justify-between font-semibold text-gray-200 transition hover:text-red-400' to='/services'>
                                    Services
                                    <FiArrowUpRight className='h-4 w-4 text-gray-400 transition group-hover:translate-x-1 group-hover:text-red-400' aria-hidden='true' />
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className='group flex w-full items-center justify-between font-semibold text-gray-200 transition hover:text-red-400' to='/why-us'>
                                    Why us
                                    <FiArrowUpRight className='h-4 w-4 text-gray-400 transition group-hover:translate-x-1 group-hover:text-red-400' aria-hidden='true' />
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className='group flex w-full items-center justify-between font-semibold text-gray-200 transition hover:text-red-400' to='/reviews'>
                                    Reviews
                                    <FiArrowUpRight className='h-4 w-4 text-gray-400 transition group-hover:translate-x-1 group-hover:text-red-400' aria-hidden='true' />
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    className='group flex w-full items-center justify-between font-semibold text-gray-200 transition hover:text-red-400'
                                    to={user ? '/book-repair' : '/login'}
                                >
                                    Book Service
                                    <FiArrowUpRight className='h-4 w-4 text-gray-400 transition group-hover:translate-x-1 group-hover:text-red-400' aria-hidden='true' />
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className='group flex w-full items-center justify-between font-semibold text-gray-200 transition hover:text-red-400' to='/contact'>
                                    Contact
                                    <FiArrowUpRight className='h-4 w-4 text-gray-400 transition group-hover:translate-x-1 group-hover:text-red-400' aria-hidden='true' />
                                </NavLink>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div className='px-2 lg:border-r lg:border-[#284052] lg:px-8' variants={item}>
                        <p className='flex items-center gap-3 text-lg font-extrabold text-white'><FiTool className='h-7 w-7 text-red-500' />Our Services</p>
                        <ul className='mt-5 space-y-3 text-sm'>
                            {['Engine Repair', 'Brake Service', 'Oil Change', 'Battery Service', 'AC Repair', 'Tire & Wheel'].map((service) => (
                                <li key={service} className='flex items-center justify-between font-semibold text-gray-200'>
                                    <span>{service}</span><FiArrowUpRight className='h-4 w-4 text-gray-400' aria-hidden='true' />
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div className='px-2 lg:border-r lg:border-[#284052] lg:px-8' variants={item}>
                        <p className='flex items-center gap-3 text-lg font-extrabold text-white'><FiUserPlus className='h-7 w-7 text-red-500' />My Account</p>
                        <ul className='mt-4 space-y-3 text-sm'>
                            <li><NavLink className='flex items-center gap-3 font-semibold text-gray-200 transition hover:text-red-400' to='/login'><FiLogIn />Sign In</NavLink></li>
                            <li><NavLink className='flex items-center gap-3 font-semibold text-gray-200 transition hover:text-red-400' to='/register'><FiUserPlus />Sign Up</NavLink></li>
                        </ul>
                        <div className='mt-6 rounded-xl border border-[#2d4d67] bg-[#102b42] p-4'><p className='flex items-center gap-2 text-base font-bold'><FiShield className='h-6 w-6' />Need Help?</p><p className='mt-1 text-xs text-gray-300'>Our support team is available 24/7.</p><NavLink to='/contact' className='mt-3 inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700'>Contact Us <FiArrowUpRight /></NavLink></div>
                    </motion.div>

                    <motion.div className='px-2 lg:px-8' variants={item}>
                        <p className='flex items-center gap-3 text-lg font-extrabold text-white'><FiMapPin className='h-7 w-7 text-red-500' />Contact Us</p>
                        <ul className='mt-5 space-y-5 text-sm text-gray-200'>
                            <li className='flex items-start gap-3'>
                                <FiPhone className='mt-0.5 h-5 w-5 text-white' aria-hidden='true' />
                                <a className='font-semibold transition hover:text-red-400' href='tel:+923001234567'>+92 300 1234567<span className='block text-xs font-normal text-gray-400'>Call us for appointments</span></a>
                            </li>
                            <li className='flex items-start gap-3'>
                                <FiMail className='mt-0.5 h-5 w-5 text-white' aria-hidden='true' />
                                <a className='font-semibold transition hover:text-red-400' href='mailto:support@autosphere.com'>support@autosphere.com<span className='block text-xs font-normal text-gray-400'>We reply within 24 hours</span></a>
                            </li>
                            <li className='flex items-start gap-3'>
                                <FiMapPin className='mt-0.5 h-5 w-5 text-white' aria-hidden='true' />
                                <a
                                    className='font-semibold transition hover:text-red-400'
                                    href='https://www.google.com/maps/search/?api=1&query=AutoSphere%20Johar%20Town%20Lahore'
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    Johar Town, Lahore<span className='block text-xs font-normal text-gray-400'>Visit our workshop</span>
                                </a>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                <motion.div className='mt-8 flex flex-col gap-3 border-t border-[#284052] pt-5 text-sm text-gray-300 sm:flex-row sm:items-center sm:justify-between' variants={item}>
                    <p>Copyright {new Date().getFullYear()} <span className='font-bold text-red-500'>AutoSphere</span>. All rights reserved.</p>
                    <p className='text-xs font-semibold text-gray-400'>QUALITY SERVICE &nbsp;•&nbsp; TRUSTED EXPERTS &nbsp;•&nbsp; YOUR SAFETY OUR PRIORITY</p>
                </motion.div>
            </div>
        </motion.footer>
    )
}

export default Footer

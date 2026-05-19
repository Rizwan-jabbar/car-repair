import { motion } from 'framer-motion'
import { FiArrowUpRight, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

import logo from '../../pictures/mainLogo.png'

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
            className='border-t border-gray-200 bg-white'
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.2 }}
            variants={container}
        >
            <div className='mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8'>
                <div className='grid gap-10 lg:grid-cols-4'>
                    <motion.div className='space-y-4' variants={item}>
                        <NavLink to='/' className='inline-flex items-center gap-2.5'>
                            <img src={logo} alt='AutoSphere logo' className='h-9 w-auto object-contain' />
                            <span className='text-lg font-extrabold tracking-tight text-gray-900'>
                                Auto<span className='text-red-600'>Sphere</span>
                            </span>
                        </NavLink>
                        <p className='text-sm leading-6 text-gray-600'>
                            Professional car care with transparent pricing, skilled mechanics, and reliable turnaround.
                        </p>

                        <div className='flex items-center gap-3'>
                            <motion.a
                                href='https://facebook.com'
                                target='_blank'
                                rel='noreferrer'
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2'
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
                                className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2'
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
                                className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2'
                                aria-label='WhatsApp'
                            >
                                <FaWhatsapp className='h-4 w-4' aria-hidden='true' />
                            </motion.a>
                        </div>
                    </motion.div>

                    <motion.div variants={item}>
                        <p className='text-sm font-extrabold text-gray-900'>Quick Links</p>
                        <ul className='mt-4 space-y-3 text-sm'>
                            <li>
                                <NavLink className='group inline-flex items-center gap-1 font-semibold text-gray-700 transition hover:text-red-600' to='/services'>
                                    Services
                                    <FiArrowUpRight className='h-4 w-4 opacity-0 transition group-hover:opacity-100' aria-hidden='true' />
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className='group inline-flex items-center gap-1 font-semibold text-gray-700 transition hover:text-red-600' to='/why-us'>
                                    Why us
                                    <FiArrowUpRight className='h-4 w-4 opacity-0 transition group-hover:opacity-100' aria-hidden='true' />
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className='group inline-flex items-center gap-1 font-semibold text-gray-700 transition hover:text-red-600' to='/reviews'>
                                    Reviews
                                    <FiArrowUpRight className='h-4 w-4 opacity-0 transition group-hover:opacity-100' aria-hidden='true' />
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    className='group inline-flex items-center gap-1 font-semibold text-gray-700 transition hover:text-red-600'
                                    to={user ? '/book-repair' : '/login'}
                                >
                                    Book Service
                                    <FiArrowUpRight className='h-4 w-4 opacity-0 transition group-hover:opacity-100' aria-hidden='true' />
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className='group inline-flex items-center gap-1 font-semibold text-gray-700 transition hover:text-red-600' to='/contact'>
                                    Contact
                                    <FiArrowUpRight className='h-4 w-4 opacity-0 transition group-hover:opacity-100' aria-hidden='true' />
                                </NavLink>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div variants={item}>
                        <p className='text-sm font-extrabold text-gray-900'>Account</p>
                        <ul className='mt-4 space-y-3 text-sm'>
                            <li><NavLink className='font-semibold text-gray-700 transition hover:text-red-600' to='/login'>Sign In</NavLink></li>
                            <li><NavLink className='font-semibold text-gray-700 transition hover:text-red-600' to='/register'>Sign Up</NavLink></li>
                        </ul>
                    </motion.div>

                    <motion.div variants={item}>
                        <p className='text-sm font-extrabold text-gray-900'>Contact</p>
                        <ul className='mt-4 space-y-3 text-sm text-gray-700'>
                            <li className='flex items-start gap-3'>
                                <FiPhone className='mt-0.5 h-4 w-4 text-gray-500' aria-hidden='true' />
                                <a className='font-semibold transition hover:text-red-600' href='tel:+923001234567'>+92 300 1234567</a>
                            </li>
                            <li className='flex items-start gap-3'>
                                <FiMail className='mt-0.5 h-4 w-4 text-gray-500' aria-hidden='true' />
                                <a className='font-semibold transition hover:text-red-600' href='mailto:support@autosphere.com'>support@autosphere.com</a>
                            </li>
                            <li className='flex items-start gap-3'>
                                <FiMapPin className='mt-0.5 h-4 w-4 text-gray-500' aria-hidden='true' />
                                <a
                                    className='font-semibold transition hover:text-red-600'
                                    href='https://www.google.com/maps/search/?api=1&query=AutoSphere%20Johar%20Town%20Lahore'
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    Johar Town, Lahore
                                </a>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                <motion.div className='mt-8 flex flex-col gap-3 border-t border-gray-200 pt-5 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between' variants={item}>
                    <p>Copyright {new Date().getFullYear()} AutoSphere</p>
                    <p className='text-xs font-semibold text-gray-500'>Transparent estimates | Warranty-backed repairs</p>
                </motion.div>
            </div>
        </motion.footer>
    )
}

export default Footer

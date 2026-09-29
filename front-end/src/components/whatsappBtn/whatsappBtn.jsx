import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'

function WhatsAppBtn () {
    return (
        <motion.a
            href='https://wa.me/923158682971'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Chat on WhatsApp'
            className='fixed bottom-5 right-5 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg ring-1 ring-white/50 backdrop-blur transition-all duration-200 ease-out hover:-translate-y-0.5 hover:from-green-500 hover:to-green-700 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 active:translate-y-0'
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
        >
            <FaWhatsapp className='h-5 w-5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.22)]' aria-hidden='true' />
        </motion.a>
    )
}

export default WhatsAppBtn

import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

import { fadeUp, sectionStagger, viewportOnce } from '../../utils/motion'

function NotFound () {
    return (
        <motion.section
            className='cr-section cr-section-muted'
            initial='hidden'
            whileInView='show'
            viewport={viewportOnce}
            variants={sectionStagger}
        >
            <div className='cr-container cr-section-pad'>
                <motion.div className='mx-auto max-w-xl p-7 text-center cr-card' variants={fadeUp}>
                <p className='text-sm font-semibold text-gray-500'>404</p>
                <h1 className='mt-2 text-2xl font-extrabold tracking-tight text-gray-900'>Page not found</h1>
                <p className='mt-2 text-sm text-gray-600'>The page you’re looking for doesn’t exist.</p>

                <div className='mt-6'>
                    <NavLink
                        to='/'
                        className='cr-btn-primary px-5 py-2.5'
                    >
                        Back to Home
                    </NavLink>
                </div>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default NotFound

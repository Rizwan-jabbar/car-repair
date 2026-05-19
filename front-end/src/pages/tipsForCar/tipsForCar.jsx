import { motion } from 'framer-motion'
import {
    FiAlertTriangle,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiDroplet,
    FiPhone,
    FiShield,
    FiMessageSquare,
    FiTool,
    FiWind,
} from 'react-icons/fi'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'

import { cardIn, fadeUp, sectionStagger } from '../../utils/motion'
import { askAi } from '../../rtk/thunks/aiThunk/aiThunk'
import { clearAiAnswer } from '../../rtk/slices/aiSlice/aiSlice'

function TipsForCar () {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.user)
    const { answer, loading: aiLoading, error: aiError } = useSelector((state) => state.ai)
    const [question, setQuestion] = useState('')

    const quickTips = [
        {
            title: 'Check engine oil every 2 weeks',
            description: 'Low or dirty oil increases engine wear and reduces mileage. Keep oil between min and max marks and replace on time.',
            Icon: FiDroplet,
        },
        {
            title: 'Monitor tyre pressure regularly',
            description: 'Correct pressure improves grip, braking, fuel efficiency, and tyre life. Recheck before long trips and weather changes.',
            Icon: FiShield,
        },
        {
            title: 'Listen for unusual sounds',
            description: 'Knocking, squealing, or vibrations are early warning signs. Quick diagnosis prevents expensive breakdowns later.',
            Icon: FiAlertTriangle,
        },
        {
            title: 'Donâ€™t ignore warning lights',
            description: 'ABS, check-engine, battery, and temperature lights should be inspected quickly to avoid major damage.',
            Icon: FiTool,
        },
    ]

    const seasonalCare = [
        {
            season: 'Summer Care',
            points: [
                'Inspect coolant level and radiator cap condition before peak heat.',
                'Check AC performance and cabin filter to keep airflow strong.',
                'Avoid hard driving immediately after start in extreme heat.',
            ],
            Icon: FiWind,
        },
        {
            season: 'Monsoon Care',
            points: [
                'Ensure tyre tread depth is healthy to reduce hydroplaning risk.',
                'Test wipers, washer fluid, and all exterior lights weekly.',
                'Dry brake discs after passing through deep water by gentle braking.',
            ],
            Icon: FiDroplet,
        },
        {
            season: 'Winter Care',
            points: [
                'Check battery health since cold starts demand more power.',
                'Use proper viscosity oil recommended for lower temperatures.',
                'Warm the engine briefly and drive gently for the first few minutes.',
            ],
            Icon: FiClock,
        },
    ]

    const maintenanceTimeline = [
        { label: 'Every week', value: 'Tyre pressure, lights, horn, brake feel' },
        { label: 'Every month', value: 'Battery terminals, coolant level, wipers, fluid leaks' },
        { label: 'Every 5,000â€“7,000 km', value: 'Engine oil and filter service' },
        { label: 'Every 10,000â€“15,000 km', value: 'Air filter, wheel balancing, general inspection' },
        { label: 'Every 20,000â€“40,000 km', value: 'Brake pads, plugs, coolant flush (as required)' },
    ]

    const emergencyChecklist = [
        'Spare tyre in usable condition',
        'Jack + wheel spanner + torch',
        'Jumper cables and basic toolkit',
        'Reflective triangle and safety vest',
        'First-aid kit and phone charger',
    ]

    const handleAskAi = (e) => {
        e.preventDefault()
        const trimmedQuestion = question.trim()
        if (!trimmedQuestion) return
        dispatch(askAi(trimmedQuestion))
    }

    return (
        <motion.section
            id='car-tips'
            className='cr-section cr-section-light'
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
                            Car Care Guide
                        </p>
                        <h1 className='mt-3 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl'>
                            Pro tips to keep your car healthy
                        </h1>
                        <p className='mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-relaxed'>
                            These practical maintenance tips help reduce sudden breakdowns, improve fuel efficiency,
                            and extend your carâ€™s life. Follow this guide as your simple routine for safer driving.
                        </p>
                    </motion.div>

                    <motion.div className='w-full max-w-sm p-5 cr-card' variants={cardIn}>
                        <p className='text-sm font-semibold text-gray-600'>Maintenance mindset</p>
                        <p className='mt-1 text-3xl font-extrabold text-gray-900'>Prevent & Save</p>
                        <p className='mt-2 text-xs font-semibold text-gray-500'>Small regular checks can prevent big repair bills.</p>

                        <div className='mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3'>
                            <p className='text-xs font-semibold text-gray-700'>Need professional inspection?</p>
                            <div className='mt-2 flex flex-wrap gap-2'>
                                <NavLink to={user ? '/book-repair' : '/login'} className='cr-btn-primary'>Book now</NavLink>
                                <a href='tel:+923001234567' className='cr-btn-outline inline-flex items-center gap-2'>
                                    <FiPhone className='h-4 w-4' aria-hidden='true' />
                                    Call
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
                    {quickTips.map((tip) => (
                        <motion.article key={tip.title} className='group p-6 cr-card cr-card-hover' variants={cardIn} whileHover={{ y: -6 }}>
                            <div className='inline-flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100'>
                                <tip.Icon className='h-5 w-5' aria-hidden='true' />
                            </div>
                            <h2 className='mt-4 text-base font-extrabold tracking-tight text-gray-900'>{tip.title}</h2>
                            <p className='mt-2 text-sm leading-6 text-gray-600'>{tip.description}</p>
                        </motion.article>
                    ))}
                </div>

                <div className='mt-10 grid gap-5 lg:grid-cols-3'>
                    {seasonalCare.map((block) => (
                        <motion.article key={block.season} className='p-6 cr-card' variants={fadeUp}>
                            <div className='flex items-center gap-2'>
                                <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-700 ring-1 ring-red-100'>
                                    <block.Icon className='h-4 w-4' aria-hidden='true' />
                                </span>
                                <h3 className='text-base font-extrabold text-gray-900'>{block.season}</h3>
                            </div>
                            <ul className='mt-4 space-y-3'>
                                {block.points.map((point) => (
                                    <li key={point} className='flex items-start gap-2 text-sm text-gray-600'>
                                        <FiCheckCircle className='mt-0.5 h-4 w-4 shrink-0 text-emerald-600' aria-hidden='true' />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.article>
                    ))}
                </div>

                <div className='mt-10 grid gap-5 lg:grid-cols-5'>
                    <motion.div className='p-6 lg:col-span-3 cr-card' variants={fadeUp}>
                        <div className='flex items-center gap-2'>
                            <FiCalendar className='h-5 w-5 text-red-600' aria-hidden='true' />
                            <h3 className='text-base font-extrabold text-gray-900'>Suggested maintenance timeline</h3>
                        </div>

                        <div className='mt-5 space-y-3'>
                            {maintenanceTimeline.map((item) => (
                                <div key={item.label} className='rounded-xl border border-gray-200 bg-white p-4'>
                                    <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>{item.label}</p>
                                    <p className='mt-1 text-sm font-semibold text-gray-800'>{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div className='p-6 lg:col-span-2 cr-card bg-gradient-to-br from-white to-red-50' variants={fadeUp}>
                        <h3 className='text-base font-extrabold text-gray-900'>Emergency travel checklist</h3>
                        <p className='mt-1 text-sm leading-6 text-gray-600'>Keep these items in your car for safer road trips and night driving.</p>

                        <ul className='mt-4 space-y-2'>
                            {emergencyChecklist.map((item) => (
                                <li key={item} className='flex items-start gap-2 text-sm text-gray-700'>
                                    <FiCheckCircle className='mt-0.5 h-4 w-4 shrink-0 text-emerald-600' aria-hidden='true' />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <motion.a
                            href='tel:+923001234567'
                            className='mt-5 inline-flex w-full items-center justify-center rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 active:translate-y-0'
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Emergency call support
                        </motion.a>
                    </motion.div>
                </div>

                <motion.div className='mt-10 p-6 cr-card' variants={fadeUp}>
                    <div className='flex items-center gap-2'>
                        <FiMessageSquare className='h-5 w-5 text-red-600' aria-hidden='true' />
                        <h3 className='text-base font-extrabold text-gray-900'>Ask AI about your car issue</h3>
                    </div>

                    <p className='mt-2 text-sm leading-6 text-gray-600'>
                        Describe your problem and get a quick suggestion. For final diagnosis, please book a professional inspection.
                    </p>

                    <form onSubmit={handleAskAi} className='mt-4'>
                        <label className='block'>
                            <span className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Your question</span>
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder='Example: My car makes a knocking sound while accelerating. What should I check first?'
                                rows={4}
                                className='cr-textarea'
                            />
                        </label>

                        <div className='mt-3 flex flex-wrap items-center gap-2'>
                            <button
                                type='submit'
                                disabled={aiLoading || !question.trim()}
                                className='cr-btn-primary disabled:cursor-not-allowed disabled:opacity-60'
                            >
                                {aiLoading ? 'Thinking...' : 'Ask AI'}
                            </button>
                            <button
                                type='button'
                                onClick={() => {
                                    setQuestion('')
                                    dispatch(clearAiAnswer())
                                }}
                                className='cr-btn-outline'
                            >
                                Clear
                            </button>
                        </div>
                    </form>

                    {aiError && (
                        <p className='mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700'>
                            {typeof aiError === 'string' ? aiError : (aiError?.error || 'Failed to get AI response')}
                        </p>
                    )}

                    {!!answer && (
                        <div className='mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4'>
                            <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>AI suggestion</p>
                            <p className='mt-2 text-sm leading-6 text-gray-700'>{answer}</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.section>
    )
}

export default TipsForCar

import { motion } from 'framer-motion'
import {
    FiAlertTriangle,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiDroplet,
    FiEdit3,
    FiPhone,
    FiShield,
    FiMessageSquare,
    FiTool,
    FiWind,
    FiX,
    FiArrowRight,
    FiThermometer,
    FiSun,
    FiCloudRain,
    FiStar,
} from 'react-icons/fi'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'

import { cardIn, fadeUp, sectionStagger } from '../../utils/motion'
import { askAi } from '../../rtk/thunks/aiThunk/aiThunk'
import { clearAiAnswer } from '../../rtk/slices/aiSlice/aiSlice'
import { getMediaUrl } from '../../rtk/utils/apiUrl'

function TipsForCar () {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.user)
    const { answer, loading: aiLoading, error: aiError } = useSelector((state) => state.ai)
    const [question, setQuestion] = useState('')
    const tipsHero = getMediaUrl('/uploads/cartips.png')

    const quickTips = [
        {
            title: 'Check engine oil every 2 weeks',
            description: 'Low or dirty oil increases engine wear and reduces mileage. Keep oil between min and max marks and replace on time.',
            Icon: FiDroplet,
            accent: 'border-red-500',
        },
        {
            title: 'Monitor tyre pressure regularly',
            description: 'Correct pressure improves grip, braking, fuel efficiency, and tyre life. Recheck before long trips and weather changes.',
            Icon: FiShield,
            accent: 'border-slate-700',
        },
        {
            title: 'Listen for unusual sounds',
            description: 'Knocking, squealing, or vibrations are early warning signs. Quick diagnosis prevents expensive breakdowns later.',
            Icon: FiAlertTriangle,
            accent: 'border-red-500',
        },
        {
            title: "Don't ignore warning lights",
            description: 'ABS, check-engine, battery, and temperature lights should be inspected quickly to avoid major damage.',
            Icon: FiTool,
            accent: 'border-slate-700',
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
        { label: 'Every 5,000 KM', value: 'Engine oil and filter service' },
        { label: 'Every 10,000 KM', value: 'Air filter, wheel balancing, general inspection' },
        { label: 'Every 20,000 KM', value: 'Brake pads, plugs, coolant flush (as required)' },
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
        <motion.section id='car-tips' className='relative overflow-hidden bg-[#f7fafc]' initial='hidden' animate='show' variants={sectionStagger}>
            <div className='absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_75%_4%,rgba(220,38,38,0.08),transparent_26%),linear-gradient(180deg,#ffffff_0%,#f7fafc_72%,#ffffff_100%)]' />
            <div className='relative mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10'>
                <motion.div className='grid items-center gap-6 lg:grid-cols-[1.02fr_0.98fr]' variants={fadeUp}>
                    <div className='order-2 lg:order-1'>
                        <p className='inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-red-600'><span className='h-px w-7 bg-red-500' /><FiTool className='h-3.5 w-3.5' /> Car Care Guide <span className='h-px w-7 bg-red-500' /></p>
                        <h1 className='mt-3 max-w-xl text-3xl font-extrabold leading-[0.98] tracking-tight text-[#0b1830] sm:text-4xl lg:text-[2.8rem]'>Pro tips to keep your car <span className='block text-red-600'>healthy</span></h1>
                        <p className='mt-4 max-w-lg text-sm leading-6 text-slate-600 sm:text-base'>These practical maintenance tips help reduce sudden breakdowns, improve fuel efficiency, and extend your car's life. Follow this guide as your simple routine for safer driving.</p>
                    </div>
                    <div className='relative order-1 h-56 overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-lg shadow-slate-900/10 lg:order-2 lg:h-64'>
                        <img src={tipsHero} alt='Mechanic inspecting a car engine' className='h-full w-full object-cover object-center' />
                        <div className='absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent' />
                    </div>
                </motion.div>

                <motion.div className='mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4' variants={fadeUp}>
                    {quickTips.map((tip) => {
                        const TipIcon = tip.Icon
                        return <motion.article key={tip.title} className={`group relative min-h-[154px] overflow-hidden rounded-xl border border-gray-200 border-l-2 ${tip.accent} bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md`} whileHover={{ y: -3 }}>
                            <div className='flex gap-3'>
                                <span className='inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-100'><TipIcon className='h-5 w-5' /></span>
                                <div><h2 className='pr-4 text-sm font-extrabold leading-5 text-[#102957]'>{tip.title}</h2><p className='mt-2 text-[11px] leading-5 text-slate-500'>{tip.description}</p></div>
                                <FiArrowRight className='absolute right-3 top-4 h-4 w-4 rounded-full bg-slate-100 p-0.5 text-slate-600' />
                            </div>
                        </motion.article>
                    })}
                </motion.div>

                <motion.div className='mt-4 grid gap-3 lg:grid-cols-3' variants={fadeUp}>
                    {seasonalCare.map((block, index) => {
                        const SeasonalIcon = index === 0 ? FiSun : index === 1 ? FiCloudRain : FiStar
                        const accent = index === 0 ? 'border-emerald-500' : index === 1 ? 'border-blue-500' : 'border-indigo-600'
                        return <article key={block.season} className={`rounded-xl border border-gray-200 border-l-2 ${accent} bg-white p-4 shadow-sm`}><div className='flex items-center gap-3'><span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${index === 0 ? 'bg-emerald-50 text-emerald-600' : index === 1 ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}><SeasonalIcon className='h-5 w-5' /></span><h3 className='text-sm font-extrabold text-[#102957]'>{block.season}</h3></div><ul className='mt-3 space-y-2'>{block.points.map((point) => <li key={point} className='flex items-start gap-2 text-[11px] leading-5 text-slate-500'><FiCheckCircle className='mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500' /><span>{point}</span></li>)}</ul></article>
                    })}
                </motion.div>

                <div className='mt-4 grid gap-4 lg:grid-cols-[1.68fr_0.95fr]'>
                    <motion.div className='relative overflow-hidden rounded-xl bg-[#0d2037] p-5 text-white shadow-lg sm:p-6' variants={fadeUp}>
                        <div className='absolute -bottom-12 -left-7 h-32 w-32 rounded-full border-[18px] border-red-600/50' /><div className='relative z-10 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]'>
                            <div><p className='inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-red-400'><FiCalendar className='h-4 w-4' /> Maintenance timeline</p><h3 className='mt-3 text-xl font-extrabold leading-tight'>Suggested maintenance timeline</h3><p className='mt-3 max-w-xs text-xs leading-5 text-slate-300'>Keep your car in perfect condition with regular checkups and timely service.</p></div>
                            <div className='space-y-2 border-l border-slate-600 pl-4'>{maintenanceTimeline.map((item) => <div key={item.label} className='relative flex items-center gap-3 rounded-xl border border-slate-600 bg-slate-800/70 px-3 py-2.5 text-[10px]'><span className='absolute -left-[22px] h-2.5 w-2.5 rounded-full border-2 border-red-500 bg-[#0d2037]' /><FiCalendar className='h-3.5 w-3.5 shrink-0 text-white' /><strong className='w-24 shrink-0 text-white'>{item.label}</strong><span className='text-slate-300'>{item.value}</span><FiArrowRight className='ml-auto h-3.5 w-3.5 shrink-0' /></div>)}</div>
                        </div>
                    </motion.div>

                    <motion.div className='relative overflow-hidden rounded-xl border border-red-100 bg-gradient-to-br from-white via-white to-red-50 p-5 shadow-sm sm:p-6' variants={fadeUp}><div className='flex items-center gap-3'><span className='inline-flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600'><FiAlertTriangle className='h-6 w-6' /></span><div><h3 className='text-base font-extrabold text-[#102957]'>Emergency travel checklist</h3><p className='mt-1 text-[11px] text-slate-500'>Keep these items in your car for safer road trips.</p></div></div><ul className='mt-4 space-y-2'>{emergencyChecklist.map((item) => <li key={item} className='flex items-center gap-2 text-[11px] text-slate-600'><FiCheckCircle className='h-3.5 w-3.5 shrink-0 text-red-600' />{item}</li>)}</ul><a href='tel:+923001234567' className='mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700'><FiPhone className='h-3.5 w-3.5' /> Emergency call support <FiArrowRight className='h-3.5 w-3.5' /></a></motion.div>
                </div>

                <motion.div className='relative mt-5 overflow-hidden rounded-2xl border border-[#dce8f5] bg-white shadow-sm' variants={fadeUp}>
                    <div className='relative overflow-hidden border-b border-[#edf2f8] bg-gradient-to-r from-white via-white to-red-50/70 px-5 py-6 sm:px-8'>
                        <div className='pointer-events-none absolute -right-8 -top-16 h-40 w-64 rounded-full bg-red-100/60 blur-2xl' />
                        <div className='relative flex items-center gap-4'>
                            <span className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-200'><FiMessageSquare className='h-7 w-7' /></span>
                            <div>
                                <p className='inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-red-600'>✦ AI Assistant</p>
                                <h3 className='mt-2 text-2xl font-extrabold tracking-tight text-[#102441] sm:text-3xl'>Ask AI about your car issue</h3>
                                <p className='mt-1 text-sm text-[#6c83a2]'>Describe your problem and get a quick suggestion. For final diagnosis, please book a professional inspection.</p>
                            </div>
                        </div>
                    </div>

                    <div className='p-5 sm:p-8'>
                        <form onSubmit={handleAskAi}>
                            <label className='relative block'>
                                <span className='sr-only'>Your question</span>
                                <FiEdit3 className='pointer-events-none absolute left-4 top-4 h-5 w-5 text-red-500' />
                                <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder='Example: My car makes a knocking sound while accelerating. What should I check first?' rows={5} className='w-full resize-none rounded-2xl border border-[#dce8f5] bg-[#fbfdff] py-4 pl-12 pr-4 text-sm text-[#314b6d] shadow-inner outline-none transition placeholder:text-[#9aacc3] focus:border-red-300 focus:ring-4 focus:ring-red-100' />
                            </label>
                            <div className='mt-5 flex flex-wrap items-center gap-3'>
                                <button type='submit' disabled={aiLoading || !question.trim()} className='inline-flex min-h-14 items-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-7 text-base font-extrabold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:from-red-700 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-60'>
                                    {aiLoading ? <span className='h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white' aria-label='Asking AI' /> : <><FiMessageSquare className='h-5 w-5' /> Ask AI <FiArrowRight className='h-5 w-5' /></>}
                                </button>
                                <button type='button' onClick={() => { setQuestion(''); dispatch(clearAiAnswer()) }} className='inline-flex min-h-14 items-center gap-3 rounded-2xl border border-[#dce8f5] bg-white px-7 text-base font-bold text-[#7890ad] shadow-sm transition hover:bg-slate-50'><FiX className='h-5 w-5' /> Clear</button>
                                <span className='ml-auto hidden items-center gap-2 rounded-full bg-[#f8fbff] px-4 py-3 text-xs font-semibold text-[#7188a7] lg:inline-flex'><FiShield className='h-5 w-5 text-red-500' /> Get accurate and helpful suggestions</span>
                            </div>
                        </form>
                        {aiError && <p className='mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700'>{typeof aiError === 'string' ? aiError : (aiError?.error || 'Failed to get AI response')}</p>}
                        {!!answer && <div className='mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5'><p className='text-xs font-semibold uppercase tracking-wide text-emerald-700'>AI suggestion</p><p className='mt-2 text-sm leading-6 text-emerald-950'>{answer}</p></div>}
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default TipsForCar

import { FiShield, FiTool, FiClock, FiThumbsUp, FiStar, FiPhoneCall, FiHeart, FiUsers, FiMessageCircle, FiHeadphones, FiArrowRight } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import whyUsImage from '../../pictures/1_JktzC9GrA_l4yz0cCy8a5Q.jpg'

import { cardIn, fadeUp, sectionStagger, viewportOnce } from '../../utils/motion'

function WhyUs () {
    const highlights = [
        {
            title: 'Certified & Experienced',
            description: 'Skilled mechanics with the right tools to diagnose and fix issues properly.',
            Icon: FiTool,
        },
        {
            title: 'Warranty-backed Repairs',
            description: 'We stand behind our work so you can drive with confidence.',
            Icon: FiShield,
        },
        {
            title: 'Fast Turnaround',
            description: 'Quick inspection and same-day service for common repairs (when possible).',
            Icon: FiClock,
        },
        {
            title: 'Trusted by Customers',
            description: 'Clear estimates, honest advice, and friendly support—every time.',
            Icon: FiThumbsUp,
        },
    ]

    const featureIcons = [FiTool, FiShield, FiClock, FiUsers]
    const featureColors = ['red', 'blue', 'emerald', 'violet']

    return (
        <motion.section id='why-us' className='overflow-hidden bg-[#f8fbff] py-14 sm:py-20' initial='hidden' whileInView='show' viewport={viewportOnce} variants={sectionStagger}>
            <div className='mx-auto max-w-6xl px-5 sm:px-8'>
                <motion.div className='grid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 lg:grid-cols-[1.3fr_0.7fr]' variants={fadeUp}>
                    <div className='p-6 sm:p-10 lg:p-12'>
                        <p className='inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-red-600'>
                            <span className='h-px w-8 bg-red-500' /> Why Choose Us <span className='h-px w-8 bg-red-500' />
                        </p>
                        <h2 className='mt-4 max-w-3xl text-3xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-4xl'>
                            Honest service. Quality repairs. <span className='text-red-600'>Zero stress.</span>
                        </h2>
                        <p className='mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base'>
                            We focus on transparency, safety, and long-term reliability—so you feel confident every time you drive.
                        </p>
                        <div className='mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4'>
                            {[['Skilled Technicians', 'Certified & experienced professionals', FiShield], ['Quality Parts', 'Only trusted and reliable parts', FiTool], ['On-Time Service', 'Your time matters to us', FiClock], ['Customer First', 'Your satisfaction is our priority', FiHeart]].map(([title, text, Icon]) => (
                                <div key={title} className='flex items-start gap-2 border-slate-100 sm:border-r sm:pr-3 last:border-0'>
                                    <Icon className='mt-0.5 h-5 w-5 shrink-0 text-red-600' aria-hidden='true' />
                                    <div><p className='text-[11px] font-bold text-slate-800'>{title}</p><p className='mt-1 text-[10px] leading-4 text-slate-500'>{text}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='relative min-h-[240px] overflow-hidden lg:min-h-full'>
                        <img src={whyUsImage} alt='Mechanic working on a car' className='absolute inset-0 h-full w-full object-cover' />
                        <div className='absolute inset-0 bg-slate-950/10' />
                        <p className='absolute bottom-6 right-6 max-w-[120px] text-right text-sm font-extrabold italic leading-5 text-white drop-shadow-md'>Your Car<br />Our Priority.</p>
                    </div>
                </motion.div>

                <div className='mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    {highlights.map((item, index) => {
                        const Icon = featureIcons[index]
                        const color = featureColors[index]
                        return <motion.article key={item.title} className={`group relative min-h-[205px] overflow-hidden rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md`} variants={cardIn}>
                            <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${color === 'red' ? 'bg-red-50 text-red-600' : color === 'blue' ? 'bg-blue-50 text-blue-600' : color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-violet-50 text-violet-600'}`}><Icon className='h-5 w-5' aria-hidden='true' /></div>
                            <h3 className='mt-4 text-base font-extrabold tracking-tight text-slate-900'>{item.title}</h3>
                            <p className='mt-2 max-w-[230px] text-sm leading-5 text-slate-500'>{item.description}</p>
                            <FiArrowRight className={`absolute bottom-5 left-6 h-4 w-4 ${color === 'red' ? 'text-red-500' : color === 'blue' ? 'text-blue-500' : color === 'emerald' ? 'text-emerald-500' : 'text-violet-500'}`} aria-hidden='true' />
                            <span className='absolute bottom-1 right-4 text-2xl font-black text-slate-100'>{String(index + 1).padStart(2, '0')}</span>
                            <span className={`absolute inset-x-0 bottom-0 h-1 ${color === 'red' ? 'bg-red-500' : color === 'blue' ? 'bg-blue-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-violet-500'}`} />
                        </motion.article>
                    })}
                </div>

                <div className='mt-7 grid gap-4 lg:grid-cols-[1.8fr_0.8fr]'>
                    <motion.div className='relative overflow-hidden rounded-xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8' variants={fadeUp}>
                        <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(219,234,254,0.65),transparent_45%)]' />
                        <div className='relative'>
                            <p className='inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em] text-red-600'><span className='h-px w-7 bg-red-500' /> Our Commitment <span className='h-px w-7 bg-red-500' /></p>
                            <div className='mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-end'>
                                <div><h3 className='max-w-xs text-2xl font-extrabold leading-tight text-slate-900'>Customer satisfaction comes first</h3><p className='mt-3 max-w-sm text-sm leading-5 text-slate-500'>We provide a clear estimate and explain the repair—no hidden charges, no confusing jargon.</p></div>
                                <div className='grid grid-cols-3 gap-2 sm:min-w-[390px]'><div className='rounded-lg border border-slate-100 bg-white p-3'><FiMessageCircle className='h-4 w-4 text-red-500' /><p className='mt-3 text-[10px] text-slate-500'>Response time</p><p className='text-lg font-extrabold text-slate-900'>~30 min</p></div><div className='rounded-lg border border-slate-100 bg-white p-3'><FiSmileIcon /><p className='mt-3 text-[10px] text-slate-500'>Happy customers</p><p className='text-lg font-extrabold text-slate-900'>2,500+</p></div><div className='rounded-lg border border-slate-100 bg-white p-3'><FiShield className='h-4 w-4 text-emerald-500' /><p className='mt-3 text-[10px] text-slate-500'>Warranty</p><p className='text-lg font-extrabold text-slate-900'>Up to 6 mo</p></div></div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div className='rounded-xl bg-[#102b49] p-6 text-white shadow-sm sm:p-7' variants={fadeUp}>
                        <p className='inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-red-400'><FiHeadphones className='h-4 w-4' /> Emergency help?</p>
                        <h3 className='mt-3 text-2xl font-extrabold'>Call us anytime.</h3><p className='mt-2 text-sm text-slate-300'>We’ll guide you and arrange help.</p>
                        <a href='tel:+923001234567' className='mt-6 inline-flex w-full items-center justify-between rounded-lg bg-red-600 px-4 py-3 text-sm font-bold transition hover:bg-red-700'><span className='inline-flex items-center gap-2'><FiPhoneCall className='h-4 w-4' /> Call: +92 300 1234567</span><FiArrowRight className='h-4 w-4' /></a>
                        <p className='mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-300'><FiClock className='h-4 w-4' /> Available 7 days/week</p>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    )
}

function FiSmileIcon () {
    return <span className='inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-blue-500 text-[9px] font-bold text-blue-500'>:)</span>
}

export default WhyUs

import { FiCalendar, FiCheckCircle, FiClock, FiMapPin, FiTool, FiUser } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'

const steps = [
    { title: 'Choose a Service', description: 'Explore the right service for your vehicle.', Icon: FiTool },
    { title: 'Tell Us About Your Vehicle', description: 'Share a few details so we understand your needs.', Icon: FiUser },
    { title: 'Select Workshop or Mechanic Visit', description: 'Choose the option that works best for you.', Icon: FiMapPin },
    { title: 'Choose Preferred Date & Time', description: 'Request an appointment at your convenience.', Icon: FiCalendar },
    { title: 'Receive Confirmation', description: 'We review your request and confirm the schedule.', Icon: FiCheckCircle },
    { title: 'Get Your Vehicle Repaired', description: 'Our team helps get you safely back on the road.', Icon: FiClock },
]

function HowItWorks () {
    return (
        <section className='cr-section cr-section-light'>
            <div className='cr-container cr-section-pad'>
                <div className='flex flex-col gap-5 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left'>
                    <div className='max-w-2xl'>
                        <p className='inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-red-600'>
                            <span className='h-px w-8 bg-red-500' />
                            How It Works
                            <span className='h-px w-8 bg-red-500' />
                        </p>
                        <h2 className='mt-3 cr-heading-md'>A simple path to safer driving</h2>
                        <p className='mt-3 text-sm leading-6 text-gray-600 sm:text-base'>From choosing a service to receiving confirmation, booking your car repair stays clear and simple.</p>
                    </div>
                    <NavLink to='/emergency-booking' className='cr-btn-primary self-center sm:self-auto'>Request Emergency Help</NavLink>
                </div>

                <div className='relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                    {steps.map((step, index) => {
                        const StepIcon = step.Icon
                        return (
                        <article key={step.title} className='group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:border-red-100 hover:shadow-md'>
                            <div className='flex items-start justify-between gap-4'>
                                <span className='flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white'>
                                    <StepIcon className='h-5 w-5' aria-hidden='true' />
                                </span>
                                <span className='text-2xl font-extrabold text-red-100'>0{index + 1}</span>
                            </div>
                            <h3 className='mt-5 text-base font-extrabold tracking-tight text-[#102957]'>{step.title}</h3>
                            <p className='mt-2 text-sm leading-5 text-gray-600'>{step.description}</p>
                        </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks

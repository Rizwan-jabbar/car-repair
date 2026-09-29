import {
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiRefreshCcw,
  FiSettings,
  FiTool,
  FiDroplet,
  FiDisc,
  FiWind,
  FiZap,
  FiNavigation,
} from 'react-icons/fi'

/**
 * Single source of truth for service list.
 * Used by Services section (cards) and Book Repair form (dropdown).
 */
export const servicesCatalog = [
  {
    title: 'Engine Diagnostics',
    description: 'Computerized scanning and expert troubleshooting to find the real issue—fast.',
    Icon: FiActivity,
  },
  {
    title: 'General Maintenance (Tune-up)',
    description: 'Routine inspection + minor adjustments to keep performance, mileage, and reliability strong.',
    Icon: FiSettings,
  },
  {
    title: 'Oil Change & Filters',
    description: 'Premium oil and filter replacement to keep your engine healthy and smooth.',
    Icon: FiDroplet,
  },
  {
    title: 'Cooling System & Radiator',
    description: 'Overheating checks, radiator service, coolant flush, and leak inspection for safe temps.',
    Icon: FiRefreshCcw,
  },
  {
    title: 'Brake Service',
    description: 'Pads, discs, fluid checks—safe stopping power with quality parts.',
    Icon: FiDisc,
  },
  {
    title: 'Suspension & Steering',
    description: 'Shocks, bushes, joints, and steering checks to remove noise and improve handling.',
    Icon: FiTool,
  },
  {
    title: 'AC Repair & Gas',
    description: 'Cooling issues? We inspect leaks, compressors, and refill refrigerant properly.',
    Icon: FiWind,
  },
  {
    title: 'Heater & Cabin Filter',
    description: 'Weak airflow or bad smell? We replace cabin filters and check blower/heater performance.',
    Icon: FiWind,
  },
  {
    title: 'Battery & Electrical',
    description: 'Battery replacement, alternator checks, wiring fixes—no-start problems solved.',
    Icon: FiZap,
  },
  {
    title: 'Lights & Electrical Accessories',
    description: 'Headlights, indicators, wiring, fuses, and accessory installs—safe visibility and reliability.',
    Icon: FiZap,
  },
  {
    title: 'Tyres & Wheel Alignment',
    description: 'Balancing, alignment, and tyre replacement for a safer, smoother drive.',
    Icon: FiNavigation,
  },
  {
    title: 'Wheel Balancing',
    description: 'Fix steering vibrations and uneven tyre wear with proper wheel balancing.',
    Icon: FiNavigation,
  },
  {
    title: 'Clutch & Transmission Check',
    description: 'Hard shifting or slipping? We inspect clutch performance and basic transmission health.',
    Icon: FiSettings,
  },
  {
    title: 'Fuel System Cleaning',
    description: 'Injector/fuel-line cleaning to improve pickup, reduce hesitation, and support better mileage.',
    Icon: FiDroplet,
  },
  {
    title: 'Exhaust & Emissions',
    description: 'Noise, smoke, or smell? We diagnose exhaust leaks and emissions-related issues.',
    Icon: FiAlertTriangle,
  },
  {
    title: 'Pre-Purchase Inspection',
    description: 'Buying a used car? We do a thorough inspection so you can buy with confidence.',
    Icon: FiCheckCircle,
  },
]

export const serviceTitles = servicesCatalog.map((s) => s.title)

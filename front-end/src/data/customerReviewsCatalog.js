/**
 * Single source of truth for customer reviews.
 * Used by reviews preview (Home) and the full Reviews page.
 */

export const customerReviewsCatalog = [
    {
        id: 'r1',
        name: 'Ahmed R.',
        rating: 5,
        title: 'Quick service and clear communication',
        date: 'March 2026',
        service: 'Brake Service',
        verified: true,
        body: 'They explained everything clearly, shared an estimate upfront, and finished the job the same day. Brakes feel perfect now.',
    },
    {
        id: 'r2',
        name: 'Sara K.',
        rating: 4,
        title: 'AC cooling is back!',
        date: 'February 2026',
        service: 'AC Repair & Gas',
        verified: true,
        body: 'AC was not cooling at all. They found a small leak, fixed it, and refilled gas. Much better now. Good team.',
    },
    {
        id: 'r3',
        name: 'Hassan M.',
        rating: 5,
        title: 'Engine diagnosis was accurate',
        date: 'January 2026',
        service: 'Engine Diagnostics',
        verified: true,
        body: 'The scan + inspection saved me from unnecessary parts replacement. They identified the real problem and fixed it fast.',
    },
    {
        id: 'r4',
        name: 'Ayesha I.',
        rating: 5,
        title: 'Very professional workshop',
        date: 'December 2025',
        service: 'Oil Change & Filters',
        verified: false,
        body: 'Clean setup, polite staff, and they didn’t push extra services. Oil change was quick and the car feels smoother.',
    },
    {
        id: 'r5',
        name: 'Bilal S.',
        rating: 4,
        title: 'Alignment fixed the vibration issue',
        date: 'November 2025',
        service: 'Wheel Alignment',
        verified: true,
        body: 'Steering vibration was annoying. After alignment and balancing, driving is smooth again. Will come back.',
    },
    {
        id: 'r6',
        name: 'Umar T.',
        rating: 5,
        title: 'Battery replaced in minutes',
        date: 'October 2025',
        service: 'Battery & Electrical',
        verified: true,
        body: 'Car wouldn’t start. They checked alternator too and replaced the battery quickly. Great experience overall.',
    },
]

export const customerReviewCount = customerReviewsCatalog.length

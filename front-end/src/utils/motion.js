// Centralized Framer Motion variants for consistent, modern animations.
// Keep these subtle—fast UI feels premium; slow UI feels broken.

export const viewportOnce = { once: true, amount: 0.18 }

export const easing = [0.22, 1, 0.36, 1]

export const sectionStagger = {
    hidden: {},
    show: {
        transition: {
            when: 'beforeChildren',
            staggerChildren: 0.06,
        },
    },
}

export const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: easing },
    },
}

export const fadeIn = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { duration: 0.4, ease: easing },
    },
}

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.98 },
    show: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.45, ease: easing },
    },
}

export const cardIn = {
    hidden: { opacity: 0, y: 12, scale: 0.99 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: easing },
    },
}

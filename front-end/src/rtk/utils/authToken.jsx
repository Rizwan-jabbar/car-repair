export function getVerifiedToken() {
    const token = localStorage.getItem('token')
    if (!token) return null

    try {
        const payloadBase64Url = token.split('.')[1]
        if (!payloadBase64Url) {
            localStorage.removeItem('token')
            return null
        }

        const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/')
        const normalizedPayload = payloadBase64.padEnd(payloadBase64.length + ((4 - (payloadBase64.length % 4)) % 4), '=')
        const payload = JSON.parse(atob(normalizedPayload))

        const exp = Number(payload?.exp)
        if (!Number.isFinite(exp)) {
            return token
        }

        const nowInSeconds = Math.floor(Date.now() / 1000)
        if (exp <= nowInSeconds) {
            localStorage.removeItem('token')
            return null
        }

        return token
    } catch {
        localStorage.removeItem('token')
        return null
    }
}

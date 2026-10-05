const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL

// Keep local development on the Vite proxy so the browser talks to the
// backend running on the developer's machine instead of the deployed API.
export const API_BASE_URL = import.meta.env.DEV
	? '/api/auth'
	: configuredApiBaseUrl

export const getMediaUrl = (mediaPath) => {
	if (!mediaPath) return ''

	try {
		const mediaUrl = new URL(mediaPath, `${API_BASE_URL}/`)
		const apiUrl = new URL(API_BASE_URL)

		if (mediaUrl.protocol === 'http:' && mediaUrl.hostname !== 'localhost' && mediaUrl.hostname !== '127.0.0.1') {
			mediaUrl.protocol = 'https:'
		}

		if (mediaUrl.pathname.startsWith('/uploads/')) {
			mediaUrl.host = apiUrl.host
			mediaUrl.protocol = apiUrl.protocol
		}

		return mediaUrl.toString()
	} catch {
		return mediaPath
	}
}

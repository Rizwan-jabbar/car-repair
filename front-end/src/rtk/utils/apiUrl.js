export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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

import Banner from "../../models/bannerModel/bannerModel.js";

const toPublicImagePath = (req, file) => {
    if (!file?.filename) return ''
    return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
}

const normalizeText = (value) => String(value || '').trim()

const pickBannerPayload = (req, existingBanner = null) => {
    const files = req.files || {}

    const imageOne = files.imageOne?.[0]
        ? toPublicImagePath(req, files.imageOne[0])
        : normalizeText(req.body.imageOne) || normalizeText(existingBanner?.imageOne)

    const imageTwo = files.imageTwo?.[0]
        ? toPublicImagePath(req, files.imageTwo[0])
        : normalizeText(req.body.imageTwo) || normalizeText(existingBanner?.imageTwo)

    const imageThree = files.imageThree?.[0]
        ? toPublicImagePath(req, files.imageThree[0])
        : normalizeText(req.body.imageThree) || normalizeText(existingBanner?.imageThree)

    return {
        imageOne,
        imageTwo,
        imageThree,
        title: normalizeText(req.body.title) || normalizeText(existingBanner?.title),
        description: normalizeText(req.body.description) || normalizeText(existingBanner?.description),
        link: normalizeText(req.body.link) || normalizeText(existingBanner?.link)
    }
}

const createBanner = async (req , res) => {
    try {
        const payload = pickBannerPayload(req)

        if (!payload.imageOne || !payload.imageTwo || !payload.imageThree || !payload.title || !payload.description || !payload.link) {
            return res.status(400).json({ message: 'All banner fields are required' })
        }

        const newBanner = new Banner({
            imageOne: payload.imageOne,
            imageTwo: payload.imageTwo,
            imageThree: payload.imageThree,
            title: payload.title,
            description: payload.description,
            link: payload.link
        })

        const savedBanner = await newBanner.save()
        res.status(201).json(savedBanner)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

const getAllBanners = async (req , res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 })
        res.status(200).json(banners)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getLatestBanner = async (req, res) => {
    try {
        const latestBanner = await Banner.findOne().sort({ createdAt: -1 })

        if (!latestBanner) {
            return res.status(404).json({ message: 'No banner found' })
        }

        return res.status(200).json(latestBanner)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const updateBanner = async (req, res) => {
    try {
        const { bannerId } = req.params

        const banner = await Banner.findById(bannerId)
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' })
        }

        const payload = pickBannerPayload(req, banner)

        if (!payload.imageOne || !payload.imageTwo || !payload.imageThree || !payload.title || !payload.description || !payload.link) {
            return res.status(400).json({ message: 'All banner fields are required' })
        }

        banner.imageOne = payload.imageOne
        banner.imageTwo = payload.imageTwo
        banner.imageThree = payload.imageThree
        banner.title = payload.title
        banner.description = payload.description
        banner.link = payload.link

        const updatedBanner = await banner.save()
        return res.status(200).json(updatedBanner)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const bannerController = {
    createBanner,
    getAllBanners,
    getLatestBanner,
    updateBanner
}

export default bannerController
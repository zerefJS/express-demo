import { Video } from "../services/video.services.js"

const getVideoAll = async (req, res) => {
    const data = await Video.findMany()
    return res.status(200).send({
        success: true,
        data
    })
}

const createVideo = async (req, res) => {
    const data = await Video.create(req.body)
    return res.status(200).send({
        success: true,
        data
    })
}

const getByVideoUrl = async (req, res) => {
    const data = await Video.findByUrl(req.params)
    return res.status(200).send({
        succes: true,
        data
    })
}
const updateByVideoUrl = async (req, res) => { }
const deleteByVideoUrl = async (req, res) => { 

}

export default {
    getVideoAll,
    createVideo,
    getByVideoUrl,
    updateByVideoUrl,
    deleteByVideoUrl
}
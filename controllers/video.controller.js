import { db } from "../services/db.js"
import { Video } from "../services/video.services.js"

const getVideo = async (req, res) => {
    const { error, data, errorMessage } = await Video.findMany()
    if (error) {
        return res.status(400).send({
            success: false,
            message: errorMessage
        })
    }

    return res.status(200).send({
        success: true,
        data
    })
}

const createVideo = async (req, res) => {
    const { error, data, errorMessage } = await Video.create(req.body)
    if (error) {
        return res.status(400).send({
            success: false,
            message: errorMessage
        })
    }

    return res.status(200).send({
        success: true,
        data
    })


}


const getByVideoUrl = async (req, res) => {
    const { error, data, errorMessage } = await Video.findByUrl(req.params)
    if (error) {
        return res.status(400).send({
            success: false,
            message: errorMessage
        })
    }

    return res.status(200).send({
        succes: true,
        data
    })

}
const updateByVideoUrl = async (req, res) => { }
const deleteByVideoUrl = async (req, res) => { }

export default {
    getVideo,
    createVideo,
    getByVideoUrl,
    updateByVideoUrl,
    deleteByVideoUrl
}
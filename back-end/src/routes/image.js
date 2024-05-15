import { Router } from "express"
import { drive } from '../index.js'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const router = Router();

router.get('/image/:fileId', async (req, res) => {
    const { fileId } = req.params

    try {
        const driveResponse = await drive.files.get(
            { fileId: fileId, alt: 'media' },
            { responseType: 'stream' }
        )

        res.setHeader('Content-Type', driveResponse.headers['content-type'])
        res.setHeader('Cache-Control', 'public, max-age=31536000')
        res.setHeader('Access-Control-Allow-Origin', '*')

        driveResponse.data.pipe(res)

    } catch (error) {
        console.error('Error fetching image', error)
        res.status(500).json({ error: 'Failed to fetch image' })
    }
})

export default router
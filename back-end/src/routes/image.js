import { Router } from "express"
import { drive } from '../index.js'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const router = Router();

router.get('/:fileId', async (req, res) => {
    console.log('Image request received')
    
    const { fileId } = req.params
    console.log('Fetching image with fileId:', fileId)

    try {
        const driveResponse = await drive.files.get(
            { fileId: fileId, alt: 'media' },
            { responseType: 'stream' },
            { maxRedirects: 5 }
        )
        
        if (!driveResponse) {
            console.error('No response from Google Drive API')
            return res.status(500).json({ error: 'No response from Google Drive' })
        }

        console.log('Drive response: ', driveResponse)

        res.setHeader('Content-Type', driveResponse.headers['content-type'])
        res.setHeader('Cache-Control', 'public, max-age=60'/*31536000*/)
        res.setHeader('Access-Control-Allow-Origin', '*')
        
        const stream = driveResponse.data
        stream.pipe(res)

        /*
        stream.on('end', () => {
            console.log('Stream ended');
        });
        
        stream.on('close', () => {
            console.log('Stream closed');
        });        
        */
        stream.on('error', (error) => {
            console.error('Stream error', error)
            res.status(500).json({ error: 'Failed to fetch image' })
        })
        
    } catch (error) {
        console.error('Error fetching image:', error.response ? error.response.data : error);
        res.status(500).json({ error: 'Failed to fetch image from Google Drive' });
    }
})

export default router
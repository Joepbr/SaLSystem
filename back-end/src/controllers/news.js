import prisma from '../database/client.js'
import { drive } from '../index.js';
import { Readable } from 'stream'

const controller = {}

controller.post = async function(req, res) {
    try {
        const {texto} = req.body
        let imageUrl = null

        if (req.file) {
            const { originalname, mimetype, buffer } = req.file

            const FolderQuery = "name='imagens' and mimeType='application/vnd.google-apps.folder'";
            const FolderResponse = await drive.files.list({
                q: FolderQuery,
                fields: 'files(id)'
            });

            if (FolderResponse.data.files.length === 0) {
                // If the 'imagens' folder doesn't exist, handle the error
                return res.status(500).json({ error: "The 'imagens' folder doesn't exist in Google Drive." });
            }

            // Retrieve the ID of the 'imagens' folder
            const FolderId = FolderResponse.data.files[0].id;

            const fileStream = Readable.from(buffer)

            const response = await drive.files.create({
                requestBody: {
                    name: originalname,
                    mimeType: mimetype,
                    parents: [FolderId]
                },
                media: {
                    mimeType: mimetype,
                    body: fileStream
                }
            })

            const fileId = response.data.id
            imageUrl = fileId
        }
        
        const newsItem = await prisma.news.create({
            data: {
                texto,
                imageUrl
            }
        })

        res.status(201).json(newsItem)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

const fetchImages = async (fileId) => {
    try {
        const response = await drive.files.get({
            fileId: fileId,
            alt: 'media'
        }, { responseType: 'stream' })

        const chunks = []

        return new Promise((resolve, reject) => {
            response.data.on('data', (chunk) => chunks.push(chunk))
            response.data.on('end', () => {
                const imageBuffer = Buffer.concat(chunks)
                resolve(imageBuffer)
            })
            response.data.on('error', (error) => reject(error))
        })
    } catch (error) {
        console.error('Error fetching image from Google Drive:', error);
        throw new Error('Failed to fetch image from Google Drive');
    }
}

const streamToBuffer = async (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(chunks));
    });
};

controller.retrieveAll = async function(req, res) {
    try {

        const result = await prisma.news.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        const newWimages = await Promise.all(result.map(async (newsItem) => {
            if(newsItem.imageUrl) {
                try {
                    const imageBuffer = await fetchImages(newsItem.imageUrl);
                    const base64Image = imageBuffer.toString('base64');

                    return { ...newsItem, image: base64Image }
                } catch (error) {
                    console.error(`Error fetching image for news item ${newsItem.id}:`, error);
                    return { ...newsItem, image: null };
                }
            } else {
                return { ...newsItem, image: null }
            }
        }))

        res.send(newWimages)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.delete = async function(req, res) {
    try {
        const id = parseInt(req.params.newsId)

        const news = await prisma.news.findUnique({
            where: { id: id }
        })

        if (!news) {
            return res.status(404).end("Registro de notícia não encontrado")
        }

        const fileId = news.imageUrl

        if(fileId) {
            try {
                await drive.files.delete({
                    fileId: fileId
                })
                console.log('Imagem deletada', fileId)

            } catch (error) {
                console.error('Imagem não deletada: ', error)
            }

        } else {
            console.log("Imagem não encontrada")
        }
        
        const result2 = await prisma.news.delete({
            where: { id: Number(id) }
        })

        if(result2) res.status(204).end()
        else res.status(404).end()        
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

export default controller
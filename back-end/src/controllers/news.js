import prisma from '../database/client.js'
import { drive } from '../index.js';
import fs from 'fs'

const controller = {}

controller.post = async function(req, res) {
    try {
        const {texto} = req.body
        let imageUrl = null

        console.log(req.file)

        if (req.file) {
            const imageFile = req.file

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

            const response = await drive.files.create({
                requestBody: {
                    name: imageFile.originalname,
                    mimeType: imageFile.mimeType,
                    parents: [FolderId]
                },
                media: {
                    mimeType: imageFile.mimetype,
                    body: imageFile.buffer
                }
            })

            imageUrl = response.data.webViewLink
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

controller.retrieveAll = async function(req, res) {
    try {

        const result = await prisma.news.findMany()

        res.send(result)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.delete = async function(req, res) {
    try {
        const { id } = req.params

        const news = await prisma.news.findUnique({
            where: { id: Number(id) }
        })

        if (!news) {
            return res.status(404).end("Registro de notícia não encontrado")
        }

        const fileId = news.imageUrl

        if(fileId) {
            const result1 = await drive.files.delete({
                fileId: fileId
            })

            if (result2.status !== 204) {
                console.error('Imagem não deletada: ', result1.statusText)
            }

        } else {console.log("Imagem não encontrada")}
        
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
import prisma from '../database/client.js'
import { transformImageUrlsInObject } from '../utils/helpers.js'

const controller = {}

controller.create = async function (req, res) {
    try {
        const aula = await prisma.aula.create({ data: req.body })

        res.status(201).json(aula)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveAll = async function (req, res) {
    try {
        const result = await prisma.aula.findMany({
            include: {
                modulo: {
                    include: {
                        curso: true
                    }
                },
                professor: {
                    include: {
                        user: true
                    }
                }
            }
        })

        const transformedResult = transformImageUrlsInObject(result)

        res.send(transformedResult)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveOne = async function (req, res) {
    try {
        const result = await prisma.aula.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                presenca: {
                    include: {
                        aluno: {
                            include: {
                                user: true
                            }
                        }
                    }
                },
                professor: {
                    include: {
                        user: true
                    }
                },
                modulo: {
                    include: {
                        curso: true
                    }
                }
            }
        })

        const transformedResult = transformImageUrlsInObject(result)

        if(transformedResult) res.send(transformedResult)
        else res.status(404).end()
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveByModuloId = async function (req, res) {
    try {
        const moduloId = Number(req.params.moduloId)
        const result = await prisma.aula.findMany({
            where: {
                moduloId: moduloId
            }
        })
        if(result) res.send(result)
        else res.status(404).end()
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.update = async function (req, res) {
    try {
        const result = await prisma.aula.update({
            where: { id: Number(req.params.id) },
            data: req.body
        })

        if(result) res.status(204).end()
        else res.status(404).end()
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.delete = async function (req, res) {
    try {
        const result = await prisma.aula.delete({
            where: { id: Number(req.params.id) }
        })

        if(result) res.status(204).end()
        else res.status(404).end()
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

//Upload e download de arquivos
import { drive } from '../index.js';
import { Readable } from 'stream'

controller.upload = async function(req, res) {
    try {
        const { aulaId } = req.params
        const { originalname, mimetype, buffer } = req.file

        const uploadsFolderQuery = "name='uploads' and mimeType='application/vnd.google-apps.folder'";
        const uploadsFolderResponse = await drive.files.list({
            q: uploadsFolderQuery,
            fields: 'files(id)'
        });

        if (uploadsFolderResponse.data.files.length === 0) {
            // If the 'uploads' folder doesn't exist, handle the error
            return res.status(500).json({ error: "The 'uploads' folder doesn't exist in Google Drive." });
        }

        // Retrieve the ID of the 'uploads' folder
        const uploadsFolderId = uploadsFolderResponse.data.files[0].id;

        const fileMetadata = {
            name: originalname,
            mimeType: mimetype,
            parents: [uploadsFolderId]
        }

        const fileStream = Readable.from(buffer)

        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: {
                mimeType: mimetype,
                body: fileStream
            }
        })

        const fileId = response.data.id;
        const fileUrl = `https://drive.google.com/uc?id=${fileId}`
        
        const newFile = await prisma.arquivo.create({
            data: {
                nome: originalname,
                type: mimetype,
                url: fileUrl,
                fileId: fileId,
                aula: {
                    connect: { id: parseInt(aulaId) }
                }
            }
        })

        res.status(201).json(newFile)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveFileByAulaId = async function(req, res) {
    try {
        const { aulaId } = req.params
        const { filename } = req.query

        const whereClause = {
            aulaId: parseInt(aulaId)
        }

        if (filename) {
            whereClause.nome = filename
        }

        const result = await prisma.arquivo.findMany({
            where: whereClause
        })

        if(result) res.send(result)
        else res.status(404).end()
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.download = async function(req, res) {
    try {
        const { arquivoId } = req.params

        const file = await prisma.arquivo.findUnique({
            where: { id: Number(arquivoId) }
        })

        if (!file) {
            return res.status(404).end("Arquivo não encontrado")
        }

        const fileId = file.fileId

        if(fileId) {
            const fileMetadata = await drive.files.get({
                fileId: fileId,
                fields: 'name'
            })

            res.setHeader('Content-Disposition', `attachment; filename="${fileMetadata.name}"`);
            res.setHeader('Content-Type', 'application/octet-stream');

            if(fileMetadata) {
                const response = await drive.files.get({
                    fileId: fileId,
                    alt: 'media'
                }, { responseType: 'stream' })

                response.data.pipe(res)
            }
        }
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.deleteFile = async function(req, res) {
    try {
        const { arquivoId } = req.params

        const file = await prisma.arquivo.findUnique({
            where: { id: Number(arquivoId) }
        })

        if (!file) {
            return res.status(404).end("Arquivo não encontrado")
        }

        const fileId = file.fileId

        if(fileId) {
            const result1 = await drive.files.delete({
                fileId: fileId
            })

            if(result1) {
                const result2 = await prisma.arquivo.delete({
                    where: { id: Number(arquivoId) }
                })

                if(result2) res.status(204).end()
                else res.status(404).end()
            } else {console.log("Arquivo não deletado")}
        } else {console.log("FileId não encontrado")}
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

export default controller
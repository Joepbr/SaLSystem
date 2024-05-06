import prisma from '../database/client.js'

const controller = {}

controller.create = async function (req, res) {
    try {
        const notas = await prisma.notas.create({ data: req.body })

        res.status(201).json(notas)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveAll = async function (req, res) {
    try {
        const result = await prisma.notas.findMany()

        res.send(result)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveOne = async function (req, res) {
    try {
        const result = await prisma.notas.findUnique({
            where: { id: Number(req.params.id) }
        })

        if(result) res.send(result)
        else res.status(404).end()
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveByAlunoId = async function (req, res) {
    try {
        const alunoId = Number(req.params.id)
        const result = await prisma.notas.findMany({
            where: {
                alunoId: alunoId
            }
        })
        if(result) res.send(result)
        else res.status(404).end()
    }
    catch (error) {
        console.log(error);

        res.status(500).end();
    }
}

controller.update = async function (req, res) {
    try {
        const result = await prisma.notas.update({
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
        const result = await prisma.notas.delete({
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

controller.deleteByAvaliacaoId = async function (req, res) {
    try {
        const avaliacaoId = Number(req.params.id)
        const result = await prisma.notas.deleteMany({
            where: {
                avaliacaoId: avaliacaoId
            }
        })
        if(result.count > 0){
            res.status(204).end()
        } else {
            res.status(404).end()
        }
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

//Upload e download de arquivos
import { drive } from '../index.js';
import { Readable } from 'stream'

controller.uploadProva = async function(req, res) {
    try {
        const { id } = req.params
        const { originalname, mimetype, buffer } = req.file

        const FolderQuery = "name='provas' and mimeType='application/vnd.google-apps.folder'";
        const FolderResponse = await drive.files.list({
            q: FolderQuery,
            fields: 'files(id)'
        });

        if (FolderResponse.data.files.length === 0) {
            // If the 'uploads' folder doesn't exist, handle the error
            return res.status(500).json({ error: "The 'provas' folder doesn't exist in Google Drive." });
        }

        // Retrieve the ID of the 'uploads' folder
        const FolderId = FolderResponse.data.files[0].id;

        const fileMetadata = {
            name: originalname,
            mimeType: mimetype,
            parents: [FolderId]
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
        
        const newFile = await prisma.arquivo2.create({
            data: {
                nome: originalname,
                type: mimetype,
                url: fileUrl,
                fileId: fileId,
                notas: {
                    connect: { id: parseInt(id) }
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

controller.retrieveFile = async function(req, res) {
    try {
        const { id } = req.params

        const result = await prisma.arquivo2.findUnique({
            where: {
                id: parseInt(id)
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

controller.downloadProva = async function(req, res) {
    try {
        const { id } = req.params

        const file = await prisma.arquivo2.findUnique({
            where: { id: Number(id) }
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

controller.deleteProva = async function(req, res) {
    try {
        const { id } = req.params

        const file = await prisma.arquivo2.findUnique({
            where: { id: Number(id) }
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
                const result2 = await prisma.arquivo2.delete({
                    where: { id: Number(id) }
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
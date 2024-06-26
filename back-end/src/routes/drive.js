import { Router } from "express";
import upload from "../middleware/multer-config.js";
import controller from '../controllers/aula.js'

const router = Router();

router.post('/:aulaId/upload', upload.single('file'), controller.upload)
router.get('/:aulaId/arquivos', controller.retrieveFileByAulaId)
router.get('/:arquivoId/download', controller.download)
router.delete('/:arquivoId/deleteFile', controller.deleteFile)

import notasController from "../controllers/notas.js";

router.post('/:id/uploadProva', upload.single('file'), notasController.uploadProva)
router.get('/:id/prova', notasController.retrieveFile)
router.get('/:id/downloadProva', notasController.downloadProva)
router.delete('/:id/deleteProva', notasController.deleteProva)

export default router
import { Router } from 'express'
import controller from '../controllers/presenca.js'

const router = Router()

router.post('/', controller.create)
router.get('/', controller.retrieveAll)
router.get('/:id', controller.retrieveOne)
router.get('/aluno/:id', controller.retrieveByAlunoId)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)
router.delete('/aula/:id', controller.deleteByAulaId)

export default router
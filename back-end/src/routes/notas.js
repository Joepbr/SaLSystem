import { Router } from 'express'
import controller from '../controllers/notas.js'

const router = Router()

router.post('/', controller.create)
router.get('/', controller.retrieveAll)
router.get('/:id', controller.retrieveOne)
router.get('/aluno/:id', controller.retrieveByAlunoId)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)
router.delete('/avaliacao/:id', controller.deleteByAvaliacaoId)

export default router
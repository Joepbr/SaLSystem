import { Router } from 'express'
import controller from '../controllers/aluno.js'

const router = Router()

router.post('/', controller.create)
router.get('/', controller.retrieveAll)
router.get('/:id', controller.retrieveOne)
router.get('/modulo/:moduloId', controller.retrieveByModuloId)
router.get('/avaliacao/:avaliacaoId', controller.retrieveByAvaliacaoId)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)
router.get('/:id/check-access', controller.checkAccess)

export default router
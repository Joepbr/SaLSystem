import { Router } from 'express'
import controller from '../controllers/modulo.js'

const router = Router()

router.post('/', controller.create)
router.get('/', controller.retrieveAll)
router.get('/:id', controller.retrieveOne)
router.get('/curso/:cursoId', controller.retrieveByCourseId)
router.get('/professor/:id', controller.retrieveByProfId)
router.get('/avaliacao/:avaliacaoId', controller.retrieveByAvaliacaoId)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

export default router
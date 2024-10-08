import { Router } from 'express'
import controller from '../controllers/user.js'

const router = Router()

router.get('/me', controller.me)
router.post('/', controller.create)
router.get('/', controller.retrieveAll)
router.get('/:id', controller.retrieveOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)
router.post('/login', controller.login)
router.post('/logout', controller.logout)
router.post('/reset-password', controller.resetPassword)
router.post('/reset-password-token', controller.resetPasswordToken)
router.post('/send-email', controller.requestPasswordReset)

export default router
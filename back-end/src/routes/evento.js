import { Router } from "express";
import controller from "../controllers/evento.js";

const router = Router();

router.post('/', controller.post)
router.get('/', controller.retrieveAll)
router.delete('/:id', controller.delete)

export default router
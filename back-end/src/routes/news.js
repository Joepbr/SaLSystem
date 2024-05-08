import { Router } from "express";
import upload from "../middleware/multer-config.js";
import controller from "../controllers/news.js";

const router = Router();

router.post('/', upload.single('image'), controller.post)
router.get('/', controller.retrieveAll)
router.delete('/:newsId', controller.delete)

export default router
import { Router } from "express";
import { createProjectController, getAllProjectController, getProjectByIdController } from '../../controllers/project/projectController.js'

const router = Router()

router.post('/project/create', createProjectController)
router.get('/projects', getAllProjectController)
router.get('/project/:id', getProjectByIdController)

export default router
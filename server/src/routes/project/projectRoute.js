import { Router } from "express";
import {
    createProjectController,
    getAllProjectController,
    getProjectByIdController,
    addProjectMemberController,
    getProjectMembersController,
    getProjectMemberByStatusController,
    processMemberRequestController
} from '../../controllers/project/projectController.js'

const router = Router()

router.post('/project/create', createProjectController)
router.get('/projects', getAllProjectController)
router.get('/project/:id', getProjectByIdController)
router.post('/project/:id', addProjectMemberController)
router.get('/project/members/:id', getProjectMembersController)
router.get('/project/:projectId/members/:index', getProjectMemberByStatusController)
router.put('/project/:projectId', processMemberRequestController)
export default router
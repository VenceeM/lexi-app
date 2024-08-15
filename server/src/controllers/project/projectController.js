import { responseUtil } from "../../utils/responseUtil.js";
import { createProjectService, getAllProjectService, getProjectByIdService } from '../../services/project/projectService.js'

// Create project
export const createProjectController = async (req, res) => {

    const { name, maxMember } = req.body
    const userId = req.user.id
    try {

        if (!name || !userId) {
            return res.status(400).json(responseUtil(false, null, 'Name and user id is required'));
        }

        const projectOjbect = {
            name: name,
            maxMember: maxMember,
            ownerUserId: userId
        }
        const { result, message } = await createProjectService(projectOjbect)

        if (message) {
            return res.status(400).json(responseUtil(false, null, message))
        }

        return res.status(201).json(responseUtil(true, result))

    } catch (error) {
        return res.status(500).json(responseUtil(false, null, error.message))
    }
}

// Get all projects
export const getAllProjectController = async (req, res) => {

    try {
        const { result, message } = await getAllProjectService();

        if (message) {
            return res.status(400).json(responseUtil(false, null, message))
        }

        return res.status(200).json(responseUtil(true, result))

    } catch (error) {
        return res.status(500).json(responseUtil(false, null, error.message))
    }
}

export const getProjectByIdController = async (req, res) => {

    const { id } = req.params

    try {
        if (!id) {
            return res.status(404).json(responseUtil(false, null, 'No Result'));
        }

        const { result, message } = await getProjectByIdService(id)

        if (message) {
            return res.status(404).json(responseUtil(false, null, 'No Result'));
        }

        return res.status(200).json(responseUtil(true, result));

    } catch (error) {
        return res.status(500).json(responseUtil(false, null, error.message))
    }
}
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const projectObject = {
    result: null,
    message: null
}
export const createProjectService = async ({ name, maxMember, ownerUserId }) => {

    try {
        if (!name && !ownerUserId) {
            projectObject.message = 'Name and user id is required.'
            return projectObject
        }

        
        const existing = await prisma.projects.findFirst({
            where: {
                name: name
            }
        });

        if (existing) {
            projectObject.message = `${name} is an existing project`
            return projectObject
        }

        const result = await prisma.projects.create({
            data: {
                name: name,
                max_member_count: maxMember,
                owner_user_id: ownerUserId
            }
        });

        projectObject.message = null
        projectObject.result = result

        return projectObject

    } catch (error) {
        console.error(error)
    }
}

export const getAllProjectService = async () => {

    try {
        const result = await prisma.projects.findMany()

        projectObject.message = null
        projectObject.result = result

        return projectObject

    } catch (error) {
        console.error(error)
    }
}

export const getProjectByIdService = async (id) => {

    try {
        if (!id) {
            projectObject.message = 'No record found'
            return projectObject
        }

        const result = await prisma.projects.findUnique({
            where: {
                id: Number(id)
            }
        })

        projectObject.message = null
        projectObject.result = result

        return projectObject

    } catch (error) {
        console.error(error)
    }
}
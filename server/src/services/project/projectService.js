import { PrismaClient, ProjectMemberStatus } from "@prisma/client"
import { getMemberStatusByIndex } from '../../utils/projectMemberStatus.js'

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

const getMemberCount = async (projectId) => {

    try {
        const members = await prisma.projectMember.findMany({
            where: {
                project_id: Number(projectId)
            }
        })

        return members.length

    } catch (error) {
        console.error(error)
    }
}

const isMemberAlreadyExist = async (userId, projectId) => {
    try {
        const members = await prisma.projectMember.findFirst({
            where: {
                user_id: Number(userId),
                project_id: Number(projectId)
            }
        })

        return members

    } catch (error) {
        console.error(error)
    }
}

export const addProjectMemberService = async ({ userId, projectId }) => {

    try {
        const isExists = await isMemberAlreadyExist(userId, projectId)

        if (isExists) {
            projectObject.message = 'Already added'
            return projectObject
        }



        const memberCount = getMemberCount(projectId)
        const projects = await prisma.projects.findUnique({
            where: {
                id: Number(projectId)
            }
        })

        if (projects.owner_user_id == userId) {
            projectObject.message = 'You are the owner of this project'
            return projectObject
        }

        if (!projects) {
            projectObject.message = 'No project found';
            return projectObject;
        }

        if (memberCount != undefined && projects.max_member_count >= memberCount) {
            projectObject.message = 'The project members is full.'
            return projectObject
        }

        const result = await prisma.projectMember.create({
            data: {
                user_id: userId,
                project_id: Number(projectId),
                status: ProjectMemberStatus.PENDING
            }
        })

        projectObject.message = null
        projectObject.result = result;
        return projectObject;

    } catch (error) {
        console.error(error)
    }
}

export const getProjectMembersService = async (projectId) => {

    try {

        const result = await prisma.projectMember.findMany({
            where: {
                project_id: Number(projectId)
            }
        })

        projectObject.message = null
        projectObject.result = result

        return projectObject

    } catch (error) {
        console.log(error)
    }
}

export const getProjectMembersByStatusService = async (statusIndex, projectId) => {

    try {

        const status = getMemberStatusByIndex(Number(statusIndex))

        const result = await prisma.projectMember.findMany({
            where: {
                project_id: Number(projectId),
                status: status
            },
            select: {
                status: true,
                project: {
                    select: {
                        name: true
                    }
                },
                user: {
                    select: {
                        email: true,
                        status: true,
                        user_information: true
                    }
                }
            }
        })


        projectObject.message = null
        projectObject.result = result.map((item) => {
            const fullName = `${item.user.user_information.first_name} ${item.user.user_information.last_name}`
            return {
                project_name: item.project.name,
                full_name: fullName,
                email: item.user.email,
                status: item.status
            }
        })

        return projectObject

    } catch (error) {
        console.log(error)
    }
}

export const processMemberRequestService = async (projectId, status, userId) => {

    try {
        const finalStatus = getMemberStatusByIndex(Number(status))
        const getProjectMemberId = await prisma.projectMember.findFirst({
            where: {
                project_id: Number(projectId),
                user_id: Number(userId)
            }
        })
        const result = await prisma.projectMember.update({
            where: {
                id: getProjectMemberId.id
            },
            data: {
                status: finalStatus
            }
        })

        projectObject.message = null
        projectObject.result = result

        return projectObject
    } catch (error) {
        console.error(error)
    }
}
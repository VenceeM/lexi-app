import { PrismaClient } from '@prisma/client'

const primsa = new PrismaClient();

const main = async () => {
    try {

        await primsa.roles.upsert({
            where: {
                id: 1
            },
            update: {
                name: 'admin'
            },
            create: {
                name: 'admin'
            }
        })

        await primsa.roles.upsert({
            where: {
                id: 2
            },
            update: {
                name: 'member'
            },
            create: {
                name: 'member'
            }
        })

        await primsa.users.upsert({
            where: {
                email: "admin@example.com"
            },
            update: {
                email: 'admin@example.com',
                password: '@Admin123456',
                role_id: 1
            },
            create: {
                email: 'admin@example.com',
                password: '@Admin123456',
                role_id: 1
            }
        });

    } catch (error) {
        console.error(error)
    }
}


main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await primsa.$disconnect();
})
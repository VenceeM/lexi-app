import { PrismaClient } from '@prisma/client'

const primsa = new PrismaClient();

const main = async () => {
    try {

        await primsa.roles.createMany({
            data: [
                { name: 'admin' },
                { name: 'member' }
            ]
        })

        await primsa.users.create({
            data: {
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
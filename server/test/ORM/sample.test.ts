// import { Prisma } from '@prisma/client'
//
// import { expect, test, vi } from 'vitest'
// import prisma from '../../src/__mocks__/prisma'
// vi.mock('../src/libs/prisma')
//
// test('createUser should return the generated user', async () => {
//     const createUser = async (user: Prisma.UserCreateInput) => {
//         return prisma.user.create({
//             data: user,
//         });
//     }
//     const newUser = { email: 'user@prisma.io', name: 'Prisma Fan' }
//     prisma.user.create.mockResolvedValue({ ...newUser, id: 1 })
//     const user = await createUser(newUser)
//     expect(user).toStrictEqual({ ...newUser, id: 1 })
//
//     prisma.user.findMany.mockResolvedValue([{ ...newUser, id: 1 }])
//     const foundUser = await prisma.user.findMany({where: {id:3}})
//     // const foundUser = await prisma.user.findMany()
//     expect(foundUser).toStrictEqual([{ ...newUser, id: 1 }])
// })
//
// test('createUser should create a new user in the database', async () => {
//     const newUser = { email: 'user@prisma.io', name: 'Prisma Fan' };
//     prisma.user.create.mockResolvedValue({ ...newUser, id: 1 })
//     const createdUser = await prisma.user.create({
//         data: newUser,
//     });
//     expect(createdUser).toBeDefined();
//     expect(createdUser.email).toBe(newUser.email);
//     expect(createdUser.name).toBe(newUser.name);
// });
//
// test('mock test', async () => {
//     const newUser = { email: 'user@prisma.io', name: 'Prisma Fan' };
//     const createdUser = await prisma.user.create({
//         data: newUser,
//     });
//     expect(createdUser).toBeUndefined();
//     const userId = 1;
//     const foundUser = await prisma.user.findUnique({
//         where: { id: userId },
//     });
//     expect(foundUser).toBeUndefined()
//     // expect(foundUser).toBeDefined();
//     // expect(foundUser!.id).toBe(userId);
// });

import { PrismaClient, Prisma } from '../generated/prisma';
const prisma = new PrismaClient();
import { ApplyInput } from "../types/apply";

async function createApplyService(data: ApplyInput) {
  try {

      const existing = await prisma.apply.findUnique({
        where: { email: data.email },
      });

      if (existing) {
        throw new Error(`Email "${data.email}" is already registered.`);
      }

    const application = await prisma.apply.create({
      data: {
        name: data.name,
        email: data.email,
        path: data.path,
        originalName: data.originalName,
        size: data.size,
        mimeType: data.mimeType,
      },
    });
    return application;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw new Error(`Email "${data.email}" is already registered.`);
    }
    throw e;
  }
}


export {
    createApplyService
}
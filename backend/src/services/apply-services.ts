import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();
import { ApplyInput } from "../types/apply";



async function createApplyService(data: ApplyInput) {
  const application = await prisma.apply.create({
    data: {
      name: data.name,
      email: data.email,
      path: data.file?.path ?? "",
      originalName: data.file?.originalName,
      size: data.file?.size,
      mimeType: data.file?.mimeType,
      createdAt: new Date(),
    },
  });

  return application;
}


export {
    createApplyService
}
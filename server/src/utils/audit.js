import prisma from "../config/prisma.js";

export const createAuditLog = async ({
  action,
  entity,
  entityId,
  userId,
}) => {
  await prisma.auditLog.create({
    data: {
      action,
      entity,
      entityId,
      userId,
    },
  });
};
import prisma from "../config/prisma.js";

export const getAuditLogs = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const search = String(req.query.search || "").trim();
    const skip = (page - 1) * limit;
    let userIds = [];

    if (search) {
      const roleSearch = search.toUpperCase();
      const roleFilter = ["ADMIN", "MANAGER", "SALES"].includes(roleSearch)
        ? [{ role: { equals: roleSearch } }]
        : [];

      const matchingUsers = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            ...roleFilter,
          ],
        },
        select: { id: true },
      });
      userIds = matchingUsers.map((user) => user.id);
    }

    const where = search
      ? {
          OR: [
            { action: { contains: search, mode: "insensitive" } },
            { entity: { contains: search, mode: "insensitive" } },
            { entityId: { contains: search, mode: "insensitive" } },
            { userId: { contains: search, mode: "insensitive" } },
            ...(userIds.length ? [{ userId: { in: userIds } }] : []),
          ],
        }
      : {};

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: [...new Set(logs.map((log) => log.userId))],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    const usersById = new Map(users.map((user) => [user.id, user]));

    res.json({
      data: logs.map((log) => ({
        ...log,
        user: usersById.get(log.userId) || null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching audit logs" });
  }
};

import prisma from "../config/prisma.js";

export const getDashboardStats = async (req, res) => {
  try {
    const baseWhere = req.user.role === "SALES" ? { assignedToId: req.user.id } : {};
    const totalLeads = await prisma.lead.count({
      where: baseWhere,
    });

    const newLeads = await prisma.lead.count({
      where: {
        ...baseWhere,
        status: "NEW",
      },
    });

    const assignedLeads = await prisma.lead.count({
      where:
        req.user.role === "SALES"
          ? baseWhere
          : {
              assignedToId: {
                not: null,
              },
            },
    });

    const convertedLeads = await prisma.lead.count({
      where: {
        ...baseWhere,
        status: "CONVERTED",
      },
    });

    res.status(200).json({
      totalLeads,
      newLeads,
      assignedLeads,
      convertedLeads,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

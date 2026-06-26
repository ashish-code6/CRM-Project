import prisma from "../config/prisma.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await prisma.lead.count();

    const newLeads = await prisma.lead.count({
      where: {
        status: "NEW",
      },
    });

    const assignedLeads = await prisma.lead.count({
      where: {
        assignedToId: {
          not: null,
        },
      },
    });

    const convertedLeads = await prisma.lead.count({
      where: {
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
import prisma from "../config/prisma.js";
import { sendLeadAssignedEmail } from "../utils/sendLeadAssignedEmail.js";
import { createAuditLog } from "../utils/audit.js";

// CREATE LEAD
export const createLead = async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        company,
      },
    });

    await createAuditLog({
      action: "CREATE",
      entity: "LEAD",
      entityId: lead.id,
      userId: req.user.id,
    });

    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: "Error creating lead" });
  }
};
// --------------Get ALl Leads----------------
export const getLeads = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: "Error fetching leads" });
  }
};

// ---------Get Lead details  By ID--------------
export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: {
        id,
      },
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.status(200).json(lead);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

//----------Update the lead By ID---------------

export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, phone, company, status } = req.body;

    // Check if lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (company !== undefined) updateData.company = company;
    if (status !== undefined) updateData.status = status;

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: updateData,
    });

    await createAuditLog({
      action: "UPDATE",
      entity: "LEAD",
      entityId: updatedLead.id,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      lead: updatedLead,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// ---------Delete the lead---------------
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    await prisma.lead.delete({
      where: { id },
    });

    await createAuditLog({
      action: "DELETE",
      entity: "LEAD",
      entityId: id,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const assignLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { assignedToId } = req.body;

    // Check if lead exists
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: assignedToId },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Assign lead
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        assignedToId,
      },
    });

    // Send email (Don't fail API if email fails)
    try {
      await sendLeadAssignedEmail(user.email, lead.name, lead.company);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    await createAuditLog({
      action: "ASSIGN",
      entity: "LEAD",
      entityId: updatedLead.id,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Lead assigned successfully",
      lead: updatedLead,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

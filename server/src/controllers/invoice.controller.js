import prisma from "../config/prisma.js";
import { createAuditLog } from "../utils/audit.js";

const allowedStatuses = ["PAID", "PENDING", "OVERDUE"];

const escapePdfText = (value) => String(value ?? "").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const formatMoney = (value) =>
  `INR ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(Number(value || 0))}`;

const formatDate = (value) => (value ? new Date(value).toLocaleDateString("en-IN") : "-");

const buildInvoicePdf = (invoice) => {
  const rows = [
    ["Invoice No", invoice.invoiceNo],
    ["Customer", invoice.customerName],
    ["Company", invoice.company || "-"],
    ["Status", invoice.status],
    ["Due Date", formatDate(invoice.dueDate)],
    ["Amount", formatMoney(invoice.amount)],
    ["GST", formatMoney(invoice.gst)],
    ["Total", formatMoney(invoice.total)],
  ];

  const lines = [
    "BT",
    "/F1 24 Tf",
    "50 780 Td",
    `(Invoice) Tj`,
    "/F1 11 Tf",
    "0 -28 Td",
    `(Generated on ${escapePdfText(formatDate(new Date()))}) Tj`,
    "/F1 13 Tf",
    "0 -38 Td",
    `(Bill To) Tj`,
    "/F1 11 Tf",
    "0 -20 Td",
    `(${escapePdfText(invoice.customerName)}) Tj`,
    "0 -16 Td",
    `(${escapePdfText(invoice.company || "-")}) Tj`,
    "/F1 12 Tf",
    "0 -36 Td",
    ...rows.flatMap(([label, value]) => [
      `(${escapePdfText(label)}) Tj`,
      "190 0 Td",
      `(${escapePdfText(value)}) Tj`,
      "-190 -24 Td",
    ]),
    "/F1 14 Tf",
    "0 -14 Td",
    `(Thank you for your business.) Tj`,
    "ET",
  ];

  const stream = lines.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
    .join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf);
};

const buildInvoiceData = (body) => {
  const amount = Number(body.amount);
  const gst = Number(body.gst || 0);
  const total = body.total !== undefined && body.total !== "" ? Number(body.total) : amount + gst;
  const status = String(body.status || "PENDING").trim().toUpperCase();

  return {
    invoiceNo: String(body.invoiceNo || "").trim(),
    customerName: String(body.customerName || "").trim(),
    company: body.company ? String(body.company).trim() : null,
    amount,
    gst,
    total,
    status,
    dueDate: new Date(body.dueDate),
    leadId: body.leadId || null,
  };
};

const validateInvoice = (data) => {
  if (!data.invoiceNo) return "Invoice number is required";
  if (!data.customerName) return "Customer name is required";
  if (!Number.isFinite(data.amount) || data.amount <= 0) return "Amount must be greater than 0";
  if (!Number.isFinite(data.gst) || data.gst < 0) return "GST cannot be negative";
  if (!Number.isFinite(data.total) || data.total <= 0) return "Total must be greater than 0";
  if (!allowedStatuses.includes(data.status)) return "Invalid invoice status";
  if (Number.isNaN(data.dueDate.getTime())) return "Valid due date is required";
  return "";
};

export const createInvoice = async (req, res) => {
  try {
    const data = buildInvoiceData(req.body);
    const validationError = validateInvoice(data);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (data.leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: data.leadId } });
      if (!lead) return res.status(404).json({ message: "Lead not found" });
    }

    const invoice = await prisma.invoice.create({ data });

    await createAuditLog({
      action: "CREATE",
      entity: "INVOICE",
      entityId: invoice.id,
      userId: req.user.id,
    });

    res.status(201).json(invoice);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Invoice number already exists" });
    }
    console.log(error);
    res.status(500).json({ message: "Error creating invoice" });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const search = String(req.query.search || "").trim();
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { invoiceNo: { contains: search, mode: "insensitive" } },
            { customerName: { contains: search, mode: "insensitive" } },
            { company: { contains: search, mode: "insensitive" } },
            ...(allowedStatuses.includes(search.toUpperCase()) ? [{ status: search.toUpperCase() }] : []),
          ],
        }
      : {};

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          lead: {
            select: {
              id: true,
              name: true,
              company: true,
            },
          },
        },
      }),
      prisma.invoice.count({ where }),
    ]);

    res.json({
      data: invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching invoices" });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
      },
    });

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    res.json(invoice);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching invoice" });
  }
};

export const downloadInvoicePdf = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
      },
    });

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const pdf = buildInvoicePdf(invoice);
    const filename = `invoice-${invoice.invoiceNo.replace(/[^a-z0-9_-]+/gi, "-")}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdf.length);
    res.send(pdf);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error downloading invoice" });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const existingInvoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });
    if (!existingInvoice) return res.status(404).json({ message: "Invoice not found" });

    const data = buildInvoiceData({ ...existingInvoice, ...req.body });
    const validationError = validateInvoice(data);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (data.leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: data.leadId } });
      if (!lead) return res.status(404).json({ message: "Lead not found" });
    }

    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data,
    });

    await createAuditLog({
      action: "UPDATE",
      entity: "INVOICE",
      entityId: invoice.id,
      userId: req.user.id,
    });

    res.json(invoice);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Invoice number already exists" });
    }
    console.log(error);
    res.status(500).json({ message: "Error updating invoice" });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    await prisma.invoice.delete({ where: { id: req.params.id } });

    await createAuditLog({
      action: "DELETE",
      entity: "INVOICE",
      entityId: req.params.id,
      userId: req.user.id,
    });

    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting invoice" });
  }
};

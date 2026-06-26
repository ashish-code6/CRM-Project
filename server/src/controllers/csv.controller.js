import fs from "fs";
import csv from "csv-parser";
import prisma from "../config/prisma.js";

export const uploadCSV = async (req, res) => {
  try {
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        // bulk insert
        await prisma.lead.createMany({
          data: results.map((item) => ({
            name: item.name,
            email: item.email,
            phone: item.phone,
            company: item.company,
          })),
        });

        res.json({
          message: "CSV uploaded successfully",
          total: results.length,
        });
      });
  } catch (error) {
    res.status(500).json({ message: "CSV upload failed" });
  }
};
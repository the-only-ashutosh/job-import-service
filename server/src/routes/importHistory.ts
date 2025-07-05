import express, { Request, Response } from "express";
import { Parser as Json2csvParser } from "json2csv";
import ImportLog from "../models/importLog.js";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const skip = (page - 1) * limit;

    const logs = await ImportLog.find({
      fileName: { $regex: search, $options: "i" },
    })
      .skip(skip)
      .limit(limit)
      .sort({ importDateTime: -1 });
    const total = await ImportLog.countDocuments();

    res.json({
      totalPages: Math.ceil(total / limit),
      items: logs.map((log) => {
        return {
          failedJobs: log.failedJobs.length,
          id: log._id,
          fileName: log.fileName,
          importDateTime: log.importDateTime,
          totalFetched: log.totalFetched,
          totalImported: log.totalImported,
          newJobs: log.newJobs,
          updatedJobs: log.updatedJobs,
          status: log.status,
          createdAt: log.createdAt,
          updatedAt: log.updatedAt,
        };
      }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching import history" });
  }
});

router.get("/export", async (req, res) => {
  try {
    const logs = await ImportLog.find().sort({ importDateTime: -1 }).lean();

    const fields = [
      { label: "File Name", value: "fileName" },
      {
        label: "Import Date",
        value: (row: any) => new Date(row.importDateTime).toLocaleString(),
      },
      { label: "Total", value: "totalFetched" },
      { label: "New", value: "newJobs" },
      { label: "Updated", value: "updatedJobs" },
      { label: "Failed Count", value: (row: any) => row.failedJobs.length },
    ];
    const parser = new Json2csvParser({ fields });
    const csv = parser.parse(logs);

    res.header("Content-Type", "text/csv");
    res.attachment("import-history.csv");
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to export data" });
  }
});

export default router;

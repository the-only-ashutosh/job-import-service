import { Worker } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";

import Job from "../models/job.js";
import ImportLog from "../models/importLog.js";

dotenv.config({ quiet: true });

const redisConnection = new Redis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: null,
});
const CONCURRENCY = parseInt(process.env.CONCURRENCY ?? "5");

interface ProcessedJobData {
  feed: string;
  batch: any[];
}

const jobWorker = new Worker<ProcessedJobData>(
  "job-queue",
  async (job) => {
    const { feed, batch } = job.data;
    let stats = {
      totalFetched: batch.length,
      newJobs: 0,
      updatedJobs: 0,
      failedJobs: [] as { jobId: string; reason: string }[],
    };

    for (const jobData of batch) {
      let jobId: string | undefined;
      if (jobData.guid?.[0]) {
        const guidValue = jobData.guid[0];
        jobId = typeof guidValue === "string" ? guidValue : guidValue._;
      } else if (jobData.link?.[0]) {
        const linkValue = jobData.link[0];
        jobId = typeof linkValue === "string" ? linkValue : linkValue._;
      }

      if (!jobId) throw new Error("Missing jobId (guid/link) for job.");

      try {
        const update = await Job.updateOne(
          { jobId },
          {
            jobId,
            title: jobData.title?.[0] ?? "",
            description: jobData.description?.[0] ?? "",
            author: jobData.author?.[0] ?? "",
            guid: jobData.guid?.[0] ?? "",
            link: jobData.link?.[0] ?? "",
            pubDate: new Date(jobData.pubDate?.[0] ?? ""),
          },
          { upsert: true }
        );

        if (update.upsertedId) stats.newJobs += 1;
        else if (update.modifiedCount > 0) stats.updatedJobs += 1;
      } catch (err: any) {
        stats.failedJobs.push({ jobId, reason: err.message });
      }
    }

    // After processing, write log to ImportLog
    await ImportLog.create({
      fileName: feed,
      importDateTime: new Date(),
      totalFetched: stats.totalFetched,
      totalImported: stats.newJobs + stats.updatedJobs,
      newJobs: stats.newJobs,
      updatedJobs: stats.updatedJobs,
      failedJobs: stats.failedJobs,
      status:
        stats.failedJobs.length === stats.totalFetched
          ? "failed"
          : stats.newJobs + stats.updatedJobs === stats.totalFetched
          ? "success"
          : "partial",
    });
  },
  {
    concurrency: CONCURRENCY,
    connection: redisConnection,
  }
);

jobWorker.on("ready", () => {
  redisConnection.publish(
    "activity-update",
    JSON.stringify({
      type: "Batch processing in progress",
      timestamp: new Date(),
    })
  );
});
jobWorker.on("closed", () => {
  redisConnection.publish(
    "import-channel",
    JSON.stringify({
      status: "Completed",
    })
  );
});
jobWorker.on("completed", (job) =>
  console.log(`Job ${job?.id} process completed!`)
);
jobWorker.on("failed", (job, err) =>
  console.error(`Job ${job?.id} failed:`, err.message)
);

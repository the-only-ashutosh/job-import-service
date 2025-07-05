import cron from "node-cron";
import axios from "axios";
import xml2js from "xml2js";
import { Queue } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";
import BadFeed from "../models/badFeed.js";
import { getIO } from "./io-helper.js";

dotenv.config({ quiet: true });

const redisConnection = new Redis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: null,
});
const CRON_SCHEDULE = process.env.CRON_SCHEDULE ?? "0 * * * *";
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE ?? "50");

const jobQueue = new Queue("job-queue", {
  connection: redisConnection,
  defaultJobOptions: { removeOnComplete: true },
});

// List of API URLs
const FEEDS = process.env.FEED_URLS ? process.env.FEED_URLS.split("[-]") : [];
const needHeader = (url: string): boolean => {
  return url === "https://www.higheredjobs.com/rss/articleFeed.cfm";
};

async function fetchData(io: any) {
  console.log(`Running fetcher at ${new Date().toISOString()}`);
  for (const url of FEEDS) {
    let data: string = "";
    try {
      data = (
        await axios.get(
          url,
          needHeader(url)
            ? {
                headers: {
                  "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115 Safari/537.36",
                  Accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                  "Accept-Language": "en-US,en;q=0.9",
                  Referer: "https://www.higheredjobs.com/",
                  Connection: "keep-alive",
                },
              }
            : {}
        )
      ).data;
      const json = await xml2js.parseStringPromise(data, {
        mergeAttrs: true,
      });
      const items = json.rss?.channel[0]?.item ?? [];

      //   Split into batches of BATCH_SIZE
      for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);
        await jobQueue.add("process-batch", { feed: url, batch });
      }
    } catch (error) {
      await BadFeed.create({
        feedUrl: url,
        errorType: "ParsingError",
        errorMessage: (error as { message: string }).message,
        rawSnapshot: data.slice(0, 10000), // store up to 10KB snapshot
      });
      io.emit("activity-update", {
        type: "Bad feed encountered",
        timestamp: new Date(),
      });
      console.error(
        `Error fetching ${url}`,
        (error as { message: string }).message
      );
    }
  }
  io.emit("activity-update", {
    type: "Data validation completed",
    timestamp: new Date(),
  });
}

export function startFetcher() {
  console.log("Job fetcher cron started");
  cron.schedule(CRON_SCHEDULE, async () => {
    const io = getIO();
    io.emit("activity-update", {
      type: "Import process started",
      timestamp: new Date(),
    });
    await fetchData(io);
  });
}

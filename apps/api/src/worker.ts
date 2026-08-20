import { Worker } from "bullmq";
import { connection, myQueue } from "./queue";

const worker = new Worker(
  "my-queue",
  async (job) => {
    console.log(`Processing job:`, job.id, job.name, job.data);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log(`Processing job completed:`, job.id, job.name, job.data);
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`Job completed:`, job.id, job.name, job.data);
});

worker.on("failed", (job, err) => {
  console.error(`Job failed:`, job?.id, job?.name, job?.data, err);
});

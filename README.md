# Job Import System

This is a full-stack job import system that:
✅ Pulls job feeds from multiple APIs  
✅ Queues jobs with Redis  
✅ Imports jobs into MongoDB  
✅ Tracks import history  
✅ Provides a Next.js frontend with live updates  
✅ Supports scheduled imports with Cloud Run Jobs + Cloud Scheduler

## 📁 Project Structure

/client → Next.js frontend app (deployed on Vercel)
/server → Node.js Express API + worker (deployed on Cloud Run)
/README.md → This guide
/docs/[architecture.md](https://github.com/the-only-ashutosh/job-import-service/blob/main/docs/architecture.md) → Architecture diagrams and design notes

## 🚀 Deployment Guide

This section explains exactly how to deploy the project step by step.

## ✅ 1) Prepare Your Google Cloud Project

- Enable these Google Cloud APIs:
  - Cloud Run
  - Cloud Build
  - Cloud Scheduler
- Make sure you have permissions to deploy Cloud Run services and jobs.

## ✅ 2) Deploy the Backend API (/server) from Cloud Run Console using Cloud Build

1. Go to [Cloud Run](https://console.cloud.google.com/run) → Click **Create Service** → Choose **Deploy container image** → then select **Continuously deploy from repository**.

2. Connect your GitHub account if you haven’t already.

3. In **Select repository**, choose your repo that contains both `/client` and `/server`.

4. For **Build Configuration**, set:

   - **Source Location**: `/server/Dockerfile`
   - This ensures Cloud Build will use the Dockerfile located in your `/server` folder to build your API image.

5. For **Region**, pick your preferred location (e.g., `us-central1`).

6. For **Service name**, use something like `job-import-api`.

7. For **Environment Variables**, add:

   - `MONGODB_URI`
   - `REDIS_URL`
   - `FEED_URLS`
   - `BATCH_SIZE`
   - `CRON_SCHEDULE`
   - `API_VERSION`

8. Complete the configuration and click **Create**.

✅ This will:

- Build your Docker image from `/server/Dockerfile` using Cloud Build.
- Deploy your API server to Cloud Run as a continuously deployed service.
- Set up automatic redeployments every time you push changes to your main branch in GitHub.

✅ After deployment completes, you will receive a public API URL like:
https://job-import-api-abc123-uc.a.run.app

---

## ✅ 3) Deploy the Worker as Cloud Run Job

1. In [Cloud Run Jobs](https://console.cloud.google.com/run/jobs), click **Deploy container**

2. Select the **container image** built by your API deployment:

- `your-region-docker.pkg.dev/YOUR_PROJECT_ID/cloud-run-source-deploy`
- `github-repo/cloud-run-service-name`
- Build Image (eg:, `df0187345y`)

3. For **Job name**, use something like `job-import-worker`.

4. Set environment variables:

- `MONGODB_URI`
- `REDIS_URL`
- `CONCURRENCY`

5. Under **Advanced settings → Container command and arguments**, override the entrypoint:

- Container command: `npm`
- Container arguments: `run`, `start:worker` (**Comma not required only space: run start:worker**)

6. Complete the configuration and click **Create**.

✅ This sets up a Cloud Run Job that uses the same backend image, but runs your worker process instead of starting the HTTP server.

---

## ✅ 4) Add a Scheduler Trigger to the Worker Job

1. After the job is created, navigate to the **Cloud Run Job details page** for your worker job.

2. Switch to the **Triggers** tab.

3. Click **Add Scheduler trigger**.

4. In the Scheduler configuration:

- **Frequency**: set your desired cron expression, e.g., `0 * * * *` to run every hour.
- **Timezone**: choose your preferred timezone (e.g., Indian Standard Time (UTC +05:30)).

5. Click **Continue**, then **Create**.

✅ This creates and connects a Cloud Scheduler job directly to your Cloud Run Job, automating periodic execution of your worker.

---

## ✅ 5) Backend Deployment Complete!

With these steps, your backend is fully deployed:

- Your API server runs on Cloud Run as a continuously updated service from your GitHub repo.
- Your worker runs as a Cloud Run Job triggered automatically by a Cloud Scheduler schedule.
- Any new commits to your `/server` code will automatically build and redeploy your API image.

✅ Your system now supports both real-time API endpoints and scheduled background job processing — fully automated and cloud-native!

---

## ✅ 6) Deploy the Frontend (/client) on Vercel

1. Go to vercel.com → log in → New Project.

2. Select your GitHub repo.

3. In Project Settings → set Root Directory to:
   client
   This tells Vercel to deploy the /client folder.

4. Add your frontend environment variable in Vercel:
   NEXT_PUBLIC_API_URL=https://job-import-api-abc123-uc.a.run.app
   (replace with your actual Cloud Run API URL).

5. Deploy.

✅ You’ll get a public Vercel frontend URL like:
https://your-project-name.vercel.app

## ✅ 7) Connect Frontend to Backend

Your deployed Vercel frontend uses the NEXT_PUBLIC_API_URL environment variable to connect to your Cloud Run API service.

✅ Your end-to-end system is now deployed, with:

- Next.js frontend on Vercel
- API server on Cloud Run
- Background worker as Cloud Run Job
- Scheduled job runs with Cloud Scheduler

## 📖 Usage

- Visit your Vercel URL.
- Dashboard shows import history, system status, and live sync info.
- Cloud Run Job fetches new jobs on schedule.
- API endpoints are available at your Cloud Run API URL.

## 📚 Architecture

See /docs/architecture.md for system diagrams.

import React from "react";
import MainPage from "./components/main-page";

export interface ImportHistoryItem {
  id: string;
  fileName: string;
  importDateTime: string;
  totalFetched: number;
  totalImported: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: number;
  status: "success" | "partial" | "failed";
}
export interface SystemInfo {
  apiVersion: string;
  dbStatus: string;
  totalRecords: number;
  uptime: string;
}

export default async function Home() {
  const data: { items: ImportHistoryItem[]; totalPages: number } = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/import-history?page=1&limit=10`
  )
    .then((res) => res.json())
    .then((res) => res);
  const systemInfo: SystemInfo = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/system-info`
  )
    .then((res) => res.json())
    .then((res) => res);
  return (
    <MainPage
      initialData={data.items}
      totalPages={data.totalPages}
      systemInfo={systemInfo}
    />
  );
}

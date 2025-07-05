"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { SystemInfo } from "../page";

const SystemInfoCard = ({ info }: { info: SystemInfo }) => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>(info);
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch(`/api/system-info`);
        const data = await res.json();
        setSystemInfo(data);
      } catch (err) {
        console.error("Failed to fetch system info:", err);
      }
    };

    fetchInfo();
    const interval = setInterval(fetchInfo, 30000); // refresh every 30s

    return () => clearInterval(interval);
  }, []);
  return (
    <Card className="bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 border-white/20 dark:border-slate-800/50 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>System Information</span>
          <div
            className="w-3 h-3 bg-green-500 rounded-full animate-pulse"
            style={{ marginLeft: "auto" }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">API Version</span>
            <span className="font-mono">{`v${systemInfo.apiVersion}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Database Status</span>
            <span className="text-green-600 font-medium">
              {systemInfo.dbStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Records</span>
            <span className="font-mono">{systemInfo.totalRecords}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Uptime</span>
            <span className="font-mono">{systemInfo.uptime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemInfoCard;

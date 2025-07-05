import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import React from "react";
import { ImportHistoryTable } from "./import-history-table";
import { ImportHistoryItem, SystemInfo } from "../page";
import { getUpcomingHour } from "@/lib/helper";
import RecentActivity from "./recent-activity";
import SystemInfoCard from "./system-info";

const MainPage = ({
  initialData,
  totalPages,
  systemInfo,
}: {
  initialData: ImportHistoryItem[];
  totalPages: number;
  systemInfo: SystemInfo;
}) => {
  const time = getUpcomingHour();
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg mb-4 transition-transform duration-300 hover:scale-105">
          <Activity className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Job Import Dashboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Monitor and analyze your job import operations with real-time
          insights, comprehensive analytics, and detailed tracking of all import
          activities.
        </p>
      </div>

      {/* Status Banner */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 transition-colors duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  System Status: Online
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Last sync: {time[0]}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600 dark:text-green-400">
                Next scheduled import
              </p>
              <p className="font-mono text-green-800 dark:text-green-200">
                {time[1]}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <ImportHistoryTable initialData={initialData} total={totalPages} />

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentActivity />

        <SystemInfoCard info={systemInfo} />
      </div>
    </div>
  );
};

export default MainPage;

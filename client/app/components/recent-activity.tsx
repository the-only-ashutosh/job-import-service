"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

interface Task {
  type: string;
  timestamp: Date;
}
const getColor = (type: string) => {
  switch (type) {
    case "Batch processing in progress":
      return "bg-yellow-500";
    case "Data validation completed":
      return "bg-blue-500";
    case "Bad feed encountered":
      return "bg-red-500";
    case "Batch processing completed":
      return "bg-teal-500";
    default:
      return "bg-green-500";
  }
};

const socket = io(process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "");
const formatTimeAgo = (timestamp: Date) => {
  const diffMs = Date.now() - timestamp.getTime();
  const minutes = Math.floor(diffMs / 60000);
  return minutes < 1 ? "just now" : `${minutes} min ago`;
};

const RecentActivity = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    socket.on("connect", () => {});

    socket.on("activity-update", (data: Task) => {
      data = { ...data, timestamp: new Date(data.timestamp) };
      setTasks((prev) => {
        return prev.length < 4 ? [data, ...prev] : [data, ...prev.slice(0, -1)];
      });
    });
    socket.on("disconnect", () => console.log("Disconnected from Server"));

    return () => {
      socket.off("import-completed");
    };
  }, []);
  return (
    <Card className="bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 border-white/20 dark:border-slate-800/50 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 justify-center">
          <Activity className="h-5 w-5" />
          <span>Recent Activity</span>
          <div
            className="w-3 h-3 bg-green-500 rounded-full animate-pulse"
            style={{ marginLeft: "auto" }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.length > 0 ? (
            <div className="flex items-center space-x-3 text-sm">
              <div
                className={`w-2 h-2 ${getColor(tasks[0].type)} rounded-full`}
              ></div>
              <span className="text-muted-foreground">{tasks[0].type}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {formatTimeAgo(tasks[0].timestamp)}
              </span>
            </div>
          ) : (
            <div className="h-5 bg-gray-200 space-x-3 rounded dark:bg-gray-700 animate-pulse" />
          )}
          {tasks.length > 1 ? (
            <div className="flex items-center space-x-3 text-sm">
              <div
                className={`w-2 h-2 ${getColor(tasks[1].type)} rounded-full`}
              ></div>
              <span className="text-muted-foreground">{tasks[1].type}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {formatTimeAgo(tasks[1].timestamp)}
              </span>
            </div>
          ) : (
            <div className="h-5 bg-gray-200 space-x-3 rounded dark:bg-gray-700 animate-pulse" />
          )}
          {tasks.length > 2 ? (
            <div className="flex items-center space-x-3 text-sm">
              <div
                className={`w-2 h-2 ${getColor(tasks[2].type)} rounded-full`}
              ></div>
              <span className="text-muted-foreground">{tasks[2].type}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {formatTimeAgo(tasks[2].timestamp)}
              </span>
            </div>
          ) : (
            <div className="h-5 bg-gray-200 space-x-3 rounded dark:bg-gray-700 animate-pulse" />
          )}
          {tasks.length > 3 ? (
            <div className="flex items-center space-x-3 text-sm">
              <div
                className={`w-2 h-2 ${getColor(tasks[3].type)} rounded-full`}
              ></div>
              <span className="text-muted-foreground">{tasks[3].type}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {formatTimeAgo(tasks[3].timestamp)}
              </span>
            </div>
          ) : (
            <div className="h-5 bg-gray-200 space-x-3 rounded dark:bg-gray-700 animate-pulse" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;

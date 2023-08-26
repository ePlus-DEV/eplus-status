"use client"; // Đây là một thành phần client

import React, { useEffect, useState } from "react";
import { Grid, Col, Card, Text, Metric, Title, AreaChart, Tracker } from "@tremor/react";
import { Spinner } from 'flowbite-react';
import dayjs from "dayjs"; // Import thư viện dayjs
import { SkeletonCard } from "@/components/skeleton";

type ResponseTime = {
  duration_seconds_reporting_error: number | null;
  average_response_time_milliseconds_available: number;
  duration_seconds_not_responding: number | null;
  end: string;
  start: string;
  duration_seconds_paused: number;
  duration_seconds_available: number;
  average_response_time_milliseconds_reporting_error: number | null;
};

type ApiResponse = {
  report_start: string;
  response_times: ResponseTime[];
};

const Home = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("https://api.freshping.io/v1/public-check-response-times-reports/690040/?for_hours=48&aggregate_by=hours")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const apiResponse: ApiResponse = await res.json();
        setData(apiResponse);
      })
      .catch((e) => {
        if (e instanceof Error) {
          setError(e.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const errorComponent = <div className="text-red-500">Error: {error}</div>;
  const dataFormatter = (number: number) => {
  return number + " ms";
  };
  
  return (
    <Card>
    <Title>ePlus.DEV - Performance metrics</Title>
      {loading ? (
        <SkeletonCard />
      ) : error ? (
        errorComponent
      ) : (
        <div>             
            <AreaChart
            className="h-72 mt-4"
            data={data?.response_times.map((responseTime) => ({
              date: dayjs(responseTime.start).format("HH:mm"),
              "Response Time": responseTime.average_response_time_milliseconds_available,
              // "The Pragmatic Engineer": responseTime.duration_seconds_available,
            })) as any} // Sử dụng "as any" để ghi đè kiểm tra kiểu dữ liệu
            index="date"
            categories={["Response Time"]}
            colors={["indigo", "cyan"]}
            valueFormatter={dataFormatter}
          />
        </div>
      )}
    </Card>
  );
};

export default Home;

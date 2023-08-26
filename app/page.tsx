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
  const [data1, setData1] = useState<ApiResponse | null>(null);
  const [data2, setData2] = useState<ApiResponse | null>(null);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");

  useEffect(() => {
     Promise.all([
      fetch("https://api.freshping.io/v1/public-check-response-times-reports/873076/?for_hours=24&aggregate_by=hours"),
      fetch("https://api.freshping.io/v1/public-check-response-times-reports/873076/?for_hours=720&aggregate_by=days"),
    ])
      .then(async (responses) => {
        // Chuyển đổi các phản hồi thành dữ liệu JSON
        const [response1, response2] = responses;
        if (!response1.ok) {
          throw new Error(`HTTP error! Status: ${response1.status}`);
        }
        if (!response2.ok) {
          throw new Error(`HTTP error! Status: ${response2.status}`);
        }
        const data1: ApiResponse = await response1.json();
        const data2: ApiResponse = await response2.json();

        // Cập nhật state với dữ liệu từ cả hai API
        setData1(data1);
        setData2(data2);
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        setError1(error.message);
        setError2(error.message);
      })
      .finally(() => {
        setLoading1(false);
        setLoading2(false);
      });
  }, []);


  const dataFormatter = (number: number) => {
  return number + " ms";
  };
  
  return (
    <Card>
    <Title>ePlus.DEV - Performance metrics</Title>
      {loading1 || loading2 ? (
        <SkeletonCard/>
      ) : error1 || error2 ? (
        <div className="text-red-500">Error: {error1 || error2}</div>
      ) : (
        <div>
          <AreaChart
            className="h-72 mt-4"
            data={data1?.response_times.map((responseTime) => ({
              date: dayjs(responseTime.start).format("HH:mm"),
              "Response Time": responseTime.average_response_time_milliseconds_available,
            })) as any}
            index="date"
            categories={["Response Time"]}
            colors={["indigo", "cyan"]}
            valueFormatter={dataFormatter}
              />
            <Tracker data={data2?.response_times.map((responseTime) => ({
              color: responseTime.average_response_time_milliseconds_available !== null ? "emerald" : "rose",
              tooltip: responseTime.average_response_time_milliseconds_available !== null ? dayjs(responseTime.start).format("DD/MM/YYYY") +" - Operational" : dayjs(responseTime.start).format("DD/MM/YYYY") +" - Downtime"
            })) as any} className="mt-2" />
        </div>
      )}
    </Card>
  );
};

export default Home;

"use client"; // Đây là một thành phần client

import React, { useEffect, useState } from "react";

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

const Example1UseEffect = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);

    fetch("https://api.freshping.io/v1/public-check-response-times-reports/873076/?for_hours=2256&aggregate_by=days")
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

  const loadingComponent = <div>Loading...</div>;
  const errorComponent = <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-24">
      {loading ? (
        loadingComponent
      ) : error ? (
        errorComponent
      ) : (
        <div>
          <p>Loading complete and no errors. Displaying data...</p>
          <code>{JSON.stringify(data, null, 4)}</code>
        </div>
      )}
    </div>
  );
};

export default Example1UseEffect;

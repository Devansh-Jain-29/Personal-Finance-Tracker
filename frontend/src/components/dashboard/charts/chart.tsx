"use client";

import { isLogin } from "@/utils/auth";
import { baseURL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const Chart = () => {
  const [transactionData, setTransactionData] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const { isAuthenticated, userId } = await isLogin();
      if (isAuthenticated) {
        fetchTransaction(userId);
      }
    };
    fetchUserData();
  }, []);
  const fetchTransaction = async (userId: any) => {
    try {
      const response = await axios.post(`${baseURL}entries`, {
        userId,
      });
      const transactions = response.data;

      const dailyData: Record<string, { income: number; expense: number }> = {};

      transactions.forEach((transaction: any) => {
        const { date, amount, type } = transaction;
        const day = new Date(date).toLocaleDateString("en-US", {
          weekday: "short",
        });

        if (!dailyData[day]) {
          dailyData[day] = { income: 0, expense: 0 };
        }

        if (type === "income") {
          dailyData[day].income += amount;
        } else if (type === "expense") {
          dailyData[day].expense += amount;
        }
      });

      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      const data = daysOfWeek.map((day) => ({
        name: day,
        income: dailyData[day]?.income || 0,
        expense: dailyData[day]?.expense || 0,
      }));

      setTransactionData(data);
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };
  return (
    <div className="h-450 bgSoft p-6 rounded-lg">
      <h2 className="textSoft mb-4">Weekly Recap</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={transactionData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip contentStyle={{ background: "#151c2c", border: "none" }} />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#8884d8"
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#82ca9d"
            strokeDasharray="3 4 5 2"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;

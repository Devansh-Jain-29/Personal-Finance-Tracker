"use client";

import Card from "@/components/dashboard/card/card";
import Chart from "@/components/dashboard/charts/chart";
import Transactions from "@/components/dashboard/transaction/transaction";
import styles from "@/components/dashboard/dashboard.module.css";
import { isLogin } from "@/utils/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { baseURL } from "@/utils/constants";
import axios from "axios";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState({ _id: "", firstname: "" });
  const [pageReady, setPageReady] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const calculateTotalAmount = (data: any) => {
    return data.reduce((total: number, item: any) => total + item.amount, 0);
  };

  const cards = [
    {
      id: 1,
      title: "Total Balance",
      number: balance,
      change: 12,
    },
    {
      id: 2,
      title: "Total Income",
      number: income,
      change: 12,
    },
    {
      id: 3,
      title: "Total Expense",
      number: expense,
      change: -2,
    },
  ];
  useEffect(() => {
    const authenticate = async () => {
      const { isAuthenticated, data } = await isLogin();

      if (isAuthenticated) {
        setUser(data);
        setPageReady(true);

        fetchIncomeData(data._id);
        fetchExpenseData(data._id);
      } else {
        router.push("/");
      }
    };

    authenticate();
  }, []);
  const fetchIncomeData = async (userId: any) => {
    try {
      const response = await axios.post(`${baseURL}incomes`, {
        userId,
      });
      const incomesData = response.data;

      const totalIncome = calculateTotalAmount(incomesData);

      setIncome(totalIncome);
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };
  const fetchExpenseData = async (userId: any) => {
    try {
      const response = await axios.post(`${baseURL}expenses`, {
        userId,
      });
      const expenseData = response.data;

      const totalIncome = calculateTotalAmount(expenseData);

      setExpense(totalIncome);
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };
  useEffect(() => {
    setBalance(income - expense);
  }, [income, expense]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
          {cards.map((item) => (
            <Card item={item} key={item.id} />
          ))}
        </div>
        <Transactions showAllTransactions={false} />
        <Chart />
      </div>
    </div>
  );
};

export default Dashboard;

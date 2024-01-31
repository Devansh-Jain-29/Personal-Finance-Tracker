"use client";

import { isLogin } from "@/utils/auth";
import { baseURL } from "@/utils/constants";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "../pagination/pagination";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const Transactions = ({
  showAllTransactions,
}: {
  showAllTransactions: boolean;
}) => {
  const [userId, setUserId] = useState("");
  const [transactionData, setTransactionData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const { isAuthenticated, userId } = await isLogin();
      if (isAuthenticated) {
        setUserId(userId);
        fetchTransaction(userId, currentPage, 5);
        fetchIncomeData(userId);
        fetchExpenseData(userId);
      }
    };
    fetchUserData();
  }, [currentPage]);
  const fetchIncomeData = async (userId: any) => {
    try {
      const response = await axios.post(`${baseURL}incomes`, {
        userId,
      });
      const incomesData = response.data;
      setIncomeData(incomesData);
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };
  const aggregateDataByCategory = (data: any[]) => {
    const aggregatedData: { [key: string]: number } = {};

    data.forEach((item) => {
      const categoryName = item.category?.name;
      const amount = item.amount;

      if (categoryName) {
        if (!aggregatedData[categoryName]) {
          aggregatedData[categoryName] = 0;
        }

        aggregatedData[categoryName] += amount;
      }
    });
    const aggregatedArray = Object.keys(aggregatedData).map((categoryName) => ({
      label: categoryName,
      amount: aggregatedData[categoryName],
      color: getCategoryColor(categoryName, data),
    }));

    return aggregatedArray;
  };
  const getCategoryColor = (categoryName: string, data: any[]) => {
    const category = data.find(
      (item) => item?.category?.name === categoryName
    )?.category;
    return category?.color;
  };

  const fetchExpenseData = async (userId: any) => {
    try {
      const response = await axios.post(`${baseURL}expenses`, {
        userId,
      });
      const expensesData = response.data;
      setExpenseData(expensesData);
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };

  const fetchTransaction = async (userId: any, page: number, limit: number) => {
    try {
      const response = await axios.post(`${baseURL}entries`, {
        userId,
        page,
        limit,
      });
      const data = response.data;
      setTransactionData(data);
      const totalCount = data?.length;
      setTotalCount(totalCount);
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="bgSoft p-6 rounded-lg mt-6">
        <h2 className="textSoft  mb-4">Latest Transactions</h2>
        <table className="w-full">
          <thead>
            <tr>
              <td className="px-4 py-2">Title</td>
              <td className="px-4 py-2">Category</td>
              <td className="px-4 py-2">Date</td>
              <td className="px-4 py-2">Amount</td>
            </tr>
          </thead>
          <tbody>
            {showAllTransactions
              ? transactionData?.map((transaction: any) => (
                  <tr key={transaction._id}>
                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        {transaction?.title}
                      </div>
                    </td>
                    <td className="px-4 py-2">{transaction?.category?.name}</td>
                    <td className="px-4 py-2">
                      {new Date(transaction?.date).toLocaleDateString("en-GB")}
                    </td>
                    <td
                      className={`px-4 py-2 ${
                        transaction?.type === "income"
                          ? "text-green-500"
                          : "text-red-600"
                      }`}
                    >
                      {transaction?.type === "income"
                        ? "+" + transaction?.amount
                        : "-" + transaction?.amount}
                    </td>
                  </tr>
                ))
              : transactionData.slice(0, 5).map((transaction: any) => (
                  <tr key={transaction._id}>
                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        {transaction?.title}
                      </div>
                    </td>
                    <td className="px-4 py-2">{transaction?.category?.name}</td>
                    <td className="px-4 py-2">
                      {new Date(transaction?.date).toLocaleDateString("en-GB")}
                    </td>
                    <td
                      className={`px-4 py-2 ${
                        transaction?.type === "income"
                          ? "text-green-500"
                          : "text-red-600"
                      }`}
                    >
                      {transaction?.type === "income"
                        ? "+" + transaction?.amount
                        : "-" + transaction?.amount}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {!showAllTransactions ? (
          <div className="flex justify-end">
            <Link href={`/dashboard/transaction`}>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                View All Transactions
              </button>
            </Link>
          </div>
        ) : (
          <Pagination
            count={totalCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      {showAllTransactions ? (
        <div className="bgSoft p-6 rounded-lg mt-6">
          <h2 className="textSoft mb-4">Stats</h2>

          <section className="flex ">
            {incomeData.length > 0 ? (
              <div className="w-1/2 mx-auto">
                <h3>Income</h3>

                <Doughnut
                  data={{
                    labels: aggregateDataByCategory(incomeData).map(
                      (income: any) => income?.label
                    ),
                    datasets: [
                      {
                        label: "Amount",
                        data: aggregateDataByCategory(incomeData).map(
                          (income: any) => income?.amount
                        ),
                        backgroundColor: aggregateDataByCategory(
                          incomeData
                        ).map((income: any) => income?.color),
                        borderColor: ["#18181b"],
                        borderWidth: 5,
                      },
                    ],
                  }}
                />
              </div>
            ) : (
              <></>
            )}

            {expenseData.length > 0 ? (
              <div className="w-1/2 mx-auto">
                <h3>Expense</h3>

                <Doughnut
                  data={{
                    labels: aggregateDataByCategory(expenseData).map(
                      (expense: any) => expense?.label
                    ),
                    datasets: [
                      {
                        label: "Amount",
                        data: aggregateDataByCategory(expenseData).map(
                          (expense: any) => expense?.amount
                        ),
                        backgroundColor: aggregateDataByCategory(
                          expenseData
                        ).map((expense: any) => expense?.color),
                        borderColor: ["#18181b"],
                        borderWidth: 5,
                      },
                    ],
                  }}
                />
              </div>
            ) : (
              <></>
            )}
          </section>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Transactions;

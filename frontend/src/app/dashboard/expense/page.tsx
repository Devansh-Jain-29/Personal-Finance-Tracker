"use client";

import Modal from "@/components/modal";
import Search from "../../../components/dashboard/search/search";
import { isLogin } from "@/utils/auth";
import { baseURL } from "@/utils/constants";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdDateRange } from "react-icons/md";

const ExpensePage = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState<any[]>([]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [userId, setUserId] = useState("");
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("");
  const [categoryType, setCategoryType] = useState("expense");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { isAuthenticated, userId } = await isLogin();
      if (isAuthenticated) {
        setUserId(userId);
        fetchExpenseData(userId);
        fetchExpenseCategory("expense");
      }
    };
    fetchUserData();
  }, []);

  const addCategoryHandler = async () => {
    try {
      const payload = {
        name: categoryName,
        color: categoryColor,
        type: categoryType,
      };
      const response = await axios.post(`${baseURL}add-category`, payload);
      const newCategory = response.data;
      setCategory([...category, newCategory]);
      toast.success(<div>Category Added Successfully</div>);
      setShowAddExpense(false);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
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

  const fetchExpenseCategory = async (type: any) => {
    try {
      const response = await axios.post(`${baseURL}category-type`, {
        type,
      });
      const expensesData = response.data;
      setCategory(expensesData);
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };

  const addExpenseHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      amount,
      category: selectedCategory,
      description,
      date,
      user: userId,
    };

    axios
      .post(`${baseURL}add-expense`, payload)
      .then((res) => {
        toast.success(<div>Expense Added Successfully</div>);
        setShowAddExpenseModal(false);
        fetchExpenseData(userId);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };
  const deleteExpenseData = async (id: any) => {
    try {
      await axios.delete(`${baseURL + "expense/" + id}`);
      toast.success(<div>Expense Deleted Successfully</div>, {
        autoClose: 3000,
      });
      fetchExpenseData(userId);
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };
  return (
    <div className={"bgSoft p-6 rounded-lg mt-6 "}>
      <div className="flex justify-between items-center mb-4">
        <Search placeholder="Search for a user..." />
        <button
          onClick={() => {
            setShowAddExpenseModal(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Add New
        </button>
      </div>
      <Modal show={showAddExpenseModal} onClose={setShowAddExpenseModal}>
        <form onSubmit={addExpenseHandler} className="flex flex-col gap-4">
          <div className="input-group">
            <label htmlFor="title">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              name="title"
              placeholder="Enter title"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="description">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              name="description"
              type="text"
              placeholder="Enter income description"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="date">Date</label>
            <DatePicker
              selected={date}
              onChange={(date: Date) => setDate(date)}
              dateFormat="MM-dd-yyyy"
              placeholderText="Enter income Date"
              className="w-full px-4 py-2 bg-slate-600 rounded-xl"
              icon={<MdDateRange />}
              showIcon={true}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="amount">Amount</label>
            <input
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              type="number"
              name="amount"
              placeholder="Enter income amount"
              required
            />
          </div>

          {amount > 0 && (
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-center justify-between">
                <h3 className=" capitalize">Select expense category</h3>
                <button
                  onClick={(e) => {
                    e.preventDefault();

                    setShowAddExpense(true);
                  }}
                  className="text-white"
                >
                  + New Category
                </button>
              </div>

              {showAddExpense && (
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="Enter Title"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                  <label>Pick Color</label>
                  <input
                    type="color"
                    className="w-24 h-10"
                    value={categoryColor}
                    onChange={(e) => setCategoryColor(e.target.value)}
                  />
                  <button
                    onClick={addCategoryHandler}
                    className="btn btn-primary-outline"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowAddExpense(false);
                    }}
                    className="btn btn-danger"
                  >
                    Cancel
                  </button>{" "}
                </div>
              )}

              {category.map((category: any) => {
                return (
                  <button
                    key={category.id}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCategory(category?._id);
                    }}
                  >
                    <div
                      style={{
                        boxShadow:
                          category._id === selectedCategory
                            ? "1px 1px 4px"
                            : "none",
                      }}
                      className="flex items-center justify-between px-4 py-4 bg-slate-700 rounded-3xl"
                    >
                      <div className="flex items-center gap-2">
                        {/* Colored circle */}
                        <div
                          className="w-[25px] h-[25px] rounded-full"
                          style={{
                            backgroundColor: category.color,
                          }}
                        />
                        <h4 className="capitalize">{category.name}</h4>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </Modal>
      <table className="w-full">
        <thead>
          <tr>
            <td>Title</td>
            <td>Category</td>
            <td>Description</td>
            <td>Date</td>
            <td>Amount</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {expenseData.map((user: any) => (
            <tr key={user._id}>
              <td>
                <div className="w-6 h-6 rounded-full"></div>
                {user?.title}
              </td>
              <td>
                <div className="w-6 h-6 rounded-full"></div>
                {user?.category?.name}
              </td>
              <td>
                <div className="w-6 h-6 rounded-full"></div>
                {user?.description}
              </td>

              <td>
                <div className="w-6 h-6 rounded-full"></div>
                {new Date(user?.date).toLocaleDateString("en-GB")}
              </td>

              <td>
                <div className="w-6 h-6 rounded-full"></div>
                {user?.amount}
              </td>
              <td>
                <div className="w-6 h-6 rounded-full"></div>

                <div className="flex items-center gap-2">
                  <button
                    className={"px-1.5 py-1.5 btn-danger"}
                    onClick={() => deleteExpenseData(user?._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensePage;

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

const IncomePage = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState<any[]>([]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [userId, setUserId] = useState("");
  const [incomeData, setIncomeData] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("");
  const [categoryType, setCategoryType] = useState("income");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { isAuthenticated, userId } = await isLogin();
      if (isAuthenticated) {
        setUserId(userId);
        fetchIncomeData(userId);
        fetchIncomeCategory("income");
      }
    };
    fetchUserData();
  }, []);
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
      setShowAddIncome(false);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const fetchIncomeCategory = async (type: any) => {
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

  const addIncomeHandler = (e: React.FormEvent) => {
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
      .post(`${baseURL}add-income`, payload)
      .then((res) => {
        toast.success(<div>Income Added Successfully</div>);
        setShowAddIncomeModal(false);
        fetchIncomeData(userId);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };

  const deleteIncomeData = async (id: any) => {
    try {
      await axios.delete(`${baseURL + "income/" + id}`);

      toast.success(<div>Income Deleted Successfully</div>, {
        autoClose: 3000,
      });
      fetchIncomeData(userId);
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };
  return (
    <div className={"bgSoft p-6 rounded-lg mt-6"}>
      <div className="flex justify-between items-center mb-4">
        <Search placeholder="Search for a income entry..." />
        <button
          onClick={() => {
            setShowAddIncomeModal(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Add New
        </button>
      </div>
      <Modal show={showAddIncomeModal} onClose={setShowAddIncomeModal}>
        <form onSubmit={addIncomeHandler} className="flex flex-col gap-4">
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
                <h3 className=" capitalize">Select income category</h3>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAddIncome(true);
                  }}
                  className="text-white"
                >
                  + New Category
                </button>
              </div>

              {showAddIncome && (
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
                      setShowAddIncome(false);
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
                            backgroundColor: category?.color,
                          }}
                        />
                        <h4 className="capitalize">{category?.name}</h4>
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
          {incomeData.map((user: any) => (
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
                    onClick={() => deleteIncomeData(user?._id)}
                    className={"px-1.5 py-1.5 btn-danger"}
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

export default IncomePage;

"use client";
import MenuLink from "./menuLink/menuLink";
import {
  MdDashboard,
  MdLogout,
  MdCurrencyRupee,
  MdWallet,
  MdList,
} from "react-icons/md";
import React, { useEffect, useState } from "react";

import { isLogin, logOut } from "../../../utils/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
const menuItems = [
  {
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "Income",
        path: "/dashboard/income",
        icon: <MdCurrencyRupee />,
      },
      {
        title: "Expense",
        path: "/dashboard/expense",
        icon: <MdWallet />,
      },
      {
        title: "Transaction",
        path: "/dashboard/transaction",
        icon: <MdList />,
      },
    ],
  },
];

const Sidebar = () => {
  const router = useRouter();
  const [user, setUser] = useState({ firstname: "", lastname: "" });
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      const { isAuthenticated, data } = await isLogin();

      if (isAuthenticated) {
        setUser(data);
        setPageReady(true);
      }
    };

    authenticate();
  }, []);

  const handleLogOut = () => {
    logOut();
    toast.success("Logout Successfully");
    router.push("/");
  };
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <div className="sticky top-4">
      <div className="flex items-center gap-20 mb-5">
        <div className="flex flex-col">
          <span
            className={`text-base text-center cursor-pointer font-bold  border-b border-gray-100 pb-4 `}
          >
            {" "}
            Hello!{" "}
            {capitalize(user?.firstname) + " " + capitalize(user?.lastname)}
          </span>
        </div>
      </div>
      <ul className="list-none">
        {menuItems.map((cat) => (
          <li key={`menu-${cat}`}>
            {cat.list.map((item) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          handleLogOut();
        }}
        className="p-5 top-170 flex items-center gap-3 cursor-pointer border-none rounded-lg w-full bg-none text-white hover:bg-gray-700"
      >
        <MdLogout />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;

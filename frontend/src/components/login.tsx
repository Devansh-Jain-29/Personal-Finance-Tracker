"use client";
import { baseURL } from "@/utils/constants";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { FaFacebookF, FaGoogle, FaInstagram } from "react-icons/fa6";
import { toast } from "react-toastify";
import { isLogin, setAuthentication } from "../utils/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pageReady, setPageReady] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const authenticate = async () => {
      const { isAuthenticated } = await isLogin();

      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        setPageReady(true);
      }
    };
    authenticate();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      email,
      password,
    };

    axios
      .post(`${baseURL}login`, payload)
      .then((res) => {
        setAuthentication(res.data.token);
        toast.success(<div>Login Successfully</div>);
        router.push("/dashboard");
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          toast.error("Invalid credentials");
        } else {
          toast.error(err?.response?.data?.message || "An error occurred");
        }
      });
  };
  return (
    <>
      <div className="grid grid-cols-[1fr,30%]">
        <div className="h-screen grid place-items-center">
          <div className="text-center">
            <h1 className="text-accent font-bold text-4xl">Login </h1>
            <div className="flex items-center gap-4 pt-8 w-fit mx-auto">
              <div className="icon__wrapper">
                <FaFacebookF />
              </div>
              <div className="icon__wrapper">
                <FaGoogle />
              </div>
              <div className="icon__wrapper">
                <FaInstagram />
              </div>
            </div>

            <p className="pt-8 text-[13px] text-gray-400">
              Or use your email account for login.
            </p>

            <form
              className="flex w-[300px] mx-auto flex-col pt-2 gap-2"
              onSubmit={handleSubmit}
            >
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input__style"
                type="email"
                placeholder="Email"
                required
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input__style"
                type="password"
                placeholder="Password"
                required
              />
              <button className="bg-zinc-400 uppercase hover:bg-zinc-300  px-4 py-2 w-[100%] rounded-full border-2 border-black mt-8">
                Login
              </button>
            </form>
          </div>
        </div>
        <div className="bg-zinc-300 h-screen grid place-items-center">
          <div className="text-center w-full space-y-8 text-gray-800">
            <h2 className="font-bold text-4xl">Hello Friends!</h2>
            <div className=" w-fit mx-auto">
              <p>To keep connected with us please</p>
              <p>please login with your personal info</p>

              <Link href="/signup">
                <button className="bg-zinc-400 hover:bg-zinc-300 uppercase px-4 py-2 w-[100%] rounded-full border-2 border-black mt-8">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

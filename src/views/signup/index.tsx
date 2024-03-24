import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { API_ENDPOINT } from "../../config/constants";
import AppBar from "../../components/appbar";
import { useNavigate } from "react-router-dom";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const [_errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const userData = await response.json();
      localStorage.setItem("authToken", userData.auth_token);
      localStorage.setItem("userData", JSON.stringify(userData.user));
      navigate("/");

      if (!response.ok) {
        const responseData = await response.json();
        if (responseData.errors && responseData.errors.length > 0) {
          setErrorMessage(responseData.errors[0]);
        } else {
          throw new Error("Failed to submit form");
        }
      } else {
        console.log("Form submitted successfully");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      if (error.message.includes("Email has already been taken")) {
        setErrorMessage("Email has already been taken");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      <AppBar></AppBar>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-800">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300">
              Sign up
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  id="name"
                  {...register("name", { required: true })}
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:bg-gray-400 dark:border-black dark:text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Name"
                />
                {errors.userName && (
                  <span className="text-red-500">Name is required</span>
                )}
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  {...register("email", { required: true })}
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:bg-gray-400 dark:border-black dark:text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
                {errors.userEmail && (
                  <span className="text-red-500">Email is required</span>
                )}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  {...register("password", { required: true })}
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:bg-gray-400 dark:border-black dark:text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
                {errors.userPassword && (
                  <span className="text-red-500">Password is required</span>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupPage;

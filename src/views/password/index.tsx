import React, { useState } from "react";
import AppBar from "../../components/appbar";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { API_ENDPOINT } from "../../config/constants";

const PasswordPage: React.FC = () => {
  const auth = localStorage.getItem("authToken");

  const navigate = useNavigate();
  const [_errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/user/password`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const responseData = await response.json();
        if (responseData.errors && responseData.errors.length > 0) {
          setErrorMessage(responseData.errors[0]);
        } else {
          throw new Error("Failed to submit form");
        }
      } else {
        console.log("Form submitted successfully");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      if (error.message.includes("Invalid current password")) {
        setErrorMessage("Invalid current password");
      } else {
        setErrorMessage("Invalid Password");
      }
    }
  };
  return (
    <>
      <AppBar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-800">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              Change Password
            </h2>
          </div>
          {_errorMessage && (
            <div className="text-red-500 text-center mb-4">{_errorMessage}</div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="current_password" className="sr-only">
                  Current Password
                </label>
                <input
                  id="current_password"
                  {...register("current_password", { required: true })}
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:bg-gray-400 dark:border-black dark:text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Current Password"
                />
                {errors.current_password && (
                  <span className="text-red-500">
                    Current password is required
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="new_password" className="sr-only">
                  New Password
                </label>
                <input
                  id="new_password"
                  {...register("new_password", { required: true })}
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:bg-gray-400 dark:border-black dark:text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="New Password"
                />
                {errors.password && (
                  <span className="text-red-500">Password is required</span>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Change
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PasswordPage;

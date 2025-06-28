"use client";

import { SignupFormType } from "@/types";
import { Loader, MailIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const SignupPageClient = () => {
  const [formData, setFormData] = useState<SignupFormType>({
    username: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.username.trim()) errors.username = "Username is required.";
    else if (formData.username.trim().length < 2)
      errors.username = "Username must be at least 2 characters.";
    if (!formData.email) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Please enter a valid email.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      const data = await res.json();
      console.log("Data", data);
      const optId = data.id;
      router.push(
        `/otp?otpId=${optId}&username=${formData.username}&email=${formData.email}`
      );
    } else {
      const data = await res.json();
      toast.error(data.error);
    }
    setIsSubmitting(false);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="username"
          className="mb-2 text-sm text-gray-700 font-medium"
        >
          Username
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.username}
            name="username"
            id="username"
            onChange={handleInputChange}
            className={`w-full pl-10 pr-3 py-3 border ${
              formErrors.username ? "border-red-300" : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 `}
          />
        </div>
        {formErrors.username && (
          <p className="mt-1 text-sm text-red-500">{formErrors.username}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-2 text-sm text-gray-700 font-medium"
        >
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MailIcon className="h-5 w-4 text-gray-400" />
          </div>
          <input
            type="email"
            value={formData.email}
            name="email"
            id="email"
            onChange={handleInputChange}
            className={`w-full pl-10 pr-3 py-3 border ${
              formErrors.email ? "border-red-300" : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 `}
          />
        </div>
        {formErrors.email && (
          <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full flex justify-center px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader className="h-5 w-5 animate-spin mr-1" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
      <div className="text-center">
        <span className="text-gray-600">Already have an account?</span>
        <Link
          href={"/login"}
          className="font-medium text-pink-500 hover:text-pink-400 transition-colors"
        >
          Login
        </Link>
      </div>
    </form>
  );
};

export default SignupPageClient;

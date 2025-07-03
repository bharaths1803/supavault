"use client";

import { LoginFormType, SignupFormType, UserType } from "@/types";
import { Loader, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface OptPageClientProps {
  username: string;
  email: string;
  otpId: string;
  type: string;
}

const OptPageClient = ({
  username,
  email,
  otpId,
  type,
}: OptPageClientProps) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleInputChange = (idx: number, digit: string) => {
    if (digit && !/^\d$/.test(digit)) return;

    if (digit != "") {
      const newOtp = [...otp];
      newOtp[idx] = digit;
      setOtp(newOtp);
      if (idx < 5) inputRefs.current[idx + 1]?.focus();
    }
  };

  const handlePressBackspace = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[idx] = "";
      setOtp(newOtp);
      if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const otpCode = otp.join("");
    const data = {
      otpCode,
      username,
      otpId,
      email,
    };
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) toast.success("Verified OTP successfully!");
      router.push("/dashboard");
    } else {
      const data = await res.json();
      toast.error(data.error);
    }
    setIsSubmitting(false);
  };

  const handleResend = async () => {
    if (type === "signup") {
      const formData: SignupFormType = {
        username,
        email,
      };
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        const optId = data.id;
        toast.success("Sent email!");
        router.push(
          `/otp?otpId=${optId}&username=${formData.username}&email=${formData.email}&type=${type}`
        );
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } else if (type === "login") {
      const formData: LoginFormType = {
        email,
      };
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        const optId = data.id;
        const username = data.username;
        toast.success("Sent email!");
        router.push(
          `/otp?otpId=${optId}&username=${username}&email=${formData.email}&type=${type}`
        );
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="h-16 w-16 mx-auto mb-4 rounded-full flex justify-center items-center bg-gradient-to-r from-pink-100 to-rose-100">
          <Mail className="w-8 h-8 text-pink-600" />
        </div>
        <p className="text-gray-600 mb-2">
          We've sent a 6-digit verification code to
        </p>
        <p className="text-gray-900 font-medium mb-2">{email}</p>
        <p className="text-gray-600 mb-6 text-xs">
          This otp will be valid for 10 minutes
        </p>
      </div>
      <div className="mb-6 flex justify-center space-x-3">
        {otp.map((digit, idx) => (
          <input
            type="text"
            key={idx}
            inputMode="numeric"
            value={digit}
            pattern="[0-9]*"
            maxLength={1}
            disabled={isSubmitting}
            className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg disabled:cursor-not-allowed disabled:opacity-50 focus:ring-2 focus:border-pink-600 focus:ring-pink-600"
            onChange={(e) => handleInputChange(idx, e.target.value)}
            onKeyDown={(e) => handlePressBackspace(idx, e)}
            ref={(ele) => {
              inputRefs.current[idx] = ele;
            }}
          />
        ))}
      </div>
      <button
        className="w-full flex justify-center px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500"
        disabled={isSubmitting || otp.some((digit) => digit === "")}
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-1" />
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </button>
      <div className="text-center">
        <span className="text-gray-600">Didn't receive the code?</span>
        <button
          className="font-medium text-pink-500 hover:text-pink-400 transition-colors"
          onClick={handleResend}
        >
          Resend
        </button>
      </div>
    </div>
  );
};

export default OptPageClient;

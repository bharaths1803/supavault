"use client";

import { AuthContext } from "@/app/_components/AuthContext";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

const Sidebar = () => {
  const [loggingout, setLoggingout] = useState<boolean>(false);
  const { setUser, user } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingout(true);
    const res = await fetch("/api/logout", {
      method: "POST",
    });
    if (res.ok) {
      setUser(null);
      router.push("/login");
    } else {
      const data = await res.json();
      toast.error(data.error);
    }
    setLoggingout(false);
  };
  return (
    <div>
      Sidebar
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Sidebar;

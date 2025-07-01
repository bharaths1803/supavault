"use client";

import { UserType } from "@/types";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  user: null as null | UserType,
  setUser: (_: any) => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<null | UserType>(null);
  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .catch(() => setUser(null));

    console.log("USer", user);
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

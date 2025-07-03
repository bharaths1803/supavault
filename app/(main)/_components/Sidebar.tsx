"use client";

import { getFiles } from "@/actions/file.actions";
import { AuthContext } from "@/app/_components/AuthContext";
import { FileCategory, SortCriteria, SortOrder } from "@/types";
import {
  FolderOpen,
  LogOut,
  Image,
  Video,
  FileText,
  Archive,
  Loader,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import toast from "react-hot-toast";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  activeCategory: FileCategory;
  setActiveCategory: Dispatch<SetStateAction<FileCategory>>;
  userFiles: Awaited<ReturnType<typeof getFiles>>;
}

const Sidebar = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeCategory,
  setActiveCategory,
  userFiles,
}: SidebarProps) => {
  const [loggingout, setLoggingout] = useState<boolean>(false);
  const { setUser, user } = useContext(AuthContext);
  const router = useRouter();

  const fileCategories = [
    {
      id: "all" as FileCategory,
      iconColor: "text-red-600",
      label: "All Files",
      icon: FolderOpen,
      count: userFiles.files.length,
    },
    {
      id: "images" as FileCategory,
      iconColor: "text-blue-600",
      label: "Images",
      icon: Image,
      count: userFiles.files.filter((file) => file.category === "images")
        .length,
    },
    {
      id: "media" as FileCategory,
      iconColor: "text-purple-600",
      label: "Media",
      icon: Video,
      count: userFiles.files.filter((file) => file.category === "media").length,
    },
    {
      id: "documents" as FileCategory,
      iconColor: "text-green-600",
      label: "Documents",
      icon: FileText,
      count: userFiles.files.filter((file) => file.category === "documents")
        .length,
    },
    {
      id: "others" as FileCategory,
      iconColor: "text-orange-600",
      label: "Others",
      icon: Archive,
      count: userFiles.files.filter((file) => file.category === "others")
        .length,
    },
  ];

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
    <>
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-pink-400 opacity-50 z-20 fixed inset-0" />
      )}
      <button
        className="lg:hidden fixed bottom-4 right-5 p-3 rounded-full shadow-lg z-30 text-white bg-pink-600"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              isMobileMenuOpen
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>

      <aside
        className={`w-64 h-full fixed left-0 flex flex-col z-20 shadow-lg bg-white lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="flex justify-center items-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 h-10 w-10">
              <FolderOpen className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg text-gray-900 font-semibold">SupaVault</h1>
              <p className="text-sm text-gray-500">Cloud Storage</p>
            </div>
          </div>
        </div>

        {/* Sidebar Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {fileCategories.map((category, idx) => {
              const Icon = category.icon;
              const isActive = category.id === activeCategory;
              return (
                <li key={category.id}>
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full px-4 py-2 rounded-lg flex items-center justify-between transition-all duration-200 group ${isActive ? "border-l-4 border-pink-700 shadow-sm bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`w-5 h-5 text-gray-600 transition-colors ${isActive ? "text-pink-600" : `${category.iconColor} group-hover:text-gray-700`}`}
                      />
                      <span className="font-medium">{category.label}</span>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-sm font-medium transition-colors ${isActive ? "bg-pink-100 text-pink-700" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"}`}
                    >
                      {category.count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile & Logout */}
        <div className="border-t border-gray-200 p-4">
          <div className="mb-4 flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full flex justify-center items-center bg-gradient-to-r from-pink-500 to-rose-500">
              <span className="text-sm font-medium text-white">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-900 font-medium">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            className="w-full px-4 py-2 flex items-center space-x-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-500"
            onClick={handleLogout}
          >
            {loggingout ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span className="text-sm">
              {loggingout ? "Logging out" : "Logout"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

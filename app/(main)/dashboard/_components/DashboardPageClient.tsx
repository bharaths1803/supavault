"use client";

import { useState } from "react";
import Sidebar from "../../_components/Sidebar";
import { Image, Video, FolderOpen, FileText, Archive } from "lucide-react";
import { FileCategory } from "@/types";
import FileUpload from "./FileUpload";

const DashboardPageClient = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<FileCategory>("all");

  return (
    <div className="flex h-screen">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setActiveCategory={setActiveCategory}
        activeCategory={activeCategory}
      />
      <div className="w-full p-5 lg:ml-64">
        <FileUpload />
      </div>
    </div>
  );
};

export default DashboardPageClient;

"use client";

import { useContext, useMemo, useState } from "react";
import Sidebar from "../../_components/Sidebar";
import { FileCategory, SortCriteria, SortOrder } from "@/types";
import FileUpload from "./FileUpload";
import { getFiles } from "@/actions/file.actions";
import FileGrid from "./FileGrid";
import Header from "./Header";
import { AuthContext } from "@/app/_components/AuthContext";

type GetFilesType = Awaited<ReturnType<typeof getFiles>>;

interface DashboardPageClientProps {
  userFiles: GetFilesType;
}

const DashboardPageClient = ({ userFiles }: DashboardPageClientProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<FileCategory>("all");
  const { user } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortingCriteria, setSortingCriteria] = useState<SortCriteria>("date");
  const [sortingOrder, setSortingOrder] = useState<SortOrder>("descending");

  const handleSorting = (
    criteria: SortCriteria,
    order: SortOrder,
    filteredFiles: typeof userFiles.files
  ) => {
    const sorted = [...filteredFiles];

    sorted.sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";

      switch (criteria) {
        case "name":
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;

        case "size":
          valA = a.size;
          valB = b.size;
          break;

        case "category":
          valA = a.category.toLowerCase();
          valB = b.category.toLowerCase();
          break;

        case "date":
          valA = new Date(a.createdAt).getTime();
          valB = new Date(b.createdAt).getTime();
          break;
      }

      if (valA < valB) return order === "ascending" ? -1 : 1;
      if (valA > valB) return order === "ascending" ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const userFilesFiltered = useMemo(() => {
    let filteredFiles = userFiles.files;
    if (searchTerm && searchTerm.length > 0) {
      const searchTermLower = searchTerm.toLowerCase();
      filteredFiles = filteredFiles.filter((f) =>
        f.name.toLowerCase().includes(searchTermLower)
      );
    }

    if (sortingCriteria) {
      filteredFiles = handleSorting(
        sortingCriteria,
        sortingOrder,
        filteredFiles
      );
    }

    if (activeCategory) {
      filteredFiles = filteredFiles.filter(
        (f) => activeCategory === "all" || f.category === activeCategory
      );
    }

    const result: GetFilesType = {
      files: filteredFiles,
      totalSize: userFiles.totalSize,
    };

    return result;
  }, [searchTerm, userFiles, sortingCriteria, sortingOrder, activeCategory]);

  return (
    <div className="flex h-screen">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setActiveCategory={setActiveCategory}
        activeCategory={activeCategory}
        userFiles={userFiles}
      />
      <div className="w-full p-5 lg:ml-64">
        <Header
          userFilesFiltered={userFilesFiltered}
          activeCategory={activeCategory}
          searchTerm={searchTerm}
          sortingCriteria={sortingCriteria}
          sortingOrder={sortingOrder}
          setSortingOrder={setSortingOrder}
          setSortingCriteria={setSortingCriteria}
          setSearchTerm={setSearchTerm}
        />
        <FileUpload totalSize={userFilesFiltered.totalSize} />
        <FileGrid userFiles={userFilesFiltered} />
      </div>
    </div>
  );
};

export default DashboardPageClient;

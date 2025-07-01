"use client";

import { getFiles } from "@/actions/file.actions";
import { FileCategory, SortCriteria, SortOrder } from "@/types";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface HeaderProps {
  userFilesFiltered: Awaited<ReturnType<typeof getFiles>>;
  activeCategory: FileCategory;
  sortingOrder: SortOrder;
  sortingCriteria: SortCriteria;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setSortingCriteria: Dispatch<SetStateAction<SortCriteria>>;
  setSortingOrder: Dispatch<SetStateAction<SortOrder>>;
}

const Header = ({
  userFilesFiltered,
  activeCategory,
  setSortingOrder,
  setSortingCriteria,
  setSearchTerm,
  searchTerm,
  sortingCriteria,
  sortingOrder,
}: HeaderProps) => {
  const getCategoryTitle = (selectedCategory: FileCategory): string => {
    const categoryMap = {
      all: "All Files",
      images: "Images",
      media: "Media",
      documents: "Documents",
      others: "Others",
    };
    return categoryMap[selectedCategory];
  };

  const sortOptions: { value: SortCriteria; label: string }[] = [
    { value: "name", label: "Name" },
    { value: "date", label: "Date" },
    { value: "size", label: "Size" },
    { value: "category", label: "Category" },
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const storage = 2 * 1024 * 1024 * 1024;
  const percentageUsed = (userFilesFiltered.totalSize / storage) * 100;

  return (
    <div className="bg-white border-b border-pink-100 shadow-sm p-6">
      <div className="flex flex-col space-y-0 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
            {getCategoryTitle(activeCategory)}
          </h1>
          <p className="text-gray-600 mt-1">Manage and organise your files</p>
        </div>

        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 sm:items-center">
          <div className="relative flex-1 sm:w-80 border rounded-lg border-pink-200">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-pink-400" />
            </div>
            <input
              type="text"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-pink-50/50 placeholder-pink-400"
              placeholder="Search files..."
            />
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={sortingCriteria}
              onChange={(e) =>
                setSortingCriteria(e.target.value as SortCriteria)
              }
              className="px-3 py-2 rounded-lg text-gray-700 border border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm bg-pink-50/50"
            >
              {sortOptions.map((sortOption, idx) => (
                <option value={sortOption.value} key={sortOption.value}>
                  {sortOption.label}
                </option>
              ))}
            </select>
            <button
              className="p-2 border border-pink-200 rounded-lg bg-pink-50/50 hover:bg-pink-50 transition-colors focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              onClick={() =>
                setSortingOrder((prev) =>
                  prev === "ascending" ? "descending" : "ascending"
                )
              }
            >
              {sortingOrder === "ascending" ? (
                <SortAsc className="text-pink-600 h-4 w-4" />
              ) : (
                <SortDesc className="text-pink-600 h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg border border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
        <div className="mb-2 text-gray-70 flex justify-between items-center">
          <span className="font-medium">Storage Used</span>
          <span>
            {formatFileSize(userFilesFiltered.totalSize)} /{" "}
            {formatFileSize(storage)}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-white shadow-inner">
          <div
            className={`h-2 rounded-full transition-colors duration-200 ${percentageUsed > 90 ? "bg-gradient-to-r from-red-400 to-red-500" : percentageUsed > 70 ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-gradient-to-r from-pink-400 to-rose-500"}`}
            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {percentageUsed > 90
            ? "Storage almost full"
            : percentageUsed > 70
              ? "Storage getting full"
              : "Plent of storage available"}
        </p>
      </div>
    </div>
  );
};

export default Header;

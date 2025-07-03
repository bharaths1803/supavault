"use client";

import { FileType, UserType } from "@/types";
import {
  Calendar,
  Check,
  Clipboard,
  Edit3,
  Eye,
  FileTypeIcon,
  HardDriveIcon,
  Loader,
  Loader2,
  Search,
  Share2,
  Trash2,
  UserIcon,
  UserPlusIcon,
  X,
} from "lucide-react";
import { use, useContext, useMemo, useState } from "react";
import DeleteModal from "./DeleteModal";
import toast from "react-hot-toast";
import { renameFile, shareFiles } from "@/actions/file.actions";
import { searchUsers } from "@/actions/user.action";
import { AuthContext } from "@/app/_components/AuthContext";

interface FileDetailsModalProps {
  file: FileType | null;
  handleCloseFileDetailsModal: () => void;
  sharedUsers: UserType[];
}

const FileDetailsModal = ({
  file,
  handleCloseFileDetailsModal,
  sharedUsers,
}: FileDetailsModalProps) => {
  if (!file) return null;

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteingFileName, setDeleteingFileName] = useState<string>("");
  const [deleteingfileId, setDeleteingFileId] = useState<string>("");
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  const [isRemaming, setIsRenaming] = useState<boolean>(false);
  const [isSubmittingRename, setIsSubmittingRename] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [searchedUsers, setSearchedUsers] = useState<UserType[]>([]);
  const [selectedSearchedUsers, setSelectedSearchedUsers] =
    useState<UserType[]>(sharedUsers);
  const { user } = useContext(AuthContext);

  const handleCloseDeleteModal = () => {
    setDeleteingFileName("");
    setShowDeleteModal(false);
  };

  const handleOpenDeleteModal = (fileName: string, fileId: string) => {
    setDeleteingFileName(fileName);
    setDeleteingFileId(fileId);
    setShowDeleteModal(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFilePreview = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(file.path);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    } catch {
      toast.error("Failed to copy!");
    }
  };

  const handleRename = async () => {
    if (!newName) {
      toast.error("Enter a valid name!");
      return;
    }
    try {
      setIsSubmittingRename(true);
      const res = await renameFile(file.id, newName);
      if (res.success) {
        toast.success("Renamed file successfully!");
        setIsRenaming(false);
        handleCloseFileDetailsModal();
      } else throw new Error(res.error as string);
    } catch (error) {
      toast.error("Renaming failed!");
    } finally {
      setIsSubmittingRename(false);
    }
  };

  const handleSearchTerm = async (query: string) => {
    const searchedUsersResult = await searchUsers(query);
    if (searchedUsersResult) setSearchedUsers(searchedUsersResult);
  };

  const isPartOfSelectedUsers = (user: UserType) => {
    return selectedSearchedUsers.some((u) => user.id === u.id);
  };

  const handleToggleSelectedUser = (user: UserType) => {
    if (isPartOfSelectedUsers(user))
      setSelectedSearchedUsers((prev) => prev.filter((u) => u.id !== user.id));
    else setSelectedSearchedUsers((prev) => [...prev, user]);
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      const res = await shareFiles(selectedSearchedUsers, file.id);
      if (res.success) {
        toast.success("Shared successfully!");
        handleCloseFileDetailsModal();
      } else throw new Error("");
    } catch (error) {
      toast.error("Sharing failed!");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <div className="z-40 fixed h-full inset-0 bg-black/50">
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl max-h-[90vh] max-w-2xl w-full overflow-hidden">
            <div className=" border-b border-pink-200 flex justify-between items-center p-6 bg-gradient-to-r from-pink-200 to-rose-200">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">
                File Details
              </h2>
              <button
                className="p-2 rounded-full hover:bg-pink-100 transition-colors"
                onClick={handleCloseFileDetailsModal}
              >
                <X className="w-5 h-5 text-pink-500" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-80px)] ">
              <div className="p-6 border-b border-pink-200">
                <div className="flex space-x-6">
                  <div>
                    <div className="h-32 w-32 rounded-lg border-2 border-pink-200 bg-gradient-to-r from-pink-200 to-rose-200 flex justify-center items-center">
                      <FileTypeIcon className="w-16 h-32 text-pink-400" />
                    </div>
                  </div>
                  <div>
                    {isRemaming ? (
                      <div className="mb-4">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg border-pink-300 hover:border-pink-500 hover:ring-pink-500"
                          autoFocus
                        />
                        <div className="flex space-x-2 mt-2">
                          <button
                            className="px-3 py-1 rounded text-sm border border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 transition-colors"
                            onClick={() => {
                              setIsRenaming(false);
                              setNewName("");
                            }}
                          >
                            <span className="text-pink-700 font-medium">
                              Cancel
                            </span>
                          </button>
                          <button
                            className="px-3 py-1 rounded text-sm border border-pink-200 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-colors"
                            onClick={handleRename}
                          >
                            {isSubmittingRename ? (
                              <span className="text-white font-medium">
                                Renaming...
                              </span>
                            ) : (
                              <span className="text-white font-medium">
                                Rename
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 break-words">
                        {file.name}
                      </h3>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-gray-600 flex items-center space-x-2 text-sm">
                      <HardDriveIcon className="h-4 w-4 text-pink-500" />
                      <span>{formatFileSize(file.size)}</span>
                    </div>
                    <div className="text-gray-600 flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-pink-500" />
                      <span>{new Date(file.createdAt).toDateString()}</span>
                    </div>{" "}
                    <div className="text-gray-600 flex items-center space-x-2 text-sm">
                      <FileTypeIcon className="h-4 w-4 text-pink-500" />
                      <span>{file.mimeType}</span>
                    </div>{" "}
                    <div className="text-gray-600 flex items-start space-x-2 text-sm">
                      <UserIcon className="h-4 w-4 text-pink-500" />
                      <span>
                        Owned by{" "}
                        {file.ownerId === user?.id
                          ? "you"
                          : file.user?.username}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-b border-pink-200">
                <h3 className="mb-4 text-gray-900 text-sm font-medium">
                  Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="flex justify-center items-center space-x-2 px-4 py-2 rounded-lg border border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 transition-colors"
                    onClick={() => handleFilePreview(file.path)}
                  >
                    <Eye className="h-4 w-4 text-pink-600" />
                    <span className="text-pink-700 font-medium">Preview</span>
                  </button>
                  <button
                    className="flex justify-center items-center space-x-2 px-4 py-2 rounded-lg border border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 transition-colors"
                    onClick={() => {
                      setNewName(file.name);
                      setIsRenaming(true);
                    }}
                  >
                    <Edit3 className="h-4 w-4 text-pink-600" />
                    <span className="text-pink-700 font-medium">Rename</span>
                  </button>
                  <button
                    className="flex justify-center items-center space-x-2 px-4 py-2 rounded-lg border border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 transition-colors"
                    onClick={() => handleOpenDeleteModal(file.name, file.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                    <span className="text-red-700 font-medium">Delete</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="mb-4 text-gray-900 text-sm font-medium">
                  Share File
                </h3>
                <div className="mb-4">
                  <label className="mb-2 text-sm font-medium text-gray-700">
                    Share Link
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={file.path}
                      readOnly
                      className="px-3 py-2 border border-pink-200 bg-pink-50/50 text-gray-600 text-sm flex-1 focus:ring-2 focus:border-pink-200 focus:ring-pink-200"
                    />
                    <button
                      className="px-4 py-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-all text-white flex justify-center items-center space-x-2"
                      onClick={handleCopy}
                      disabled={isCopying}
                    >
                      {isCopying ? (
                        <>
                          <Check className="w-4 h-4 " />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Clipboard className="w-4 h-4 " />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2 text-sm font-medium text-gray-700">
                    Share With User
                  </label>
                  <div className="relative flex-1 border rounded-lg border-pink-200">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-pink-400" />
                    </div>
                    <input
                      type="text"
                      onChange={(e) => handleSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-pink-50/50 placeholder-pink-400"
                      placeholder="Search by username..."
                    />
                  </div>
                </div>

                {searchedUsers.length > 0 && (
                  <div className="border border-pink-200 rounded-lg max-h-60 overflow-y-auto">
                    {searchedUsers.map((user, idx) => {
                      const isSelected = isPartOfSelectedUsers(user);
                      return (
                        <div
                          className={`p-3 flex items-start justify-between ${isSelected ? "bg-gradient-to-r from-pink-100 to-rose-100" : "bg-white hover:bg-pink-100"} border-b border-pink-200  group `}
                          key={user.id}
                        >
                          <div className="flex gap-2">
                            <div className="rounded-full h-10 w-10 bg-gradient-to-br from-pink-600 to-rose-600 text-white font-semibold flex justify-center items-center">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className=" space-y-1">
                              <p className="text-sm text-gray-900 ">
                                {user.username}
                              </p>
                              <p className="text-gray-600 text-xs">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <button
                            className={`rounded cursor-pointer inline-flex justify-center items-center p-1 text-sm transition-colors font-bold ${isSelected ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white" : "bg-gradient-to-r from-pink-200 to-rose-200 hover:from-pink-300 hover:to-rose-300 text-pink-500"}`}
                            onClick={() => handleToggleSelectedUser(user)}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedSearchedUsers.length > 0 && (
                  <button
                    className="mt-3 rounded-lg w-full px-4 py-2 inline-flex justify-center items-center space-x-2 text-white font-semibold transition-colors bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                    disabled={isSharing}
                    onClick={handleShare}
                  >
                    {isSharing ? (
                      <>
                        <Loader2 className="animate-spin text-white rounded-full h-4 w-4" />
                        <span>Sharing...</span>
                      </>
                    ) : (
                      <>
                        <UserPlusIcon className="text-white rounded-full h-4 w-4" />
                        <span>
                          Share with {selectedSearchedUsers.length} user
                          {selectedSearchedUsers.length > 1 && "s"}
                        </span>
                      </>
                    )}
                  </button>
                )}

                {selectedSearchedUsers.length > 0 && (
                  <div className="mt-3">
                    <label className="mb-2 text-sm font-medium text-gray-700">
                      Shared Users
                    </label>
                    <div className="border border-pink-200 rounded-lg max-h-60 overflow-y-auto mt-4 space-y-2">
                      {selectedSearchedUsers.map((user, idx) => {
                        return (
                          <div
                            className="p-3 bg-gradient-to-r from-pink-100 to-rose-100 border-b border-pink-200"
                            key={user.id}
                          >
                            <div className="flex gap-2">
                              <div className="rounded-full h-10 w-10 bg-gradient-to-br from-pink-600 to-rose-600 text-white font-semibold flex justify-center items-center">
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                              <div className=" space-y-1">
                                <p className="text-sm text-gray-900 ">
                                  {user.username}
                                </p>
                                <p className="text-gray-600 text-xs">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal
          handleCloseDeleteModal={handleCloseDeleteModal}
          fileName={deleteingFileName}
          fileId={deleteingfileId}
        />
      )}
    </>
  );
};

export default FileDetailsModal;

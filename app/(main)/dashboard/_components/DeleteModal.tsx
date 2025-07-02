"use client";

import { deleteFile } from "@/actions/file.actions";
import { Check, Loader, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteModalProps {
  handleCloseModal: () => void;
  fileName: string;
  fileId: string;
}

const DeleteModal = ({
  handleCloseModal,
  fileName,
  fileId,
}: DeleteModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleDeleteFile = async (fileId: string) => {
    try {
      setIsSubmitting(true);
      const res = await deleteFile(fileId);
      if (res.success) toast.success("Deleted file successfully!");
      else throw new Error(res.error as string);
    } catch (error) {
      toast.error("Deleting failed!");
    } finally {
      setIsSubmitting(false);
      handleCloseModal();
    }
  };
  return (
    <>
      <div className="z-40 h-full fixed inset-0 bg-black opacity-50" />
      <div className="flex justify-center items-center fixed inset-0 z-50">
        <div className="max-w-md bg-pink-50 rounded-xl shadow-xl border border-pink-200 w-full animate-scale">
          <div className="p-4 flex justify-between items-center border-b border-pink-200">
            <h2 className="text-gray-900 text-xl font-bold">Delete File</h2>
            <button
              className="text-pink-500 hover:text-pink-700"
              onClick={handleCloseModal}
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-pink-600 text-lg font-semibold p-4">
            Are you sure you want to delete this file {fileName}?
          </p>
          <div className="p-4 flex gap-2 items-center">
            <button
              className="flex flex-1 justify-center items-center text-gray-700 px-4 py-2 rounded-lg border border-pink-200 bg-gray-200 hover:bg-gray-300 mt-4 sm:mt-0"
              onClick={() => handleCloseModal()}
            >
              <X size={18} className="mr-1" />
              Cancel
            </button>
            <button
              className={`flex flex-1 justify-center items-center  px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg border border-pink-200 mt-4 sm:mt-0`}
              onClick={() => handleDeleteFile(fileId)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader size={18} className="animate-spin mr-1" />{" "}
                  {"Deleting"}
                </>
              ) : (
                <>
                  <Check size={18} className="mr-1" /> {"Confirm"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;

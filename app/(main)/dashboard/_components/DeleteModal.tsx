"use client";

import { deleteFile } from "@/actions/file.actions";
import { Check, Eye, Loader, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteModalProps {
  handleCloseDeleteModal: () => void;
  fileName: string;
  fileId: string;
}

const DeleteModal = ({
  handleCloseDeleteModal,
  fileName,
  fileId,
}: DeleteModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleDeleteFile = async () => {
    try {
      setIsSubmitting(true);
      const res = await deleteFile(fileId);
      if (res.success) toast.success("Deleted file successfully!");
      else throw new Error(res.error as string);
    } catch (error) {
      toast.error("Deleting failed!");
    } finally {
      setIsSubmitting(false);
      handleCloseDeleteModal();
    }
  };
  return (
    <>
      <div className="z-40 h-full fixed inset-0 bg-black/50" />
      <div className="flex justify-center items-center fixed inset-0 z-50">
        <div className="max-w-md bg-pink-50 rounded-xl shadow-xl border border-pink-200 w-full overflow-hidden animate-scale">
          <div className="bg-gradient-to-r from-pink-100 to-rose-100 border-b border-pink-200 flex justify-between items-center p-4">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">
              Delete File
            </h2>
            <button
              className="p-2 rounded-full hover:bg-pink-100 transition-colors"
              onClick={handleCloseDeleteModal}
            >
              <X className="w-5 h-5 text-pink-500" />
            </button>
          </div>
          <p className="text-pink-600 text-lg font-semibold p-4">
            Are you sure you want to delete this file {fileName}?
          </p>
          <div className="p-4 flex gap-2 items-center">
            <button
              className="w-full flex justify-center items-center space-x-2 px-4 py-2 rounded-lg border border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 transition-colors"
              onClick={handleCloseDeleteModal}
            >
              <X className="h-4 w-4 text-pink-600" />
              <span className="text-pink-700 font-medium">Cancel</span>
            </button>
            <button
              className="w-full flex justify-center items-center space-x-2 px-4 py-2 rounded-lg border border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 transition-colors"
              onClick={handleDeleteFile}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 text-pink-600" />
                  <span className="text-pink-700 font-medium">Deleting</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 text-pink-600" />
                  <span className="text-pink-700 font-medium">Confirm</span>
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

import React, { useState, useRef } from "react";
import { toast } from "react-toastify";

const AddTimelineEntryModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [caption, setCaption] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = [];
    const maxSize = 10 * 1024 * 1024; // 10MB

    files.forEach((file) => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "video/mp4",
        "video/mov",
        "video/avi",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type.`);
        return;
      }

      validFiles.push(file);
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      toast.error("Please select at least one photo or video.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption.trim() || "Field update");

    selectedFiles.forEach((file) => {
      formData.append("media", file);
    });

    const result = await onSubmit(formData);

    if (result.success) {
      // Reset form
      setCaption("");
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    }
  };

  const getFilePreview = (file) => {
    const url = URL.createObjectURL(file);

    if (file.type.startsWith("image/")) {
      return (
        <img
          src={url}
          alt="Preview"
          className="w-20 h-20 object-cover rounded-lg"
          onLoad={() => URL.revokeObjectURL(url)}
        />
      );
    } else if (file.type.startsWith("video/")) {
      return (
        <video
          src={url}
          className="w-20 h-20 object-cover rounded-lg"
          onLoadedData={() => URL.revokeObjectURL(url)}
        />
      );
    }

    return (
      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 text-xs">File</span>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Add Update</h3>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Caption */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Description
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Describe the current status, work done, or any observations..."
                disabled={loading}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos/Videos <span className="text-rose-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="w-full flex flex-col items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="text-sm font-medium">Add Photos/Videos</span>
                  <span className="text-xs text-gray-500">
                    Click to select files
                  </span>
                </button>
              </div>
            </div>

            {/* File Previews */}
            {selectedFiles.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Selected Files ({selectedFiles.length})
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative">
                      {getFilePreview(file)}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-rose-600"
                        disabled={loading}
                      >
                        ×
                      </button>
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || selectedFiles.length === 0}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
              >
                {loading ? "Adding..." : "Add Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTimelineEntryModal;

"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadToImgBB } from "@/lib/upload";

export default function ImageUploader({
  value = "",
  onChange,
  label = "Upload Image",
  aspectRatio = "square", // 'square' | 'wide'
  helperText = "PNG, JPG, WEBP up to 10MB",
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setErrorMessage("");

    try {
      const result = await uploadToImgBB(file);
      if (result.success && result.url) {
        onChange(result.url);
      } else {
        setErrorMessage(result.message || "Upload failed. Please try again.");
      }
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
          {label}
        </label>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl">
          {errorMessage}
        </div>
      )}

      {value ? (
        <div className="relative group inline-block">
          <div
            className={`border-2 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center ${
              aspectRatio === "square"
                ? "w-24 h-24 rounded-2xl"
                : "w-full max-w-sm h-36 rounded-2xl"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-cover"
            />
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700 transition-colors"
            title="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? "border-black bg-gray-100/80"
              : "border-gray-200 bg-gray-50/70 hover:border-gray-400 hover:bg-gray-100/50"
          } ${isUploading ? "opacity-60 cursor-wait" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm">
              {isUploading ? (
                <Loader2 size={20} className="animate-spin text-black" />
              ) : (
                <UploadCloud size={20} />
              )}
            </div>

            <div className="text-xs">
              <span className="font-bold text-gray-900">
                {isUploading ? "Uploading to ImgBB..." : "Click to upload"}
              </span>{" "}
              <span className="text-gray-500">
                {!isUploading && "or drag & drop"}
              </span>
            </div>

            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              {helperText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

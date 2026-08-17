"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Camera, Check, Loader2 } from "lucide-react";
import { updateUser } from "@/lib/auth-client";
import ImageUploader from "@/components/ImageUploader";

export default function ProfilePhotoModal({ isOpen, onClose, currentImage = "" }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(currentImage);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await updateUser({
        image: imageUrl || "",
      });

      if (res?.error) {
        setErrorMessage(res.error.message || "Failed to update profile photo.");
      } else {
        setSuccessMessage("Profile photo updated successfully!");
        setTimeout(() => {
          onClose();
          router.refresh();
          // Reload page to refresh session state if needed
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      console.error("Error updating profile image:", err);
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 sm:p-8 w-full max-w-md space-y-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center">
              <Camera size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Profile Photo</h2>
              <p className="text-xs text-gray-500">Upload or change your account avatar</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Feedback messages */}
        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2">
            <Check size={14} /> {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl">
            {errorMessage}
          </div>
        )}

        {/* ImageUploader */}
        <ImageUploader
          label="Your Avatar Photo"
          value={imageUrl}
          onChange={(url) => setImageUrl(url)}
          aspectRatio="square"
          helperText="PNG, JPG, WEBP (Square format works best)"
        />

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex-1 bg-black text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md hover:bg-gray-800 transition-all flex items-center justify-center gap-2 ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Photo"
            )}
          </button>

          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

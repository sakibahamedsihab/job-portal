export const uploadToImgBB = async (file) => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("ImgBB API key is missing. Please configure NEXT_PUBLIC_IMGBB_API_KEY in .env");
  }

  if (!file) {
    throw new Error("No file provided for upload.");
  }

  // Validate file size (max 10MB)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("Image size must be less than 10MB.");
  }

  // Validate MIME type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Supported image formats are JPEG, PNG, WEBP, GIF, and SVG.");
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success && data.data?.display_url) {
      return {
        success: true,
        url: data.data.display_url,
        thumbUrl: data.data.thumb?.url || data.data.display_url,
        deleteUrl: data.data.delete_url,
      };
    } else {
      throw new Error(data.error?.message || "Failed to upload image to ImgBB.");
    }
  } catch (error) {
    console.error("ImgBB Upload Error:", error);
    return {
      success: false,
      message: error.message || "Failed to upload image. Please try again.",
    };
  }
};

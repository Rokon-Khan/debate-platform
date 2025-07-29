"use client";

import { useState } from "react";

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      setError("IMGBB API key is missing");
      return null;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsUploading(true);
      setError(null);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data?.success) {
        const url = data.data.url;
        setUploadedUrl(url);
        return url;
      } else {
        setError(data?.error?.message || "Image upload failed");
        return null;
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadedUrl,
    error,
    uploadImage,
  };
}

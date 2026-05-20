import { ImageIcon, Upload, X } from "lucide-react";
import { ReactNode, useRef, useState } from "react";
import { toast } from "sonner";
import { showError } from "./sonner";

export interface UploadedImage {
  name: string;
  type: string;
  size: number;
  extension: string;
  base64: string;
  preview: string;
};

type Props = {
  maxImages?: number;
  images: UploadedImage[];
  title?: string;
  type?: 'image' | 'pdf';
  preview?: boolean;
  setImages: any;
  children?: ReactNode
};

export default function ThumbnailUpload({
  maxImages = 3,
  title = "Thumbnail",
  setImages,
  images,
  type = "image",
  preview = false,
  children,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const triggerUpload = () => {
    // if (images.length >= maxImages) return;
    inputRef.current?.click();
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = reject;
    });
  };

  const parseFile = async (
    file: File
  ): Promise<UploadedImage> => {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "";

    const base64 = await fileToBase64(file);

    return {
      name: file.name,
      type: file.type,
      size: file.size,
      extension,
      base64,
      preview: URL.createObjectURL(file),
    };
  };

  const allowedTypes = type === "image" ? ["image/jpeg", "image/png"] : ["application/pdf"];

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const remainingSlots = maxImages - images.length;

    if (remainingSlots <= 0) {
      alert(`Maximum of ${maxImages} images allowed`);
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    const parsedImages: UploadedImage[] = [];

    for (const file of selectedFiles) {
      // Validate file type
      if (type === 'pdf' && file.type !== 'application/pdf') {
        showError('Please select a PDF file');
        continue;
      }
      if (type === 'image' && !file.type.startsWith('image/')) {
        showError('Please select an image file (JPG, PNG, etc.)');
        continue;
      }
      const parsed = await parseFile(file);

      parsedImages.push(parsed);
    }

    const updatedImages = [...images, ...parsedImages];

    setImages(updatedImages);

    /**
     * Example payload
     */
    const payload = {
      images: updatedImages.map((img) => ({
        name: img.name,
        type: img.type,
        size: img.size,
        base64: img.base64,
      })),
    };

    console.log("PAYLOAD:", payload);

    // Reset input
    e.target.value = "";
  };

  /**
   * Remove image
   */
  const removeImage = (index: number) => {
    setImages((prev: any) =>
      prev.filter((_: any, i: any) => i !== index)
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-5">
        <h4 className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">{title}</h4>
        <div className="flex items-center gap-3">
          {images.length < 2 && type === "image" && <div className="w-24 h-16 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center overflow-hidden flex-shrink-0">
            {images.length > 0 ? (
              <div className="relative w-full h-full">
                <img src={images[0]?.preview} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(0)}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <ImageIcon size={18} className="text-[#D1D5DB]" />
            )}
          </div>}
          <div className="flex flex-col gap-1.5 w-full">
            <button
              onClick={triggerUpload}
              // disabled={images.length >= maxImages}
              className=""
            >
              {!children ? <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[11px] font-semibold text-[#6B7280] hover:border-[#9CA3AF] transition-colors">
                <Upload size={11} /> Upload Thumbnail
              </div> : children}
            </button>

            <p className="text-[10px] text-gray-400">
              {images.length}/{maxImages} uploaded
            </p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={allowedTypes.join(",")}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
      {images.length > 1 && preview && (
        <div className="flex gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative w-24 h-16 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center overflow-hidden flex-shrink-0"
            >
              <img
                src={image.preview}
                alt={image.name}
                className="w-full h-32 object-cover"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
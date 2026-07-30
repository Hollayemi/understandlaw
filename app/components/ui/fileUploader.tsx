import { ImageIcon, Upload, X } from "lucide-react";
import { ReactNode, useRef } from "react";
import { showError } from "./sonner";

export interface UploadedImage {
  name: string;
  type: string;
  size: number;
  extension: string;
  base64: string;
  preview: string;
};

// "image"    → JPG/PNG only (profile photos, thumbnails, covers)
// "pdf"      → PDF only
// "document" → PDF, Word (.doc/.docx), or image — for verification-style uploads
export type UploadFileType = "image" | "pdf" | "document";

const TYPE_CONFIG: Record<UploadFileType, { mimes: string[]; extensions: string[]; label: string; buttonLabel: string }> = {
  image: {
    mimes: ["image/jpeg", "image/png", "image/webp"],
    extensions: [".jpg", ".jpeg", ".png", ".webp"],
    label: "an image (JPG or PNG)",
    buttonLabel: "Upload Image",
  },
  pdf: {
    mimes: ["application/pdf"],
    extensions: [".pdf"],
    label: "a PDF file",
    buttonLabel: "Upload PDF",
  },
  document: {
    mimes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ],
    extensions: [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"],
    label: "a PDF, Word document, or image",
    buttonLabel: "Upload File",
  },
};

type Props = {
  maxImages?: number;
  images: UploadedImage[];
  title?: string;
  type?: UploadFileType;
  preview?: boolean;
  setImages: any;
  children?: ReactNode;
  /** Max size per file, in MB. Defaults to 10MB. */
  maxSizeMB?: number;
};

export default function ThumbnailUpload({
  maxImages = 3,
  title = "Thumbnail",
  setImages,
  images,
  type = "image",
  preview = false,
  children,
  maxSizeMB = 10,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const cfg = TYPE_CONFIG[type];

  const triggerUpload = () => {
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

  // Some browsers/OSes report an empty or unreliable `file.type` for
  // .doc/.docx, so we fall back to checking the extension too.
  const isAllowedFile = (file: File) => {
    const ext = `.${file.name.split(".").pop()?.toLowerCase() || ""}`;
    return cfg.mimes.includes(file.type) || cfg.extensions.includes(ext);
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const remainingSlots = maxImages - images.length;

    if (remainingSlots <= 0) {
      showError(`Maximum of ${maxImages} file${maxImages === 1 ? "" : "s"} allowed`);
      e.target.value = "";
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    const parsedImages: UploadedImage[] = [];

    for (const file of selectedFiles) {
      if (!isAllowedFile(file)) {
        showError(`"${file.name}" isn't supported. Please select ${cfg.label}.`);
        continue;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        showError(`"${file.name}" is over ${maxSizeMB}MB.`);
        continue;
      }
      const parsed = await parseFile(file);

      parsedImages.push(parsed);
    }

    if (parsedImages.length) {
      const updatedImages = [...images, ...parsedImages];
      setImages(updatedImages);
    }

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

  const acceptAttr = [...cfg.extensions, ...cfg.mimes].join(",");

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-5">
        {title.trim() ? <h4 className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">{title}</h4> : <h4 className="mb-3">&nbsp;</h4>}
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
              type="button"
              className=""
            >
              {!children ? <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[11px] font-semibold text-[#6B7280] hover:border-[#9CA3AF] transition-colors">
                <Upload size={11} /> {cfg.buttonLabel}
              </div> : children}
            </button>

            <p className="text-[10px] text-gray-400">
              {images.length}/{maxImages} uploaded
            </p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={acceptAttr}
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

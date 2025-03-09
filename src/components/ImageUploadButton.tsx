import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useRef } from "react";
import { useToasts } from "../util/toasts";

interface Props {
  onChange: (url: string | undefined) => void;
}

export default function ImageUploadButton({ onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const createToast = useToasts((s) => s.create);

  const DISCORD_WEBHOOK_URL =
    "https://discord.com/api/webhooks/1348344739216228473/ua6k3blytGNV7F4uaoKb681xYS67BcwOdAGvNgPyasfZr1rxBn0SJn0sAdgj1dEVYaE7";

  async function uploadToDiscord(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      if (data.attachments?.length > 0) {
        const imageUrl = data.attachments[0].url;
        onChange(imageUrl);
      } else {
        throw new Error("Failed to retrieve image URL");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      createToast({
        title: "Error uploading image",
        message: errorMessage,
        type: "error",
      });
    }
  }

  function onFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadToDiscord(file);
  }

  return (
    <div>
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={onFileUpload}
        accept="image/*"
      />
      <button
        className="h-10 w-10 bg-dark-2 rounded flex items-center justify-center text-gray-300 hover:text-white"
        onClick={() => inputRef.current?.click()}
      >
        <DocumentArrowUpIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

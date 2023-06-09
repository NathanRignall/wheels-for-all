"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { v4 as uuidv4 } from "uuid";
import { Button, Modal } from "@/components/ui";

type EditPictureModalProps = {
  companyId: string;
  productionId: string;
};

export const EditPictureModal = ({
  companyId,
  productionId,
}: EditPictureModalProps) => {
  const { supabase, session } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [file, setfile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      setfile(null);
    } else {
      setfile(event.target.files[0]);
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!event.dataTransfer.files) {
      setfile(null);
    } else {
      setfile(event.dataTransfer.files[0]);
    }
  };

  const onSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (!file) {
      setError("No file selected");
      return;
    }

    const filename = `${uuidv4()}-${file.name}`;
    const filepath = `companies/${companyId}/images/${filename}`;

    const { data: data1, error: error1 } = await supabase.storage
      .from("media")
      .upload(filepath, file, {
        cacheControl: "7200",
        upsert: false,
      });

    const { data: data2, error: error2 } = await supabase
      .from("productions")
      .update({ image_url: filename })
      .match({ id: productionId });

    if (error1 || error2) {
      setError(error1?.message || error2?.message || "Error uploading file");
    } else {
      toggleModal();
      setfile(null);

      startTransition(() => {
        router.refresh();
      });
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="absolute bottom-2 right-2"
    >
      <div className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
        Edit Production Picture
      </div>
      <form>
        <div className="mb-4"></div>

        <div className="mb-4">
          {file ? (
            <div className="max-w-[400px] mx-auto">
              <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-slate-300 dark:bg-slate-700">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="production picture"
                  width={400}
                  height={400}
                />
                <div className="w-full h-full">
                  <Button
                    onClick={() => setfile(null)}
                    className="absolute bottom-2 right-2"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <label
              htmlFor="dropzone-file"
              className="max-w-[400px] mx-auto flex flex-col items-center justify-center w-full h-64 border-2  border-dashed rounded-lg cursor-pointer bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  aria-hidden="true"
                  className="w-10 h-10 mb-3 text-slate-600 dark:text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  PNG, JPG or JPEG (MAX. 20MB)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onDrop={handleFileDrop}
                onChange={handleFileSelected}
              />
            </label>
          )}
        </div>

        <div className="mb-6">
          <Button
            variant="secondary"
            display="block"
            // @ts-ignore
            onClick={onSubmit}
            type="submit"
          >
            Save
          </Button>

          <div className="text-center">
            {error ? (
              <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                {error}
              </p>
            ) : (
              <div className="mt-2 h-5" />
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { Button, Modal } from "@/components/ui";

type RemoveProductModalProps = {
  productId: string;
  name: string;
};

export const RemoveProductModal = ({
  productId,
  name,
}: RemoveProductModalProps) => {
  const { supabase } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const onSubmit = async () => {
    const { error } = await supabase
      .from("products")
      .delete()
      .match({ id: productId });

    if (error) {
      setFormError(error.message);
    } else {
      toggleModal();

      startTransition(() => {
        router.refresh();
      });
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      button="Remove"
      buttonVariant="danger"
      buttonSize="sm"
    >
      <div className="text-3xl font-bold mb-1 text-slate-900 dark:text-white">
        Remove Product
      </div>

      <p className="text-lg mb-6 text-slate-600 dark:text-slate-300">
        You are about to remove a product. Are you sure you want to continue?
      </p>

      <p className="text-lg mb-6 italic text-slate-600 dark:text-slate-300">
        {name}
      </p>

      <div className="mb-6">
        <Button variant="secondary" display="block" onClick={onSubmit}>
          Remove
        </Button>

        <div className="text-center">
          {formError ? (
            <p className="mt-2 text-sm text-red-600 dark:text-red-300">
              {formError}
            </p>
          ) : (
            <div className="mt-2 h-5" />
          )}
        </div>
      </div>
    </Modal>
  );
};

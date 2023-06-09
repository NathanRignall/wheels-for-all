"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { Button, Modal } from "@/components/ui";

type DeleteMemberModalProps = {
  companyId: string;
  profileId: string;
  name: string;
  email: string;
};

export const DeleteMemberModal = ({
  companyId,
  profileId,
  name,
  email,
}: DeleteMemberModalProps) => {
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
      .from("company_members")
      .delete()
      .match({ company_id: companyId, profile_id: profileId });

    if (error) {
      setFormError(error.message);
    } else {
      toggleModal();
      setFormError(null);

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
      buttonSize="sm"
    >
      <div className="text-3xl font-bold mb-1 text-slate-900 dark:text-white">
        Remove Memeber
      </div>

      <p className="text-lg mb-6 text-slate-600 dark:text-slate-300">
        You are about to remove a member from your company. Are you sure you
        would like to continue?
      </p>

      <p className="text-lg mb-6 italic text-slate-600 dark:text-slate-300">
        {name} - {email}
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

"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase, AutoCompleteEmail } from "@/components/client";
import { getArray } from "@/lib/supabase-type-convert";
import { object, string, boolean, number } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button, Modal } from "@/components/ui";
import { AutoCompleteEquipmentType } from "@/components/client";

export const AddEquipmentModal = () => {
  const { supabase } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setFormError(null);
  };

  interface FormValues {
    equipment_type_id: string;
    notes: string;
  }

  const initialValues: FormValues = {
    equipment_type_id: "",
    notes: "",
  };

  const validationSchema = object({
    equipment_type_id: string().required("Equipment type is required"),
    notes: string(),
  });

  const onSubmit = async (values: FormValues) => {

    const { error } = await supabase.from("equipment").insert({
      equipment_type_id: values.equipment_type_id,
      notes: values.notes,
    });

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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} button="Add Equipment">
      <div className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
        Add Equipment
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, values }: FormikProps<FormValues>) => (
          <Form>

            <div className="mb-4">
              <AutoCompleteEquipmentType name="equipment_type_id" />

              {errors.equipment_type_id && touched.equipment_type_id && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                  {errors.equipment_type_id}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="notes"
                className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                Notes
              </label>
              <Field
                component="textarea"
                id="notes"
                type="text"
                rows={2}
                name="notes"
                placeholder="Equipment Notes..."
                className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
              />

              {errors.notes && touched.notes && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                  {errors.notes}
                </p>
              )}
            </div>

            <div className="text-right">
              <Button variant="success" type="submit" className="mr-2">
                Create
              </Button>
              <Button variant="danger" onClick={toggleModal}>
                Cancel
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
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

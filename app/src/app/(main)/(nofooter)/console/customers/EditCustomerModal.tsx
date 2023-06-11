"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button, Modal } from "@/components/ui";

type Customer = {
  email: string;
  given_name: string | null;
  family_name: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  postcode: string | null;
  country: string | null;
}

type EditCustomerModalProps = {
  customerId: string;
  customer: Customer;
};

export const EditCustomerModal = ({
  customerId,
  customer
}: EditCustomerModalProps) => {
  const { supabase, session } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  interface FormValues {
    email: string;
    given_name: string;
    family_name: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    postcode: string;
    country: string;
  }

  const initialValues: FormValues = {
    email: customer.email,
    given_name: customer.given_name || "",
    family_name: customer.family_name || "",
    address_line_1: customer.address_line_1 || "",
    address_line_2: customer.address_line_2 || "",
    city: customer.city || "",
    postcode: customer.postcode || "",
    country: customer.country || "",
  };

  const validationSchema = object({
    email: string().email().required("Email is required"),
    given_name: string().required("First Name is required"),
    family_name: string().required("Last Name is required"),
    address_line_1: string().required("Address Line 1 is required"),
    address_line_2: string(),
    city: string().required("City is required"),
    postcode: string().required("Postcode is required"),
    country: string().required("Country is required"),
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase
      .from("customers")
      .update({
        email: values.email,
        given_name: values.given_name,
        family_name: values.family_name,
        address_line_1: values.address_line_1,
        address_line_2: values.address_line_2,
        city: values.city,
        postcode: values.postcode,
        country: values.country,
      })
      .match({ id: customerId });

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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} button="Edit" buttonVariant="success"
      buttonSize="sm">
      <div className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
        Edit production
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }: FormikProps<FormValues>) => (
          <Form>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                Email
              </label>
              <Field
                id="email"
                type="email"
                name="email"
                placeholder="Email Address..."
                className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
              />

              {errors.email && touched.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex space-x-2 w-full mb-4">
              <div className="grow">
                <label
                  htmlFor="given_name"
                  className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300"
                >
                  First Name
                </label>
                <Field
                  id="given_name"
                  type="text"
                  name="given_name"
                  placeholder="First Name..."
                  className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
                />

                {errors.given_name && touched.given_name && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                    {errors.given_name}
                  </p>
                )}
              </div>

              <div className="grow">
                <label
                  htmlFor="family_name"
                  className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300"
                >
                  Last Name
                </label>
                <Field
                  id="family_name"
                  type="text"
                  name="family_name"
                  placeholder="Last Name..."
                  className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
                />

                {errors.family_name && touched.family_name && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                    {errors.family_name}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="address_line_1"
                className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                Address Line 1
              </label>
              <Field
                id="address_line_1"
                type="text"
                name="address_line_1"
                placeholder="Address Line 1..."
                className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
              />

              {errors.address_line_1 && touched.address_line_1 && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                  {errors.address_line_1}
                </p>
              )}
            </div>


            <div className="mb-4">
              <label
                htmlFor="address_line_2"
                className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                Address Line 2
              </label>
              <Field
                id="address_line_2"
                type="text"
                name="address_line_2"
                placeholder="Address Line 2..."
                className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
              />

              {errors.address_line_2 && touched.address_line_2 && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                  {errors.address_line_2}
                </p>
              )}
            </div>

            <div className="flex space-x-2 w-full mb-4">
              <div className="grow">
                <label
                  htmlFor="city"
                  className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300"
                >
                  City
                </label>
                <Field
                  id="city"
                  type="text"
                  name="city"
                  placeholder="City..."
                  className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
                />

                {errors.city && touched.city && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                    {errors.city}
                  </p>
                )}
              </div>

              <div className="grow">
                <label
                  htmlFor="postcode"
                  className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300"
                >
                  Postcode
                </label>
                <Field
                  id="postcode"
                  type="text"
                  name="postcode"
                  placeholder="Postcode..."
                  className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
                />

                {errors.postcode && touched.postcode && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                    {errors.postcode}
                  </p>
                )}
              </div>


            </div>

            <div className="mb-4">
              <label
                htmlFor="country"
                className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                Country
              </label>
              <Field
                as="select"
                id="country"
                type="text"
                name="country"
                placeholder="Country..."
                className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600">
                <option value="United Kingdom
                      ">United Kingdom</option>
              </Field>

              {errors.country && touched.country && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                  {errors.country}
                </p>
              )}
            </div>

            <div className="text-right">
              <Button variant="success" type="submit" className="mr-2">
                Save
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

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string, number } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button, Modal } from "@/components/ui";

type Product = {
  name: string;
  description: string;
  image_url: string | null;
  stock: number;
  price: number;
}

type EditProductModalProps = {
  productId: string;
  product: Product;
};

export const EditProductModal = ({
  productId,
  product,
}: EditProductModalProps) => {
  const { supabase, session } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  interface FormValues {
    name: string;
    description: string;
    image_url: string;
    stock: number;
    price: number;
  }

  const initialValues: FormValues = {
    name: product.name,
    description: product.description,
    image_url: product.image_url || "",
    stock: product.stock,
    price: product.price,
  };

  const validationSchema = object({
    name: string().required("Product name is required"),
    description: string().required("Product description is required"),
    image_url: string(),
    stock: number().integer().required("Product stock is required"),
    price: number().integer().required("Product price is required"),
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase
      .from("products")
      .update({
        name: values.name,
        description: values.description,
        image_url: values.image_url,
        stock: values.stock,
        price: values.price,
      })
      .match({ id: productId });

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
        {({ errors, touched, values }: FormikProps<FormValues>) => (
          <Form>
            <div className="mb-4">
              <label
                htmlFor="address_line_2"
                className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                Name
              </label>
              <Field
                id="name"
                type="text"
                name="name"
                placeholder="Product Name..."
                className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
              />

              {errors.name && touched.name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                Description
              </label>
              <Field
                component="textarea"
                id="description"
                type="text"
                rows={3}
                name="description"
                placeholder="Product Description..."
                className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
              />

              {errors.description && touched.description && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="flex space-x-2 w-full mb-4">
              <div className="grow">
                <label
                  htmlFor="stock"
                  className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300"
                >
                  Stock
                </label>
                <Field
                  id="stock"
                  type="number"
                  step="1"
                  name="stock"
                  placeholder="Product Stock..."
                  className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
                />

                {errors.stock && touched.stock && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                    {errors.stock}
                  </p>
                )}
              </div>

              <div className="grow">
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300"
                >
                  Price
                </label>
                <Field
                  id="price"
                  type="number"
                  step="1"
                  name="price"
                  placeholder="Product Price..."
                  className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
                />

                {errors.price && touched.price && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                    {errors.price}
                  </p>
                )}
              </div>
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

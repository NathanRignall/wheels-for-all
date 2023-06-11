"use client";

import { useEffect, useState, useTransition } from "react";
import { object, array, string, boolean, number } from "yup";
import { FormikProps, Formik, Field, Form, FieldArray } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Modal } from "@/components/ui";
import { AutoCompleteProduct, AutoCompleteEquipmentType, AutoCompleteEmail } from "@/components/client";
import { error } from "console";

type Equipment = {
  id: string;
  start_at: Date;
  end_at: Date;
}

type Product = {
  id: string;
  quantity: number;
}

type Basket = {
  equipment: Equipment[];
  products: Product[];
}

type CheckoutItemFormProps = {
  onContinue: (values: Basket) => void;
}

const CheckoutItemForm = ({ onContinue }: CheckoutItemFormProps) => {
  const [formError, setFormError] = useState<string | null>(null);

  interface FormValues {
    equipment: Equipment[];
    products: Product[];
  }

  const initialValues: FormValues = {
    equipment: [],
    products: [],
  };

  const validationSchema = object({
    equipment: array().of(object({
      id: string().required("Equipment is required"),
      start_at: string().required("Start date is required"),
      end_at: string().required("End date is required"),
    })),
    products: array().of(object({
      id: string().required("Product is required"),
      quantity: number().required("Quantity is required"),
    })).test(
      "unqiue-products",
      "Duplicate products are not allowed, update the quantity instead",
      (value) => value ? new Set(value.map((product) => product.id)).size === value.length : true
    )
  });

  const onSubmit = async (values: FormValues) => {
    onContinue(values)
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, values, setFieldValue }: FormikProps<FormValues>) => (
          <Form>

            <FieldArray name="equipment">
              {({ push, remove }) => (
                <div>
                  <div className="mb-4">
                    <Button
                      onClick={() => {
                        push({ id: "", quantity: 20 });
                      }}
                    >
                      Add Equipment
                    </Button>
                  </div>

                  {values.equipment.map((equipment, index) => (
                    <div className="mb-4" key={index} >
                      <div className="flex space-x-2 w-full">

                        <div className="grow">
                          <AutoCompleteEquipmentType name={`equipment.${index}.id`} label={false} />
                        </div>

                        <div>
                          <DatePicker
                            id="datetime"
                            name="datetime"
                            selected={equipment.start_at}
                            onChange={(start_at) =>
                              setFieldValue(`equipment.${index}.start_at`, start_at)
                            }
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MM/dd/yyyy HH:mm"
                            className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
                          />
                        </div>


                        <div>
                          <DatePicker
                            id="datetime"
                            name="datetime"
                            selected={equipment.end_at}
                            onChange={(end_at) =>
                              setFieldValue(`equipment.${index}.end_at`, end_at)
                            }
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MM/dd/yyyy HH:mm"
                            className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
                          />
                        </div>

                        <Button
                          onClick={() => {
                            remove(index);
                          }}
                        >
                          x
                        </Button>

                      </div>

                      {errors.equipment && touched.equipment && errors.equipment[index] && (
                        <p className="text-sm text-red-600 dark:text-red-300">
                          {/* @ts-ignore */}
                          {errors.equipment[index].id}{" "}
                          {/* @ts-ignore */}
                          {errors.equipment[index].start_at}{" "}
                          {/* @ts-ignore */}
                          {errors.equipment[index].end_at}{" "}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>

            <FieldArray name="products">
              {({ push, remove }) => (
                <div>
                  <div className="mb-4">
                    <Button
                      onClick={() => {
                        push({ id: "", quantity: 20 });
                      }}
                    >
                      Add Product
                    </Button>
                  </div>

                  {values.products.map((product, index) => (
                    <div className="mb-4" key={index} >
                      <div className="flex space-x-2 w-full">

                        <div className="grow">
                          <AutoCompleteProduct name={`products.${index}.id`} />
                        </div>

                        <Field
                          id={`products.${index}.quantity`}
                          type="text"
                          name={`products.${index}.quantity`}
                          placeholder="Quantity"
                          className="relative block rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
                        />

                        <Button
                          onClick={() => {
                            remove(index);
                          }}
                        >
                          x
                        </Button>

                      </div>

                      {errors.products && touched.products && errors.products[index] && (
                        <p className="text-sm text-red-600 dark:text-red-300">
                          {/* @ts-ignore */}
                          {errors.products[index].id}{" "}
                          {/* @ts-ignore */}
                          {errors.products[index].quantity}{" "}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>

            {errors.products && touched.products && typeof errors.products === "string" && (
              <p className="text-sm text-red-600 dark:text-red-300">
                {
                  errors.products
                }
              </p>
            )}

            <div className="text-right">
              <Button variant="success" type="submit" className="mr-2">
                Continue
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
    </>
  );
}

const CheckoutCustomerForm = () => {
  const [formError, setFormError] = useState<string | null>(null);

  interface FormValues {
    isNewCustomer: boolean;
    profileId: string
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
    isNewCustomer: true,
    profileId: "",
    email: "",
    given_name: "",
    family_name: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    postcode: "",
    country: "",
  };

  const validationSchema = object({
    isNewCustomer: boolean(),
    profileId: string().when("isNewCustomer", {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("Valid person is required"),
    }),
    email: string().when("isNewCustomer", {
      is: true,
      then: (schema) => schema.required("Email is required"),
    }),
    given_name: string().when("isNewCustomer", {
      is: true,
      then: (schema) => schema.required("Given name is required"),
    }),
    family_name: string().when("isNewCustomer", {
      is: true,
      then: (schema) => schema.required("Family name is required"),
    }),
    address_line_1: string().when("isNewCustomer", {
      is: true,
      then: (schema) => schema.required("Address line 1 is required"),
    }),
    address_line_2: string(),
    city: string().when("isNewCustomer", {
      is: true,
      then: (schema) => schema.required("City is required"),
    }),
    postcode: string().when("isNewCustomer", {
      is: true,
      then: (schema) => schema.required("Postcode is required"),
    }),
    country: string().when("isNewCustomer", {
      is: true,
      then: (schema) => schema.required("Country is required"),
    }),
  });

  const onSubmit = async (values: FormValues) => {
    
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, values }: FormikProps<FormValues>) => (
        <Form>
          {values.isNewCustomer ? (<>
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


          </>) : (
            <div className="mb-4">
              <AutoCompleteEmail name="profileId" />
            </div>

          )


          }

          <div className="mb-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <Field
                id="isNewCustomer"
                type="checkbox"
                name="isNewCustomer"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800 dark:peer-checked:bg-slate-400"></div>
              <span className="ml-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                New Customer
              </span>
            </label>
          </div>

          <div className="text-right">
            <Button variant="success" type="submit" className="mr-2">
              {values.isNewCustomer ? "Add Customer" : "Continue"}
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

          {JSON.stringify(errors)}

        </Form>
      )}
    </Formik>
  );
}


export const Checkout = () => {
  const [basket, setBasket] = useState<Basket | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const onContinue = (values: Basket) => {
    setBasket(values);
    setIsComplete(true);
  }
  return (
    <>
      {
        !isComplete ? (
          <CheckoutItemForm onContinue={onContinue} />
        ) : (
          <CheckoutCustomerForm />
        )
      }
    </>
  );
};
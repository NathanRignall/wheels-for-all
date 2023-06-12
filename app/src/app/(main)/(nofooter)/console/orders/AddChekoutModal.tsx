"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { object, array, string, boolean, number } from "yup";
import { FormikProps, Formik, Field, Form, FieldArray } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Modal } from "@/components/ui";
import { useSupabase, AutoCompleteProduct, AutoCompleteEquipmentType, AutoCompleteEmail } from "@/components/client";

type Equipment = {
  id: string;
  start_at: Date;
  end_at: Date;
}

type Product = {
  id: string;
  quantity: number;
}

type Customer = {
  email: string;
  given_name: string;
  family_name: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  postcode: string;
  country: string;
}

type Checkout = {
  equipment: Equipment[];
  products: Product[];
  customer: Customer;
  customerId: string;
}

const PriceChecker = (equipment: Equipment[], products: Product[]) => {
  const { supabase } = useSupabase();

  const [price, setPrice] = useState<number>(0)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    const getPrice = async () => {
      setIsLoaded(false)

      // filter out equipment with no id, start_at or end_at
      const newEquipment = equipment.filter((equipment) => equipment.id != null && equipment.start_at != null && equipment.end_at != null)

      // filter out products with no id or quantity
      const newProducts = products.filter((product) => product.id != null && product.quantity != null)

      if (newEquipment.length === 0 && newProducts.length === 0) {
        setIsLoaded(true)
        setPrice(0)
      } else {

        console.log({
          checkout: {
            equipment: newEquipment,
            products: newProducts,
          }
        })

        const { data, error } = await supabase.functions.invoke("check-checkout", {
          body: JSON.stringify({
            checkout: {
              equipment: newEquipment,
              products: newProducts,
            }
          }),
        });

        if (data) {
          console.log(data)
          setPrice(data.total)
          setIsLoaded(true)
        }
      }
    }

    const timeout = setTimeout(async () => {
      getPrice()
    }, 200);

    return () => clearTimeout(timeout);
  }, [equipment, products, supabase]);

  return (
    <p className="text-xl font-medium p-2 text-slate-900 dark:text-white">
      {
        isLoaded ? (
          <>£{price/100}</>
        ) : (
          <>Loading...</>
        )
      }
    </p>
  )
}

export const CheckoutModal = () => {
  const { supabase } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  interface FormValues {
    equipment: Equipment[];
    products: Product[];
    customer: Customer;
    isNewCustomer: boolean;
    customerId: string;
  }

  const initialValues: FormValues = {
    equipment: [],
    products: [],
    customer: {
      email: "",
      given_name: "",
      family_name: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      postcode: "",
      country: "",
    },
    isNewCustomer: false,
    customerId: "",
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
    ),
    customer: object({
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
    }),
    customerId: string().when("isNewCustomer", {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("Valid customer is required"),
    }),
  });

  const onSubmit = async (values: FormValues) => {
    console.log({
      checkout: {
        equipment: values.equipment,
        products: values.products,
        customer: values.customer,
        customerId: values.customerId,
      }
    })
    const { error } = await supabase.functions.invoke("checkout", {
      body: JSON.stringify({
        checkout: {
          equipment: values.equipment,
          products: values.products,
          customer: values.customer,
          customerId: values.customerId,
        }
      }),
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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} button="New Order" size="lg">
      <div className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
        New Order
      </div>

      <div className="max-h-[70vh] overflow-y-scroll pr-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, values, setFieldValue }: FormikProps<FormValues>) => (
            <Form>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Equipment
              </h2>
              <FieldArray name="equipment">
                {({ push, remove }) => (
                  <div>
                    <div className="mb-4">
                      <Button
                        onClick={() => {
                          push({ id: "" });
                        }}
                        size="sm"
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
                            variant="danger"
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

              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Products
              </h2>
              <FieldArray name="products">
                {({ push, remove }) => (
                  <div>
                    <div className="mb-4">
                      <Button
                        onClick={() => {
                          push({ id: "" });
                        }}
                        size="sm"
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
                            variant="danger"
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

              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Customer
              </h2>

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
                    name="customer.email"
                    placeholder="Email Address..."
                    className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
                  />

                  {errors.customer && errors.customer.email && touched.customer && touched.customer.email && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                      {errors.customer.email}
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
                      name="customer.given_name"
                      placeholder="First Name..."
                      className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
                    />

                    {errors.customer && errors.customer.given_name && touched.customer && touched.customer.given_name && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                        {errors.customer.given_name}
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
                      name="customer.family_name"
                      placeholder="Last Name..."
                      className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
                    />

                    {errors.customer && errors.customer.family_name && touched.customer && touched.customer.family_name && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                        {errors.customer.family_name}
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
                    name="customer.address_line_1"
                    placeholder="Address Line 1..."
                    className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
                  />

                  {errors.customer && errors.customer.address_line_1 && touched.customer && touched.customer.address_line_1 && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                      {errors.customer.address_line_1}
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
                    name="customer.address_line_2"
                    placeholder="Address Line 2..."
                    className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
                  />

                  {errors.customer && errors.customer.address_line_2 && touched.customer && touched.customer.address_line_2 && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                      {errors.customer.address_line_2}
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
                      name="customer.city"
                      placeholder="City..."
                      className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
                    />

                    {errors.customer && errors.customer.city && touched.customer && touched.customer.city && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                        {errors.customer.city}
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
                      name="customer.postcode"
                      placeholder="Postcode..."
                      className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
                    />

                    {errors.customer && errors.customer.postcode && touched.customer && touched.customer.postcode && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                        {errors.customer.postcode}
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
                    name="customer.country"
                    placeholder="Country..."
                    className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600">
                    <option value="United Kingdom
                        ">United Kingdom</option>
                  </Field>

                  {errors.customer && errors.customer.country && touched.customer && touched.customer.country && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                      {errors.customer.country}
                    </p>
                  )}
                </div>


              </>) : (
                <div className="mb-4">
                  <AutoCompleteEmail name="customerId" />

                  {errors.customerId && touched.customerId && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                      {errors.customerId}
                    </p>
                  )}
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


              {errors.products && touched.products && typeof errors.products === "string" && (
                <p className="text-sm text-red-600 dark:text-red-300">
                  {
                    errors.products
                  }
                </p>
              )}

              <div className="text-right">
                {PriceChecker(values.equipment, values.products)}

                <Button variant="success" type="submit" className="mr-2">
                  Continue
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
      </div>
    </Modal>
  );
};

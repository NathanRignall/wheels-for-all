"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tag } from "@/components/ui";
import clsx from "clsx";
import { usePathname } from "next/navigation";

// Navbar types
interface NavbarProps {
  loggedIn: boolean;
}

// Navbar Link types
interface NavbarLinkProps {
  href: string;
  text: string;
  active: boolean;
}

// Navbar Link component
const NavbarLink = ({ href, text, active }: NavbarLinkProps) => {
  return (
    <li>
      <Link
        href={href}
        className={clsx(
          active && "underline underline-offset-4 decoration-2",
          "block px-3 py-2 text-lg font-medium border-2 rounded-md text-white border-transparent hover:bg-slate-900 hover:border-slate-700 dark:text-white dark:hover:bg-slate-900 dark:hover:border-slate-700"
        )}
      >
        {text}
      </Link>
    </li>
  );
};

// Links for the navbar
const links = [
  { href: "/", text: "Home" },
  { href: "/shop", text: "Shop" },
  { href: "/hire", text: "Hire" },
  { href: "/about", text: "About" },
];

// Navbar component
export const Navbar = ({ loggedIn }: NavbarProps) => {
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow(!show);

  // use the router to get the current path
  const pathname = usePathname();

  useEffect(() => {
    setShow(false);
  }, [pathname]);

  return (
    <>
      <nav className="z-40 border-b-2 bg-slate-800 border-slate-600 dark:bg-slate-800 dark:border-slate-600">
        <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto px-4 py-3 md:px-6 md:py-2 lg:px-8">
          <Link href="/" className="flex items-center">
            <span className="self-center text-2xl md:text-3xl font-medium whitespace-nowrap text-white dark:text-white">
              Wheels for All
            </span>
          </Link>

          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm border-2 rounded-lg md:hidden text-slate-500 border-slate-200 dark:text-slate-300 dark:border-slate-600"
            aria-controls="navbar-default"
            aria-expanded="false"
            onClick={toggleShow}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>

          <div
            className={clsx(
              show ? "block" : "hidden",
              "md:block w-full md:w-auto"
            )}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col md:flex-row p-4 md:p-0 mt-4 md:mt-0 border-2 md:border-0 rounded-lg  md:space-x-2 space-y-1 md:space-y-0 bg-slate-800 border-slate-600 dark:bg-slate-800 dark:border-slate-600">
              {links.map((link) => (
                <NavbarLink
                  key={link.href}
                  href={link.href}
                  text={link.text}
                  active={pathname == link.href}
                />
              ))}

              {loggedIn ? (
                <li>
                  <Link
                    href="/profile"
                    className="block rounded-md px-3 py-2 text-lg font-medium text-white bg-slate-700 border-2 border-slate-500 hover:bg-slate-900 hover:border-slate-700 dark:text-white dark:bg-slate-700 dark:border-slate-500 dark:hover:bg-slate-900 dark:hover:border-slate-700"
                  >
                    Account
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    href="/auth/login"
                    className="block rounded-md px-3 py-2 text-lg font-medium text-white bg-slate-700 border-2 border-slate-500 hover:bg-slate-900 hover:border-slate-700 dark:text-white dark:bg-slate-700 dark:border-slate-500 dark:hover:bg-slate-900 dark:hover:border-slate-700"
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div
        className={clsx(
          show ? "block" : "hidden",
          "z-30 fixed inset-0 bg-slate-500 opacity-70"
        )}
        onClick={toggleShow}
      />
    </>
  );
};

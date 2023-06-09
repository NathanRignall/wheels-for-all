import Link from "next/link";
import { Tag } from "@/components/ui";

export const Footer = () => {
  return (
    <footer className="border-t-2 bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-600">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center">
            <span className="self-center text-2xl md:text-3xl font-medium whitespace-nowrap text-slate-900 dark:text-white">
              Wheels for All
            </span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0 text-slate-500 dark:text-slate-400">
            <li>
              <Link
                href="/about/privacy"
                className="mr-4 hover:underline md:mr-6"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/about/documentation"
                className="mr-4 hover:underline md:mr-6 "
              >
                Documentation
              </Link>
            </li>
            <li>
              <Link href="/about/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 sm:mx-auto lg:my-8 border-slate-200 dark:border-slate-500" />
        <span className="block text-sm sm:text-center text-slate-500 dark:text-slate-400">
          © 2023{" "}
          <Link href="/" className="hover:underline">
            Wheels for All
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

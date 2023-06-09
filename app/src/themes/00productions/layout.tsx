import Image from "next/image";
import Link from "next/link";
import { Abril_Fatface } from "next/font/google";
import fontColorContrast from "font-color-contrast";
import { LayoutProps } from "@/themes";

const interFont = Abril_Fatface({
  weight: "400",
  subsets: ["latin"],
});

// layout
export default function Layout({ children, company }: LayoutProps) {
  return (
    <>
      <header style={{ backgroundColor: company.main_colour }}>
        <div className="container mx-auto max-w-6xl pt-6 px-8">
          <div className="flex flex-row">
            <Image
              src="media/themes/00productions/logo.png"
              width={100}
              height={100}
              alt="00 Productions Logo"
            />
            <div className="flex flex-col justify-center ml-2">
              <h1
                className={`mb-0 text-3xl sm:text-6xl font-extrabold ${interFont.className}`}
              >
                Productions
              </h1>
            </div>
          </div>

          <nav className="relative bg-gray-200 mt-4 font-sans-serif">
            <ul
              className=" flex space-x-4"
              style={{
                color: fontColorContrast(company.main_colour),
              }}
            >
              <li className="flex-1 text-center hover:bg-gray-400 hover:text-white uppercase">
                <Link
                  href={`/companies/${encodeURIComponent(company.slug)}`}
                  className="inline-block text-sm px-2 py-2 "
                >
                  Home
                </Link>
              </li>

              {company.pages.map((page) => (
                <li
                  key={page.id}
                  className="flex-1 text-center hover:bg-gray-400 hover:text-white uppercase"
                >
                  <Link
                    href={`/companies/${encodeURIComponent(
                      company.slug
                    )}/${encodeURIComponent(page.slug)}`}
                    className="inline-block flex-1 text-sm px-2 py-2"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl py-6 px-8">{children}</div>
    </>
  );
}

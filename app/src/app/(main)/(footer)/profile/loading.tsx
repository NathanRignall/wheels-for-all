import { Button } from "@/components/ui";

// Loading
export default function Loading() {
  return (
    <>
      <div className="container mx-auto md:py-6 md:px-8 py-6 px-6">
        <header className="sm:flex max-w-3xl mx-auto mb-8">
          <div className="flex-1">
            <div className="mb-3 rounded-lg sm:h-[60px] h-12 animate-pulse max-w-[400px] bg-slate-300 dark:bg-slate-600"></div>
            <div className="mb-3 rounded-lg h-7 animate-pulse max-w-[350px] bg-slate-200 dark:bg-slate-700 "></div>

            <div>
              <Button>View Public</Button>
            </div>
          </div>

          <div className="sm:w-[150px] w-[200px] sm:p-0 pt-3 pb-3">
            <div className="rounded-lg animate-pulse w-full aspect-w-1 aspect-h-1 bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto">
          <section>
            <div className="sm:flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                  Productions
                </h2>
              </div>
              <div>
                <p className="text-2xl font-normal text-slate-600 dark:text-white">
                  Involvements
                </p>
              </div>
            </div>

            <ul className="mt-4 grid sm:grid-cols-2 gap-4">
              <li className="rounded-lg h-32 animate-pulse bg-slate-200 dark:bg-slate-700"></li>
              <li className="rounded-lg h-32 animate-pulse bg-slate-200 dark:bg-slate-700"></li>
              <li className="rounded-lg h-32 animate-pulse bg-slate-200 dark:bg-slate-700"></li>
            </ul>
          </section>
        </main>
      </div>
    </>
  );
}

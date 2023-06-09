import clsx from "clsx";
import { Button } from "../Button";

export type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  button?: string;
  buttonSize?: "sm" | "md" | "lg";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

export const Modal = ({
  isOpen,
  setIsOpen,
  button,
  buttonSize = "md",
  size = "md",
  className,
  children,
}: ModalProps) => {
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {button ? (
        <Button onClick={toggleModal} size={buttonSize}>
          {button}
        </Button>
      ) : (
        <button
          type="button"
          className={clsx(
            "rounded-lg text-sm p-1 text-slate-900 bg-white border-2 border-slate-200 hover:bg-slate-200 hover:border-slate-400 dark:text-white dark:bg-slate-700 dark:border-slate-500 dark:hover:bg-slate-900 dark:hover:border-slate-700",
            className
          )}
          data-modal-hide="defaultModal"
          onClick={toggleModal}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="fixed z-30 inset-0 overflow-y-auto text-left whitespace-normal">
          <div className="flex items-center justify-center min-h-screen pt-5 px-5 sm:p-0">
            <div className="fixed inset-0 bg-slate-500 opacity-70" />

            <div
              className={clsx(
                "rounded-lg overflow-hidden z-40 w-full bg-white dark:bg-slate-900",
                size === "sm" && "max-w-lg",
                size === "md" && "max-w-2xl",
                size === "lg" && "max-w-3xl"
              )}
            >
              <div className="px-6 py-6 sm:px-10 sm:py-8">
                <div className="flex items-end justify-between rounded-t mb-4">
                  <button
                    type="button"
                    className="rounded-lg text-sm p-1.5 ml-auto inline-flex items-center text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-white"
                    data-modal-hide="defaultModal"
                    onClick={toggleModal}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

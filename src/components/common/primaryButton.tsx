import clsx from "clsx";

export const PrimaryButton = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={clsx(
        "flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white p-2 font-sm rounded-md font-bold flex justify-center items-center",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

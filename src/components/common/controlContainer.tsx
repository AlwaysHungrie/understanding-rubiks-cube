import clsx from "clsx";

export const ControlContainer = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={clsx("bg-black/60 rounded-lg p-1 md:w-auto", className)}>
      <div className="flex flex-1 justify-center items-center gap-2 border border-white rounded-md px-4 py-1">
        {children}
      </div>
    </div>
  );
};

import clsx from "clsx";

export const ControlContainer = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={clsx(" bg-black/60 rounded-lg p-1 w-72", className)}>
      <div className="flex justify-center items-center gap-2 border border-white rounded-md p-4">
        {children}
      </div>
    </div>
  );
};

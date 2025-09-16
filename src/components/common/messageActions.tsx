import clsx from "clsx";

export const MessageActions = ({
  message,
  className,
  actions,
}: {
  message: string;
  className?: string;
  actions: React.ReactNode;
}) => {
  return (
    <div className={clsx("flex flex-col gap-2 w-full md:w-72", className)}>
      <div className=" bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">{message}</h3>
        </div>
      </div>
      <div className="flex">{actions}</div>
    </div>
  );
};

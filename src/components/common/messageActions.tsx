import clsx from "clsx";

export const MessageActions = ({
  message,
  pointers,
  className,
  actions,
}: {
  message: string;
  pointers?: string[];
  className?: string;
  actions: React.ReactNode;
}) => {
  return (
    <div className={clsx("flex flex-col gap-2 w-full md:w-72", className)}>
      <div className=" bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">{message}</h3>
        </div>
        {pointers && (
          <ul className="p-3 list-disc list-inside text-sm text-gray-700">
            {pointers.map((pointer) => (
              <li key={pointer}>{pointer}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex gap-2">{actions}</div>
    </div>
  );
};

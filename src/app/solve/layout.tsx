import CubeContextProvider from "@/context/cubeContext";

export default function AnatomyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CubeContextProvider>{children}</CubeContextProvider>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function isSingleExportedProvider(data: any) {
  return (
    !!data &&
    (typeof data === "string" ||
      typeof data === "symbol" ||
      typeof data === "function")
  );
}

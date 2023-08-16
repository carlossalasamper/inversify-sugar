/* eslint-disable @typescript-eslint/no-explicit-any */

const isMultiExportedProvider = (data: any) => {
  return !!data && data.multi === true;
};

export default isMultiExportedProvider;

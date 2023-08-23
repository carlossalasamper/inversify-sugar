const isNewableProvider = (data: unknown): boolean => {
  return data instanceof Function;
};

export default isNewableProvider;

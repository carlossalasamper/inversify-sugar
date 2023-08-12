const isConstructorProvider = (data: unknown): boolean => {
  return data instanceof Function;
};

export default isConstructorProvider;

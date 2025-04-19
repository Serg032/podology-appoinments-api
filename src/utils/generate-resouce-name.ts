export const generateResourceName = (name: string) => {
  const env = process.env.ENV || "dev";
  const resourceName = `${name}-${env}`;
  return resourceName;
};

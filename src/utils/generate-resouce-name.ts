import { Construct } from "constructs";

export const generateResourceName = (name: string, resourceType: string) => {
  const projectName = process.env.PROJECT_NAME || "podologist"; // Nombre del proyecto
  const stage = process.env.ENV || "dev"; // Entorno (dev, staging, prod)
  const resourceName = `${projectName}-${stage}-${resourceType}-${name}`;
  return resourceName;
};

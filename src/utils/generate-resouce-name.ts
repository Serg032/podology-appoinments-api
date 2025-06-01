import { Construct } from "constructs";

export const generateResourceName = (name: string, scope: Construct) => {
  const env = process.env.ENV || "dev"; // Entorno (dev, staging, prod)
  const resourceName = `Podologist-api-${name}-${env}-${scope.node.id}`;
  return resourceName;
};

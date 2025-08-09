import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

export class ParameterStoreService {
  private ssmClient: SSMClient;

  constructor(region: string) {
    this.ssmClient = new SSMClient({ region });
  }

  async getParameterValue(
    parameterName: string,
    withDecryption = true
  ): Promise<string> {
    const command = new GetParameterCommand({
      Name: parameterName,
      WithDecryption: withDecryption,
    });

    const response = await this.ssmClient.send(command);
    if (!response.Parameter?.Value) {
      throw new Error(`Parameter ${parameterName} not found`);
    }

    return response.Parameter.Value;
  }
}

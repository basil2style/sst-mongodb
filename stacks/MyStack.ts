import { StackContext, Api, Table, Auth } from "@serverless-stack/resources";

export function MyStack({ stack }: StackContext) {
  // Create the table
  const table = new Table(stack, "Counter", {
    fields: {
      counter: "string",
    },
    primaryIndex: { partitionKey: "counter" },
  });

  const api = new Api(stack, "api", {
    defaults: {
      authorizer: "iam",
      function: {
        // Allow the API to access the table
        permissions: [table],
        environment: {
          tableName: table.tableName,
          // MONGODB_URI: process.env.MONGODB_URI,
        }
      }
    },
    routes: {
      "GET /": { function: "functions/lambda.handler", authorizer: "none", },
      "GET /koro": "functions/koro.handler",
      "POST /create": { function: "functions/dynamo.handler", authorizer: "none" },
    },
  });

  // Create auth provider
  const auth = new Auth(stack, "Auth", {
    login: ["email"]
  });

  auth.attachPermissionsForAuthUsers(stack, [api]);

  stack.addOutputs({
    ApiEndpoint: api.url,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId,
  });
}

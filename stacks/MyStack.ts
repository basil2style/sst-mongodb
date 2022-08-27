import { StackContext, Api, Auth } from "@serverless-stack/resources";

export function MyStack({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    defaults: {
      authorizer: "iam",
      function: {
        environment: {
          MONGODB_URI: process.env.MONGODB_URI,
        }
      }
    },
    routes: {
      "GET /": { function: "functions/lambda.handler", authorizer: "none", },
      "GET /koro": "functions/koro.handler"
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

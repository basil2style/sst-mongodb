import { StackContext, Api, Auth } from "@serverless-stack/resources";

export function MyStack({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    defaults: {
      authorizer: "iam",
      function: {
        environment: {
          MONGODB_URI: process.env.MONGODB_URI,
          Auth0Domain: process.env.Auth0Domain,
          Auth0ClientId: process.env.Auth0ClientId
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
    identityPoolFederation: {
      auth0: {
        domain: process.env.Auth0Domain,
        clientId: process.env.Auth0ClientId,
      },
    },
  });

  auth.attachPermissionsForAuthUsers(stack, [api]);

  stack.addOutputs({
    ApiEndpoint: api.url,
    IdentityPoolId: auth.cognitoIdentityPoolId,
  });
}

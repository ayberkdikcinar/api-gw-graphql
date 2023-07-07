import { ApolloServer } from "@apollo/server";
import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from "@apollo/gateway";

export class Apollo {
  private static instance: Apollo;
  server: ApolloServer;

  private constructor() {
    const gateway = this.createGateway();
    this.server = new ApolloServer({ gateway });
  }

  static getInstance(): Apollo {
    if (!Apollo.instance) {
      Apollo.instance = new Apollo();
    }
    return Apollo.instance;
  }

  private createGateway(): ApolloGateway {
    return new ApolloGateway({
      buildService({ url }) {
        return new RemoteGraphQLDataSource({
          url,
          willSendRequest({ request, context }) {
            request.http?.headers.set("user", context.user ? JSON.stringify(context.user) : "");
          },
        });
      },
      supergraphSdl: new IntrospectAndCompose({
        subgraphs: [
          {
            name: "users",
            url: "http://localhost:3001/graphql",
          },
          {
            name: "posts",
            url: "http://localhost:3002/graphql",
          },
        ],
      }),
    });
  }

  async start() {
    await this.server.start();
  }
}

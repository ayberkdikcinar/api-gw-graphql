import { app } from "./app";
import { expressMiddleware } from "@apollo/server/express4";
import { Apollo } from "./apollo";

const startApp = async () => {
  try {
    const apollo = Apollo.getInstance();
    await apollo.start();
    app.use(expressMiddleware(apollo.server));
  } catch (error) {
    console.log(error);
  }

  app.listen(3000, () => console.log(`Server ready at http://localhost:3000/graphql`));
};

startApp();

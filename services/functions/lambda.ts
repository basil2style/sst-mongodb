import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { MongoClient } from "mongodb";


let cachedDb: null = null;
async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  cachedDb = await client.db("Todos");

  // const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

  // client.connect(async err => {
  //   cachedDb = await client.db("Todos");

  // })
  // Specify which database we want to use


  return cachedDb;
}



export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  // Get an instance of our database
  const db = await connectToDatabase();

  // Make a MongoDB MQL Query
  const users = await db.collection("cookies").find({}).toArray();

  return {
    statusCode: 200,
    body: JSON.stringify(users, null, 2),
  };
};

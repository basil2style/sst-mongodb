import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export async function handler() {
    const getParams = {
        // Get the table name from the environment variable
        TableName: process.env.tableName,
        // Get the row where the counter is called "hits"
        Key: {
            counter: "hits",
        },
    };
    const results = await dynamoDb.get(getParams).promise();

    // If there is a row, then get the value of the
    // column called "tally"
    console.log(results.Item);
    console.log(results.Item.tally)
    let count = results.Item ? results.Item.tally : 0;

    const putParams = {
        TableName: process.env.tableName,
        Key: {
            counter: "hits",
        },
        // Update the "tally" column
        UpdateExpression: "SET tally = :count",
        ExpressionAttributeValues: {
            // Increase the count
            ":count": ++count,
        },
    };
    await dynamoDb.update(putParams).promise();
    return {
        statusCode: 200,
        body: count,
    };
}
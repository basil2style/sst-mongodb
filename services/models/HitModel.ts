import dynamoose  from "dynamoose";
// const dynamoose = require('dynamoose');

const schema = new dynamoose.Schema(
    {
      id: {
        type: String,
        hashKey: true,
      },
      name: String,
      age: Number,
    },
    {
      timestamps: true,
    }
  );
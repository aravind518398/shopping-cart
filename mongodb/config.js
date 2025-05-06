const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const connectDB = async () => {
  await client.connect();
  console.log("DATABASE CONNECTED SUCCESSFULLY✅ ");
  const db = client.db("shop");
  return db;
};

module.exports = { connectDB };

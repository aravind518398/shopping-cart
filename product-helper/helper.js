const { connectDB } = require("../mongodb/config");

const addProduct = async (product) => {
  const db = await connectDB();
  const collection = await db.collection("product");
  const result = await collection.insertOne(product);
  
  console.log("INSERTED ONE DOCUMENT TO COLLECTION: (PRODUCT)✅");
  const data = await collection.findOne(result.insertedId);
  console.log(data);

  return result;
};

// FINDING DATA INSIDE THE SHOP DATABASE FROM COLLECTION "PRODUCT"

const getAllProduct = async(products) => {
    const db = await connectDB();
    const collection = await db.collection('product');
    const result = await collection.find();
    const productArray = await result.toArray();
    console.log(productArray)
    return productArray;
}



module.exports = { addProduct, getAllProduct };

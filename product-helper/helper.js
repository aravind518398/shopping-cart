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
    
    return productArray;
}

const deleteProduct = async (productId) => {
  const db = await connectDB();
  const collection = await db.collection('product');
  const result = await collection.deleteOne({_id:productId});
  console.log('DELETED ONE DOCUMENT FROM COLLECTION: (PRODUCT)✅' ,result)
  return result;
  

}


const editProduct = async (productId) => {
  const db = await connectDB();
  const collection = await db.collection('product');
  const result = await collection.findOne({_id:productId});
  
  return result;
}

const updateProduct = async (objId, body) => {
  const db = await connectDB();
  const collection = await db.collection('product');
  const result = await collection.updateOne({_id:objId}, {
    $set:{
      name:body.name,
      type:body.type,
      price:body.price,
      description:body.description
    }
  });
  console.log("UPDATED ONE DOCUMENT DETAILS FROM COLLECTION: (PRODUCT)✅", result)
  return result;
}

module.exports = { addProduct, getAllProduct, deleteProduct, editProduct, updateProduct };

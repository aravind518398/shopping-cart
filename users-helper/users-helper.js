const { ObjectId } = require('mongodb');
const { connectDB } = require("../mongodb/config");
const bcrypt = require('bcrypt')


const  forSignup = async (userData) => {
    console.log('I AM HERE')
    userData.password = await bcrypt.hash(userData.password,10)
    console.log('PASSWORD IS ENCRYPTED SUCCESSFULLY✅')
    const db = await connectDB();

    const collection = await db.collection("user");
    const result = await collection.insertOne(userData);
    
    console.log("INSERTED ONE DOCUMENT TO COLLECTION: (USER)✅");
    const data = await collection.findOne(result.insertedId);
    
    
    return data;
  };

const forLogin = async(userData)=> {
    const db = await connectDB();
    const collection = await db.collection('user');
    const user= await collection.findOne({email:userData.email});
     const response = {}
    if(user) {
       result = await bcrypt.compare(userData.password, user.password)
       if(result){
        console.log("LOGIN SUCCESS✅");
        response.user = user;
        response.result = true;
       } else {
        console.log("LOGIN FAILED❌")
        response.user = user;
        response.result = false;
       }
    } else {
        console.log('USER NOT FOUND❌')
        response.user = user;
        response.result = false;
    }
    return response
}


const addToCart = async(productId, userId) => {
    const db = await connectDB();
    console.log("DATABASE IS CONNECTED AT USER-HELPER LINE:49✅")
    const collection = await db.collection("cart");
    console.log("ADDED ONE COLLECTION TO DATABASE: (CART)✅")
    const document = collection.findOne({_id:userId});
    if (document) {
        const cartObj = {
            user:userId,
            products:[productId]
        } 
     const data = collection.insertOne(cartObj)
     console.log("INSERTED PRODUCT ID AND UID TO COLLECTION: (CART)✅")
     
     return data; 
    } 
}


module.exports = { forSignup, forLogin, addToCart };




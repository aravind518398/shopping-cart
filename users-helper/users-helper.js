const { response } = require("express");
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
    console.log(data);
  
    return result;
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


module.exports = {forSignup, forLogin}

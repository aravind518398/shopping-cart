const { connectDB } = require("../mongodb/config");
const bcrypt = require("bcrypt");

const forSignup = async (userData) => {
  console.log("I AM HERE");
  userData.password = await bcrypt.hash(userData.password, 10);
  console.log("PASSWORD IS ENCRYPTED SUCCESSFULLY✅");
  const db = await connectDB();

  const collection = db.collection("user");
  const result = await collection.insertOne(userData);

  console.log("INSERTED ONE DOCUMENT TO COLLECTION: (USER)✅");
  const data = await collection.findOne(result.insertedId);

  return data;
};

const forLogin = async (userData) => {
  const db = await connectDB();
  const collection = db.collection("user");
  const user = await collection.findOne({ email: userData.email });
  const response = {};
  if (user) {
    result = await bcrypt.compare(userData.password, user.password);
    if (result) {
      console.log("LOGIN SUCCESS✅");
      response.user = user;
      response.result = true;
    } else {
      console.log("LOGIN FAILED❌");
      response.user = user;
      response.result = false;
    }
  } else {
    console.log("USER NOT FOUND❌");
    response.user = user;
    response.result = false;
  }
  return response;
};

const addToCart = async (productId, userId) => {
  const db = await connectDB();
  console.log("DATABASE IS CONNECTED AT USER-HELPER LINE:49✅");

  const collection = db.collection("cart");
  console.log("ADDED ONE COLLECTION TO DATABASE: (CART)✅");

  const document = await collection.findOne({ user: userId });
  let productObj = {
    item: productId,
    quantity: 1,
  };

  if (document) {
    const prod = document.products;
    const productExist = prod.findIndex(
      (obj) => obj.item.toString() === productId.toString()
    );

    console.log(productExist);
    if (productExist == -1) {
      console.log("IF");
      await collection.updateOne(
        { user: userId },
        { $push: { products: productObj } }
      );
      console.log("PRODUCT ADDED TO EXISTING USER CART✅");
    } else {
      console.log("ELSE");
      await collection.updateOne(
        {
          "products.item": productId,
        },
        {
          $inc: { "products.$.quantity": 1 },
        }
      );
    }
  } else {
    const cartObj = {
      user: userId,
      products: [productObj],
    };
    const data = await collection.insertOne(cartObj);
    console.log("INSERTED PRODUCT ID AND UID TO COLLECTION: (CART)✅");

    return data;
  }
};

const getCartProducts = (uid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await connectDB();
      const collection = db.collection("cart");

      const documents = await collection
        .aggregate([
          {
            $match: { user: uid },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: "product",
              localField: "item",
              foreignField: "_id",
              as: "cartItems",
            },
          },
          {
            $unwind: "$cartItems", // Optional: if you want to flatten the array
          },
        ])
        .toArray();

      resolve(documents);
    } catch (error) {
      reject(error);
    }
  });
};

const removeCartProduct = async (productId, userId) => {
  const db = await connectDB();
  const collection = db.collection("cart"); 

  const document = await collection.updateOne(
    { user: userId },
    { $pull: { products: { item: productId } } }
  );
  console.log(document);
};

const getCartCount = async (userId) => {
  const db = await connectDB();
  const collection = db.collection("cart");
  const document = await collection.findOne({ user: userId });
  let count = 0;
  if (document) {
    count = document.products.length;
  } else {
    count = 0;
  }
  return count;
};

const increaseProductCount = async (productId, userId) => {
  const db = await connectDB();
  const collection = db.collection("cart"); 

  const document = await collection.updateOne(
    {
      user: userId,
      "products.item": productId
    },
    {
      $inc: { "products.$.quantity": +1 }
    }

  );
  console.log(document);
};
const decreaseProductCount = async (productId, userId) => {
  const db = await connectDB();
  const collection = db.collection("cart"); 

  const document = await collection.updateOne(
    {
      user: userId,
      "products.item": productId
    },
    {
      $inc: { "products.$.quantity": -1 }
    }

  );
  console.log(document);
};


module.exports = {
  forSignup,
  forLogin,
  addToCart,
  getCartProducts,
  removeCartProduct,
  getCartCount,
  increaseProductCount,
  decreaseProductCount
};

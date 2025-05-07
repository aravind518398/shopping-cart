var express = require("express");
var router = express.Router();
const objectId = require("mongodb").ObjectId;
const { getAllProduct } = require("../product-helper/helper");
const {
  forSignup,
  forLogin,
  addToCart,
  getCartProducts,
  removeCartProduct,
  getCartCount,
  increaseProductCount,
  decreaseProductCount,
  getTotalAmount,
  getPaymentMethod,
} = require("../users-helper/users-helper");

router.get("/", async function (req, res, next) {
  let user = req.session.user;

  let count = null;
  if (req.session.user) {
    let id = req.session.user._id;
    const userId = new objectId(id);
    count = await getCartCount(userId);
  }

  console.log("CART COUNT IS :", count);
  const products = await getAllProduct();

  res.render("./users-pages/user-home-page", {
    admin: false,
    products,
    user,
    count,
  });
});

router.get("/login", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("./users-pages/user-login-form", {
      admin: false,
      loginErr: req.session.loginErr,
    });
    req.session.loginErr = false;
  }
});
router.get("/signup", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.render("./users-pages/user-signup-form", { admin: false });
});
router.post("/signup", async (req, res) => {
  const response = await forSignup(req.body);

  if (response) {
    req.session.user = response;
    req.session.loggedIn = true;
    res.redirect("/");
  }
});
router.post("/login", async (req, res) => {
  const response = await forLogin(req.body);

  if (response.result) {
    req.session.user = response.user;
    req.session.loggedIn = true;
    res.redirect("/");
  } else {
    req.session.loggedIn = false;
    req.session.loginErr = "Invalid username or password.";
    res.redirect("/login");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
const varifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

router.get("/cart", varifyLogin, async (req, res) => {
  let user = req.session.user;
  const uid = new objectId(req.session.user._id);
  const total = await getTotalAmount(uid);
  const result = await getCartProducts(uid);
  // console.log(result)
  res.render("./users-pages/user-cart-page", {
    admin: false,
    user,
    result,
    total: total,
  });
});

router.get("/add-to-cart", varifyLogin, async (req, res) => {
  const id = req.query.id;
  const productId = new objectId(id);
  // console.log(productId)
  const userId = new objectId(req.session.user._id);
  // console.log(uid)
  const result = await addToCart(productId, userId);
  console.log(result);

  res.json({ status: true });
});

router.get("/remove-cart-product", varifyLogin, async (req, res) => {
  const id = req.query.id;
  const productId = new objectId(id);
  const userId = new objectId(req.session.user._id);
  const result = await removeCartProduct(productId, userId);
  res.redirect("/cart");
});
router.get("/increase-product-count", varifyLogin, async (req, res) => {
  const id = req.query.id;
  const productId = new objectId(id);
  const userId = new objectId(req.session.user._id);
  const result = await increaseProductCount(productId, userId);
  res.redirect("/cart");
});
router.get("/decrease-product-count", varifyLogin, async (req, res) => {
  const id = req.query.id;
  const productId = new objectId(id);
  const userId = new objectId(req.session.user._id);
  const result = await decreaseProductCount(productId, userId);

  res.redirect("/cart");
});

router.get("/place-order", varifyLogin, async (req, res) => {
  const user = req.session.user;
  const userId = new objectId(user._id);

  const result = await getTotalAmount(userId);
  console.log("Total amount:", result);

  res.render("./users-pages/user-delivery-details", {
    admin: false,
    user,
    total: result,
  });
});

router.post("/place-order", (req, res) => {
  console.log(req.body);
});

module.exports = router;

var express = require("express");
var objectId = require("mongodb").ObjectId;
var router = express.Router();
const {
  addProduct,
  getAllProduct,
  deleteProduct,
  editProduct,
  updateProduct,
} = require("../product-helper/helper");

/* GET Admin page. */
router.get("/", async function (req, res, next) {
  const products = await getAllProduct();

  res.render("./admin-pages/view-product-table", { admin: true, products });
});

router.get("/add-products", (req, res) => {
  res.render("./admin-pages/create-product-form", { admin: true });
});

router.post("/add-products", async function (req, res, next) {
  const addedProduct = await addProduct(req.body);
  const id = addedProduct.insertedId;
  console.log("START");
  console.log(id);
  console.log("END");

  if (req.files) {
    const file = req.files.image;
    const fileName = file.name;
    const extend = fileName.toString().split(".")[1];

    console.log(extend);
    file.mv("./public/images/" + id + "." + "png");

    console.log("IMAGE SUCCESFULLY UPLOADED TO PUBLIC/IMAGES FOLDER ✅ ");
    res.render("./admin-pages/create-product-form", { admin: true });
  } else {
    console.log("ERROR❌");
  }
});

router.get("/delete-product", async (req, res) => {
  const productId = req.query.id;
  const objId = new objectId(productId);
  const deletedId = await deleteProduct(objId);
  res.redirect("/admin");
});

router.get("/edit-product", async (req, res) => {
  const productId = req.query.id;
  const objId = new objectId(productId);
  const product = await editProduct(objId);

  res.render("./admin-pages/edit-created-product", { admin: true, product });
});

router.post("/edit-product", async (req, res) => {
  const body = await req.body;
  const productId = req.query.id;

  const objId = new objectId(productId);

  const updatedProduct = await updateProduct(objId, body);
  console.log(updatedProduct);
  res.redirect("/admin");

  if (req.files) {
    let file = req.files.image;
    file.mv("./public/images/" + productId + ".png");
  }
});
module.exports = router;

var express = require("express");
var router = express.Router();
const { addProduct, getAllProduct } = require("../product-helper/helper");

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
  const id = addedProduct.insertedId
  console.log("START");
  console.log(id);
  console.log("END");

  if (req.files) {
    const file = req.files.image;
    const fileName = file.name;
    const extend = fileName.toString().split(".")[1];

    console.log(extend);
    file.mv("./public/images/" +id+"." + 'png');

    console.log("IMAGE SUCCESFULLY UPLOADED TO PUBLIC/IMAGES FOLDER ✅ ");
    res.render("./admin-pages/create-product-form", { admin: true });
  } else {
    console.log("ERROR❌");
  }
});

module.exports = router;

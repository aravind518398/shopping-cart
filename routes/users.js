var express = require('express');
var router = express.Router();
const { getAllProduct } = require("../product-helper/helper");
/* GET users listing. */
router.get('/',async function(req, res, next) {

  const products = await getAllProduct();


  res.render('./users-pages/user-home-page', {admin:false, products});


});

router.get('/login', (req,res)=> {
  res.render('./users-pages/user-login-form', {admin:false})
})

module.exports = router;

var express = require('express');
var router = express.Router();
const { getAllProduct } = require("../product-helper/helper");
const {forSignup, forLogin} = require('../users-helper/users-helper')
/* GET users listing. */
router.get('/',async function(req, res, next) {

  const products = await getAllProduct();


  res.render('./users-pages/user-home-page', {admin:false, products});


});

router.get('/login', (req,res)=> {
  res.render('./users-pages/user-login-form', {admin:false})
})
router.get('/signup', (req,res)=> {
  res.render('./users-pages/user-signup-form', {admin:false})
})
router.post('/signup', (req,res)=> {
  console.log(req.body)
  forSignup(req.body)
})
router.post('/login', async(req,res)=> {
     const response = await forLogin(req.body);
     if(response.result) {
      res.redirect('/');
     } else {
      res.redirect('/login')
     }
  
})
module.exports = router;

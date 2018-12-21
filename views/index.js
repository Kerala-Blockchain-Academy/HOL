var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
    //var {SimpleWalletClient} = require('./SimpleWalletClient') 

var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res){
    res.redirect("/manufacturer");
})

//Get home view
router.get('/manufacturer', function(req, res){
    res.render('manufacturer');
});

//Get main view
router.get('/sale', function(req, res){
    res.render('sale');
});

// Get Deposit view
router.get('/stockist',function(req, res){
    res.render('stockist_to_warehouse');
})

//Get Withdraw view
router.get('/warehouse',function(req, res){
    res.render('warehouse_to_pos');
})

/*

//Get Transfer View
router.get('/transfer',function(req, res){
    res.render('transferPage');
})

//Get Balance View
router.get('/balance', function(req, res){
    res.render('balancePage');
})

*/


module.exports = router;
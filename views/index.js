var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var path = require('path');
    //var {SimpleWalletClient} = require('./SimpleWalletClient') 

var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res){
    res.redirect("/manufacturer");
})

//Get home view
router.get('/manufacturer', function(req, res){
    res.sendFile(path.join(__dirname, '/clients/manufacturer.html'));
});

//Get main view
router.get('/sale', function(req, res){
    res.sendFile(path.join(__dirname, '/clients/sale.html'));
});

// Get Deposit view
router.get('/stockist',function(req, res){
    res.sendFile(path.join(__dirname, '/clients/stockist_to_warehouse.html'));
})

//Get Withdraw view
router.get('/warehouse',function(req, res){
    res.sendFile(path.join(__dirname, '/clients/warehouse_to_pos.html'));
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
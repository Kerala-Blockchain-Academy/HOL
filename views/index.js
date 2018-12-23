var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var path = require('path');
// var {ProjectHolClient} = require('./ProjectHolClient') 

var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res){
    res.redirect("/manufacturer");
})

//Get Manufacturer view
router.get('/manufacturer', function(req, res){
    res.sendFile(path.join(__dirname, '/clients/manufacturer.html'));
});

//Get POS view
router.get('/sale', function(req, res){
    res.sendFile(path.join(__dirname, '/clients/sale.html'));
});

// Get Stockist view
router.get('/stockist',function(req, res){
    res.sendFile(path.join(__dirname, '/clients/stockist_to_warehouse.html'));
})

//Get Warehouse view
router.get('/warehouse',function(req, res){
    res.sendFile(path.join(__dirname, '/clients/warehouse_to_pos.html'));
})



module.exports = router;
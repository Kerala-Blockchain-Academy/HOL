'use strict'



const {
  InvalidTransaction,
  InternalError
} = require('sawtooth-sdk/processor/exceptions')
const crypto = require('crypto')
const { TextEncoder, TextDecoder } = require('text-encoding/lib/encoding')
const protobuf = require("protobufjs")
const _hash = (x) => crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 64)
var encoder = new TextEncoder('utf8')
var decoder = new TextDecoder('utf8')


const { TransactionHandler } = require('sawtooth-sdk/processor/handler')// require the transaction module here from SDK

//declare all CONSTANTS 
const FAMILY_NAME = 'manufacturing';
const NAMESPACE = _hash(FAMILY_NAME).substr(0,6);





//main class that extends the TransactionHandler class
class ManufacturerHandler extends TransactionHandler
{
  
  
  constructor()
  {
    super(FAMILY_NAME,['1.0'],[NAMESPACE])
  }

  //the main apply function where all execution happens
  apply(txProcessRequest, context)
  {
    //extracting and decoding payload from TransactionProcessRequest
    var payload = txProcessRequest.payload;
    var payloadDecoded = _decodeRequest(payload.toString());

    console.log("TXPROCREQUEST: ",txProcessRequest)
    console.log("Payload Actions: ",payloadDecoded.action, typeof (payloadDecoded.action))
    console.log("Payload Type: ",payloadDecoded.cType)
    console.log("Payload Quantity: ",payloadDecoded.quantity, typeof (payloadDecoded.quantity))
    console.log("PAYLOAD: ",payload.toString()) 

    // //getting state address from TransactionHeader
    // let txHeader = txProcessRequest.header;
    // let userPublicKey = txHeader.signerPublicKey;
    // let stateAddress = NAMESPACE+_hash(userPublicKey)
    


  


   
  }
}



module.exports = CookieJarHandler// Module name here
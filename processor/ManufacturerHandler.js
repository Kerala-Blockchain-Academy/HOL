'use strict'



const {
  InvalidTransaction,
  InternalError
} = require('sawtooth-sdk/processor/exceptions')
const crypto = require('crypto')
const { TextEncoder, TextDecoder } = require('text-encoding/lib/encoding')
const protobuf = require("protobufjs")
const _hash = (x) => crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 70)
var encoder = new TextEncoder('utf8')
var decoder = new TextDecoder('utf8')


const { TransactionHandler } = require('sawtooth-sdk/processor/handler')// require the transaction module here from SDK

//declaring all CONSTANTS 
const FAMILY_NAME = 'manufacturing';
const NAMESPACE = _hash(FAMILY_NAME).substr(0,6);

//loading ProtoBuf
var assetCreateProto;
protobuf.load("../protofiles/HolStructure.proto", function(err,root) 
  {
    if (err)
    {
      throw (err);
    }
    assetCreateProto = root.lookupType("HolStructure.holStructure");
    
  });


const decodeProto = function(stateValue)
{
    var buffer = assetCreateProto.decode(stateValue);

    return buffer;
}


//function to decode & validate payload coming from the client
const _decodeRequest = function(payload)
{
  var payloadActions = payload.split(',');
  var payloadDecoded = {action: payloadActions[0], bottleID: payloadActions[1], liqType: payloadActions[2], mfrID: payloadActions[3], mfrTime: payloadActions[4] };
  return payloadDecoded;
}

//check payload for null i.e. if it follows all rules
const checkPayload = function(payloadDecoded)
{
  if((payloadDecoded.action==='create') && payloadDecoded.bottleID && payloadDecoded.liqType && payloadDecoded.mfrID && payloadDecoded.mfrTime)
  {
    return true;
  }
  throw new InvalidTransaction('Invalid Payload: Payload must follow convention.') ;
}


//creating asset record in state
const createAsset = function(context, payloadDecoded, assetAddress)
{
  console.log("****HITTING createAsset ENCODE BLOCK***")
    let  manufacturerID = payloadDecoded.mfrID
    let  liqType = payloadDecoded.liqType
    let  bottleID = payloadDecoded.bottleID
    let  dateMfr = payloadDecoded.mfrTime
    let encodedStateValue
  
  encodedStateValue = assetCreateProto.encode(
    {
      manufacturerID: manufacturerID,
      liqType: liqType,
      bottleID: bottleID,
      dateMfr: dateMfr
    }
  ).finish();

  
  console.log("ENCODED PBUF: ", encodedStateValue )
  viewAsset(context,assetAddress)
  let stateVal = {[assetAddress]: encodedStateValue};
  return (context.setState(stateVal))
  

    
}



const viewAsset = function(context,assetAddress)
{
  let getPromise = context.getState([assetAddress]);
  return getPromise.then(function checkState(stateMapping){
  let stateValue = stateMapping[assetAddress];
  console.log("ENTERED STATEVAL: ",stateValue)
  var buffer = decodeProto(stateValue);
  console.log("ASSET BUFFER FROM STATE: ", buffer)

  })
}




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
    console.log("PAYLOAD : ",payload.toString()) 

  
    if(checkPayload(payloadDecoded))
    {
      let assetAddress = _hash(payloadDecoded.bottleID)
      return (createAsset(context, payloadDecoded, assetAddress));
    }


   
  }
}



module.exports = ManufacturerHandler// Module name here

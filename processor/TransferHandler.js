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

//declare all CONSTANTS 
const FAMILY_NAME = 'transfer';
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

//function to decode proto buffer from state
const decodeProto = function(stateValue)
  {
      var buffer = assetCreateProto.decode(stateValue);
  
      return buffer;
  }


//function to decode & validate payload coming from the client
const _decodeRequest = function(payload)
{
  var payloadActions = payload.split(',');
  var payloadDecoded = {action: payloadActions[0], bottleID: payloadActions[1], fromType: payloadActions[2], toID: payloadActions[3], transferTime: payloadActions[4] };
  return payloadDecoded;
}

//check payload for null i.e. if it follows all rules
const checkPayload = function(payloadDecoded)
{
  if((payloadDecoded.action==='transfer') && payloadDecoded.bottleID && payloadDecoded.fromType && payloadDecoded.toID && payloadDecoded.transferTime)
  {
    return true;
  }
  throw new InvalidTransaction('Invalid Payload: Payload must follow convention.') ;
}

//function update state on the transfer made
const transferAsset = function(context, payloadDecoded, assetAddress)
{
  let encodedStateValue
  let toID = payloadDecoded.toID 
  let transferTime = payloadDecoded.transferTime

  console.log("****HITTING TRANSFERASSET ENCODE BLOCK***")

  let getPromise = context.getState([assetAddress]);
  return getPromise.then(function checkState(stateMapping){
  let stateValue = stateMapping[assetAddress];
  console.log("ENTERED STATEVAL: ",stateValue)
  var buffer = decodeProto(stateValue);
  console.log("ASSET BUFFER FROM STATE: ", buffer)
 
//updating the state values based on where the transfer is initiated from 
if (buffer.bottleID == payloadDecoded.bottleID)
{
  if(payloadDecoded.fromType === 'MFR')
  {
    encodedStateValue = assetCreateProto.encode(
      { 
        manufacturerID: buffer.manufacturerID,
        liqType: buffer.liqType,
        bottleID: buffer.bottleID,
        dateMfr: buffer.dateMfr,
        stockistID: toID,
        stockistEntry: transferTime
      }
    ).finish();
  }
  else if (payloadDecoded.fromType === 'STK')
  {
    encodedStateValue = assetCreateProto.encode(
      {
        manufacturerID: buffer.manufacturerID,
        liqType: buffer.liqType,
        bottleID: buffer.bottleID,
        dateMfr: buffer.dateMfr,
        stockistID: buffer.stockistID,
        stockistEntry: buffer.stockistEntry,
        stockistExit: transferTime,
        warehouseID: toID,
        wareEntry: transferTime
      }
    ).finish();
  }
  else if(payloadDecoded.fromType === 'WRH')
  {
    encodedStateValue = assetCreateProto.encode(
      {
        manufacturerID: buffer.manufacturerID,
        liqType: buffer.liqType,
        bottleID: buffer.bottleID,
        dateMfr: buffer.dateMfr,
        stockistID: buffer.stockistID,
        stockistEntry: buffer.stockistEntry,
        stockistExit: buffer.stockistExit,
        warehouseID: buffer.warehouseID,
        wareEntry: buffer.wareEntry,
        wareExit: transferTime,
        posID: toID,
        posEntry: transferTime
      }
    ).finish();
  }

}
else
{
  throw new InvalidTransaction('Bottle ID does NOT exist !') ;
}
  


  let stateVal = {[assetAddress]: encodedStateValue};
  return (context.setState(stateVal))



  });


 
}


//main class that extends the TransactionHandler class
class TransferHandler extends TransactionHandler
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
    console.log("PAYLOAD: ",payload.toString()) 

  
    if(checkPayload(payloadDecoded))
    {
      let assetAddress = _hash(payloadDecoded.bottleID)
      return (transferAsset(context, payloadDecoded, assetAddress));
    }


  


   
  }
}



module.exports = TransferHandler// Module name here
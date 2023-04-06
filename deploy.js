console.log("Deploying...")
const Web3 = require("web3");
const {default: Common} = require('@ethereumjs/common');
var Tx = require('@ethereumjs/tx').Transaction;
const { bytecode } = require("./compile");

// TYPE YOUR PRIVATE KEY
var privateKey = Buffer.from('8b2c4ca73a4ce874432997a1a0851ff11283996f512b39f2640d009d8dc8b408', 'hex');

// Specify lacchain network node to connect to
const provider = new Web3.providers.HttpProvider('https://lachain.lacchain.net')
// Colocar IP address del nodo con http://
const web3 = new Web3('http://20.127.223.24');

const deploy = async () => {
  const txCount = await web3.eth.getTransactionCount('1306E8B4CD9593c49E2A021DAF7d513d7E634405')
  //Colocar NodeAddress
  const nodeAddress = "0x07eae2a8d012570707d3ced0562e4d0beca22a18"
  const expiration = 1836394529
  let value = web3.eth.abi.encodeParameters(
    ["address","uint256"],
    [nodeAddress,expiration])//setting the value

  var rawTx = {
    nonce: web3.utils.toHex(txCount),
    gasPrice: '0x00',
    gasLimit: '0x300000',
    value: '0x00',
    data: '0x'+bytecode+value.substr(2)
  }

  const c = Common.custom()
  c.setHardfork('homestead')
  var tx = new Tx(rawTx,{ common: c });
  const signedTx = tx.sign(privateKey)
  var serializedTx = signedTx.serialize();

  console.log(serializedTx.toString('hex'));

  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .on('receipt', console.log);
};
deploy();
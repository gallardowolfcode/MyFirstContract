console.log('Send a Transaction...')
const Web3 = require('web3')
const { default: Common } = require('@ethereumjs/common')
var Tx = require('@ethereumjs/tx').Transaction

// TYPE YOUR PRIVATE KEY
var privateKey = Buffer.from(
  '8b2c4ca73a4ce874432997a1a0851ff11283996f512b39f2640d009d8dc8b408',
  'hex'
)
//Colocar el contractAddres Deploy que se genera despues de ejecutar el comando deploy.js
const contractAddress = '0x8ac4f4dC9A0837fBf12dd235D682f0682e19b19d'

// Specify lacchain network node to connect to
// Colocar dirección IP del nodo
const web3 = new Web3('http://20.127.223.24')

const send = async () => {
  const txCount = await web3.eth.getTransactionCount(
    '1306E8B4CD9593c49E2A021DAF7d513d7E634405'
  )

  const bytesFunc = web3.eth.abi.encodeFunctionSignature('setMessage(string)')
  const parameter = web3.eth.abi.encodeParameter(
    'string',
    'my first transaction'
  )
    //Colocar el NodeAddress
  const nodeAddress = '0x07eae2a8d012570707d3ced0562e4d0beca22a18'
  const expiration = 1836394529
  let value = web3.eth.abi.encodeParameters(
    ['address', 'uint256'],
    [nodeAddress, expiration]
  ) //setting the value

  var rawTx = {
    nonce: web3.utils.toHex(txCount),
    to: contractAddress,
    gasPrice: '0x00',
    gasLimit: '0x300000',
    value: '0x00',
    data: bytesFunc + parameter.substr(2) + value.substr(2)
  }

  const c = Common.custom()
  c.setHardfork('homestead')
  var tx = new Tx(rawTx, { common: c })
  const signedTx = tx.sign(privateKey)
  var serializedTx = signedTx.serialize()

  //  console.log(serializedTx.toString('hex'));

  web3.eth
    .call({
      to: contractAddress, // contract address
      data: '0xce6d41de' //getMessage()
    })
    .then(result => {
      let decoded = web3.eth.abi.decodeParameter('string', result)
      console.log('Current value:', decoded)
    })
    .catch(ex => {
      console.log(ex)
    })

  await web3.eth
    .sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .on('receipt', function (receipt) {
      console.log('TransactionHash:', receipt.transactionHash)
    })

  web3.eth
    .call({
      to: contractAddress, // contract address
      data: '0xce6d41de' //getMessage()
    })
    .then(result => {
      let decoded = web3.eth.abi.decodeParameter('string', result)
      console.log('New value set:', decoded)
    })
    .catch(ex => {
      console.log(ex)
    })
}
send()

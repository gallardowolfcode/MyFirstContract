console.log('Compiling...')
const path = require('path')
const fs = require('fs-extra')
const solc = require('solc')
const buildPath = path.resolve(__dirname, './build')
const contractPath = path.resolve(__dirname, './contracts', 'MyContract.sol')

const myContractSource = fs.readFileSync(contractPath, 'utf8')
console.log('Acá mero' + ' ' + contractPath);
var input = {
  language: 'Solidity',
  sources: {
    'MyContract.sol': {
      content: myContractSource
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
}

const output = JSON.parse(solc.compile(JSON.stringify(input)))
console.log('Acá mero' + ' ' + output.contracts);

const contracts = output.contracts['MyContract.sol']
const contract = contracts['MyContract']

fs.writeFileSync(
  path.resolve(buildPath, `MyContract.json`),
  JSON.stringify(contract.abi, null, 2),
  'utf8'
)

const contractDeploy = {
  interface: contract.abi,
  bytecode: contract.evm.bytecode.object
}

module.exports = contractDeploy

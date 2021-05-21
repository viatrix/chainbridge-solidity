require("@eth-optimism/hardhat-ovm");
require("@nomiclabs/hardhat-truffle5");

module.exports = {
  networks: {
    hardhat: {
    },
    // Add this network to your config!
    optimism: {
      url: 'http://127.0.0.1:8545',
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk'
      },
      // This sets the gas price to 0 for all transactions on L2. We do this
      // because account balances are not automatically initiated with an ETH
      // balance (yet, sorry!).
      gasPrice: 0,
      gas: 9000000-1,
      ovm: true // This sets the network as using the ovm and ensure contract will be compiled against that.
    }
  },
  solidity: {
    version: '0.6.12',
    settings: {
      optimizer: {
        enabled: true,
        runs: 10000
      }
    }
  },
  ovm: {
    solcVersion: '0.6.12'
  },
  mocha: {
    timeout: 50000
  }
}
// require('@nomiclabs/hardhat-ethers')
// require('@nomiclabs/hardhat-waffle')
// require('hardhat-deploy')
require("@eth-optimism/hardhat-ovm");
require("@nomiclabs/hardhat-truffle5");

module.exports = {
  networks: {
    hardhat: {
    },
    // Add this network to your config!
    optimism: {
      url: 'http://127.0.0.1:8545',
      // instantiate with a mnemonic so that you have >1 accounts available
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk'
      },
      gasPrice: 0,
      ovm: true // This sets the network as using the ovm and ensure contract will be compiled against that.
    },
  },
  solidity: '0.6.12',
  ovm: {
    solcVersion: '0.6.12'
  },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
  }
}
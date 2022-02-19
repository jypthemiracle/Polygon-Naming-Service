require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.10"
      },
      {
        version: "0.7.6",
        settings: {}
      }
    ]
  },
  networks: {
    // mumbai: {
    //   url: "https://polygon-mumbai.g.alchemy.com/v2/" + process.env.ALCHEMY_MUMBAI_KEY,
    //   accounts: [process.env.METAMASK_PRIVATE_KEY],
    //   gas: 9100000,
    //   gasPrice: 8000000000
    // },
    // ropsten: {
    //   url: "https://ethereum-ropsten-rpc.allthatnode.com/" + process.env.DSRV_ROPSTEN_KEY,
    //   accounts: [process.env.METAMASK_PRIVATE_KEY],
    //   gas: 9100000,
    //   gasPrice: 8000000000
    // },
    // rinkeby: {
    //   url: "https://ethereum-rinkeby-rpc.allthatnode.com/" + process.env.DSRV_ROPSTEN_KEY,
    //   accounts: [process.env.METAMASK_PRIVATE_KEY],
    //   gas: 9100000,
    //   gasPrice: 8000000000
    // },
    polygon: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/sdY2bOZQToMBNzEh7_FMgdvx9pB_jUfF",
      accounts: [process.env.METAMASK_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY
  }
};

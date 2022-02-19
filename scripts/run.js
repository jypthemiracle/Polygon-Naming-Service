// So what does this mean? Every time you run a terminal command that starts with npx hardhat you are getting this hre object built on the fly using the hardhat.config.js specified in your code!
// This means you will never have to actually do some sort of import into your files like:

const main = async () => {
    // This will actually compile our contract and generate the necessary files we need to work with our contract under the artifacts directory. 
    // Go check it out after you run this :)
    const domainContractFactory = await hre.ethers.getContractFactory('Domains');
    // What's happening here is Hardhat will create a local Ethereum network for us, but just for this contract.
    // Then after the script completes, it will destroy that local network.
    // So, every time you run the contract it will be a fresh blockchain.
    // Whats the point? It's kinda like refreshing your local server every time so you always start from a clean slate which makes it easy to debug errors.
    const domainContract = await domainContractFactory.deploy();
    // We'll wait until our contract is officially mined and deployed to our local blockchain!
    // That's right, hardhat actually creates fake "miners" on your machine to try its best to imitate the actual blockchain.
    await domainContract.deployed();
    // Finally, once it's deployed domainContract.address will basically give us the address of the deployed contract. This address is how we can actually find our contract on the blockchain.
    // Right now on our local blockchain it's just us. So, this isn't that cool.
    console.log("contract deployed to: ", domainContract.address);
}

const runMain = async () => {
    try {
        await main();
        return;
    } catch (error) {
        console.log(error);
        return;
    }
}

runMain();

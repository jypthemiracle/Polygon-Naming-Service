const main = async () => {
    const domainContractFactory = await hre.ethers.getContractFactory('Domains');
    const domainContract = await domainContractFactory.deploy("sigrid");
    await domainContract.deployed();

    console.log("Contract deployed to:", domainContract.address);

    let txn = await domainContract.register("jin", { value: hre.ethers.utils.parseEther('1') });
    await txn.wait();
    console.log("Minted domain jin.sigrid");

    txn = await domainContract.setRecord("jin", "I am Sigrid Jin");
    await txn.wait();
    console.log("Set record for jin.sigrid");

    const address = await domainContract.getAddress("jin");
    console.log("Owner of domain jin:", address);

    const balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
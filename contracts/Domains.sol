pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract Domains {
    
    mapping(string => address) public domains;

    constructor() {
        console.log("hello, domain contract is here.");
    }

    // register function to add their names to our mapping
    function register(string calldata name) public {
        domains[name] = msg.sender;
        console.log('%s has registered a domain!', msg.sender);
    }

    // gives the domain owner's address
    function getAddress(string calldata name) public view returns (address) {
        return domains[name];
    }
}
pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract Domains {
    
    mapping(string => address) public domains;
    mapping(string => string) public records;

    constructor() {
        console.log("hello, domain contract is here.");
    }

    // register function to add their names to our mapping
    function register(string calldata name) public {
        require(domains[name] == address(0));
        domains[name] = msg.sender;
        console.log('%s has registered a domain!', msg.sender);
    }

    // gives the domain owner's address
    function getAddress(string calldata name) public view returns (address) {
        return domains[name];
    }

    // check that the owner is the transaction sender
    function setRecord(string calldata name, string calldata record) public {
        require(testStr(record) == true, "should be alphanumeric");
        require(domains[name] == msg.sender);
        records[name] = record;
    }

    function getRecord(string calldata name) public view returns (string memory) {
        return records[name];
    }

    function testStr(string calldata str) public pure returns (bool){
        bytes memory b = bytes(str);
        if(b.length > 13) return false;

        for(uint i; i<b.length; i++){
            bytes1 char = b[i];

            if(
                !(char >= 0x30 && char <= 0x39) && //9-0
                !(char >= 0x41 && char <= 0x5A) && //A-Z
                !(char >= 0x61 && char <= 0x7A) && //a-z
                !(char == 0x2E) //.
            )
                return false;
        }

        return true;
    }
}
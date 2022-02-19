pragma solidity ^0.8.10;

import { StringUtils } from "./libraries/StringUtils.sol";
import "hardhat/console.sol";

contract Domains {

    string public tld;
    
    mapping(string => address) public domains;
    mapping(string => string) public records;

    constructor(string memory _tld) payable {
        tld = _tld;
        console.log("hello, domain contract is here.");
    }

    function price(string calldata name) public pure returns (uint) {
        uint len = StringUtils.strlen(name);
        require(len > 0);
        if (len == 3) {
            // 5 MATIC = 5 000 000 000 000 000 000 (18 decimals).
            return 5 * 10 ** 17;
        }
        if (len == 4) {
            return 3 * 10 ** 17;
        }
        return 1 * 10 ** 17;
    }

    // register function to add their names to our mapping
    function register(string calldata name) public payable {
        require(domains[name] == address(0));
        uint _price = this.price(name);
        // Check if enough Matic was paid in the transaction
        require(msg.value >= _price, "Not enough Matic paid");
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
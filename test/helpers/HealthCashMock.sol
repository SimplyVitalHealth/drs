pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract HealthCashMock is StandardToken {

  string public name = "Health Cash";
  string public symbol = "HLTH";
  address public owner = 0x0000000000000000000000000000000000000000000000000000000000000000;

  uint256 public decimals = 18;
  uint256 public INITIAL_SUPPLY = 100000000;

   constructor() {
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
    owner=msg.sender;
  }


  function getOwner() public constant returns (address) {
      return owner;
    }


  function getBalance() public constant returns (uint256) {
      return balances[msg.sender];
    }


}

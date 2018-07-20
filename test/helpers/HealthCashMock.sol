pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract HealthCashMock is StandardToken {

  string public name = "Health Cash";
  string public symbol = "HLTH";
  uint256 public decimals = 18;
  uint256 public INITIAL_SUPPLY = 100000000;

   constructor() {
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }

}

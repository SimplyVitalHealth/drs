pragma solidity ^0.5.0;

import '../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';

contract HealthCashMock is ERC20 {

  string public name = "Health Cash";
  string public symbol = "HLTH";
  mapping(address => uint256) public balances;
  mapping(address => mapping (address => uint256)) allowed;
  uint256 public decimals = 18;
  uint256 public INITIAL_SUPPLY = 100000000000;
  uint256 public _totalSupply;

  constructor() public {
    _totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }

}
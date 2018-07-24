pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

/**
* Health Decentralized Record Service (DRS)
* This contract enables creation of services and keys which can
* be managed, shared, traded, and sold using Health Cash (HLTH).
*
* These keys enable gatekeeper services and
* cryptographically secure data exchanges.
*/

contract HealthSearch is Ownable {

   StandardToken public token;
   address public latestContract = address(this);
   uint8 public version = 1;
   uint public minimumHold = 1000;
   uint public maxSearches = 8;
   uint public maxSearchesPerTag = 8;

   uint public PricePerTag = 1;


   struct Service {
       string url;
       address owner;
   }

   struct Key {
       address owner;
       bool canShare;
       bool canTrade;
       bool canSell;
       bytes32 service;
   }



//market
   struct buyingData {
       bytes32 keyId;
       bytes32 tag1;
       bytes32 tag2;
       bytes32 contact;
       address owner;
       uint256 timeStamp;

   }

//market

   struct sellingData {
       bytes32 keyId;
       bytes32 tag1;
       bytes32 tag2;
       bytes32 contact;
       address owner;
       uint256 timeStamp;

   }


   //market
   mapping(bytes32 => sellingData[]) public sellerInformation;
   mapping(bytes32 => buyingData[]) public buyingInformation;
   mapping(address => uint) public numbeOfSearches;



   //certain functions require the user to have tokens
   modifier holdingTokens() {
     require(token.balanceOf(msg.sender) >= minimumHold);
     _;
   }

   modifier holdingTokensSameAsNumberOfSearches() {
     require(token.balanceOf(msg.sender) >= numbeOfSearches[msg.sender]);
     require(numbeOfSearches[msg.sender] <= maxSearches);

     _;
   }


   //prevent accidentally​ sending/trapping ether
   function() {
       revert();
   }

  //require token specified at deployment
   constructor(StandardToken _token) public{
      token = _token;
  }


   //user must authorize this contract to spend Health Cash (HLTH)
   function authorizedToSpend() public constant returns (uint) {
       return token.allowance(msg.sender, address(this));
   }

   //allow owner access to tokens erroneously transferred to this contract
   function recoverTokens(StandardToken _token, uint amount) public onlyOwner {
       _token.transfer(owner, amount);
   }

   function setHealthCashToken(StandardToken _token) public onlyOwner {
       token = _token;
   }

   function setLatestContract(address _contract) public onlyOwner {
       latestContract = _contract;
   }


   /**
   * Market Search
   */
   /*mapping(bytes32 => bytes32[]) public sellerInformation;
   mapping(bytes32 => bytes32[]) public buyingInformation;*/

   function getPotentialSellers(bytes32 tag1, bytes32 tag2)
       public
       returns (bytes32[])
   {
     bytes32 id = keccak256(abi.encodePacked(tag1, tag2));
     bytes32[] memory toReturn=new bytes32[](sellerInformation[id].length);

     for ( uint i = 0; i < sellerInformation[id].length; i++) {
       if((block.timestamp-sellerInformation[id][i].timeStamp)>=2630000){
         delete sellerInformation[id][i];
         numbeOfSearches[sellerInformation[id][i].owner]--;
         require(token.transferFrom(this,sellerInformation[id][i].owner,PricePerTag));
         i--;
         continue;
       }

       toReturn[i]=sellerInformation[id][i].contact;
     }

     return  toReturn;

   }


   function getPotentialBuyers(bytes32 tag1, bytes32 tag2)
       public
       returns (bytes32[])
   {
     bytes32 id = keccak256(abi.encodePacked(tag1, tag2));
     bytes32[] memory toReturn=new bytes32[](buyingInformation[id].length);

     for ( uint i = 0; i < buyingInformation[id].length; i++) {
       if((block.timestamp-buyingInformation[id][i].timeStamp)>=2630000){
         delete buyingInformation[id][i];
         numbeOfSearches[buyingInformation[id][i].owner]--;
         require(token.transferFrom(this,buyingInformation[id][i].owner,PricePerTag));
         i--;
         continue;
       }
       toReturn[i]=buyingInformation[id][i].contact;
     }

     return  toReturn;

   }



   function deletePotentialSellers(bytes32 tag1, bytes32 tag2)//, bytes32 contact)
       public

   {
     bytes32 id = keccak256(abi.encodePacked(tag1, tag2));
     /*require(sellingData[id].owner == msg.sender); //Ensures existence*/
     for(uint i=0;i<sellerInformation[id].length;i++){
       if( sellerInformation[id][i].owner==msg.sender){
         delete sellerInformation[id][i];
         numbeOfSearches[msg.sender]--;
         require(token.transferFrom(this,msg.sender,PricePerTag));
         break;
       }
     }
   }

   function deletePotentialBuyers(bytes32 tag1, bytes32 tag2)//, bytes32 contact)
       public


   {
     bytes32 id = keccak256(abi.encodePacked(tag1, tag2));
     for(uint i=0;i<buyingInformation[id].length;i++)
     {
       if( buyingInformation[id][i].owner==msg.sender){
         delete buyingInformation[id][i];
         numbeOfSearches[msg.sender]--;
         require(token.transferFrom(this,msg.sender,PricePerTag));
         break;
       }
     }

   }



   function setPotentialSellers(bytes32 keyId, bytes32 tag1, bytes32 tag2, bytes32 contact)
       public

       holdingTokensSameAsNumberOfSearches()

   {

     bytes32 id = keccak256(abi.encodePacked(tag1, tag2));
     for ( uint i = 0; i < sellerInformation[id].length; i++) {
       if((block.timestamp-sellerInformation[id][i].timeStamp)>=2630000){
         delete sellerInformation[id][i];
         numbeOfSearches[sellerInformation[id][i].owner]--;
         require(token.transferFrom(this,sellerInformation[id][i].owner,PricePerTag));
         i--;
         continue;
       }
     }

     require(buyingInformation[id].length<=maxSearchesPerTag);
     require(token.transferFrom(msg.sender,this,PricePerTag));


     sellingData memory newData;
     newData.tag1=tag1;
     newData.keyId=keyId;
     newData.timeStamp=block.timestamp;
     newData.owner = msg.sender;
     newData.tag2=tag2;
     newData.contact=contact;
     sellerInformation[id].push(newData);
     numbeOfSearches[msg.sender]++;

   }

   function setPotentialBuyers(bytes32 keyId,bytes32 tag1, bytes32 tag2, bytes32 contact)
       public

       holdingTokensSameAsNumberOfSearches()


   {



     bytes32 id = keccak256(abi.encodePacked( tag1, tag2));

     for ( uint i = 0; i < buyingInformation[id].length; i++) {
       if((block.timestamp-buyingInformation[id][i].timeStamp)>=2630000){
         delete buyingInformation[id][i];
         numbeOfSearches[buyingInformation[id][i].owner]--;
         require(token.transferFrom(this,buyingInformation[id][i].owner,PricePerTag));
         i--;
         continue;
       }
     }

     require(buyingInformation[id].length<=maxSearchesPerTag);
     require(token.transferFrom(msg.sender,this,PricePerTag));

     /*require(buyingInformation[id].owner == address(0)); //prevent overwriting*/
     buyingData memory newData;

     newData.tag1=tag1;
     newData.keyId=keyId;
     newData.timeStamp=block.timestamp;
     newData.owner = msg.sender;
     newData.tag2=tag2;
     newData.contact=contact;
     buyingInformation[id].push(newData);
     numbeOfSearches[msg.sender]++;

   }




   /**
   * ecrecover passthrough
   */
   function recoverAddress(
       bytes32 msgHash,
       uint8 v,
       bytes32 r,
       bytes32 s)
       constant
       public
       returns (address)
   {
     return ecrecover(msgHash, v, r, s);
   }

}

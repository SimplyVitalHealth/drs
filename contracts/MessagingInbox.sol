pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract MessagingInbox {

  address public owner;
  mapping(address => string[]) private messages;
  StandardToken  public token;
  address [] private contactList;
  uint256 private contactListSize;

  uint8 contactPrice;

 constructor(StandardToken _token) public {
  owner=msg.sender;
  token = _token;
  contactPrice=1;
  }


  modifier onlyOwner() {
    require(owner != msg.sender);
    _;
  }


function contactAddToList() public {
    require(token.transferFrom(msg.sender,owner,contactPrice));
    for(uint256 i=0;i<contactList.length;i++){
      if(contactList[i]==0){
        contactList[i]=msg.sender;
        return;
      }
    }
    contactList.push(msg.sender);
  }

function getContacts() public onlyOwner returns (address[]){
        return contactList;
  }


function deleteContact(address toDelete) public onlyOwner{
        for(uint256 i=0;i<contactList.length;i++){
          if(contactList[i]==toDelete){
            delete contactList[i];
            }
          }
  }


function setPrice(uint8 newPrice) public onlyOwner{

      contactPrice=newPrice;
  }


function sendMessage(string newMessage) public {
  if(messages[msg.sender].length<100)
    messages[msg.sender].push(newMessage);
  else{
    for(uint8 i=0;i<messages[msg.sender].length-1;i++){
      messages[msg.sender][i]=messages[msg.sender][i+1];
    }
    messages[msg.sender][99]=newMessage;
  }
  }

  function getMessagelenght(address retrieveID) public constant onlyOwner returns (uint256){
          return messages[retrieveID].length;
    }

  function getMessage(address retrieveID,uint8 index) public constant onlyOwner returns (string){
    return messages[retrieveID][index];
  }

//TODO:  allow to return strings once possible
/*function retrieveMessage(address retrieveID) public  onlyOwner returns (string[100]){
  string[100] memory messageArray = messages[retrieveID];
  return messageArray;
}*/



}

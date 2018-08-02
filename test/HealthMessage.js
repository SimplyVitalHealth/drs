const BigNumber = web3.BigNumber
const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

var HealthCashMock = artifacts.require('./helpers/HealthCashMock.sol');
var HealthMessage = artifacts.require("./MessagingInbox.sol")
import isAddress from './helpers/isAddress'

contract('HealthMessage', function(accounts) {

  beforeEach(async function() {
    this.token = await HealthCashMock.new()
    this.message = await HealthMessage.new(this.token.address)
    this.owner=accounts[0]

    //console.log(this.owner)
    // await this.token.approve(this.message.address,100000000,{from: this.owner})
    // await this.token.approve(this.message.address,100000);
    // await this.token.approve(this.owner,100000000,{from: this.message.address})
    await this.token.approve(this.message.address,100000);
    await this.token.approve(this.message.address,100000000,{from: accounts[1]})
    await this.token.approve(this.message.address,100000000,{from: accounts[2]})
    await this.token.approve(this.message.address,100000000,{from: accounts[3]})
    await this.token.approve(this.message.address,100000000,{from: accounts[4]})
    await this.token.approve(this.message.address,100000000,{from: accounts[5]})
    await this.token.approve(this.message.address,100000000,{from: accounts[6]})
    await this.token.approve(this.message.address,100000000,{from: accounts[7]})
    await this.token.approve(this.message.address,100000000,{from: accounts[8]})
    await this.token.approve(this.message.address,100000000,{from: accounts[9]})



  })

  it('should be able to create a contact', async function() {
    let tx = await this.message.contactAddToList()
    let result = await this.message.getContacts()
    //console.log(result)

    result[0].should.equal(accounts[0]);
  })
  it('should be able to send and retrieve message', async function() {
    let tx = await this.message.contactAddToList()
    let result = await this.message.sendMessage('test')
    let msg = await this.message.getMessage(accounts[0],0)
    msg.should.equal('test');
  })

  it('should set a price', async function() {
    let tx = await this.message.setPrice(2)
    let tx2 = await this.message.getPrice()

    tx2.toNumber().should.equal(2);

  })


})

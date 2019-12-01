
const BigNumber = web3.BigNumber
var BN = web3.utils.BN
const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()
const utils = require('./helpers/utils.js');

var HealthCashMock = artifacts.require('./helpers/HealthCashMock.sol');
var HealthDRS = artifacts.require("./HealthDRS.sol")
var isAddress = require('./helpers/isAddress')

contract('HealthDRS :: Sell', function(accounts) {

  beforeEach(async function() {
    // this.token = await HealthCashMock.new()
    this.drs = await HealthDRS.new();
    this.url = 'https://blogs.scientificamerican.com/observations/consciousness-goes-deeper-than-you-think/'
    let tx = await this.drs.createService(this.url)
    this.service = tx.logs[0].args._service
  })

  /**
   * Error: Returned error: VM Exception while processing transaction: revert canSell() key can't be sold error -- Reason given: canSell() key can't be sold error.
   */
  it('key owner should be able to put a key up for sale only if salable', async function() {
    let tx = await this.drs.createKey(this.service)
    let key = tx.logs[0].args._key
    var so;
    //should fail - having no permissions to sell
    try{
      await this.drs.createSalesOffer(key, accounts[1], 5, false)
      so = await this.drs.salesOffers(key)
      so[0].should.not.equal(accounts[1])
      so[1].should.not.be.bignumber.equal(5)
    }catch(error){
      error.message.should.equal('Returned error: VM Exception while processing transaction: revert -- Reason given: canSell() key can\'t be sold error.');
    }

    //give key permission to sell - should suceed
    await this.drs.setKeyPermissions(key, false, false, true);
    await this.drs.createSalesOffer(key, accounts[1], 5, false)
    so = await this.drs.salesOffers(key)
    so[0].should.equal(accounts[1])
    let bn = so[1].toNumber()
    bn.should.equal(5)

  })


  it('putting a key up for sale should negate an active trade offer', async function() {
    let tx = await this.drs.createKey(this.service)
    let key = tx.logs[0].args._key
    await utils.advanceTimeAndBlock(10000);

    tx = await this.drs.createKey(this.service)
    let key2 = tx.logs[0].args._key
    await utils.advanceTimeAndBlock(10000);

    //Give permissions
    await this.drs.setKeyPermissions(key, true, true, true);
    await this.drs.setKeyPermissions(key2, true, true, true);

    await this.drs.createTradeOffer(key, key2)
    await this.drs.createSalesOffer(key, accounts[1], 5, false)
    let to = await this.drs.tradeOffers(key)
    to.should.equal('0x0000000000000000000000000000000000000000000000000000000000000000')

  })

  it('non owner should not be able to list a key for sale', async function() {
    let tx = await this.drs.createKey(this.service)
    let key = tx.logs[0].args._key
    try {
      //try to create a sales offer from the account that wants to buy a key
      await this.drs.createSalesOffer(key, accounts[1], 5, false, { from: accounts[1] })
    } catch (e) {
      if (e = true) {
        let so = await this.drs.salesOffers(key)
        so[0].should.not.equal(accounts[1])
        so[1].toNumber().should.not.be.equal(5)
        return;
      }
      (true).should.equal(false);
    }

   })


   it('should not be able to purchase an unoffered key', async function() {
     try{
      let tx = await this.drs.createKey(this.service)
      let key = tx.logs[0].args._key

      await this.drs.purchaseKey(key, {from: accounts[1]})
      let owner = await this.drs.isKeyOwner(key,accounts[0])
      owner.should.equal(true)
    }
    catch(error){
      error.message.should.equal('Returned error: VM Exception while processing transaction: revert -- Reason given: canSell() key can\'t be sold error.');
    }
   })

  /**
  * TypeError: Cannot read property 'transfer' of undefined
  */
   it('should be able to purchase an offered key', async function() {
    let tx = await this.drs.createKey(this.service)
    let key = tx.logs[0].args._key
    await this.drs.setKeyPermissions(key, false, false, true);
    await this.drs.createSalesOffer(key, accounts[1], 5, false)

    //give account some HLTH to spend
    // this.token.transfer(accounts[1],5)
    // await this.token.approve(this.drs.address, 5, {from: accounts[1]})
    let balanceAccount0 = await web3.eth.getBalance(accounts[0])
    let balanceAccount1 = await web3.eth.getBalance(accounts[1])
    
    let tx2 = await this.drs.purchaseKey(key, {from: accounts[1], value: 5})
    
    let balanceAccount0After = await web3.eth.getBalance(accounts[0])
    let balanceAccount1After = await web3.eth.getBalance(accounts[1])

     const transaction = await web3.eth.getTransaction(tx2.tx);
     const gasPrice = new BN(transaction.gasPrice);
     const gasUsed = tx2.receipt.gasUsed
     const gasCost = gasPrice.mul(new BN(gasUsed));
     const totalDiff = gasCost.add(new BN(5))

    let owner = await this.drs.isKeyOwner(key,accounts[1])
    owner.should.equal(true)
    new BN(balanceAccount0After).toString().should.be.equal(new BN(balanceAccount0).add(new BN(5)).toString(),'Should have gotten 5 tokens back')
    new BN(balanceAccount1After).toString().should.be.equal(new BN(balanceAccount1).sub(totalDiff).toString(),'Should have gotten 5 tokens back')
   })

  /**
   * Error: Returned error: VM Exception while processing transaction: revert canSell() key does not exist error -- Reason given: canSell() key does not exist error.
   */
   it('should not be able to purchase a shared key', async function() {
    let tx = await this.drs.createKey(this.service)
    let key = tx.logs[0].args._key
    await this.drs.setKeyPermissions(key, true, false, true);
    await this.drs.shareKey(key, accounts[1])
    let balanceAccount0 = await web3.eth.getBalance(accounts[0])

    try{
      await this.drs.createSalesOffer(key, accounts[1], 5, false)

      //give account some HLTH to spend
      await this.drs.purchaseKey(key, {from: accounts[1]})
    }catch(error){
        error.message.should.equal('Returned error: VM Exception while processing transaction: revert -- Reason given: canSell() key does not exist error.');
      }
      let balanceAccount0After = await web3.eth.getBalance(accounts[0])
      await this.drs.unshareKey(key, accounts[1])
      let owner = await this.drs.isKeyOwner(key,accounts[1])

    owner.should.equal(false)

    balanceAccount0.should.equal(balanceAccount0After,'Should not have recieved ether')
   })


   it('a key owner should be able to cancel a sales offer', async function() {
    let tx1 = await this.drs.createKey(this.service)
    let key = tx1.logs[0].args._key
    await this.drs.setKeyPermissions(key, false, false, true);
    await this.drs.createSalesOffer(key, accounts[1], 5, false)
    await this.drs.cancelSalesOffer(key)
    let so = await this.drs.salesOffers(key)
    so[0].should.equal('0x0000000000000000000000000000000000000000')
   })

   it('a key owner should be able to update the price on a sales offer', async function() {
    let tx = await this.drs.createKey(this.service)
    let key = tx.logs[0].args._key
    await this.drs.setKeyPermissions(key, false, false, true);
    await this.drs.createSalesOffer(key, accounts[1], 5, false)
    //overwrite old with new
    await this.drs.createSalesOffer(key, accounts[1], 50, false)
    let so = await this.drs.salesOffers(key)
    so[1].toNumber().should.be.equal(50)
   })

   /**
    * TypeError: Cannot read property 'transfer' of undefined
    */
   it('key owner can create a sales offer that prevents subsequent sales', async function() {
    let tx = await this.drs.createKey(this.service)
    let key = tx.logs[0].args._key
    await this.drs.setKeyPermissions(key, false, false, true)
    await this.drs.createSalesOffer(key, accounts[1], 5, false)

    this.token.transfer(accounts[1],5)
    await this.token.approve(this.drs.address, 5, {from: accounts[1]})
    await this.drs.purchaseKey(key, {from: accounts[1]})

    key = await this.drs.getKey(key)
    key[3].should.equal(false) //canSell
   })

})

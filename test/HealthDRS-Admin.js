
const BigNumber = web3.BigNumber
const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

var HealthCashMock = artifacts.require('./helpers/HealthCashMock.sol');
var HealthDRS = artifacts.require("./HealthDRS.sol")
import isAddress from './helpers/isAddress'

contract('HealthDRS :: Admin', function(accounts) {

  beforeEach(async function() {
    this.token = await HealthCashMock.new()
    this.drs = await HealthDRS.new(this.token.address)
  })
  
  it('should enable the token to be updated by admin', async function() {
    let firstTokenAddress = await this.drs.token()
    await this.drs.setHealthCashToken(accounts[1])
    let secondTokenAddress = await this.drs.token()

    secondTokenAddress.should.not.be.equal(firstTokenAddress)  
    secondTokenAddress.should.be.equal(accounts[1])  
  })

  it('should only be updateable by admin', async function() {
    let firstTokenAddress = await this.drs.token()
    await this.drs.setHealthCashToken(accounts[1],{from: accounts[1]})
    let secondTokenAddress = await this.drs.token()

    secondTokenAddress.should.be.equal(firstTokenAddress)  
    secondTokenAddress.should.not.be.equal(accounts[1])  
  })
 
  it('latest contract should be updateable by admin', async function() {
    let firstAddresss = await this.drs.latestContract()
    await this.drs.setLatestContract(accounts[1])
    let secondAddress = await this.drs.latestContract()

    secondAddress.should.not.equal(firstAddresss)  
    secondAddress.should.equal(accounts[1])  
  })

  it('latest contract should only be updateable by admin', async function() {
    let firstAddresss = await this.drs.latestContract()
    await this.drs.setLatestContract(accounts[1],{from: accounts[1]})
    let secondAddress = await this.drs.latestContract()

    secondAddress.should.equal(firstAddresss)  
    secondAddress.should.not.equal(accounts[1])  
  })

  it('minimum hold should be updateable by admin', async function() {
    let minimumHold = await this.drs.minimumHold()
    await this.drs.setMinimumHold(5000)
    let newMinimumHold = await this.drs.minimumHold()

    newMinimumHold.should.be.bignumber.not.equal(minimumHold)  
    newMinimumHold.should.be.bignumber.equal(5000)  
  })

  it('minimum hold should only be updateable by admin', async function() {
    let minimumHold = await this.drs.minimumHold()
    await this.drs.setMinimumHold(5000,{from: accounts[1]})    
    let newMinimumHold = await this.drs.minimumHold()

    newMinimumHold.should.be.bignumber.equal(minimumHold)  
    newMinimumHold.should.be.bignumber.not.equal(5000)  
  })


})

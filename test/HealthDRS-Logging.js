
const BigNumber = web3.BigNumber
const utils = require('./helpers/utils.js');

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

var HealthCashMock = artifacts.require('./helpers/HealthCashMock.sol');
var HealthDRS = artifacts.require("./HealthDRS.sol")

contract('HealthDRS :: Logging', function(accounts) {

  beforeEach(async function() {
    // this.token = await HealthCashMock.new()
    this.drs = await HealthDRS.new();
    this.url = 'https://blogs.scientificamerican.com/observations/consciousness-goes-deeper-than-you-think/'
    let tx = await this.drs.createService(this.url)
    this.service = tx.logs[0].args._service
  })

  it('should enable a key owner to log', async function() {
    let tx = await this.drs.createKey(this.service)
    let key = tx.logs[0].args._key

    tx = await this.drs.log(key, 'test log')
    tx.logs[0].args._owner.should.equal(accounts[0]);
    tx.logs[0].args._from.should.equal(key);
    tx.logs[0].args._data.should.equal('test log');
  })

  it('should enable a service owner to log', async function() {
    let tx = await this.drs.log(this.service, 'test log')
    tx.logs[0].args._owner.should.equal(accounts[0]);
    tx.logs[0].args._from.should.equal(this.service);
    tx.logs[0].args._data.should.equal('test log');
  })

  /**
   * Error: Returned error: VM Exception while processing transaction: revert log() error -- Reason given: log() error.
   */
  it('should not enable a non service owner to log', async function () {
    try {
      let tx = await this.drs.log(this.service, 'test log', { from: accounts[1] })
      tx.logs.length.should.equal(0);
    }
    catch(error){
      error.message.should.equal('Returned error: VM Exception while processing transaction: revert -- Reason given: log() error.');

    }
  })

  /**
   * Error: Returned error: VM Exception while processing transaction: revert validService() error -- Reason given: validService() error.
   */
  it('should not enable a non-owner to log', async function () {
    try{
      let tx = await this.drs.createKey(this.service)
      let rootKey = tx.logs[0].args._key
      tx = await this.drs.log(rootKey, 'test log', { from: accounts[1] })
      tx.logs.length.should.equal(0)
    }
    catch(error){
      //valid service error, because after failing the key due to not being an owner, it then checks if its a valid service and throws an error there as well
      error.message.should.equal('Returned error: VM Exception while processing transaction: revert -- Reason given: validService() error.');

    }
  })

  it('should enable a service owner to log access', async function() {

    let tx = await this.drs.createKey(this.service)
    let key = tx.logs[0].args._key

    tx = await this.drs.logAccess(key, 'datastring')
    tx.logs[0].args._owner.should.equal(accounts[0]);
    tx.logs[0].args._from.should.equal(this.service);
    tx.logs[0].args._to.should.equal(key);
    tx.logs[0].args._data.should.equal('datastring');
  })

  /**
   * Error: Returned error: VM Exception while processing transaction: revert issueKey() error -- Reason given: issueKey() error.
   */
  it('should enable a key owner to message', async function () {
    let tx = await this.drs.createKey(this.service)
    await utils.advanceTimeAndBlock(10000);
    let key1 = tx.logs[0].args._key

    tx = await this.drs.createKey(this.service)

    let key2 = tx.logs[0].args._key

    tx = await this.drs.message(key1, key2, 'init', 'data')
    tx.logs[0].args._owner.should.equal(accounts[0]);
    tx.logs[0].args._from.should.equal(key1);
    tx.logs[0].args._to.should.equal(key2);
    tx.logs[0].args._category.should.equal('init');
    tx.logs[0].args._data.should.equal('data');

    tx = await this.drs.message(key2, key1, 'init', 'data')
    tx.logs[0].args._owner.should.equal(accounts[0]);
    tx.logs[0].args._from.should.equal(key2);
    tx.logs[0].args._to.should.equal(key1);
    tx.logs[0].args._category.should.equal('init');
    tx.logs[0].args._data.should.equal('data');

  })

  /**
   * Error: Returned error: VM Exception while processing transaction: revert issueKey() error -- Reason given: issueKey() error.
   */
  it('should not enable a non-owner to message', async function () {
    let tx = await this.drs.createKey(this.service)
    let key1 = tx.logs[0].args._key
    tx = await this.drs.createKey(this.service)
    let key2 = tx.logs[0].args._key
    tx = await this.drs.message(key1, key2, 'init', 'data', { from: accounts[1] })
    tx.logs.length.should.equal(0)
  })

  it('should enable a service owner to message', async function() {
    let tx = await this.drs.createKey(this.service)
    let key1 = tx.logs[0].args._key

    tx = await this.drs.message(this.service, key1, 'init', 'data')
    tx.logs[0].args._owner.should.equal(accounts[0]);
    tx.logs[0].args._from.should.equal(this.service);
    tx.logs[0].args._to.should.equal(key1);
    tx.logs[0].args._category.should.equal('init');
    tx.logs[0].args._data.should.equal('data');

  })

  /**
   * Error: Returned error: VM Exception while processing transaction: revert message() error 1 -- Reason given: message() error 1.
   */
  it('should not enable a non service owner to message', async function () {
    let tx = await this.drs.createKey(this.service)
    let key1 = tx.logs[0].args._key

    tx = await this.drs.message(this.service, key1, 'init', 'data', { from: accounts[1] })
    tx.logs.length.should.equal(0)
  })


})

const BigNumber = web3.BigNumber
const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

var HealthCashMock = artifacts.require('./helpers/HealthCashMock.sol');
var HealthSearch = artifacts.require("./HealthSearch.sol")
import isAddress from './helpers/isAddress'

contract('HealthSearch Multiple', function(accounts) {

  beforeEach(async function() {
    this.token = await HealthCashMock.new()
    this.search = await HealthSearch.new(this.token.address)
    this.owner=accounts[0]

    //console.log(this.owner)
    // await this.token.approve(this.search.address,100000000,{from: this.owner})
    await this.token.approve(this.search.address,100000);
    await this.token.approve(this.search.address,100000000,{from: accounts[1]})
    await this.token.approve(this.search.address,100000000,{from: accounts[2]})
    await this.token.approve(this.search.address,100000000,{from: accounts[3]})
    await this.token.approve(this.search.address,100000000,{from: accounts[4]})
    await this.token.approve(this.search.address,100000000,{from: accounts[5]})
    await this.token.approve(this.search.address,100000000,{from: accounts[6]})
    await this.token.approve(this.search.address,100000000,{from: accounts[7]})
    await this.token.approve(this.search.address,100000000,{from: accounts[8]})
    await this.token.approve(this.search.address,100000000,{from: accounts[9]})



  })

  it('should be able to create a seller', async function() {
    let tx = await this.search.setPotentialSellers('0x0000000000000000000000000000000000000000000000000000000000000001','0x0000000000000000000000000000000000000000000000000000000000000002','0x0000000000000000000000000000000000000000000000000000000000000003','0x0000000000000000000000000000000000000000000000000000000000000004')
    tx = await this.search.setPotentialSellers('0x1000000000000000000000000000000000000000000000000000000000000001','0x0000000000000000000000000000000000000000000000000000000000000002','0x0000000000000000000000000000000000000000000000000000000000000003','0x1000000000000000000000000000000000000000000000000000000000000004')
    tx = await this.search.setPotentialSellers('0x2000000000000000000000000000000000000000000000000000000000000001','0x0000000000000000000000000000000000000000000000000000000000000002','0x0000000000000000000000000000000000000000000000000000000000000003','0x2000000000000000000000000000000000000000000000000000000000000004')
    tx = await this.search.setPotentialSellers('0x3000000000000000000000000000000000000000000000000000000000000001','0x0000000000000000000000000000000000000000000000000000000000000002','0x0000000000000000000000000000000000000000000000000000000000000003','0x3000000000000000000000000000000000000000000000000000000000000004')

    let curOwner=['0x0000000000000000000000000000000000000000000000000000000000000004','0x1000000000000000000000000000000000000000000000000000000000000004','0x2000000000000000000000000000000000000000000000000000000000000004','0x3000000000000000000000000000000000000000000000000000000000000004']
    let result = await this.search.getPotentialSellers('0x0000000000000000000000000000000000000000000000000000000000000002', '0x0000000000000000000000000000000000000000000000000000000000000003')
    curOwner[0].should.equal(result[0]);
    curOwner[1].should.equal(result[1]);
    curOwner[2].should.equal(result[2]);
    curOwner[3].should.equal(result[3]);

  })

})

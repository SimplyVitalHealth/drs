var hlthDRS = artifacts.require("./HealthDRS.sol")
var hlthToken = '0x0' //update before deploy

module.exports = function(deployer) {
    deployer.deploy(hlthDRS, hlthToken)
};

var hlthDRS = artifacts.require("./HealthDRS.sol")
var hlthToken = '0xab6cee678340a12ee72d41d472300f6a2befa1eb' //update before deploy

module.exports = function(deployer) {
    hlthDRS.new(hlthToken).then(function(instance) {
        console.log("HealthDRS: " + instance.address)
    })
};

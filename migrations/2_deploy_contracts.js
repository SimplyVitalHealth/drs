var hlthDRS = artifacts.require("./HealthDRS.sol")

module.exports = function(deployer) {
    hlthDRS.new().then(function(instance) {
        console.log("HealthDRS: " + instance.address)
    })
};

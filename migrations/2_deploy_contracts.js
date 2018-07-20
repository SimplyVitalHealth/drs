var hlthDRS = artifacts.require("./HealthDRS.sol")
// var hlthToken = '0xa17b6235ef312c7b3e281059006324460f3875fd' //update before deploy
var hlthToken = '0x8a1eD83DfB3ea079ee7F057e1E7eCE964A1c6259' //update before deploy

module.exports = function(deployer) {
    hlthDRS.new(hlthToken).then(function(instance) {
        console.log("HealthDRS: " + instance.address)
    })
};

var hlthDRS = artifacts.require("./HealthDRS.sol")
var hlthSearch = artifacts.require("./HealthSearch.sol")
var hlthMessage = artifacts.require("./MessagingInbox.sol")

// var hlthToken = '0xa17b6235ef312c7b3e281059006324460f3875fd' //update before deploy
var hlthToken = '0xfcbc080dd4b5aafcea9e35cccf3e2e5746d90935' //update before deploy

module.exports = function(deployer) {
    hlthDRS.new(hlthToken).then(function(instance) {
        console.log("HealthDRS: " + instance.address)
    })
    hlthSearch.new(hlthToken).then(function(instance) {
        console.log("HealthSearch: " + instance.address)
    })
    hlthMessage.new(hlthToken).then(function(instance) {
        console.log("HealthSearch: " + instance.address)
    })
};
